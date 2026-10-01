import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth, db } from '@/lib/firebase'
import { isUserLoggedInAtom } from '@/store'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useAtom } from 'jotai'
import type React from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [isLoggedIn] = useAtom(isUserLoggedInAtom)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  if (isLoggedIn && !isRegistering) {
    return <Navigate to="/" replace />
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsRegistering(true)
    try {
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp')
        setIsRegistering(false)
        return
      }
      if (name && email && password) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCredential.user, { displayName: name })

        // Generate a unique code (Timestamp since Jan 1 2026 in Base36 + 1 random char)
        const epoch2026 = new Date('2026-01-01T00:00:00Z').getTime()
        const secondsPassed = Math.floor((Date.now() - epoch2026) / 1000)
        const timeString = secondsPassed.toString(36).toUpperCase()
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const randomChar = chars.charAt(Math.floor(Math.random() * chars.length))
        const userCode = timeString + randomChar

        // Create user document
        await setDoc(
          doc(db, 'users', userCredential.user.uid),
          {
            uid: userCredential.user.uid,
            code: userCode,
            email: email,
            name: name,
            isDonated: false,
            totalDonate: 0,
            totalTimeSpentMs: 0,
            totalChapters: 0,
            totalWords: 0,
            averageWpm: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          // merge: cloud sync có thể đã ghi settings/progress ngay khi tài khoản được tạo
          { merge: true },
        )

        navigate('/')
      }
    } catch (err: any) {
      console.error('Lỗi khi tạo user doc:', err)
      if (err.code === 'auth/email-already-in-use') {
        setError('Email này đã được đăng ký')
      } else if (err.code === 'auth/weak-password') {
        setError('Mật khẩu quá yếu, vui lòng chọn mật khẩu từ 6 ký tự trở lên')
      } else {
        setError(err.message || 'Lỗi đăng ký')
      }
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <div className="flex min-h-[600px] w-full max-w-[1200px] overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800">
        {/* Left Side: 40% - Register Form */}
        <div className="flex w-full flex-col justify-center p-10 lg:w-[40%]">
          <div className="mb-10 flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-10 rounded-xl shadow-sm" />
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {import.meta.env.VITE_APP_NAME || 'Type & English'}
            </span>
          </div>

          <h1 className="mb-2 text-3xl font-extrabold text-slate-900 dark:text-white">Đăng ký</h1>
          <p className="mb-6 text-slate-500 dark:text-slate-400">Tạo tài khoản mới để bắt đầu quá trình luyện tập của bạn.</p>

          {error && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-500 dark:border-red-800 dark:bg-red-900/20">
              {error}
            </p>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ tên</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
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
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <Button
              type="submit"
              className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-lg font-bold text-white shadow-lg transition-transform hover:from-indigo-600 hover:to-purple-700 active:scale-95"
            >
              Đăng ký
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-indigo-600 transition-colors hover:text-indigo-500">
              Đăng nhập ngay
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

export default RegisterPage
