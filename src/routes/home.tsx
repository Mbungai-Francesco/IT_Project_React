import { useAdminContext } from '@/hooks/useAdminContext'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const { theme, setRoute } = useAdminContext()
  
  useEffect(() =>{
    setRoute('/home')
  },[])

  return (
    <div className={cn(`${theme} w-full h-full`)}>
      <div className={cn(
          `h-full overflow-auto bg-slate-100 dark:bg-black text-black dark:text-white  flex flex-col justify-center items-center`,
        )}>Hello "/home"!</div>
    </div>
  )
}
