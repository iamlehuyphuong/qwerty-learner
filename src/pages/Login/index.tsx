import ForgotPasswordDialog from './components/ForgotPasswordDialog'
import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth } from '@/lib/firebase'
import { isUserLoggedInAtom } from '@/store'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAtom } from 'jotai'
import type React from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [isLoggedIn] = useAtom(isUserLoggedInAtom)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (email && password) {
        await signInWithEmailAndPassword(auth, email, password)
        // Redirection is handled by the onAuthStateChanged in index.tsx
        // but we can also navigate directly
        navigate('/')
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email hoặc mật khẩu không chính xác')
      } else {
        setError(err.message || 'Lỗi đăng nhập')
      }
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <div className="flex min-h-[600px] w-full max-w-[1200px] overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800">
        {/* Left Side: 40% - Login Form */}
        <div className="flex w-full flex-col justify-center p-10 lg:w-[40%]">
          <div className="mb-10 flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-xl shadow-sm" />
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {import.meta.env.VITE_APP_NAME || 'Type & English'}
            </span>
          </div>

          <h1 className="mb-2 text-3xl font-extrabold text-slate-900 dark:text-white">Đăng nhập</h1>
          <p className="mb-6 text-slate-500 dark:text-slate-400">Chào mừng bạn quay trở lại! Vui lòng nhập thông tin đăng nhập.</p>

          {error && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-500 dark:border-red-800 dark:bg-red-900/20">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <ForgotPasswordDialog defaultEmail={email} />
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg transition-transform hover:from-indigo-600 hover:to-purple-700 active:scale-95"
            >
              Đăng nhập
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase text-slate-400">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            hoặc
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-xl border-slate-200 text-base font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            <Link to="/">Dùng ngay, không cần đăng nhập</Link>
          </Button>
          <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            Lịch sử học sẽ chỉ lưu trên trình duyệt này. Bạn có thể đăng nhập bất cứ lúc nào để đồng bộ.
          </p>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-indigo-600 transition-colors hover:text-indigo-500">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Right Side: 60% - Landing Page Section */}
        <div className="relative hidden w-[60%] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 p-12 lg:flex">
          {/* Decorative Background Elements */}
          <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-purple-400/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-8 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <img src={logo} alt="Hero Logo" className="h-32 w-32 object-contain" />
            </div>

            <h2 className="mb-6 whitespace-nowrap text-2xl font-black leading-tight text-white drop-shadow-md xl:text-[2rem]">
              2in1: Thạo Gõ Phím - Giỏi Tiếng Anh
            </h2>

            <p className="mb-10 max-w-lg text-lg leading-relaxed text-indigo-100 drop-shadow">
              Nâng cao trình độ tiếng Anh của bạn trong khi luyện tập đánh máy tốc độ cao. Sự kết hợp hoàn hảo giữa gõ phím 10 ngón và phát
              âm chuẩn quốc tế.
            </p>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <span>🚀 Tăng tốc gõ phím</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <span>🧠 Ghi nhớ từ vựng</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <span>🎧 Luyện phát âm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
