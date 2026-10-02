// Kiểm thử firestore.rules trên emulator: yarn test:rules
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { arrayUnion, deleteDoc, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { after, before, beforeEach, describe, test } from 'node:test'

let testEnv

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-qwerty-rules',
    firestore: { rules: readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8') },
  })
})

after(async () => {
  await testEnv?.cleanup()
})

beforeEach(async () => {
  await testEnv.clearFirestore()
})

const alice = () => testEnv.authenticatedContext('alice').firestore()
const bob = () => testEnv.authenticatedContext('bob').firestore()
const guest = () => testEnv.unauthenticatedContext().firestore()

const wordRecord = (overrides = {}) => ({
  word: 'hello',
  dict: 'coca_20000',
  chapter: 0,
  timeStamp: 1759370000,
  timing: [120, 90, 80, 100],
  wrongCount: 1,
  mistakes: { 1: ['r'] },
  hasError: true,
  syncedAt: serverTimestamp(),
  ...overrides,
})

const dailyStatsUpdate = (count = 1) => ({
  date: '2026-10-02',
  exerciseCount: increment(count),
  totalTimeMs: increment(390),
  wrongCount: increment(1),
  totalChars: increment(5),
  words: arrayUnion('hello'),
  wrongKeys: { R: increment(1) },
  updatedAt: serverTimestamp(),
})

const seedUser = (data) =>
  testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'users/alice'), data)
  })

describe('users/{uid}', () => {
  test('chủ tài khoản ghi được settings và progress', async () => {
    await assertSucceeds(
      setDoc(doc(alice(), 'users/alice'), { settings: { fontSize: 1 }, settingsUpdatedAt: serverTimestamp() }, { merge: true }),
    )
    await assertSucceeds(
      setDoc(
        doc(alice(), 'users/alice'),
        { progress: { dictId: 'coca_20000', chapter: 3, updatedAt: serverTimestamp() } },
        { merge: true },
      ),
    )
  })

  test('client không tự đặt được field do server quản lý', async () => {
    await seedUser({
      uid: 'alice',
      code: 'ABC123',
      isDonated: false,
      totalDonate: 0,
      streak: { current: 1, best: 1, lastDate: '2026-10-01' },
    })
    for (const data of [
      { code: 'HACKED' },
      { isDonated: true },
      { totalDonate: 1000000 },
      { streak: { current: 999, best: 999, lastDate: '2026-10-02' } },
      { totalChapters: 999 },
      { name: 'Người khác' },
    ]) {
      await assertFails(setDoc(doc(alice(), 'users/alice'), data, { merge: true }))
    }
  })

  test('không đọc / ghi được tài khoản người khác, khách không đọc được', async () => {
    await seedUser({ uid: 'alice', code: 'ABC123' })
    await assertFails(getDoc(doc(bob(), 'users/alice')))
    await assertFails(setDoc(doc(bob(), 'users/alice'), { settings: {} }, { merge: true }))
    await assertFails(getDoc(doc(guest(), 'users/alice')))
  })

  test('progress không hợp lệ bị từ chối', async () => {
    await assertFails(setDoc(doc(alice(), 'users/alice'), { progress: { dictId: 'coca_20000', chapter: -1 } }, { merge: true }))
  })
})

describe('users/{uid}/wordRecords + dailyStats', () => {
  test('đẩy bản ghi kèm dailyStats trong một batch', async () => {
    const db = alice()
    const batch = writeBatch(db)
    batch.set(doc(db, 'users/alice/wordRecords/1759370000_abc'), wordRecord())
    batch.set(doc(db, 'users/alice/dailyStats/2026-10-02'), dailyStatsUpdate(), { merge: true })
    await assertSucceeds(batch.commit())

    const stats = await getDoc(doc(db, 'users/alice/dailyStats/2026-10-02'))
    assert.equal(stats.get('exerciseCount'), 1)
    assert.deepEqual(stats.get('wrongKeys'), { R: 1 })
  })

  test('đẩy lại bản ghi đã có bị từ chối toàn bộ batch, dailyStats không bị cộng trùng', async () => {
    const db = alice()
    const first = writeBatch(db)
    first.set(doc(db, 'users/alice/wordRecords/1759370000_abc'), wordRecord())
    first.set(doc(db, 'users/alice/dailyStats/2026-10-02'), dailyStatsUpdate(), { merge: true })
    await assertSucceeds(first.commit())

    const retry = writeBatch(db)
    retry.set(doc(db, 'users/alice/wordRecords/1759370000_abc'), wordRecord())
    retry.set(doc(db, 'users/alice/dailyStats/2026-10-02'), dailyStatsUpdate(), { merge: true })
    await assertFails(retry.commit())

    const stats = await getDoc(doc(db, 'users/alice/dailyStats/2026-10-02'))
    assert.equal(stats.get('exerciseCount'), 1)
  })

  test('bản ghi không hợp lệ bị từ chối', async () => {
    const db = alice()
    await assertFails(setDoc(doc(db, 'users/alice/wordRecords/a'), wordRecord({ hasError: false })))
    await assertFails(setDoc(doc(db, 'users/alice/wordRecords/b'), wordRecord({ extra: 1 })))
    await assertFails(setDoc(doc(db, 'users/alice/wordRecords/c'), wordRecord({ word: '' })))
    await assertFails(setDoc(doc(db, 'users/alice/wordRecords/d'), wordRecord({ syncedAt: new Date() })))
    await assertSucceeds(setDoc(doc(db, 'users/alice/wordRecords/e'), wordRecord({ chapter: null })))
  })

  test('không sửa được bản ghi; chủ tài khoản xoá được (Error Book); người khác không đọc / ghi được', async () => {
    await assertSucceeds(setDoc(doc(alice(), 'users/alice/wordRecords/x'), wordRecord()))
    await assertFails(getDoc(doc(bob(), 'users/alice/wordRecords/x')))
    await assertFails(setDoc(doc(bob(), 'users/alice/wordRecords/y'), wordRecord()))
    await assertFails(updateDoc(doc(alice(), 'users/alice/wordRecords/x'), { wrongCount: 0, hasError: false }))
    await assertSucceeds(deleteDoc(doc(alice(), 'users/alice/wordRecords/x')))
  })

  test('dailyStats không cho giảm bộ đếm hoặc sai ngày', async () => {
    const db = alice()
    await assertSucceeds(setDoc(doc(db, 'users/alice/dailyStats/2026-10-02'), dailyStatsUpdate(), { merge: true }))
    await assertFails(
      setDoc(doc(db, 'users/alice/dailyStats/2026-10-02'), { exerciseCount: 0, updatedAt: serverTimestamp() }, { merge: true }),
    )
    await assertFails(setDoc(doc(db, 'users/alice/dailyStats/2026-10-03'), dailyStatsUpdate(), { merge: true }))
  })
})

describe('history, publicProfiles, userCodes', () => {
  test('ghi log luyện tập với timestamp của server', async () => {
    const log = {
      dictID: 'coca_20000',
      chapter: 0,
      timeSpentMs: 60000,
      accuracy: 95,
      correctCount: 100,
      wrongCount: 5,
      wordCount: 20,
      wpm: 20,
      isRevision: false,
    }
    await assertSucceeds(setDoc(doc(alice(), 'users/alice/history/1'), { ...log, timestamp: serverTimestamp() }))
    await assertFails(setDoc(doc(alice(), 'users/alice/history/2'), { ...log, timestamp: new Date('2026-01-01') }))
  })

  test('publicProfiles chỉ đọc, userCodes khoá hoàn toàn', async () => {
    await assertFails(setDoc(doc(alice(), 'publicProfiles/alice'), { uid: 'alice', name: 'A', bestStreak: 999 }))
    await assertSucceeds(getDoc(doc(bob(), 'publicProfiles/alice')))
    await assertFails(getDoc(doc(guest(), 'publicProfiles/alice')))
    await assertFails(setDoc(doc(alice(), 'userCodes/ABC123'), { uid: 'alice' }))
    await assertFails(getDoc(doc(alice(), 'userCodes/ABC123')))
  })
})
