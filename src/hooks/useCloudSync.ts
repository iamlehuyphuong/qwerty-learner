import type { CloudProgress, CloudSettings, CloudState, SyncedSettingKey } from '@/lib/cloudSync'
import { ensureUserProfile, fetchCloudState, pushProgress, pushSettings, syncedSettingAtoms } from '@/lib/cloudSync'
import { pullCloudWordRecords, syncPendingWordRecords } from '@/lib/syncWordRecords'
import { withTimeout } from '@/lib/utils'
import { idDictionaryMap } from '@/resources/dictionary'
import { authUserAtom, cloudChapterProgressAtom, cloudSyncStatusAtom, currentChapterAtom, currentDictIdAtom } from '@/store'
import type { WritableAtom } from 'jotai'
import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useEffect } from 'react'

type Store = ReturnType<typeof useStore>
type AnyWritableAtom = WritableAtom<unknown, [unknown], void>

const PUSH_DEBOUNCE_MS = 800
const FETCH_TIMEOUT_MS = 8000
const RETRY_INTERVAL_MS = 60 * 1000

const settingKeys = Object.keys(syncedSettingAtoms) as SyncedSettingKey[]

function readSettings(store: Store): CloudSettings {
  const settings: CloudSettings = {}
  settingKeys.forEach((key) => {
    settings[key] = store.get(syncedSettingAtoms[key] as unknown as AnyWritableAtom)
  })
  return settings
}

function readProgress(store: Store): CloudProgress {
  return { dictId: store.get(currentDictIdAtom), chapter: store.get(currentChapterAtom) }
}

function applyRemoteSettings(store: Store, remote: CloudState) {
  if (!remote.settings) return
  settingKeys.forEach((key) => {
    const value = remote.settings?.[key]
    if (value !== undefined && value !== null) {
      store.set(syncedSettingAtoms[key] as unknown as AnyWritableAtom, value)
    }
  })
}

function applyRemoteProgress(store: Store, remote: CloudState) {
  if (remote.progress && remote.progress.dictId in idDictionaryMap) {
    store.set(currentDictIdAtom, remote.progress.dictId)
    store.set(currentChapterAtom, remote.progress.chapter)
  }
}

// Đẩy ngay các thay đổi đang chờ debounce, dùng trước khi đăng xuất
let activeFlush: (() => Promise<void>) | null = null
export function flushCloudSync(): Promise<void> {
  return activeFlush ? activeFlush() : Promise.resolve()
}

/**
 * Đồng bộ cấu hình, chương trình/bài đang học và tiến độ từng bài với Firestore.
 * - Khi đăng nhập: tải dữ liệu từ cloud và áp dụng (cloud là nguồn chuẩn), để máy khác tiếp tục đúng lộ trình.
 *   Tài khoản mới (chưa có dữ liệu cloud) sẽ nhận cấu hình/bài đang học từ lúc dùng ở chế độ khách.
 * - Sau đó: mỗi khi cấu hình hoặc bài học thay đổi trên máy này thì đẩy lên cloud.
 * - Không tải được cloud (mất mạng / quá thời gian): vẫn cho dùng app nhưng không đẩy gì lên (tránh ghi đè cloud
 *   bằng dữ liệu cũ trên máy), thử tải lại khi có mạng / quay lại tab / định kỳ.
 * - Lịch sử luyện tập từng từ: đẩy bản ghi chưa đồng bộ lên và tải từ sai của máy khác về (syncWordRecords).
 * - Khách (chưa đăng nhập): không đồng bộ, chỉ dùng dữ liệu trên máy.
 */
export function useCloudSync() {
  const store = useStore()
  const setStatus = useSetAtom(cloudSyncStatusAtom)
  const setCloudChapterProgress = useSetAtom(cloudChapterProgressAtom)
  const authUser = useAtomValue(authUserAtom)
  // undefined: Firebase chưa khôi phục phiên đăng nhập
  const uid = authUser === undefined ? undefined : authUser?.uid ?? null

  useEffect(() => {
    if (uid === undefined) return
    if (uid === null) {
      setStatus('idle')
      setCloudChapterProgress({})
      return
    }

    let cancelled = false
    let loaded = false
    let loading = false
    const unsubscribes: (() => void)[] = []
    const timers: Record<'settings' | 'progress', number | undefined> = { settings: undefined, progress: undefined }
    let lastSettings = ''
    let lastProgress = ''
    // Bài đang học lúc bắt đầu, để biết người dùng đã tự chuyển bài trong lúc chưa tải được cloud hay chưa
    const initialProgress = JSON.stringify(readProgress(store))

    const flushSettings = async () => {
      window.clearTimeout(timers.settings)
      timers.settings = undefined
      const settings = readSettings(store)
      const serialized = JSON.stringify(settings)
      if (serialized === lastSettings) return
      lastSettings = serialized
      await pushSettings(uid, settings).catch((e) => console.error('Firebase: Error pushing settings:', e))
    }

    const flushProgress = async () => {
      window.clearTimeout(timers.progress)
      timers.progress = undefined
      const progress = readProgress(store)
      const serialized = JSON.stringify(progress)
      if (serialized === lastProgress) return
      lastProgress = serialized
      await pushProgress(uid, progress).catch((e) => console.error('Firebase: Error pushing progress:', e))
    }

    const flushAll = async () => {
      await Promise.all([
        timers.settings !== undefined ? flushSettings() : undefined,
        timers.progress !== undefined ? flushProgress() : undefined,
      ])
    }
    activeFlush = flushAll

    const syncHistory = () => {
      syncPendingWordRecords(uid).catch((e) => console.error('Firebase: Error syncing word records:', e))
      pullCloudWordRecords(uid).catch((e) => console.error('Firebase: Error pulling word records:', e))
    }

    const subscribe = () => {
      settingKeys.forEach((key) => {
        unsubscribes.push(
          store.sub(syncedSettingAtoms[key] as unknown as AnyWritableAtom, () => {
            window.clearTimeout(timers.settings)
            timers.settings = window.setTimeout(flushSettings, PUSH_DEBOUNCE_MS)
          }),
        )
      })
      ;[currentDictIdAtom, currentChapterAtom].forEach((atom) => {
        unsubscribes.push(
          store.sub(atom, () => {
            window.clearTimeout(timers.progress)
            timers.progress = window.setTimeout(flushProgress, PUSH_DEBOUNCE_MS)
          }),
        )
      })
    }

    const load = async (isRetry: boolean) => {
      if (loaded || loading) return
      loading = true
      let remote: CloudState | null = null
      try {
        remote = await withTimeout(fetchCloudState(uid), FETCH_TIMEOUT_MS, 'Cloud sync timeout')
      } catch (e) {
        console.error('Firebase: Error fetching cloud state:', e)
      }
      loading = false
      if (cancelled) return

      if (!remote) {
        // Vẫn cho dùng app, chưa đẩy gì lên cho tới khi tải được cloud
        setStatus('ready')
        return
      }

      // Tải lại thành công sau khi người dùng đã tự chuyển bài: giữ bài trên máy (mới hơn) và đẩy lên
      const keepLocalProgress = isRetry && JSON.stringify(readProgress(store)) !== initialProgress
      applyRemoteSettings(store, remote)
      if (!keepLocalProgress) applyRemoteProgress(store, remote)
      setCloudChapterProgress(remote.chapterProgress)

      lastSettings = JSON.stringify(readSettings(store))
      lastProgress = JSON.stringify(readProgress(store))

      // Tài khoản chưa có dữ liệu trên cloud: khởi tạo bằng dữ liệu hiện có trên máy.
      if (!remote.settings) {
        lastSettings = ''
        flushSettings()
      }
      if (!remote.progress || keepLocalProgress) {
        lastProgress = ''
        flushProgress()
      }

      // Tài khoản chưa có hồ sơ trên server (tài khoản cũ, hoặc tạo hồ sơ lúc đăng ký bị lỗi)
      if (!remote.hasProfile) {
        ensureUserProfile().catch((e) => console.error('Firebase: Error ensuring user profile:', e))
      }

      loaded = true
      setStatus('ready')
      subscribe()
      syncHistory()
    }

    const retry = () => {
      if (!loaded) load(true)
    }
    const onOnline = () => {
      if (loaded) syncHistory()
      else retry()
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushAll()
      else retry()
    }
    const retryTimer = window.setInterval(retry, RETRY_INTERVAL_MS)

    setStatus('loading')
    load(false)
    window.addEventListener('online', onOnline)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('beforeunload', flushAll)

    return () => {
      cancelled = true
      flushAll()
      if (activeFlush === flushAll) activeFlush = null
      window.clearInterval(retryTimer)
      unsubscribes.forEach((unsubscribe) => unsubscribe())
      window.removeEventListener('online', onOnline)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('beforeunload', flushAll)
    }
  }, [uid, store, setStatus, setCloudChapterProgress])
}
