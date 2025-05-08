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
          `bg-white dark:bg-black h-screen w-full flex flex-col justify-center items-center`,
        )}>Hello "/home"!</main>
    </div>
  )
}
