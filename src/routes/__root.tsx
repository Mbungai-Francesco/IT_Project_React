import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'

// import ClerkProvider from '../integrations/clerk/provider'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'
import type { QueryClient } from '@tanstack/react-query'
import { useAdminContext } from '@/hooks/useAdminContext'

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

        <Outlet />
        <TanStackRouterDevtools />
        <TanstackQueryLayout />
        {/* </ClerkProvider> */}
      </>
    )
  },
})
