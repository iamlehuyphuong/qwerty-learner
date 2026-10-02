import Loading from './components/Loading'
import './index.css'
import { ErrorBook } from './pages/ErrorBook'
import LoginPage from './pages/Login'
import MobilePage from './pages/Mobile'
import RegisterPage from './pages/Register'
import TypingPage from './pages/Typing'
import { useCloudSync } from '@/hooks/useCloudSync'
import { auth } from '@/lib/firebase'
import { authUserAtom, cloudSyncStatusAtom, isOpenDarkModeAtom, isUserLoggedInAtom } from '@/store'
import { Analytics } from '@vercel/analytics/react'
import 'animate.css'
import { onAuthStateChanged } from 'firebase/auth'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import mixpanel from 'mixpanel-browser'
import React, { Suspense, lazy, useEffect, useState } from 'react'
import 'react-app-polyfill/stable'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

const AnalysisPage = lazy(() => import('./pages/Analysis'))
const GalleryPage = lazy(() => import('./pages/Gallery-N'))

if (import.meta.env.MODE === 'production') {
  // for prod
  mixpanel.init('bdc492847e9340eeebd53cc35f321691')
} else {
  // for dev
  mixpanel.init('5474177127e4767124c123b2d7846e2a', { debug: true })
}

function Root() {
  const darkMode = useAtomValue(isOpenDarkModeAtom)
  useEffect(() => {
    darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
  }, [darkMode])

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)
  const [isLoggedIn, setIsLoggedIn] = useAtom(isUserLoggedInAtom)
  const setAuthUser = useSetAtom(authUserAtom)
  const cloudSyncStatus = useAtomValue(cloudSyncStatusAtom)
  useCloudSync()

  // Nơi duy nhất lắng nghe trạng thái đăng nhập, các component khác đọc qua authUserAtom
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null)
      setIsLoggedIn(!!user)
    })
    return () => unsubscribe()
  }, [setAuthUser, setIsLoggedIn])

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 600
      if (!isMobile) {
        window.location.href = '/'
      }
      setIsMobile(isMobile)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <React.StrictMode>
      <BrowserRouter basename={REACT_APP_DEPLOY_ENV === 'pages' ? '/qwerty-learner' : ''}>
        <Suspense fallback={<Loading />}>
          {/* Đã đăng nhập thì chờ tải xong dữ liệu cloud. Không so với 'loading' vì ngay sau khi đăng nhập
              status vẫn là 'idle' của chế độ khách, app sẽ kịp render một nhịp với cấu hình của khách */}
          {isLoggedIn && cloudSyncStatus !== 'ready' ? (
            <Loading />
          ) : (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* Không bắt buộc đăng nhập: khách dùng đầy đủ tính năng, dữ liệu lưu trên máy */}
              {isMobile ? (
                <Route path="*" element={<Navigate to="/mobile" replace />} />
              ) : (
                <>
                  <Route index element={<TypingPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/analysis" element={<AnalysisPage />} />
                  <Route path="/error-book" element={<ErrorBook />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
              <Route path="/mobile" element={<MobilePage />} />
            </Routes>
          )}
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </React.StrictMode>
  )
}

const container = document.getElementById('root')

container && createRoot(container).render(<Root />)
