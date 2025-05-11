import { getAdmin } from '@/lib/localStore'
import type { Admin } from '@/types'
import { createContext, useEffect, useState, type ReactNode } from 'react'

interface AdminContextProps {
  admin: Admin
  setAdmin: React.Dispatch<React.SetStateAction<Admin>>
  theme: string | null
  setTheme: React.Dispatch<React.SetStateAction<string | null>>
}

export const AdminContext = createContext<AdminContextProps | undefined>(
  undefined,
)

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const isBrowser = typeof window !== 'undefined'
  const storedTheme = isBrowser ? localStorage.getItem('theme') : null

  const [admin, setAdmin] = useState(getAdmin())
  const [theme, setTheme] = useState<string | null>(storedTheme)

  useEffect(() => {
    console.log(theme)
    if (theme == null) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        setTheme('light')
        localStorage.setItem('theme', 'light')
      }
      console.log(localStorage.getItem('theme'))
    }
  })

  return (
    <AdminContext.Provider value={{ admin, setAdmin, theme, setTheme }}>
      {children}
    </AdminContext.Provider>
  )
}
