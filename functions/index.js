const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { defineSecret, defineString } = require('firebase-functions/params')
const { logger } = require('firebase-functions')
const admin = require('firebase-admin')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')
const crypto = require('crypto')

admin.initializeApp()
const db = getFirestore()

// Region cho HTTP/callable functions (client gọi tới region này: src/lib/firebase.ts)
const REGION = 'asia-southeast1'
// Firestore trigger phải đặt cùng location với database Firestore (xem Firebase Console > Firestore > Location).
// Đổi giá trị này nếu database không nằm ở asia-southeast1 (vd: nam5 -> us-central1, eur3 -> europe-west1)
const FIRESTORE_TRIGGER_REGION = 'asia-southeast1'
// Streak tính theo ngày giờ Việt Nam
const STREAK_TIME_ZONE = 'Asia/Ho_Chi_Minh'

// Secret key từ Tingee — cấu hình bằng: firebase functions:secrets:set TINGEE_SECRET_KEY
const tingeeSecretKey = defineSecret('TINGEE_SECRET_KEY')

// Client ID từ Tingee — cấu hình trong file functions/.env
const tingeeClientId = defineString('TINGEE_CLIENT_ID')

/**
 * Xác thực chữ ký webhook từ Tingee
 * Sử dụng HMAC_SHA512(timestamp + ":" + json_body, secretKey)
 */
function verifyWebhookSignature(timestamp, rawBody, signature, secretKey) {
  const message = `${timestamp}:${rawBody}`
  const computedSig = crypto.createHmac('sha512', secretKey).update(message).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(computedSig, 'hex'), Buffer.from(signature, 'hex'))
}

/**
 * Trích xuất các chuỗi có thể là user code từ nội dung thanh toán, ưu tiên từ cuối lên
 * (user code thường nằm ở cuối, vd: "Ung ho ABC12D").
 * User code: chuỗi A-Z0-9 viết hoa 4-10 ký tự (mã mới 6 ký tự, mã cũ dạng Base36)
 */
function extractUserCodeCandidates(content) {
  if (!content || typeof content !== 'string') return []

  const normalized = content.trim().toUpperCase()
  if (/^[A-Z0-9]{4,10}$/.test(normalized)) {
    return [normalized]
  }

  const matches = normalized.match(/\b[A-Z0-9]{4,10}\b/g) || []
  return Array.from(new Set(matches.reverse()))
}

/**
 * Tìm user bằng code: tra userCodes/{code} (mã do ensureUserProfile cấp, đảm bảo không trùng),
 * sau đó tới users.code cho tài khoản cũ chưa có trong userCodes
 */
async function findUserByCode(code) {
  const codeSnap = await db.collection('userCodes').doc(code).get()
  if (codeSnap.exists) {
    const userSnap = await db.collection('users').doc(codeSnap.get('uid')).get()
    if (userSnap.exists) return { id: userSnap.id, ...userSnap.data() }
  }
  const snapshot = await db.collection('users').where('code', '==', code).limit(1).get()
  if (snapshot.empty) return null
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
}

/**
 * Webhook endpoint nhận thông báo thanh toán từ Tingee
 *
 * Flow:
 * 1. Nhận webhook POST từ Tingee
 * 2. Xác thực chữ ký (x-signature) bằng HMAC_SHA512
 * 3. Trích xuất user code từ nội dung thanh toán (content), tìm user tương ứng
 * 4. Trong một transaction: bỏ qua nếu transactionCode đã xử lý (idempotency), lưu log vào donations,
 *    cập nhật isDonated = true và cộng dồn totalDonate cho user
 * 5. Trả về { code: "00", message: "Success" }
 */
exports.tingeeWebhook = onRequest(
  {
    region: REGION,
    secrets: [tingeeSecretKey],
    cors: false,
    maxInstances: 10,
  },
  async (req, res) => {
    // Chỉ chấp nhận POST
    if (req.method !== 'POST') {
      logger.warn('Webhook: Rejected non-POST request', { method: req.method })
      res.status(405).json({ code: '99', message: 'Method Not Allowed' })
      return
    }

    const secretKey = tingeeSecretKey.value()

    // Lấy headers
    const signature = req.headers['x-signature']
    const timestamp = req.headers['x-request-timestamp']
    const requestId = req.headers['x-request-id']

    // Log toàn bộ payload và headers để audit
    logger.info('Webhook received', {
      requestId,
      timestamp,
      headers: {
        'x-request-id': requestId,
        'x-request-timestamp': timestamp,
        'content-type': req.headers['content-type'],
      },
      body: req.body,
    })

    // Kiểm tra headers bắt buộc
    if (!signature || !timestamp) {
      logger.error('Webhook: Missing required headers', { signature: !!signature, timestamp: !!timestamp })
      res.status(400).json({ code: '99', message: 'Missing required headers' })
      return
    }

    // Xác thực chữ ký trên body gốc (serialize lại req.body có thể khác byte so với body Tingee đã ký)
    try {
      const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body)
      const isValid = verifyWebhookSignature(timestamp, rawBody, signature, secretKey)
      if (!isValid) {
        logger.error('Webhook: Invalid signature', { requestId })
        res.status(401).json({ code: '99', message: 'Invalid signature' })
        return
      }
    } catch (err) {
      logger.error('Webhook: Signature verification error', { error: err.message })
      res.status(401).json({ code: '99', message: 'Signature verification failed' })
      return
    }

    // Parse body
    const { clientId, transactionCode, amount, content, bank, accountNumber, vaAccountNumber, transactionDate, additionalData, billId } =
      req.body

    // Validate fields bắt buộc
    if (!transactionCode || !amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      logger.error('Webhook: Missing or invalid body fields', { transactionCode, amount })
      res.status(400).json({ code: '99', message: 'Missing required fields' })
      return
    }

    // Xác thực clientId
    const expectedClientId = tingeeClientId.value()
    if (clientId && expectedClientId && clientId !== expectedClientId) {
      logger.error('Webhook: ClientId mismatch', { received: clientId, expected: expectedClientId })
      res.status(403).json({ code: '99', message: 'Invalid client' })
      return
    }

    const donationRef = db.collection('donations').doc(String(transactionCode))

    // Trích xuất user code từ nội dung thanh toán
    const candidates = extractUserCodeCandidates(content)
    let userCode = null
    let matchedUser = null
    for (const candidate of candidates) {
      matchedUser = await findUserByCode(candidate)
      if (matchedUser) {
        userCode = candidate
        break
      }
    }
    const userId = matchedUser ? matchedUser.id : null

    if (matchedUser) {
      logger.info('Webhook: Matched user', { userCode, userId, userName: matchedUser.name })
    } else if (candidates.length > 0) {
      logger.warn('Webhook: User code found but no matching user', { candidates, content })
    } else {
      logger.warn('Webhook: No user code found in content', { content })
    }

    const donationData = {
      transactionCode,
      clientId: clientId || null,
      amount: Number(amount),
      content: content || '',
      bank: bank || null,
      accountNumber: accountNumber || null,
      vaAccountNumber: vaAccountNumber || null,
      transactionDate: transactionDate || null,
      additionalData: additionalData || null,
      billId: billId || null,
      requestId: requestId || null,
      extractedUserCode: userCode || candidates[0] || null,
      matchedUserId: userId || null,
      status: userId ? 'matched' : 'unmatched',
      processedAt: FieldValue.serverTimestamp(),
    }

    // Transaction: kiểm tra transactionCode đã xử lý chưa + lưu donation + cộng tiền cho user.
    // Tingee gửi lại webhook gần như đồng thời cũng chỉ được ghi nhận một lần
    let alreadyProcessed = false
    try {
      await db.runTransaction(async (tx) => {
        const existing = await tx.get(donationRef)
        if (existing.exists) {
          alreadyProcessed = true
          return
        }
        tx.create(donationRef, donationData)
        if (userId) {
          tx.set(
            db.collection('users').doc(userId),
            {
              isDonated: true,
              totalDonate: FieldValue.increment(Number(amount)),
              updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true },
          )
        }
      })
    } catch (err) {
      logger.error('Webhook: Failed to save transaction', { error: err.message, transactionCode })
      res.status(500).json({ code: '99', message: 'Internal error' })
      return
    }

    if (alreadyProcessed) {
      logger.info('Webhook: Transaction already processed (idempotent)', { transactionCode })
    } else {
      logger.info('Webhook: Transaction processed successfully', {
        transactionCode,
        amount,
        userId,
        userCode,
        status: userId ? 'matched' : 'unmatched',
      })
    }

    // Phản hồi thành công theo format Tingee yêu cầu
    res.status(200).json({ code: '00', message: 'Success' })
  },
)

// Mã donate: bỏ các ký tự dễ nhầm khi gõ nội dung chuyển khoản (0/O, 1/I).
// Đúng 32 ký tự nên randomBytes % 32 phân bố đều
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6
const CODE_CANDIDATES = 5

function randomUserCode() {
  return Array.from(crypto.randomBytes(CODE_LENGTH), (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join('')
}

/**
 * Tạo hồ sơ người dùng nếu chưa có: mã donate không trùng (giữ chỗ bằng userCodes/{code}), tên, email...
 * Gọi được nhiều lần (idempotent). Client gọi sau khi đăng ký, và khi phát hiện tài khoản chưa có hồ sơ.
 * data.name (tuỳ chọn): biệt danh, ghi đè tên hiện có.
 */
exports.ensureUserProfile = onCall({ region: REGION }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Cần đăng nhập')
  }

  const uid = request.auth.uid
  const token = request.auth.token || {}
  const requestedName = request.data && typeof request.data.name === 'string' ? request.data.name.trim().slice(0, 50) : ''
  const userRef = db.collection('users').doc(uid)
  const publicProfileRef = db.collection('publicProfiles').doc(uid)
  const candidates = Array.from({ length: CODE_CANDIDATES }, randomUserCode)

  return db.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef)
    const user = userSnap.exists ? userSnap.data() : {}
    const codeRefs = (user.code ? [user.code] : candidates).map((code) => db.collection('userCodes').doc(code))
    const codeSnaps = await tx.getAll(...codeRefs)
    const now = FieldValue.serverTimestamp()

    const profile = {}
    let code = user.code
    if (code) {
      // Tài khoản cũ (mã do client tạo trước đây): giữ chỗ mã trong userCodes nếu còn trống
      if (!codeSnaps[0].exists) {
        tx.create(codeRefs[0], { uid, createdAt: now })
      } else if (codeSnaps[0].get('uid') !== uid) {
        logger.warn('ensureUserProfile: Legacy code already taken by another user', { uid, code })
      }
    } else {
      const freeIndex = codeSnaps.findIndex((snap) => !snap.exists)
      if (freeIndex === -1) {
        throw new HttpsError('aborted', 'Không tạo được mã người dùng, vui lòng thử lại')
      }
      code = candidates[freeIndex]
      tx.create(codeRefs[freeIndex], { uid, createdAt: now })
      profile.code = code
    }

    if (requestedName) {
      profile.name = requestedName
    } else if (!user.name) {
      profile.name = token.name || (token.email ? token.email.split('@')[0] : 'Học viên')
    }
    if (!user.uid) profile.uid = uid
    if (!user.email && token.email) profile.email = token.email
    if (user.isDonated === undefined) profile.isDonated = false
    if (user.totalDonate === undefined) profile.totalDonate = 0
    if (!user.createdAt) profile.createdAt = now
    if (!user.streak) profile.streak = { current: 0, best: 0, lastDate: '' }

    if (Object.keys(profile).length > 0) {
      tx.set(userRef, { ...profile, updatedAt: now }, { merge: true })
    }
    if (profile.name) {
      tx.set(publicProfileRef, { uid, name: profile.name, updatedAt: now }, { merge: true })
    }

    return { code }
  })
})

function toZonedDate(date) {
  // en-CA cho định dạng YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: STREAK_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

function previousDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() - 1)
  return date.toISOString().slice(0, 10)
}

const nonNegative = (value) => (typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0)

/**
 * Mỗi lần client ghi log luyện tập (users/{uid}/history), server cộng dồn thống kê tổng và tính streak.
 * Client không được tự ghi các field này (firestore.rules) nên không thể gian lận bảng xếp hạng bằng cách sửa số:
 * timestamp của log do server đặt (rules bắt buộc == request.time) nên cũng không lùi ngày được.
 */
exports.onHistoryCreated = onDocumentCreated(
  { document: 'users/{uid}/history/{logId}', region: FIRESTORE_TRIGGER_REGION },
  async (event) => {
    const snap = event.data
    if (!snap) return
    const { uid } = event.params
    const userRef = db.collection('users').doc(uid)
    const publicProfileRef = db.collection('publicProfiles').doc(uid)

    await db.runTransaction(async (tx) => {
      const [logSnap, userSnap] = await tx.getAll(snap.ref, userRef)
      // Trigger có thể chạy lại nhiều lần cho cùng một log
      if (!logSnap.exists || logSnap.get('processedAt')) return

      const log = logSnap.data()
      const user = userSnap.exists ? userSnap.data() : {}
      const now = FieldValue.serverTimestamp()
      const update = {
        totalTimeSpentMs: FieldValue.increment(nonNegative(log.timeSpentMs)),
        totalChapters: FieldValue.increment(1),
        totalWords: FieldValue.increment(nonNegative(log.wordCount)),
        updatedAt: now,
      }

      // Như trước đây: chỉ hoàn thành bài mới (không phải ôn tập) mới tính streak
      if (!log.isRevision) {
        const practicedAt = log.timestamp && typeof log.timestamp.toDate === 'function' ? log.timestamp.toDate() : new Date()
        const day = toZonedDate(practicedAt)
        const streak = user.streak || { current: 0, best: 0, lastDate: '' }
        // Bỏ qua log của ngày cũ hơn lastDate (trigger chạy lại / xử lý lệch thứ tự)
        if (streak.lastDate < day) {
          const current = streak.lastDate === previousDate(day) ? (streak.current || 0) + 1 : 1
          const best = Math.max(streak.best || 0, current)
          update.streak = { current, best, lastDate: day }
          tx.set(
            publicProfileRef,
            { uid, name: user.name || 'Học viên', bestStreak: best, currentStreak: current, lastActiveDate: day, updatedAt: now },
            { merge: true },
          )
        }
      }

      tx.set(userRef, update, { merge: true })
      tx.update(snap.ref, { processedAt: now })
    })
  },
)
