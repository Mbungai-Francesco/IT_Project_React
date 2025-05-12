import { getRegistration, getRegistrations } from '@/api/registrationApi'
import { getStudents } from '@/api/studentApi'
import { useAdminContext } from '@/hooks/useAdminContext'
import { cn } from '@/lib/utils'
import type { Student } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const { theme, setRoute } = useAdminContext()
  const [ studs, setStuds ] = useState<Student[]>([])

  useEffect(() => {
    setRoute('/home')
  }, [])
  
  const { data } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudents()
  })

  const { data : res } = useQuery({
    queryKey: ['registrations'],
    queryFn: () => getRegistrations()
  })
  
  useEffect(() => {
    if(data && res){
      data.forEach(val => {
        res.forEach(resVal =>{
          if(resVal.id == val.registrationId) val.registration = resVal
        })
      });
      setStuds(data)
      
    }
  }, [res,data])

  return (
    <div className={cn(`${theme} w-full h-full`)}>
      <div
        className={cn(
          `h-full overflow-auto bg-slate-100 dark:bg-black text-black dark:text-white p-2`,
        )}
      >
        <div className="p-6 bg-white rounded-lg shadow-md w-full dark:bg-black dark:border dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Students in system</h2>
          {data ? (
            <table className="min-w-full border-collapse table-auto text-sm ">
              <thead>
                <tr className="bg-gray-100 dark:bg-black">
                  <th className="border-b p-2 text-left">#</th>
                  <th className="border-b p-2 text-left">Image</th>
                  <th className="border-b p-2 text-left">Name</th>
                  <th className="border-b p-2 text-left">Email</th>
                  <th className="border-b p-2 text-left">Specialty</th>
                  <th className="border-b p-2 text-left">Level</th>
                </tr>
              </thead>
              <tbody>
                {studs.map((student, idx) => (
                    <tr key={student.matricule} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="border-b p-2">{idx + 1}</td>
                    <td className="border-b p-2">
                      
                      <img
                      src={student.registration?.image}
                      alt="student"
                      className="h-10 w-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="border-b p-2">
                      {student.registration?.firstName}
                    </td>
                    <td className="border-b p-2">{student.email}</td>
                    <td className="border-b p-2">
                      {student.registration?.specialty}
                    </td>
                    <td className="border-b p-2">
                      {student.registration?.level}
                    </td>
                  </tr>
                ))}
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
