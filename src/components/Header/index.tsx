import logo from '@/assets/logo.png'
import { Card } from '@/components/ui/card'
import { auth } from '@/lib/firebase'
import { isUserLoggedInAtom } from '@/store'
import { signOut } from 'firebase/auth'
import { useSetAtom } from 'jotai'
import type { PropsWithChildren } from 'react'
import type React from 'react'
import { NavLink } from 'react-router-dom'

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  const setIsLoggedIn = useSetAtom(isUserLoggedInAtom)
  return (
    <header className="container z-20 mx-auto w-full px-10 py-6">
      <div className="flex w-full flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
        <NavLink className="flex items-center text-2xl font-bold text-indigo-500 no-underline hover:no-underline lg:text-4xl" to="/">
          <img src={logo} className="mr-3 h-16 w-16" alt={`${import.meta.env.VITE_APP_NAME || 'Type & English'} Logo`} />
          <h1>{import.meta.env.VITE_APP_NAME || 'Type & English'}</h1>
        </NavLink>
        <Card className="flex w-auto content-center items-center justify-end gap-3 rounded-xl py-4 pl-4 pr-2 transition-colors duration-300">
          {children}
          <button
            className="ml-2 mr-2 flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            onClick={() => {
              signOut(auth)
              setIsLoggedIn(false)
            }}
            title="Đăng xuất"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
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
          </button>
        </Card>
      </div>
    </header>
  )
}

export default Header
