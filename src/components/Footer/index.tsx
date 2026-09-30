import { DonatingCard } from '../DonatingCard'
import InfoPanel from '@/components/InfoPanel'
import { infoPanelStateAtom } from '@/store'
import type { InfoPanelType } from '@/typings'
import { recordOpenInfoPanelAction } from '@/utils'
import { useAtom } from 'jotai'
import type React from 'react'
import { useCallback } from 'react'
import IconMail from '~icons/material-symbols/mail'
import IconCoffee2 from '~icons/mdi/coffee'
import IconFacebook from '~icons/simple-icons/facebook'
import IconZalo from '~icons/simple-icons/zalo'
import IconCoffee from '~icons/tabler/coffee'

const Footer: React.FC = () => {
  const [infoPanelState, setInfoPanelState] = useAtom(infoPanelStateAtom)

  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      recordOpenInfoPanelAction(modalType, 'footer')
      setInfoPanelState((state) => ({ ...state, [modalType]: true }))
    },
    [setInfoPanelState],
  )

  const handleCloseInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: false }))
    },
    [setInfoPanelState],
  )

  return (
    <>
      <InfoPanel
        openState={infoPanelState.donate}
        title="Buy us a coffee"
        icon={IconCoffee}
        buttonClassName="bg-amber-500 hover:bg-amber-400"
        iconClassName="text-amber-500 bg-amber-100 dark:text-amber-300 dark:bg-amber-500"
        onClose={() => handleCloseInfoPanel('donate')}
      >
        <p className="indent-4 text-sm text-gray-500 dark:text-gray-300">
          Cảm ơn bạn rất nhiều vì đã sử dụng {import.meta.env.VITE_APP_NAME || 'Qwerty Learner'}! Hiện tại website đang được bảo trì và phát
          triển trong thời gian rảnh rỗi. Để đảm bảo rằng trang web có thể tiếp tục cung cấp dịch vụ chất lượng cao cho mọi người, chúng tôi
          cần sự giúp đỡ của bạn!
          <br />
          Khoản đóng góp của bạn sẽ giúp chúng tôi trang trải chi phí vận hành trang web {import.meta.env.VITE_FRONTEND_URL}, cải thiện chức
          năng, thiết kế, và nâng cao trải nghiệm người dùng.
          <br />
        </p>
        <br />
        <p className="indent-4 text-sm text-gray-700 dark:text-gray-200">
          Chúng tôi tin rằng, những nỗ lực chung có thể làm cho {import.meta.env.VITE_APP_NAME || 'Qwerty Learner'} trở thành một nền tảng
          học tập tốt hơn. Sự ủng hộ của các bạn sẽ tiếp thêm động lực cho chúng tôi tiếp tục tiến về phía trước. Cảm ơn sự hỗ trợ của bạn!
        </p>
        <br />

        <DonatingCard />
      </InfoPanel>

      <footer className="mb-1 mt-4 flex w-full items-center justify-center gap-4 text-sm ease-in" onClick={(e) => e.currentTarget.blur()}>
        <a
          href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'lehuyphuong.work@gmail.com'}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Mail"
        >
          <IconMail fontSize={18} className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400" />
        </a>

        <a href={`https://zalo.me/${import.meta.env.VITE_ZALO_PHONE || '0123456789'}`} target="_blank" rel="noreferrer" aria-label="Zalo">
          <IconZalo fontSize={18} className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500" />
        </a>

        <a
          href={`https://facebook.com/${import.meta.env.VITE_FACEBOOK_USERNAME || 'username'}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          <IconFacebook fontSize={18} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-600" />
        </a>

        <button
          className="cursor-pointer focus:outline-none"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
          aria-label="Buy a coffee"
        >
          <IconCoffee2 fontSize={18} className="text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-500" />
        </button>
      </footer>
    </>
  )
}

export default Footer
