import logo from '@/assets/logo.svg'
import { Card } from '@/components/ui/card'
import type { PropsWithChildren } from 'react'
import type React from 'react'
import { NavLink } from 'react-router-dom'

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <header className="container z-20 mx-auto w-full px-10 py-6">
      <div className="flex w-full flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
        <NavLink className="flex items-center text-2xl font-bold text-indigo-500 no-underline hover:no-underline lg:text-4xl" to="/">
          <img src={logo} className="mr-3 h-16 w-16" alt={`${import.meta.env.VITE_APP_NAME || 'Type & English'} Logo`} />
          <h1>{import.meta.env.VITE_APP_NAME || 'Type & English'}</h1>
        </NavLink>
        <Card className="flex w-auto content-center items-center justify-end gap-3 rounded-xl px-5 py-3 transition-colors duration-300">
          {children}
        </Card>
      </div>
    </header>
  )
}

export default Header
