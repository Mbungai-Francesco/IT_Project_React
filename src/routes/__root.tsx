import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/shared/Header'

// import ClerkProvider from '../integrations/clerk/provider'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'
import type { QueryClient } from '@tanstack/react-query'
import { useAdminContext } from '@/hooks/useAdminContext'
import SideBar from '@/components/shared/SideBar'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const { admin } = useAdminContext()

    return (
      <>
        <div className='h-screen flex flex-col'>
          {admin.id ? <Header /> : <></>}

          <div className="flex grow">
            {admin.id ? <SideBar /> : <></>}
            <div className="flex-auto">
              <Outlet />
            </div>
          </div>
        </div>
        <TanStackRouterDevtools position='top-left' />
        <TanstackQueryLayout />
      </>
    )
  },
})
