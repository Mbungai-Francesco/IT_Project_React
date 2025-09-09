import { getGradesByStudMat } from '@/api/gradeApi'
import { getRegistration } from '@/api/registrationApi'
import { getRoom } from '@/api/roomApi'
import { getStudent } from '@/api/studentApi'
import { getSubjectsBySemester } from '@/api/subjectApi'
import { useAdminContext } from '@/hooks/useAdminContext'
import { cn } from '@/lib/utils'
import type { Grade, Registration, Room, Student, Subject } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/home/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setRoute, theme } = useAdminContext()
  const semester =
    new Date().getMonth() > 0 && new Date().getMonth() < 8 ? 2 : 1
  const { id } = Route.useParams()
  const [registration, setRegistration] = useState<Registration>()
  const [room, setRoom] = useState<Room>()
  const [location, setLocation] = useState('')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [grades, setGrades] = useState<Grade[]>([])

  useEffect(() => {
    setRoute('/home')
  }, [])
  const { isLoading, data } = useQuery({
    queryKey: ['stud'],
    queryFn: () => getStudent(id),
    staleTime: Infinity,
    refetchOnMount: 'always',
  })
  useEffect(() => {
    if (data) {
      getRegistration(data.registrationId).then((res) => {
        setRegistration(res)
        // console.log(res)

        if (Number(res.room_id)) {
          getRoom(Number(res.room_id)).then((res) => setRoom(res))
        } else if (res.paidBus) {
          switch (res.paidBus) {
            case 150000:
              setLocation('MECC')
              break
            case 200000:
              setLocation('Poste Central')
              break
            case 250000:
              setLocation('Vogt')
              break
          }
        }
      })
      getSubjectsBySemester(semester).then((res) => {
        setSubjects(res)

        getGradesByStudMat(data.matricule).then((res) => {
          setGrades(res)
          for (const grad of grades) {
            for (const sub of subjects) {
              if (grad.subject.id === sub.id) {
                sub.graded = true
              }
            }
          }
        })
      })
    }
  }, [data])

  return (
    <div className={cn(`${theme} w-full h-full`)}>
      <div className="w-full p-6 flex justify-between h-full bg-slate-100/50 gap-2">
        {/* Header Section */}
        <div className="mb-8 w-1/2 bg-white h-fit shadow-md p-4 rounded-sm border border-gray-300">
          <img
            src={registration?.image}
            alt="student"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1 className="font-semibold text-gray-800 my-4">
            {registration?.firstName.toUpperCase()}
          </h1>
          <div className="space-y-1 text-gray-600">
            <p>
              <span className="font-semibold">Surname:</span>{' '}
              {registration?.lastName}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{' '}
              {registration?.email}
            </p>
            <p>
              <span className="font-semibold">Specialty:</span>{' '}
              {registration?.specialty}
            </p>
            <p>
              <span className="font-semibold">Level:</span>{' '}
              {registration?.level}
            </p>
            <p>
              <span className="font-semibold">Date of Birth:</span>{' '}
              {registration?.dateOfBirth.toString()}
            </p>
            <p>
              <span className="font-semibold">CNI:</span> {registration?.cni}
            </p>
            <p>
              <span className="font-semibold">Birth Certificate:</span>
              <a href={registration?.birthCertificate} target="_blank">
                {' '}
                Open
              </a>
            </p>
            {registration?.paidBus ? (
              <p>
                <span className="font-semibold">Paid Bus:</span> {location}
              </p>
            ) : (
              <p>
                <span className="font-semibold">Paid Room:</span> {room?.number}
              </p>
            )}
          </div>
        </div>

        <div className="w-1/2 bg-white h-fit shadow-md py-2 px-4 rounded-sm border border-gray-300">
          {/* Subjects Section */}
          <div className="mb-8">
            <h2 className="font-semibold text-gray-800 my-4">Subjects</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead> */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.map((sub) => (
                    <tr
                      className="flex justify-between items-center px-2"
                      key={sub.id}
                    >
                      <td className="whitespace-nowrap text-sm font-medium text-gray-900">
                        {sub.name}
                      </td>
                      <td className="flex justify-between items-center gap-10 py-2">
                        <td className="whitespace-nowrap text-sm text-gray-500">
                          {sub.coef}
                        </td>
                        <td className="whitespace-nowrap text-sm text-gray-500">
                          <div className="bg-green-700 hover:bg-green-800 py-2 px-3 rounded-sm text-white cursor-pointer">
                            <p>Grade</p>
                          </div>
                        </td>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grades Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Grades</h2>
            <div className="p-4 rounded-lg">
              <p className="text-gray-500 italic">No grades available yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
