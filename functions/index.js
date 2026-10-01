const { onRequest } = require('firebase-functions/v2/https')
const { defineSecret, defineString } = require('firebase-functions/params')
const { logger } = require('firebase-functions')
const admin = require('firebase-admin')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')
const crypto = require('crypto')

admin.initializeApp()
const db = getFirestore()

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
 * Trích xuất user code từ nội dung thanh toán
 * User code có dạng: chuỗi Base36 viết hoa (5-8 ký tự)
 * Ví dụ: "ABC12D" trong nội dung "ABC12D" hoặc "Ung ho ABC12D"
 */
function extractUserCode(content) {
  if (!content || typeof content !== 'string') return null

  // Loại bỏ khoảng trắng thừa và chuyển thành uppercase
  const normalized = content.trim().toUpperCase()

  // Tìm user code trong nội dung: chuỗi 4-8 ký tự gồm A-Z0-9
  // Ưu tiên match toàn bộ content nếu nó đúng format
  if (/^[A-Z0-9]{4,10}$/.test(normalized)) {
    return normalized
  }

  // Tìm trong nội dung: lấy từ cuối cùng phù hợp (thường user code nằm ở cuối)
  const matches = normalized.match(/\b[A-Z0-9]{4,10}\b/g)
  if (matches && matches.length > 0) {
    return matches[matches.length - 1]
  }

  return null
}

/**
 * Tìm user bằng code trong Firestore
 */
async function findUserByCode(code) {
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
 * 3. Kiểm tra idempotency (transactionCode đã xử lý chưa)
 * 4. Trích xuất user code từ nội dung thanh toán (content)
 * 5. Tìm user tương ứng trong Firestore
 * 6. Cập nhật isDonated = true, cộng dồn totalDonate
 * 7. Lưu log giao dịch vào collection donations
 * 8. Trả về { code: "00", message: "Success" }
 */
exports.tingeeWebhook = onRequest(
  {
    region: 'asia-southeast1',
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

    // Xác thực chữ ký
    try {
      const rawBody = JSON.stringify(req.body)
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
    if (!transactionCode || !amount) {
      logger.error('Webhook: Missing required body fields', { transactionCode, amount })
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

    // Kiểm tra idempotency — transactionCode đã xử lý chưa
    const donationRef = db.collection('donations').doc(transactionCode)
    const existingDonation = await donationRef.get()
    if (existingDonation.exists) {
      logger.info('Webhook: Transaction already processed (idempotent)', { transactionCode })
      // Vẫn trả 200 OK để Tingee không retry
      res.status(200).json({ code: '00', message: 'Success' })
      return
    }

    // Trích xuất user code từ nội dung thanh toán
    const userCode = extractUserCode(content)
    let matchedUser = null
    let userId = null

    if (userCode) {
      matchedUser = await findUserByCode(userCode)
      if (matchedUser) {
        userId = matchedUser.id
        logger.info('Webhook: Matched user', { userCode, userId, userName: matchedUser.name })
      } else {
        logger.warn('Webhook: User code found but no matching user', { userCode, content })
      }
    } else {
      logger.warn('Webhook: No user code found in content', { content })
    }

    // Transaction: lưu donation + cập nhật user (nếu tìm thấy)
    const batch = db.batch()

    // 1. Lưu log giao dịch donation
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
      extractedUserCode: userCode || null,
      matchedUserId: userId || null,
      status: userId ? 'matched' : 'unmatched',
      processedAt: FieldValue.serverTimestamp(),
    }
    batch.set(donationRef, donationData)

    // 2. Cập nhật user nếu tìm thấy
    if (userId) {
      const userRef = db.collection('users').doc(userId)
      batch.update(userRef, {
        isDonated: true,
        totalDonate: FieldValue.increment(Number(amount)),
        updatedAt: FieldValue.serverTimestamp(),
      })
    }

    try {
      await batch.commit()
      logger.info('Webhook: Transaction processed successfully', {
        transactionCode,
        amount,
        userId,
        userCode,
        status: userId ? 'matched' : 'unmatched',
      })
    } catch (err) {
      logger.error('Webhook: Failed to save transaction', { error: err.message, transactionCode })
      res.status(500).json({ code: '99', message: 'Internal error' })
      return
    }

    // Phản hồi thành công theo format Tingee yêu cầu
    res.status(200).json({ code: '00', message: 'Success' })
  },
)
