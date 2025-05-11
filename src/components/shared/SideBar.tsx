import { cn } from '@/lib/utils'
import SideBarButtons from './SideBarButtons'
import { useAdminContext } from '@/hooks/useAdminContext'

const SideBar = () => {
  const { theme } = useAdminContext()
  return (
    <div className={cn(`${theme} w-[17%]`)}>
      <div
        className={cn(
          `h-screen p-2 border-r-2 bg-white dark:bg-black border-gray-200 dark:border-gray-700 `,
        )}
      >
        <div className="gap-2 flex flex-col">
          <SideBarButtons label='Students' link='home'/>
          <SideBarButtons label='Candidates' link='candidates'/>
          <SideBarButtons label='Subjects' link='Subjects'/>
          <SideBarButtons label='Rooms' link='rooms'/>
        </div>
      </div>
    </div>
  )
}

export default SideBar
