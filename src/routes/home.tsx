import { useAdminContext } from '@/hooks/useAdminContext'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const { theme } = useAdminContext()

  return (
    <div className={cn(`${theme}`)}>
      <main className={cn(
          `bg-slate-100 dark:bg-black text-black dark:text-white h-screen w-full flex flex-col justify-center items-center`,
        )}>Hello "/home"!</main>
    </div>
  )
}
