import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card } from '@/components/ui/card'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/dropdown'
import { logoutAndClearLocalData } from '@/lib/account'
import { countPendingWordRecords } from '@/lib/syncWordRecords'
import { authUserAtom, isUserLoggedInAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { HatGlasses, LogIn, UserPlus } from 'lucide-react'
import type { PropsWithChildren, ReactNode } from 'react'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps extends PropsWithChildren {
  leftNode?: ReactNode
}

const Header: React.FC<HeaderProps> = ({ children, leftNode }) => {
  const user = useAtomValue(authUserAtom)
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const isLoggedInHint = useAtomValue(isUserLoggedInAtom)
  // undefined: Firebase đang khôi phục phiên, dựa vào trạng thái lần trước để tránh nháy giao diện
  const isGuest = user === undefined ? !isLoggedInHint : user === null

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (showLogoutConfirm) countPendingWordRecords().then(setPendingCount)
  }, [showLogoutConfirm])

  const handleLogout = async (e: React.MouseEvent) => {
    // Giữ hộp thoại mở trong lúc đồng bộ nốt dữ liệu
    e.preventDefault()
    setIsLoggingOut(true)
    try {
      // Đăng xuất xong vẫn ở lại app với chế độ khách, trạng thái được cập nhật qua onAuthStateChanged ở Root
      await logoutAndClearLocalData()
    } finally {
      setIsLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  return (
    <header className="container z-20 mx-auto flex w-full items-center gap-4 px-10 py-3">
      {leftNode}
      <Card className="flex flex-1 flex-col items-center justify-between space-y-3 rounded-xl px-4 py-2 transition-colors duration-300 lg:flex-row lg:space-y-0">
        {/* User Info (Left) */}
        {isGuest ? (
          <Dropdown>
            <DropdownTrigger className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-400 text-lg font-bold text-white shadow-md dark:bg-slate-600">
                <HatGlasses className="h-6 w-6" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Khách</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Đăng nhập để lưu tiến độ trên mọi thiết bị</span>
              </div>
            </DropdownTrigger>
            <DropdownMenu align="left" className="mt-4 w-64 p-2">
              <p className="px-2 pb-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                Bạn đang dùng chế độ khách, lịch sử học chỉ lưu trên trình duyệt này.
              </p>
              <DropdownItem onClick={() => navigate('/login')} className="flex items-center gap-2 font-medium">
                <LogIn className="h-4 w-4" />
                <span>Đăng nhập</span>
              </DropdownItem>
              <DropdownItem onClick={() => navigate('/register')} className="flex items-center gap-2 font-medium">
                <UserPlus className="h-4 w-4" />
                <span>Đăng ký tài khoản</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Dropdown>
            <DropdownTrigger className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold text-white shadow-md">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.displayName || 'Học viên'}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'Đang tải...'}</span>
              </div>
            </DropdownTrigger>
            <DropdownMenu align="left" className="mt-4 w-48 p-2">
              <DropdownItem
                onClick={(e) => {
                  e.preventDefault()
                  setShowLogoutConfirm(true)
                }}
                className="flex items-center gap-2 font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300 dark:focus:bg-red-900/30 dark:focus:text-red-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Đăng xuất</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}

        {/* Tools (Right) */}
        <div className="flex w-auto content-center items-center justify-end gap-3">{children}</div>
      </Card>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Lịch sử học của tài khoản sẽ được xoá khỏi trình duyệt này (vẫn còn trên cloud, đăng nhập lại sẽ có). Sau khi đăng xuất bạn
              vẫn có thể tiếp tục luyện tập ở chế độ khách.
            </AlertDialogDescription>
            {pendingCount > 0 && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                Còn {pendingCount} lượt gõ chưa được đồng bộ lên cloud. Hệ thống sẽ thử đồng bộ trước khi đăng xuất, nếu không được (mất
                mạng) chúng sẽ được giữ lại trên máy này.
              </p>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:text-white dark:hover:bg-red-800"
            >
              {isLoggingOut ? 'Đang đồng bộ...' : 'Đăng xuất'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}

export default Header
