import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth } from '@/lib/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import type React from 'react'
import { useState } from 'react'

export default function ForgotPasswordDialog({ defaultEmail }: { defaultEmail: string }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  const onOpenChange = (value: boolean) => {
    setOpen(value)
    if (value) {
      setEmail(defaultEmail)
      setStatus('idle')
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('sending')
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setStatus('sent')
    } catch (err: any) {
      setStatus('idle')
      if (err.code === 'auth/invalid-email' || err.code === 'auth/missing-email') {
        setError('Email không hợp lệ')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau')
      } else if (err.code === 'auth/network-request-failed') {
        setError('Không có kết nối mạng, vui lòng thử lại')
      } else {
        setError(err.message || 'Không gửi được email')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Quên mật khẩu?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          <DialogDescription>Nhập email đã đăng ký, chúng tôi sẽ gửi đường dẫn để bạn đặt mật khẩu mới.</DialogDescription>
        </DialogHeader>

        {status === 'sent' ? (
          <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
            Nếu email <b>{email.trim()}</b> đã được đăng ký, bạn sẽ nhận được thư đặt lại mật khẩu trong vài phút. Hãy kiểm tra cả thư mục
            Spam.
          </p>
        ) : (
          <form id="forgot-password-form" onSubmit={handleSubmit} className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          </form>
        )}

        <DialogFooter>
          {status === 'sent' ? (
            <Button type="button" onClick={() => setOpen(false)}>
              Đóng
            </Button>
          ) : (
            <Button type="submit" form="forgot-password-form" disabled={status === 'sending'}>
              {status === 'sending' ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
