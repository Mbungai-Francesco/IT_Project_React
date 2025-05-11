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
        {/* <ClerkProvider> */}
        {/* {admin.id ? <Header /> : <></>} */}
        <Header />

        <div className="flex">
          <SideBar />
          <div className='grow'>
            <Outlet />
          </div>
        </div>
        <TanStackRouterDevtools />
        <TanstackQueryLayout />
        {/* </ClerkProvider> */}
      </>
    )
  },
})
