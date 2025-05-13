import { useAdminContext } from '@/hooks/useAdminContext'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/candidates/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { theme, setRoute } = useAdminContext()

  useEffect(() => {
    setRoute('/candidates')
  }, [])

  return (
    <div className={cn(`${theme} w-full h-full`)}>
      <div
        className={cn(
          `h-full overflow-auto bg-slate-100 dark:bg-black text-black dark:text-white p-2`,
        )}
      >
        <p>Hello "/candidates/"!</p>
      </div>
    </div>
  )
}
