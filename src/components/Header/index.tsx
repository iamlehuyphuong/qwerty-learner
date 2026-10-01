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
import { auth } from '@/lib/firebase'
import { isUserLoggedInAtom } from '@/store'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useSetAtom } from 'jotai'
import type { PropsWithChildren, ReactNode } from 'react'
import type React from 'react'
import { useEffect, useState } from 'react'

interface HeaderProps extends PropsWithChildren {
  leftNode?: ReactNode
}

const Header: React.FC<HeaderProps> = ({ children, leftNode }) => {
  const setIsLoggedIn = useSetAtom(isUserLoggedInAtom)
  const [user, setUser] = useState<User | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsubscribe()
  }, [])

  const handleLogout = () => {
    signOut(auth)
    setIsLoggedIn(false)
  }

  return (
    <header className="container z-20 mx-auto flex w-full items-center gap-4 px-10 py-3">
      {leftNode}
      <Card className="flex flex-1 flex-col items-center justify-between space-y-3 rounded-xl px-4 py-2 transition-colors duration-300 lg:flex-row lg:space-y-0">
        {/* User Info (Left) */}
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

        {/* Tools (Right) */}
        <div className="flex w-auto content-center items-center justify-end gap-3">{children}</div>
      </Card>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:text-white dark:hover:bg-red-800"
            >
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  )
}

export default Header
