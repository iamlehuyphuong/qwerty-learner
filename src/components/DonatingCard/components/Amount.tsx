import type { AmountType } from '..'

export const Amount = ({
  amount,
  onClick,
  active = true,
}: {
  amount: AmountType
  onClick?: (amount: AmountType) => void
  active: boolean
}) => {
  return (
    <button
      className={` focus:  h-10 rounded border-gray-100 px-3 font-bold text-gray-700 shadow-md
 shadow-gray-300 outline-none hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:text-opacity-80 
 dark:opacity-80 dark:shadow-gray-700 hover:dark:bg-gray-600
 ${active ? 'bg-stone-100 dark:bg-gray-500' : ''}`}
      onClick={() => onClick && onClick(amount)}
    >
      {amount === -1 ? 'Tuỳ chọn' : `${amount / 1000}K`}
    </button>
  )
}
