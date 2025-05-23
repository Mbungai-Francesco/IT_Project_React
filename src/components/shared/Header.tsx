import { Link } from '@tanstack/react-router'

// import ClerkHeader from '../integrations/clerk/header-user'
import { useAdminContext } from '@/hooks/useAdminContext'
import ThemeSwitch from './ThemeSwitcher'
import { cn } from '@/lib/utils'

export default function Header() {
  const { admin, theme } = useAdminContext()

  return (
    <div className={cn(`${theme}`)}>
      <header className=" px-2 py-4 flex gap-2 bg-white dark:bg-black text-black dark:text-white justify-between border-b-2 border-gray-200 dark:border-gray-700">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/home">FYV Student Managment</Link>
        </div>
      </nav>

      <div className='flex gap-2 items-center'>
        {/* <ClerkHeader /> */}
        <ThemeSwitch />
        <p className='font-medium'>{admin.name || 'Default'}</p>
      </div>
    </header>
    </div>
  )
}
