import type { CloudProgress, CloudSettings, CloudState, SyncedSettingKey } from '@/lib/cloudSync'
import { fetchCloudState, pushProgress, pushSettings, syncedSettingAtoms } from '@/lib/cloudSync'
import { auth } from '@/lib/firebase'
import { idDictionaryMap } from '@/resources/dictionary'
import { cloudChapterProgressAtom, cloudSyncStatusAtom, currentChapterAtom, currentDictIdAtom } from '@/store'
import { onAuthStateChanged } from 'firebase/auth'
import type { WritableAtom } from 'jotai'
import { useSetAtom, useStore } from 'jotai'
import { useEffect, useState } from 'react'

type Store = ReturnType<typeof useStore>
type AnyWritableAtom = WritableAtom<unknown, [unknown], void>

const PUSH_DEBOUNCE_MS = 800
const FETCH_TIMEOUT_MS = 8000

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

function applyRemoteState(store: Store, remote: CloudState) {
  if (remote.settings) {
    settingKeys.forEach((key) => {
      const value = remote.settings?.[key]
      if (value !== undefined && value !== null) {
        store.set(syncedSettingAtoms[key] as unknown as AnyWritableAtom, value)
      }
    })
  }

  if (remote.progress && remote.progress.dictId in idDictionaryMap) {
    store.set(currentDictIdAtom, remote.progress.dictId)
    store.set(currentChapterAtom, remote.progress.chapter)
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Cloud sync timeout')), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

/**
 * Đồng bộ cấu hình, chương trình/bài đang học và tiến độ từng bài với Firestore.
 * - Khi đăng nhập: tải dữ liệu từ cloud và áp dụng (cloud là nguồn chuẩn), để máy khác tiếp tục đúng lộ trình.
 * - Sau đó: mỗi khi cấu hình hoặc bài học thay đổi trên máy này thì đẩy lên cloud.
 */
export function useCloudSync() {
  const store = useStore()
  const setStatus = useSetAtom(cloudSyncStatusAtom)
  const setCloudChapterProgress = useSetAtom(cloudChapterProgressAtom)
  // undefined: Firebase chưa khôi phục phiên đăng nhập
  const [uid, setUid] = useState<string | null | undefined>(undefined)

  useEffect(() => onAuthStateChanged(auth, (user) => setUid(user?.uid ?? null)), [])

  useEffect(() => {
    if (uid === undefined) return
    if (uid === null) {
      setStatus('idle')
      setCloudChapterProgress({})
      return
    }

    let cancelled = false
    const unsubscribes: (() => void)[] = []
    const timers: Record<'settings' | 'progress', number | undefined> = { settings: undefined, progress: undefined }
    let lastSettings = ''
    let lastProgress = ''

    const flushSettings = () => {
      window.clearTimeout(timers.settings)
      timers.settings = undefined
      const settings = readSettings(store)
      const serialized = JSON.stringify(settings)
      if (serialized === lastSettings) return
      lastSettings = serialized
      pushSettings(uid, settings).catch((e) => console.error('Firebase: Error pushing settings:', e))
    }

    const flushProgress = () => {
      window.clearTimeout(timers.progress)
      timers.progress = undefined
      const progress = readProgress(store)
      const serialized = JSON.stringify(progress)
      if (serialized === lastProgress) return
      lastProgress = serialized
      pushProgress(uid, progress).catch((e) => console.error('Firebase: Error pushing progress:', e))
    }

    const flushAll = () => {
      if (timers.settings !== undefined) flushSettings()
      if (timers.progress !== undefined) flushProgress()
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushAll()
    }

    setStatus('loading')
    ;(async () => {
      let remote: CloudState | null = null
      try {
        remote = await withTimeout(fetchCloudState(uid), FETCH_TIMEOUT_MS)
      } catch (e) {
        console.error('Firebase: Error fetching cloud state:', e)
      }
      if (cancelled) return

      if (remote) {
        applyRemoteState(store, remote)
        setCloudChapterProgress(remote.chapterProgress)
      }

      lastSettings = JSON.stringify(readSettings(store))
      lastProgress = JSON.stringify(readProgress(store))

      // Tài khoản chưa có dữ liệu trên cloud: khởi tạo bằng dữ liệu hiện có trên máy.
      // Không làm khi tải thất bại để tránh ghi đè dữ liệu cloud bằng dữ liệu cũ.
      if (remote && !remote.settings) {
        lastSettings = ''
        flushSettings()
      }
      if (remote && !remote.progress) {
        lastProgress = ''
        flushProgress()
      }

      setStatus('ready')

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
      document.addEventListener('visibilitychange', onVisibilityChange)
      window.addEventListener('beforeunload', flushAll)
    })()

    return () => {
      cancelled = true
      flushAll()
      unsubscribes.forEach((unsubscribe) => unsubscribe())
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('beforeunload', flushAll)
    }
  }, [uid, store, setStatus, setCloudChapterProgress])
}
