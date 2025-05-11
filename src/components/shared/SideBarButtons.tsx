import { useAdminContext } from '@/hooks/useAdminContext'
import { Link } from '@tanstack/react-router'

interface props {
  label: string
  link?: string
}

const SideBarButtons = ({ label, link }: props) => {
  const { theme } = useAdminContext()

  return (
    <Link className={`${theme}`} to={link}>
      <button className="w-full text-left px-2 py-2 hover:bg-blue-100 rounded-md hover:text-blue-500 font-medium cursor-pointer dark:text-white dark:hover:text-black">
        {label}
      </button>
    </Link>
  )
}

export default SideBarButtons
