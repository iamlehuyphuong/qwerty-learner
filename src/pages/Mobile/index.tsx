import logo from '@/assets/logo.svg'
import directoryImg from '@/assets/mobile/carousel/directory.png'
import hotImg from '@/assets/mobile/carousel/hot.png'
import indexImg from '@/assets/mobile/carousel/index.png'
import codeImg from '@/assets/mobile/detail/code.png'
import dictationImg from '@/assets/mobile/detail/dictation.png'
import phoneticImg from '@/assets/mobile/detail/phonetic.png'
import speedImg from '@/assets/mobile/detail/speed.png'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

const detail = [
  {
    title: 'Chức năng hiển thị ký hiệu phiên âm và phát âm',
    description: 'Giúp người dùng ghi nhớ đồng thời cách phát âm và ký hiệu ngữ âm của từ',
    img: phoneticImg,
  },
  {
    title: 'Chế độ viết im lặng',
    description: 'Bạn có thể chọn viết thầm sau mỗi chương.，Củng cố các từ đã học',
    img: dictationImg,
  },
  {
    title: 'phản hồi thời gian thực',
    description: 'Hiển thị tốc độ đầu vào và độ chính xác，Cải thiện kỹ năng định lượng',
    img: speedImg,
  },
  {
    title: 'Tùy chỉnh cho lập trình viên',
    description: 'Từ vựng liên quan đến lập trình tích hợp，Nâng cao hiệu quả công việc',
    img: codeImg,
  },
]

const MobilePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 3 // Tổng số hình ảnh băng chuyền
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const slideWidth = container.offsetWidth

      if (currentSlide === 0) {
        container.style.transform = `translateX(-${totalSlides * slideWidth}px)`
        setTimeout(() => {
          container.style.transition = 'none'
          container.style.transform = `translateX(0)`
        }, 500)
      } else {
        container.style.transition = 'transform 0.5s ease'
        container.style.transform = `translateX(-${currentSlide * slideWidth}px)`
      }
    }
  }, [currentSlide])

  return (
    <div className="flex w-screen flex-col bg-white lg:mx-auto lg:max-w-7xl">
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-gray-100/50 bg-white/80 px-6 py-6 backdrop-blur-xl lg:px-12">
        <div className="flex items-center">
          <img src={logo} className="mr-4 h-10 w-10 lg:h-12 lg:w-12" alt={`${import.meta.env.VITE_APP_NAME || 'Type & English'} Logo`} />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight text-indigo-500 lg:text-xl">
              {import.meta.env.VITE_APP_NAME || 'Type & English'}
            </h1>
            <span className="text-xs font-normal text-gray-500">Trang web chính thức</span>
          </div>
        </div>
        <a
          href="https://qwerty.kaiyi.cool/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg md:flex"
        >
          <span>Truy cập trang web chính thức</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
        <a
          href="https://qwerty.kaiyi.cool/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm text-white transition-all duration-200 hover:bg-gray-800 md:hidden"
        >
          <span>Trang web chính thức</span>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </header>

      {/* vụn bánh mì */}
      <nav aria-label="vụn bánh mì" className="bg-gray-50/50 px-6 py-3 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <ol className="flex items-center space-x-2 text-sm text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <a href="https://qwerty.kaiyi.cool/" className="transition-colors hover:text-indigo-600" itemProp="item">
                <span itemProp="name">trang đầu</span>
              </a>
              <meta itemProp="position" content="1" />
            </li>
            <li className="flex items-center">
              <svg className="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="font-medium text-gray-900" itemProp="name">
                {import.meta.env.VITE_APP_NAME || 'Type & English'} Trang web chính thức
              </span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </div>
      </nav>

      <main role="main">
        <section
          className="relative mt-20 flex min-h-[90vh] items-center lg:mt-24"
          itemScope
          itemType="https://schema.org/SoftwareApplication"
        >
          {/* Nền gradient đơn giản */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white to-slate-50/30"></div>

          {/* Nội dung chính */}
          <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 text-center">
            {/* Logo trang web chính thức */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-5 py-2.5 text-sm font-medium text-indigo-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Trang web chính thức</span>
            </div>

            {/* tiêu đề chính */}
            <h1 className="mb-8 text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl" itemProp="name">
              vì<span className="text-indigo-500">nhân viên bàn phím</span>
              <br />
              được thiết kế<span className="text-indigo-500">Phần mềm học tiếng anh</span>
            </h1>

            {/* phụ đề */}
            <p className="mx-auto mb-16 max-w-3xl text-xl font-light leading-relaxed text-gray-600 sm:text-2xl" itemProp="description">
              Kết hợp luyện gõ phím với ghi nhớ từ，Giúp việc học tiếng Anh hiệu quả và thú vị
            </p>

            {/* Thẻ chức năng */}
            <div className="mb-16 flex flex-wrap justify-center gap-3" itemProp="featureList">
              {[
                'Rèn luyện trí nhớ từ tiếng Anh',
                'Luyện phát âm bảng chữ cái phiên âm quốc tế',
                'CET Từ Vựng Cấp 4 Và Cấp 6',
                'Từ vựng lập trình viên',
                'Học trực tuyến miễn phí',
                '完全Nguồn mở',
              ].map((item, index) => (
                <span
                  key={index}
                  className="rounded-full border border-gray-200/50 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-white hover:shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* CTAcái nút */}
            <a
              href="https://qwerty.kaiyi.cool/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-gray-900 px-10 py-5 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-2xl"
            >
              <span>Bắt đầu ngay bây giờ</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>

        <section className="mt-24 px-6 md:px-12 lg:mt-32 lg:px-24">
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-2 shadow-2xl">
            <div className="overflow-hidden rounded-2xl bg-white">
              <div
                ref={containerRef}
                style={{
                  display: 'flex',
                  transition: 'transform 0.5s ease',
                }}
              >
                <img
                  src={hotImg}
                  alt={`${
                    import.meta.env.VITE_APP_NAME || 'Type & English'
                  } Phần mềm học tiếng Anh giao diện từ điển phổ biến - CET Luyện trực tuyến từ vựng IELTS và TOEFL Band 4 và Band 6`}
                  className="w-full flex-shrink-0"
                />
                <img
                  src={directoryImg}
                  alt={`${
                    import.meta.env.VITE_APP_NAME || 'Type & English'
                  } Danh mục từ điển phần mềm học tiếng Anh miễn phí - Hỗ trợ việc học tiếng Anh kỹ thuật của lập trình viên`}
                  className="w-full flex-shrink-0"
                />
                <img
                  src={indexImg}
                  alt={`${
                    import.meta.env.VITE_APP_NAME || 'Type & English'
                  } Giao diện chính của phần mềm luyện gõ tiếng Anh - Luyện trí nhớ từ vựng tiếng Anh trực tuyến`}
                  className="w-full flex-shrink-0"
                />
                <img
                  src={hotImg}
                  alt={`${
                    import.meta.env.VITE_APP_NAME || 'Type & English'
                  } Phần mềm học tiếng Anh giao diện từ điển phổ biến - CET Luyện trực tuyến từ vựng IELTS và TOEFL Band 4 và Band 6`}
                  className="w-full flex-shrink-0"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-center space-x-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-500 ${
                    currentSlide === index ? 'w-8 bg-indigo-500' : 'bg-gray-300 hover:bg-indigo-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-24 bg-gray-50/30 px-6 py-24 lg:mt-32 lg:px-24" itemScope itemType="https://schema.org/Product">
          <div className="mx-auto max-w-7xl">
            <meta itemProp="name" content={import.meta.env.VITE_APP_NAME || 'Type & English'} />
            <meta
              itemProp="description"
              content="Phần mềm học tiếng Anh dành cho người làm bàn phím，Kết hợp luyện gõ phím với ghi nhớ từ"
            />
            <meta itemProp="brand" content={import.meta.env.VITE_APP_NAME || 'Type & English'} />

            {/* Offers Schema */}
            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="price" content="0" />
              <meta itemProp="priceCurrency" content="USD" />
              <meta itemProp="availability" content="https://schema.org/InStock" />
              <meta itemProp="url" content="https://qwerty.kaiyi.cool/" />
            </div>

            {/* Aggregate Rating */}
            <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
              <meta itemProp="ratingValue" content="4.8" />
              <meta itemProp="bestRating" content="5" />
              <meta itemProp="worstRating" content="1" />
              <meta itemProp="ratingCount" content="2156" />
              <meta itemProp="reviewCount" content="486" />
            </div>

            {/* Individual Reviews */}
            <div itemProp="review" itemScope itemType="https://schema.org/Review">
              <meta itemProp="author" content="Lý Mâu Mâu - Kỹ sư mặt trước" />
              <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content="5" />
                <meta itemProp="bestRating" content="5" />
              </div>
              <meta itemProp="datePublished" content="2024-11-15" />
              <meta
                itemProp="reviewBody"
                content="với tư cách là một lập trình viên，Công cụ này đã giải quyết hoàn hảo những điểm yếu của tôi。Luyện gõ phím trong khi ghi nhớ từ，Hiệu quả gấp đôi！Đặc biệt là vốn từ vựng của lập trình viên，Hãy để tôi nhanh chóng làm quen với các từ vựng thông dụng trong tài liệu kỹ thuật。键盘音效配合网站kinh nghiệm感拉满，Không thể dừng lại chút nào。"
              />
            </div>

            <div itemProp="review" itemScope itemType="https://schema.org/Review">
              <meta itemProp="author" content="Vương Mâu Mâu - sinh viên đại học" />
              <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content="5" />
                <meta itemProp="bestRating" content="5" />
              </div>
              <meta itemProp="datePublished" content="2024-10-28" />
              <meta
                itemProp="reviewBody"
                content="Kho báu được phát hiện khi chuẩn bị cho kỳ thi CET-6！CET-6Từ vựng rất phong phú，Chế độ đọc chính tả giúp tôi củng cố nhiều từ dễ mắc lỗi。Mình thích nhất là chức năng sổ từ sai，Có thể thực hành lặp đi lặp lại những từ không quen thuộc。Giảm một tháng，Tốc độ gõ và vốn từ vựng đã được cải thiện đáng kể。"
              />
            </div>

            <div itemProp="review" itemScope itemType="https://schema.org/Review">
              <meta itemProp="author" content="Trương Mưu Mâu - phát triển phụ trợ" />
              <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content="5" />
                <meta itemProp="bestRating" content="5" />
              </div>
              <meta itemProp="datePublished" content="2024-09-20" />
              <meta
                itemProp="reviewBody"
                content="GitHubĐã xem trên17.5kHãy đến và thử ngôi sao，Nó thực sự không làm tôi thất vọng！VSCodePhiên bản plug-in rất tiện lợi，Khi bạn cảm thấy mệt mỏi với việc viết mã, hãy chuyển sang và thực hành một vài từ.。JavaScript APIChế độ luyện tập đã giúp tôi rất nhiều，viết ngay bây giờJSKhông còn phải kiểm tra tài liệu mọi lúc。"
              />
            </div>

            <div itemProp="review" itemScope itemType="https://schema.org/Review">
              <meta itemProp="author" content="Lưu Mâu Mâu - người quản lý sản phẩm" />
              <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content="4" />
                <meta itemProp="bestRating" content="5" />
              </div>
              <meta itemProp="datePublished" content="2024-08-12" />
              <meta
                itemProp="reviewBody"
                content="Giao diện đơn giản，Chức năng và thiết thực。Chức năng hiển thị ký hiệu phiên âm và phát âm rất hữu ích，Phát âm đúng khi gõ。Gợi ý duy nhất là bổ sung thêm từ vựng tiếng Anh thương mại，Nhưng tôi thấy cộng đồng này rất tích cực，Tôi tin nó sẽ ngày càng hoàn hảo hơn。"
              />
            </div>

            <div itemProp="review" itemScope itemType="https://schema.org/Review">
              <meta itemProp="author" content="Trần Mâu Mâu - Kỹ sư Full Stack" />
              <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content="5" />
                <meta itemProp="bestRating" content="5" />
              </div>
              <meta itemProp="datePublished" content="2024-07-05" />
              <meta
                itemProp="reviewBody"
                content="Nguồn mởdự áncủa典范！Chất lượng mã rất cao，Tôi cũng đóng góp một ítPR。Khái niệm rèn luyện trí nhớ cơ bắp rất tuyệt vời，Nếu gõ sai phải gõ lại để tránh ghi nhớ sai.。Đọc tài liệu tiếng Anh bây giờ nhanh hơn rất nhiều，Gõ cũng chính xác hơn。Rất khuyến khích cho tất cả người chơi bàn phím！"
              />
            </div>
            <h2 className="mb-6 text-center text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl xl:text-6xl">
              Chức năng cốt lõi，<span className="text-indigo-500">Thiết kế chuyên nghiệp</span>
            </h2>
            <p className="mx-auto mb-16 max-w-3xl text-center text-xl font-light leading-relaxed text-gray-600">
              每một个细节都vì了更好củahiện hữu线Tiếng Anh学习kinh nghiệm而精心打磨，Thích hợp cho lập trình viên、học sinh、Tất cả nhân viên
              bàn phím kể cả nhân viên văn phòng đều có thể nhanh chóng cải thiện tốc độ gõ tiếng Anh và khả năng ghi nhớ từ tiếng Anh
            </p>

            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
              <div>
                {detail.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`my-6 cursor-pointer rounded-2xl border px-8 py-8 transition-all duration-300 ${
                        activeIndex === index
                          ? 'scale-[1.02] transform border-indigo-200 bg-indigo-50/50 shadow-xl'
                          : 'border-gray-200 bg-white/50 hover:scale-[1.01] hover:transform hover:border-gray-300 hover:bg-white hover:shadow-lg'
                      }`}
                      onClick={() => setActiveIndex(index)}
                    >
                      <h3 className="mb-3 text-xl font-semibold text-indigo-500 lg:text-2xl">{item.title}</h3>
                      <p className="text-base font-light leading-relaxed text-gray-600 lg:text-lg">{item.description}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-16 flex h-[14rem] items-center justify-center rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl lg:mt-0 lg:h-auto lg:p-12">
                <img
                  className="w-full object-contain"
                  src={detail[activeIndex].img}
                  alt={`${import.meta.env.VITE_APP_NAME || 'Type & English'} ${
                    detail[activeIndex].title
                  } Hiển thị chức năng - Ảnh chụp màn hình tính năng đặc biệt của phần mềm học tiếng Anh`}
                />
              </div>
            </div>

            {/* Giới thiệu chức năng chi tiết */}
            <div className="mt-16 lg:mt-24">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Hiển thị ký hiệu phiên âm và phát âm */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Chức năng hiển thị ký hiệu phiên âm và phát âm</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    Thuận tiện cho người dùng ghi nhớ từ，Ghi nhớ cùng lúc cách phát âm và ký hiệu ngữ âm。Hỗ trợ phát âm chuẩn Mỹ，Giúp
                    người dùng thiết lập bộ nhớ giọng nói chính xác，Cải thiện kỹ năng nghe và nói。
                  </p>
                </div>

                {/* Chế độ viết im lặng */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Chế độ đọc chính tả thông minh</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    Sau khi người dùng hoàn thành một chương bài tập，Một tùy chọn sẽ bật lên để cho biết có nên viết chương này trong im
                    lặng hay không.，Thuận tiện cho người dùng củng cố các từ đã học trong chương này。Tăng cường trí nhớ thông qua luyện
                    tập chính tả。
                  </p>
                </div>

                {/* thống kê tốc độ */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Thống kê chính xác</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    Định lượng tốc độ đầu vào của người dùng và độ chính xác đầu vào，Hãy để người dùng có sự hiểu biết sâu sắc về việc cải
                    thiện kỹ năng của họ。ủng hộ WPM thống kê、Phân tích độ chính xác và theo dõi tiến độ。
                  </p>
                </div>

                {/* trí nhớ cơ bắp */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Rèn luyện trí nhớ cơ bắp bằng tiếng Anh</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    Dành cho người làm việc bàn phím，Kết hợp việc ghi nhớ từ tiếng Anh với các bài tập ghi nhớ cơ để gõ bàn phím，Củng cố
                    kỹ năng đánh máy trong khi ghi nhớ từ。
                  </p>
                </div>

                {/* sửa lỗi */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">Sửa lỗi thông minh</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    Để tránh tạo ra trí nhớ cơ bị lỗi，nếu như用户từ输入错误则需要重新输入từ，Đảm bảo người dùng duy trì thói quen đánh vần
                    và ghi nhớ chính xác。
                  </p>
                </div>

                {/* Hỗ trợ đa nền tảng */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">nhiều平台无缝kinh nghiệm</h3>
                  <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                    Hỗ trợ phiên bản web và VSCode Phiên bản plugin，Bắt đầu luyện tập mọi lúc, mọi nơi。Nó cũng cung cấp một giải pháp
                    triển khai thuận tiện và nhanh chóng，Đáp ứng nhu cầu của người dùng khác nhau。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Khu vực hiển thị từ vựng */}
        <section className="mt-24 px-6 py-24 lg:mt-32 lg:px-24" itemScope itemType="https://schema.org/EducationalOrganization">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl xl:text-6xl">
                Làm giàu từ điển đồng nghĩa，<span className="text-indigo-500">Mọi thứ</span>
              </h2>
              <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-gray-600">
                Che phủ CET-4/6 CET-4 và CET-6、IELTS TOEFL GRE Kỳ thi tuyển sinh sau đại học tiếng Anh、Tiếng Anh thương mại BEC kỳ thi và
                tùy chỉnh cho các lập trình viên JavaScript/Java/Python từ vựng kỹ thuật，Đáp ứng nhu cầu học tiếng Anh của nhiều đối tượng
                người dùng khác nhau
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Từ vựng thi */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                <div className="mb-6 inline-flex items-center justify-center rounded-full bg-red-100 p-3">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">Từ vựng cần thiết cho kỳ thi</h3>
                <div className="space-y-2 text-xs text-gray-600 sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>CET-4 Tiếng Anh đại học cấp 4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>CET-6 Tiếng Anh đại học CET-6</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>TOEFL Từ Vựng TOEFL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>IELTS Từ Vựng IELTS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>GRE Kỳ thi tuyển sinh sau đại học</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>GMAT kỳ thi tuyển sinh trường kinh doanh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>SAT Bài kiểm tra đánh giá năng lực học tập</span>
                  </div>
                </div>
              </div>

              {/* từ vựng học thuật */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                <div className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">Từ Vựng Học Thuật</h3>
                <div className="space-y-2 text-xs text-gray-600 sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Kỳ thi tuyển sinh sau đại học Từ vựng tiếng Anh cốt lõi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Tiếng Anh chuyên nghiệp cấp độ 4 TEM-4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Tiếng Anh chuyên nghiệp cấp độ 8 TEM-8</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Từ vựng tiếng Anh cần thiết cho kỳ thi tuyển sinh đại học</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Từ Vựng Tiếng Anh Thiết Yếu Cho Kỳ Thi Đầu Vào Trung Học</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Tiếng Anh PEP 3-9 cấp</span>
                  </div>
                </div>
              </div>

              {/* Kinh doanh và Ngôn ngữ */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-8">
                <div className="mb-6 inline-flex items-center justify-center rounded-full bg-green-100 p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">Kinh doanh và đa ngôn ngữ</h3>
                <div className="space-y-2 text-xs text-gray-600 sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Từ vựng cốt lõi tiếng Anh thương mại</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>BEC Kiểm tra tiếng Anh thương mại</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Kho bài nghe IELTS Wang Lu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>những từ thông dụng của người Nhật N1-N5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Khái niệm cơ bản về tiếng Kazakhstan3000từ</span>
                  </div>
                </div>
              </div>

              {/* Dành riêng cho lập trình viên */}
              <div className="col-span-full rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 shadow-lg sm:p-8">
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-4">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">Từ vựng độc quyền của lập trình viên và API</h3>
                  <p className="mx-auto max-w-3xl text-gray-600">
                    Từ vựng kỹ thuật và lập trình phù hợp cho lập trình viên API luyện tập，Nâng cao hiệu quả mã hóa và trình độ tiếng Anh
                    kỹ thuật
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">từ vựng lập trình</div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      Coder Dict
                      <br />
                      Những từ thông dụng được lập trình viên sử dụng
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">JavaScript</div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      JS API
                      <br />
                      bài tập phương pháp cốt lõi
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">Node.js</div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      Node API
                      <br />
                      Phát triển phía máy chủ
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">Java</div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      Java API
                      <br />
                      Phát triển cấp doanh nghiệp
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">Linux</div>
                    <div className="text-xs text-gray-600 sm:text-sm">
                      hướng dẫn dòng lệnh
                      <br />
                      Quản lý hệ thống
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-6 py-2 text-sm font-medium text-indigo-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Tiếp tục cập nhật thêm ngôn ngữ lập trình API
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="mb-8">
                <h4 className="mb-4 text-2xl font-bold text-gray-900">Xây dựng cộng đồng，tiếp tục tăng trưởng</h4>
                <p className="mx-auto max-w-2xl text-gray-600">
                  của chúng tôitừ库由活跃củaNguồn mở社区持续贡献Và维护，nếu như您需要特定củatừ库，Chào mừng tại GitHub đề nghị Issue
                </p>
              </div>
              <a
                href="https://qwerty.kaiyi.cool/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg"
              >
                <span>立即kinh nghiệmLàm giàu từ điển đồng nghĩa</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Khu vực dành riêng cho lập trình viên */}
        <section
          className="mt-24 bg-gradient-to-br from-slate-900 via-gray-900 to-black px-6 py-24 lg:mt-32 lg:px-24"
          itemScope
          itemType="https://schema.org/SoftwareSourceCode"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-indigo-100 px-6 py-3 text-indigo-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="font-semibold">For Coder</span>
              </div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-white lg:text-5xl xl:text-6xl">
                Được thiết kế cho<span className="text-indigo-400">lập trình viên</span>thiết kế riêng
              </h2>
              <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-gray-300">
                Từ điển tích hợp các từ tiếng Anh kỹ thuật thường được các lập trình viên sử dụng，Bao gồm các cấu trúc dữ liệu thuật
                toán、mẫu thiết kế、Điện toán đám mây và các thuật ngữ kỹ thuật khác，Cải thiện tốc độ gõ tiếng Anh。Hỗ trợ cả hai
                JavaScript/Node.js/Java/Python/Linux Lệnh và các ngôn ngữ lập trình khác API luyện tập，Giúp lập trình viên nhanh chóng làm
                quen với các giao diện lập trình thông dụng
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* bên trái：từ vựng kỹ thuật */}
              <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm sm:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-full bg-indigo-600 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">Từ vựng kỹ thuật lập trình</h3>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-gray-300 sm:text-base">
                  Đặc biệt sưu tầm những từ tiếng Anh thông dụng nhất được các lập trình viên sử dụng trong công việc，bao gồm các thuật
                  toán、cấu trúc dữ liệu、mẫu thiết kế、Từ vựng cốt lõi trong công nghệ phần mềm và các lĩnh vực khác
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
                    <span className="text-indigo-400">•</span>
                    <span className="text-gray-200">Từ vựng về thuật toán và cấu trúc dữ liệu</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
                    <span className="text-indigo-400">•</span>
                    <span className="text-gray-200">Kiến trúc phần mềm và các mẫu thiết kế</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
                    <span className="text-indigo-400">•</span>
                    <span className="text-gray-200">Công cụ cộng tác và quản lý dự án</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3">
                    <span className="text-indigo-400">•</span>
                    <span className="text-gray-200">Điện toán đám mây và DevOps thuật ngữ</span>
                  </div>
                </div>
              </div>

              {/* bên phải：API luyện tập */}
              <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm sm:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="rounded-full bg-green-600 p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">API phương pháp thực hành</h3>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-gray-300 sm:text-base">
                  Hỗ trợ nhiều ngôn ngữ lập trình chính thống API luyện tập，Làm quen với các phương pháp thông dụng thông qua luyện gõ
                  phím，Cải thiện hiệu quả mã hóa và API ký ức
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                    <div className="mb-2 font-semibold text-yellow-400">JavaScript</div>
                    <div className="text-sm text-gray-300">Array, Object, Promise Chờ lấy lõi API</div>
                  </div>
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                    <div className="mb-2 font-semibold text-green-400">Node.js</div>
                    <div className="text-sm text-gray-300">fs, http, express Đợi máy chủ API</div>
                  </div>
                  <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                    <div className="mb-2 font-semibold text-orange-400">Java</div>
                    <div className="text-sm text-gray-300">Collection, Stream Cấp doanh nghiệp API</div>
                  </div>
                  <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                    <div className="mb-2 font-semibold text-blue-400">Linux</div>
                    <div className="text-sm text-gray-300">Hướng dẫn dòng lệnh phổ biến và quản lý hệ thống</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hiển thị chức năng nổi bật */}
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-600/20 p-4">
                  <svg className="h-8 w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="mb-3 text-xl font-semibold text-white">Làm quen nhanh API</h4>
                <p className="text-gray-300">Luyện tập lập trình bộ nhớ nhanh bằng cách gõ API，Nâng cao hiệu quả phát triển</p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-600/20 p-4">
                  <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h4 className="mb-3 text-xl font-semibold text-white">Cải thiện tiếng Anh kỹ thuật</h4>
                <p className="text-gray-300">Đào tạo từ vựng chuyên môn và kỹ thuật，Cải thiện kỹ năng đọc tài liệu và giao tiếp</p>
              </div>
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-purple-600/20 p-4">
                  <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="mb-3 text-xl font-semibold text-white">VSCode trình cắm thêm</h4>
                <p className="text-gray-300">ủng hộ VSCode Phiên bản plugin，Thực hành bất cứ lúc nào trong môi trường phát triển</p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="mb-8">
                <h4 className="mb-4 text-2xl font-bold text-white">định hướng cộng đồng，Cập nhật liên tục</h4>
                <p className="mx-auto max-w-2xl text-gray-300">
                  của chúng tôi API Thesaurus chủ yếu dựa vào sự đóng góp của cộng đồng，Thêm ngôn ngữ lập trình API Đang được bổ sung dần
                  dần，Chào mừng bạn đóng góp
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href="https://qwerty.kaiyi.cool/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg"
                >
                  <span>kinh nghiệmDành riêng cho lập trình viên功能</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="https://marketplace.visualstudio.com/items?itemName=Kaiyi.qwerty-learner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-600 bg-gray-800 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-gray-700"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
                  </svg>
                  <span>Cài đặt VSCode trình cắm thêm</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Khu vực thành tựu danh dự */}
        <section
          className="mt-24 bg-gradient-to-br from-gray-50 to-white px-6 py-24 lg:mt-32 lg:px-24"
          itemScope
          itemType="https://schema.org/Organization"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-yellow-100 px-6 py-3 text-yellow-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span className="font-semibold">Thành tựu danh dự</span>
              </div>
              <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl xl:text-6xl">
                nhiều<span className="text-indigo-500">Sự chấp thuận</span>dự án chất lượng
              </h2>
              <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-gray-600">
                lấy GitHub Số 1 trong danh sách xu hướng toàn cầu、V2EX Tìm kiếm phổ biến trên trang web、Gitee GVP 最有价值Nguồn mởdự
                án、Được đề xuất bởi Trang chủ thiểu số và được nhiều nền tảng có thẩm quyền công nhận，trở nên 10 Mười nghìn+ Lựa chọn đầu
                tiên của người dùng về phần mềm học tiếng Anh miễn phí
              </p>
            </div>

            {/* Màn hình vinh danh chính */}
            <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-center shadow-lg sm:p-8">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-orange-100 p-4">
                  <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">GitHub danh sách xu hướng</h3>
                <p className="text-sm text-gray-600 sm:text-base">Số 1 trong danh sách xu hướng toàn cầu</p>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-red-100 p-4">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">V2EX Tìm kiếm nóng</h3>
                <p className="text-sm text-gray-600 sm:text-base">V2EX Các mục tìm kiếm nóng trên toàn bộ trang web</p>
              </div>

              <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-100 p-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">Gitee GVP</h3>
                <p className="text-sm text-gray-600 sm:text-base">最有价值Nguồn mởdự án</p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center shadow-lg">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">Được đề xuất bởi thiểu số</h3>
                <p className="text-sm text-gray-600 sm:text-base">Trang chủ thiểu số Ứng dụng được đề xuất</p>
              </div>
            </div>

            {/* Danh sách vinh danh chi tiết */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
                <h3 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Nguồn mở社区Sự chấp thuận</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-orange-100 p-2">
                      <svg className="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">GitHub Số 1 trong danh sách xu hướng toàn cầu</div>
                      <div className="text-sm text-gray-600">
                        Nhận được sự quan tâm và công nhận cao nhất từ các nhà phát triển trên toàn thế giới
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
                      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Gitee 最有价值Nguồn mởdự án (GVP)</div>
                      <div className="text-sm text-gray-600">国内顶级Nguồn mởdự án认证</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-purple-100 p-2">
                      <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">GitCode G-Star đồ án tốt nghiệp dự kiến</div>
                      <div className="text-sm text-gray-600">Nguồn mở摘星kế hoạch优秀dự án</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
                <h3 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Đề xuất nền tảng truyền thông</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-red-100 p-2">
                      <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">V2EX Các mục tìm kiếm nóng trên toàn bộ trang web</div>
                      <div className="text-sm text-gray-600">Cộng đồng kỹ thuật rất quan tâm và thảo luận</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
                      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Đề xuất trang chủ thiểu số</div>
                      <div className="text-sm text-gray-600">Được công nhận bởi nền tảng đề xuất ứng dụng chất lượng cao</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="flex-shrink-0 rounded-full bg-gray-100 p-2">
                      <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Gitee Các mục được đề xuất trên toàn bộ trang web</div>
                      <div className="text-sm text-gray-600">Nền tảng lưu trữ mã trong nước hàng đầu được đề xuất</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thống kê dữ liệu người dùng */}
            <div className="mt-16 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 text-center sm:p-8">
              <h3 className="mb-6 text-xl font-bold text-gray-900 sm:mb-8 sm:text-2xl">Sự tin tưởng của người dùng，Dữ liệu lên tiếng</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
                <div>
                  <div className="mb-2 text-3xl font-bold text-indigo-600 sm:text-4xl">20000+</div>
                  <div className="text-sm text-gray-600 sm:text-base">GitHub Stars</div>
                  <div className="text-xs text-gray-500 sm:text-sm">Được các nhà phát triển công nhận rộng rãi</div>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-indigo-600 sm:text-4xl">100000+</div>
                  <div className="text-sm text-gray-600 sm:text-base">người dùng hoạt động hàng tháng</div>
                  <div className="text-xs text-gray-500 sm:text-sm">Người học sử dụng liên tục</div>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-indigo-600 sm:text-4xl">100+</div>
                  <div className="text-sm text-gray-600 sm:text-base">cộng tác viên cộng đồng</div>
                  <div className="text-xs text-gray-500 sm:text-sm">Cùng nhau cải thiện các dự án</div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center sm:mt-16">
              <div className="mb-8">
                <h4 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">Tham gia nhóm người dùng của chúng tôi</h4>
                <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
                  Trở thành một trong hàng chục ngàn người dùng，kinh nghiệm这款nhiềuSự chấp thuậncủaTiếng Anh学习工具，Cải thiện kỹ năng
                  đánh máy và trình độ tiếng Anh của bạn
                </p>
              </div>
              <a
                href="https://qwerty.kaiyi.cool/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg"
              >
                <span>Tham gia nhóm người dùng ngay bây giờ</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section className="relative mt-24 w-full overflow-hidden py-24 lg:mt-32 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          <div className="absolute inset-0">
            <div className="absolute -left-4 top-0 h-96 w-96 animate-pulse rounded-full bg-white/5 opacity-50 mix-blend-multiply blur-3xl filter"></div>
            <div
              className="absolute -right-4 top-0 h-96 w-96 animate-pulse rounded-full bg-white/5 opacity-50 mix-blend-multiply blur-3xl filter"
              style={{ animationDelay: '2s' }}
            ></div>
            <div
              className="absolute -bottom-8 left-20 h-96 w-96 animate-pulse rounded-full bg-white/5 opacity-50 mix-blend-multiply blur-3xl filter"
              style={{ animationDelay: '4s' }}
            ></div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
            <h2 className="mb-8 text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl xl:text-7xl">
              Bắt đầu ngay bây giờ<span className="text-indigo-300">kinh nghiệm</span>
            </h2>
            <p className="mb-12 max-w-4xl text-xl font-light leading-relaxed text-white/80 lg:text-2xl">
              Bắt đầu hành trình học tiếng Anh của bạn，Làm cho mỗi bước đánh máy trở thành một tiến trình
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="https://qwerty.kaiyi.cool/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:shadow-3xl group relative overflow-hidden rounded-full bg-white px-12 py-5 text-xl font-semibold text-gray-900 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              >
                <span className="relative z-10">Bắt đầu học →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </a>
              <div className="flex items-center gap-2 text-sm font-light text-white/60 lg:hidden">
                <span>Nên sử dụng trình duyệt trên máy tính để bàn để truy cập</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MobilePage
