import { getAdmin } from '@/lib/localStore'
import type { Admin } from '@/types'
import { createContext, useEffect, useState, type ReactNode } from 'react'

interface AdminContextProps {
  admin: Admin
  setAdmin: React.Dispatch<React.SetStateAction<Admin>>
  theme: string | null;
  setTheme: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AdminContext = createContext<AdminContextProps | undefined>(
  undefined,
)



export const AdminProvider = ({ children }: { children :ReactNode}) => {
  const isBrowser = typeof window !== "undefined";
  const storedTheme = isBrowser ? localStorage.getItem("theme") : null;

  const [admin, setAdmin] = useState(getAdmin())
  const [theme, setTheme] = useState<string | null>(storedTheme);

  useEffect(()=>{
    if(!theme){
      if(window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark")
      else setTheme("light")
    }
  })

  return (
    <AdminContext.Provider value={{ admin, setAdmin, theme, setTheme }}>
      {children}
    </AdminContext.Provider>
  )
}
