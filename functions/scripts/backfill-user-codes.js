/**
 * Giữ chỗ mã donate của các tài khoản hiện có trong userCodes/{code} (mã do client tạo trước khi có ensureUserProfile),
 * để webhook tra mã nhanh và mã mới không bao giờ trùng mã cũ. Báo các mã đang bị trùng giữa nhiều tài khoản.
 *
 * Chạy (cần quyền Admin trên project):
 *   gcloud auth application-default login
 *   cd functions && node scripts/backfill-user-codes.js            # chỉ xem, không ghi
 *   cd functions && node scripts/backfill-user-codes.js --write    # ghi vào Firestore
 */
const admin = require('firebase-admin')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')

const PROJECT_ID = process.env.GCLOUD_PROJECT || 'typing-english'
const shouldWrite = process.argv.includes('--write')

admin.initializeApp({ projectId: PROJECT_ID })
const db = getFirestore()

async function main() {
  const usersSnap = await db.collection('users').get()
  const uidsByCode = new Map()
  usersSnap.forEach((doc) => {
    const code = doc.get('code')
    if (typeof code !== 'string' || !code) return
    if (!uidsByCode.has(code)) uidsByCode.set(code, [])
    uidsByCode.get(code).push(doc.id)
  })

  const duplicates = [...uidsByCode].filter(([, uids]) => uids.length > 1)
  let created = 0
  let alreadyReserved = 0

  for (const [code, uids] of uidsByCode) {
    if (uids.length > 1) continue
    const ref = db.collection('userCodes').doc(code)
    const snap = await ref.get()
    if (snap.exists) {
      alreadyReserved++
      if (snap.get('uid') !== uids[0]) console.warn(`Mã ${code} của ${uids[0]} đã được giữ bởi ${snap.get('uid')}`)
      continue
    }
    if (shouldWrite) await ref.create({ uid: uids[0], createdAt: FieldValue.serverTimestamp() })
    created++
  }

  console.log(`Tổng tài khoản: ${usersSnap.size}, có mã: ${[...uidsByCode.values()].flat().length}`)
  console.log(`${shouldWrite ? 'Đã tạo' : 'Sẽ tạo'} ${created} userCodes, đã có sẵn ${alreadyReserved}`)
  if (duplicates.length > 0) {
    console.warn(`Có ${duplicates.length} mã bị trùng giữa nhiều tài khoản (không tự xử lý, cần cấp lại mã thủ công):`)
    duplicates.forEach(([code, uids]) => console.warn(`  ${code}: ${uids.join(', ')}`))
  }
  if (!shouldWrite) console.log('Chạy lại với --write để ghi.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
