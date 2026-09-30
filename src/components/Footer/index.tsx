import { DonatingCard } from '../DonatingCard'
import { StickerButton } from '../DonatingCard/components/StickerButton'
import redBookCode from '@/assets/redBook-code.jpg'
import InfoPanel from '@/components/InfoPanel'
import Tooltip from '@/components/Tooltip'
import { infoPanelStateAtom } from '@/store'
import type { InfoPanelType } from '@/typings'
import { recordOpenInfoPanelAction } from '@/utils'
import { useAtom } from 'jotai'
import type React from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import IconMail from '~icons/material-symbols/mail'
import IconCoffee2 from '~icons/mdi/coffee'
import IconXiaoHongShu from '~icons/my-icons/xiaohongshu'
import RiLinksLine from '~icons/ri/links-line'
import IconTwitter from '~icons/ri/twitter-fill'
import IconGithub from '~icons/simple-icons/github'
import IconVisualstudiocode from '~icons/simple-icons/visualstudiocode'
import IconWechat2 from '~icons/simple-icons/wechat'
import IconWechat from '~icons/tabler/brand-wechat'
import IconCoffee from '~icons/tabler/coffee'
import IconTerminal2 from '~icons/tabler/terminal-2'
import IconFlagChina from '~icons/twemoji/flag-china'

const Footer: React.FC = () => {
  const [infoPanelState, setInfoPanelState] = useAtom(infoPanelStateAtom)
  const navigate = useNavigate()

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
          Cảm ơn bạn rất nhiều vì đã sử dụng Qwerty Learner，Hiện tại website đang được bảo trì trong thời gian rảnh rỗi，Để đảm bảo rằng
          trang web có thể tiếp tục cung cấp dịch vụ chất lượng cao cho mọi người，chúng tôi cần sự giúp đỡ của bạn！
          <br />
          Khoản đóng góp của bạn sẽ giúp chúng tôi trang trải chi phí vận hành trang web của chúng tôi，Cải thiện chức năng và thiết kế của
          trang web，并提高用户kinh nghiệm。
          <br />
        </p>
        <br />
        <p className="indent-4 text-sm text-gray-700 dark:text-gray-200">
          chúng tôi tin，Những nỗ lực chung có thể làm Qwerty Learner Trở thành một nền tảng học tập tốt hơn，Tôi cũng tin rằng sự ủng hộ
          của các bạn sẽ tiếp thêm động lực cho chúng tôi tiếp tục tiến về phía trước.。 cảm ơn sự hỗ trợ của bạn！
        </p>
        <br />
        <p className="indent-4 text-sm text-gray-700 dark:text-gray-200">
          Để cảm ơn sự hào phóng của bạn，Đơn 50 rmb Đóng góp từ và cao hơn， Chúng tôi sẽ trả lại Qwerty dán tùy chỉnh 5 miếng
          <span className="text-xs">（Chỉ có Trung Quốc đại lục）</span>
          ，Tôi hy vọng bạn có thể chia sẻ hạnh phúc của mình với bạn bè
        </p>
        <div className="flex items-center justify-center py-2">
          <StickerButton className="" />
        </div>

        <DonatingCard />
      </InfoPanel>

      <InfoPanel
        openState={infoPanelState.vsc}
        title="VSCode chạm🐟trình cắm thêm"
        icon={IconTerminal2}
        buttonClassName="bg-sky-500 hover:bg-sky-400"
        iconClassName="text-sky-500 bg-sky-100 dark:text-sky-300 dark:bg-sky-500"
        onClose={() => handleCloseInfoPanel('vsc')}
      >
        <p className="text-sm text-gray-500  dark:text-gray-400">
          Chúng tôi đã phát triển nó dựa trên đề xuất của bạn VSCode trình cắm thêm，Hỗ trợ bắt đầu bằng một cú nhấp chuột，Bắt đầu ghi nhớ
          từ bất cứ lúc nào。 Có thể mở trong bất kỳ tập tin nào chỉ bằng một cú nhấp chuột，Khi bật sẽ hiển thị chữ trên thanh trạng
          thái，Và plug-in sẽ chặn dữ liệu đầu vào của người dùng vào tài liệu，Giấy tờ gốc sẽ không bị ảnh hưởng。
        </p>
        <br /> <br />
        <a className="mr-5 underline dark:text-gray-300" href="https://github.com/RealKai42/qwerty-learner-vscode">
          GitHub dự án
        </a>
        <a className="underline dark:text-gray-300" href="https://marketplace.visualstudio.com/items?itemName=Kaiyi.qwerty-learner">
          VSCode Liên kết plugin
        </a>
        <br />
      </InfoPanel>

      <InfoPanel
        openState={infoPanelState.community}
        title="Cộng đồng phản hồi của người dùng"
        icon={IconWechat}
        buttonClassName="bg-green-500 hover:bg-green-400"
        iconClassName="text-green-500 bg-green-100 dark:text-green-300 dark:bg-green-500"
        onClose={() => handleCloseInfoPanel('community')}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Qwerty Learner 是một个Nguồn mởdự án，Được thiết kế để cung cấp cho người dùng chất lượng cao、Công cụ luyện gõ đáng tin cậy。
          <br />
          Sau khi tham gia cộng đồng người dùng của chúng tôi，Bạn có thể liên lạc với nhóm phát triển của chúng tôi，分享您củasử dụngkinh
          nghiệmVà建议，Hãy giúp chúng tôi cải thiện sản phẩm của mình，Đồng thời, bạn cũng có thể theo dõi những phát triển và cập nhật mới
          nhất của chúng tôi.。
          <br />
          <br />
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-200">
          Chúng tôi bị thuyết phục，Sự tương tác và phản hồi tốt từ người dùng là những yếu tố quan trọng thúc đẩy chúng tôi tiến lên và cải
          thiện。Vì vậy，Chúng tôi chân thành mời bạn tham gia cộng đồng của chúng tôi，Xây dựng tốt hơn với chúng tôi 「Qwerty Learner」！
        </p>
        <br />
        <p className="text-sm text-gray-500  dark:text-gray-400">Cảm ơn bạn một lần nữa vì sự hỗ trợ và quan tâm của bạn！</p>
        <br />
        <img className="ml-1 w-2/6 " src="https://qwerty.kaiyi.cool/weChat-group.png" alt="weChat-group" />
        <br />
      </InfoPanel>

      <InfoPanel
        openState={infoPanelState.redBook}
        title="cộng đồng Xiaohongshu"
        icon={IconXiaoHongShu}
        buttonClassName="bg-red-500 hover:bg-red-400"
        iconClassName="text-red-500 bg-red-100 dark:text-red-600 dark:bg-red-500"
        onClose={() => handleCloseInfoPanel('redBook')}
      >
        <p className="text-sm text-gray-500  dark:text-gray-400">
          Qwerty Learner 是một个Nguồn mởdự án，Được thiết kế để cung cấp cho người dùng chất lượng cao、Công cụ luyện gõ đáng tin cậy。
          <br />
          Theo dõi Xiaohongshu, Bạn có thể nhận được những tin tức và cập nhật mới nhất từ nhóm phát triển, phản hồi trải nghiệm và đề xuất
          sử dụng của bạn, Hãy giúp chúng tôi cải thiện sản phẩm của mình.
          <br />
          <br />
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-200">
          Chúng tôi bị thuyết phục，Sự tương tác và phản hồi tốt từ người dùng là những yếu tố quan trọng thúc đẩy chúng tôi tiến lên và cải
          thiện。Vì vậy，Chúng tôi chân thành mời bạn theo dõi tài khoản Xiaohongshu của chúng tôi，Xây dựng tốt hơn với chúng tôi 「Qwerty
          Learner」！
        </p>
        <br />
        <img className="ml-1 w-5/12 " src={redBookCode} alt="redBook" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tips: Từ Tiểu Hồng Thư“TÔI”Bấm vào góc trên bên trái của ba xuất hiện Quét
        </p>
        <br />
      </InfoPanel>

      <footer className="mb-1 mt-4 flex w-full items-center justify-center gap-2.5 text-sm ease-in" onClick={(e) => e.currentTarget.blur()}>
        <a href="https://github.com/RealKai42/qwerty-learner" target="_blank" rel="noreferrer" aria-label="đi tới GitHub Trang chủ dự án">
          <IconGithub fontSize={15} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100" />
        </a>

        <button
          className="cursor-pointer"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('redBook')
            e.currentTarget.blur()
          }}
          aria-label="Tham gia cộng đồng Xiaohongshu của chúng tôi"
        >
          <IconXiaoHongShu fontSize={14} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500" />
        </button>

        <button
          className="cursor-pointer focus:outline-none"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('community')
            e.currentTarget.blur()
          }}
          aria-label="Tham gia nhóm người dùng WeChat của chúng tôi"
        >
          <IconWechat2 fontSize={16} className="text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-500" />
        </button>

        <a href="https://twitter.com/real_kai42" target="_blank" title="x" rel="noreferrer">
          <IconTwitter fontSize={16} className="text-gray-500 hover:text-[#1DA1F2] dark:text-gray-400 dark:hover:text-[#1DA1F2]" />
        </a>
        <button
          className="cursor-pointer focus:outline-none "
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
          aria-label="Hãy cân nhắc quyên góp cho chúng tôi"
        >
          <IconCoffee2 fontSize={16} className="text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-500" />
        </button>

        <button
          className="cursor-pointer focus:outline-none"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('vsc')
            e.currentTarget.blur()
          }}
          aria-label="sử dụng Visual Studio Code Phiên bản trình cắm Qwerty Learner"
        >
          <IconVisualstudiocode fontSize={14} className="text-gray-500 hover:text-sky-500 dark:text-gray-400 dark:hover:text-sky-500" />
        </button>

        <a
          href="mailto:me@kaiyi.cool"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.currentTarget.blur()}
          aria-label="Gửi email tới me@kaiyi.cool"
        >
          <IconMail fontSize={16} className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400" />
        </a>
        <a
          rel="noreferrer"
          className="cursor-pointer focus:outline-none"
          onClick={() => navigate('/friend-links')}
          aria-label="Xem liên kết bạn bè"
        >
          <RiLinksLine fontSize={14} className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400" />
        </a>

        <Tooltip content="Gương Trung Quốc đại lục">
          <a href="https://kaiyiwing.gitee.io/qwerty-learner" target="_self" title="Đến Gương Trung Quốc Đại Lục">
            <IconFlagChina fontSize={16} />
          </a>
        </Tooltip>

        <button
          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
        >
          @ Qwerty Learner
        </button>

        <a
          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          href="https://beian.miit.gov.cn"
          target="_blank"
          rel="noreferrer"
        >
          LữICPChuẩn bị2022030649Con số
        </a>
        <span className="select-none rounded bg-slate-200 px-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          Build <span className="select-all">{LATEST_COMMIT_HASH}</span>
        </span>
      </footer>
    </>
  )
}

export default Footer
