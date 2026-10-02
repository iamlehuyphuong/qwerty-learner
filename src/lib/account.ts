import { flushCloudSync } from '@/hooks/useCloudSync'
import { auth } from '@/lib/firebase'
import { clearLocalAccountData, syncPendingWordRecords } from '@/lib/syncWordRecords'
import { withTimeout } from '@/lib/utils'
import { signOut } from 'firebase/auth'

const FLUSH_TIMEOUT_MS = 3000
const SYNC_TIMEOUT_MS = 5000

/**
 * Đăng xuất và trở về chế độ khách:
 * 1. Đẩy nốt cấu hình / bài đang học đang chờ debounce
 * 2. Đẩy nốt lịch sử luyện tập chưa đồng bộ (mất mạng thì bỏ qua sau một lúc)
 * 3. Xoá khỏi máy dữ liệu luyện tập đã có trên cloud của tài khoản (đăng nhập lại sẽ tải về).
 *    Bản ghi chưa đẩy lên được thì giữ lại, sẽ được đẩy lên tài khoản đăng nhập kế tiếp.
 * Cấu hình hiển thị và bài đang học được giữ nguyên để khách dùng tiếp.
 */
export async function logoutAndClearLocalData() {
  const uid = auth.currentUser?.uid
  if (uid) {
    await withTimeout(flushCloudSync(), FLUSH_TIMEOUT_MS).catch((e) => console.warn('Logout: flush settings failed', e))
    await withTimeout(syncPendingWordRecords(uid), SYNC_TIMEOUT_MS).catch((e) => console.warn('Logout: sync records failed', e))
    await clearLocalAccountData(uid).catch((e) => console.error('Logout: clear local data failed', e))
  }
  await signOut(auth)
}
