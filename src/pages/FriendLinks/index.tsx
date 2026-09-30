import Layout from '../../components/Layout'
import ezbdc from '@/assets/friendlinks/ezbdc.jpg'
import kk from '@/assets/friendlinks/kk.jpg'
import web_worker from '@/assets/friendlinks/web-worker.png'
import type React from 'react'

export const FriendLinks: React.FC = () => {
  const links = [
    {
      title: 'ezghi nhớ từ',
      href: 'https://ezbdc.dashu.ai',
      imgSrc: ezbdc,
      description:
        'Một ứng dụng học từ tiếng Anh tối giản，Bạn có thể học tiếng Anh rất thuận tiện và hiệu quả，Chế độ đọc thuộc lòng đầy thử thách，Không cần đăng ký，Tải xuống và sử dụng',
    },
    {
      title: 'Kai',
      href: 'https://kaiyi.cool/',
      imgSrc: kk,
      description: 'Kai blog cá nhân，Ghi lại một số bài viết kỹ thuật，Những hiểu biết sâu sắc về cuộc sống，và một số dự án nhỏ thú vị',
    },
    {
      title: 'Web Worker-Lập trình viên front-end thích lắng nghe',
      href: 'https://www.xiaoyuzhoufm.com/podcast/613753ef23c82a9a1ccfdf35',
      imgSrc: web_worker,
      description:
        'Web Worker Podcast là một chương trình podcast âm thanh front-end của Trung Quốc, nơi một số lập trình viên front-end trò chuyện.。Chương trình nói về lĩnh vực lập trình viên，thông tin trò chuyện、Nói về nơi làm việc、Trò chuyện về lựa chọn công nghệ……Miễn là nó như vậy và web Bạn có thể trò chuyện về bất cứ điều gì liên quan đến phát triển。',
    },
  ]

  return (
    <Layout>
      <div className="flex w-full flex-1 flex-col items-center px-4 pt-20">
        <div className="flex w-full max-w-md flex-grow flex-col items-center">
          <div className="mt-5 text-center text-lg font-bold dark:text-gray-50">Liên kết thân thiện</div>
          <div className="links flex w-full flex-col items-center gap-y-8 py-5">
            {links.map((link, index) => (
              <a
                key={index}
                title={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="linkItem flex w-full items-center overflow-hidden dark:text-gray-50"
              >
                <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center bg-gray-200">
                  <img src={link.imgSrc} alt={link.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="pb-1 text-sm font-bold">{link.title}</div>
                  <div className="text-xs text-gray-500">{link.description}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-auto pb-5 text-center text-sm text-gray-500">
          Muốn thêm liên kết bạn bè？Vui lòng liên hệ email：
          <a href="mailto:me@kaiyi.cool" className="text-blue-500">
            me@kaiyi.cool
          </a>
        </div>
      </div>
    </Layout>
  )
}
