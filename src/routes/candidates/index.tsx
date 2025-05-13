import { getRegistrations } from '@/api/registrationApi'
import { useAdminContext } from '@/hooks/useAdminContext'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
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

  const { isFetched, data: res } = useQuery({
    queryKey: ['registrations'],
    queryFn: () => getRegistrations(),
  })

  return (
    <div className={cn(`${theme} w-full h-full`)}>
      <div
        className={cn(
          `h-full overflow-auto bg-slate-100 dark:bg-black text-black dark:text-white p-2`,
        )}
      >
        <div className="p-6 bg-white rounded-lg shadow-md w-full dark:bg-black dark:border dark:border-gray-700">
          <h1 className="text-lg font-semibold mb-4">
            Registrations in system
          </h1>

          {isFetched ? (
            <table className="min-w-full border-collapse table-auto text-sm ">
              <thead>
                <tr className="bg-gray-100 dark:bg-black">
                  <th className="p-2 border-b text-left">#</th>
                  <th className="p-2 border-b text-left">Image</th>
                  <th className="p-2 border-b text-left">Name</th>
                  <th className="p-2 border-b text-left">Email</th>
                  <th className="p-2 border-b text-left">Specialty</th>
                  <th className="p-2 border-b text-left">Status</th>
                  <th className="p-2 border-b text-left">Level</th>
                  <th className="p-2 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {res?.map(
                  (val, idx) =>
                    val.status != 'ACCEPTED' && (
                      <tr className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                        <td className="p-2 border-b">{idx + 1}</td>
                        <td className="p-2 border-b">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <img
                              src={val.image}
                              alt="student"
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-2 border-b">{val.firstName}</td>
                        <td className="p-2 border-b">{val.email}</td>
                        <td className="p-2 border-b">{val.specialty}</td>
                        <td className="p-2 border-b">
                          <span
                            className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              val.status == 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900'
                              : val.status == 'ACCEPTED' ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800 dark:bg-red-200',
                            )}
                          >
                            {val.status}
                          </span>
                        </td>
                        <td className="p-2 border-b">3</td>
                        {val.status == 'PENDING' ? (
                          <td className="p-2 border-b space-x-2">
                            <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                              Accept
                            </button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                              Deny
                            </button>
                          </td>
                        ) : (
                          <></>
                        )}
                      </tr>
                    ),
                )}
              </tbody>
            </table>
          ) : (
            <p>Loading</p>
          )}
        </div>
      </div>
    </div>
  )
}
