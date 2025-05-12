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
  })
  useEffect(() => {
    if (data) {
      getRegistration(data.registrationId).then((res) => {
        setRegistration(res)
        if (res.roomId) {
          getRoom(res.roomId).then((res) => setRoom(res))
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
  }, [isLoading])

  return (
    <div className={cn(`${theme} w-full h-full`)}>
      <div
        className={cn(
          `h-full overflow-auto bg-slate-100 dark:bg-black text-black dark:text-white p-2`,
        )}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {data?.email} {semester}
          </div>
        )}
      </div>
    </div>
  )
}
