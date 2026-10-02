import { Amount } from './components/Amount'
import { db } from '@/lib/firebase'
import { authUserAtom } from '@/store'
import { doc, getDoc } from 'firebase/firestore'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export type AmountType = -1 | 50000 | 100000 | 200000 | 500000
const displayAmount: AmountType[] = [50000, 100000, 200000, 500000, -1]

export const DonatingCard = ({ className, onAmountChange }: { className?: string; onAmountChange?: (amount: AmountType) => void }) => {
  const [amount, setAmount] = useState<AmountType | undefined>(undefined)
  const [userCode, setUserCode] = useState<string>('')
  const authUser = useAtomValue(authUserAtom)
  const uid = authUser?.uid

  useEffect(() => {
    setUserCode('')
    const fetchUserCode = async () => {
      if (uid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            if (data.code) {
              setUserCode(data.code)
            }
          }
        } catch (err) {
          console.error(err)
        }
      }
    }
    fetchUserCode()
  }, [uid])

  const onClickAmount = (amount: AmountType) => {
    setAmount(amount)
  }

  useEffect(() => {
    onAmountChange && amount && onAmountChange(amount as AmountType)
  }, [amount, onAmountChange])

  return (
    <div className={`flex w-full flex-col items-center justify-center gap-3 ${className && className}`}>
      <h2 className="text-center font-bold text-gray-800 dark:text-gray-300">Chọn số tiền quyên góp của bạn：</h2>
      {authUser === null && (
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          <Link to="/login" className="font-semibold text-indigo-500 hover:text-indigo-600">
            Đăng nhập
          </Link>{' '}
          để khoản ủng hộ được ghi nhận vào tài khoản của bạn.
        </p>
      )}
      <div className="mt-2 flex gap-3">
        {displayAmount.map((a) => {
          return <Amount active={a === amount} key={a} amount={a} onClick={onClickAmount} />
        })}
      </div>

      <div className={`mt-3 flex w-full flex-col overflow-hidden px-4 transition-[height] duration-500 ${amount ? 'h-72' : 'h-0'}`}>
        {amount && (
          <div className="flex w-full justify-center">
            <img
              src={`https://vietqr.app/img?acc=${import.meta.env.VITE_BANK_ACCOUNT || '9988776655'}&bank=${
                import.meta.env.VITE_BANK_NAME || 'Vietcombank'
              }${amount !== -1 ? `&amount=${amount}` : ''}&des=${userCode || 'Ung ho Type And English'}&template=compact&showinfo=true`}
              alt="Mã QR thanh toán SePay"
              className="h-full max-h-72 w-auto object-contain"
            />
          </div>
        )}
      </div>
    </div>
  )
}
