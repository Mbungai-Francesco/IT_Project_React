import { useAdminContext } from '@/hooks/useAdminContext'
import { cn } from '@/lib/utils'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { motion } from 'motion/react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { Room } from '@/types'
import { getRooms } from '@/api/roomApi'

export const Route = createFileRoute('/registration')({
  component: RouteComponent,
})

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email({
      message: 'Please enter a valid email address.',
    }),
  specialty: z.string().min(1, {
    message: 'Specialty is required.',
  }),
  level: z.number().min(1, {
    message: 'Level must be at least 1.',
  }),
  dateOfBirth: z.coerce
    .date()
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 12)), {
      message: 'You must be at least 12 years old.',
    }),
  image: z.instanceof(File).optional(),
  cni: z.string().min(10, {
    message: 'CNI must be at least 10 characters.',
  }),
  birthCertificate: z
    .instanceof(File, {
      message: 'Please upload birth certificate',
    })
    .optional(),
  roomOrBus: z.string().optional(),
  roomType: z.number(),
  paidRoom: z.number(),
  paidBus: z.number(),
  roomId: z.number(),
  status: z.string(),
})

const emptyRoom: Room = {
  id: 0,
  studentId: 0,
  occupied: false,
  number: 0,
  price: 0,
}

function RouteComponent() {
  const [image, setImage] = useState<File | undefined>(undefined)
  const [birthCertificate, setBirthCertificate] = useState<File | undefined>(
    undefined,
  )
  const [roomType, setRoomType] = useState(0)
  const [room, setRoom] = useState<Room>(emptyRoom)
  const [roomOrBus, setRoomOrBus] = useState('')

  const navigate = useNavigate()
  const { theme } = useAdminContext()
  const {
    isLoading,
    data: rooms,
    isFetched,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
    staleTime: 30000, // 30 seconds
  })

  const roomById = (id: number) => {
    if (rooms) return rooms.find((val) => val.id == id) || emptyRoom
    else return emptyRoom
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: image,
      birthCertificate: birthCertificate,
      roomType: 0,
      paidRoom: 0,
      roomOrBus: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const { isPending, mutate } = useMutation({
    mutationFn: form.handleSubmit(onSubmit),
    onSuccess: () => {
      console.log('Login successful')
      // navigate({ to: '/home' })
    },
  })


  return (
    <div className={cn(`${theme}`)}>
      <title>Registration</title>
      <main
        className={cn(
          `bg-white dark:bg-black h-fit min-h-screen w-full flex flex-col justify-center items-center`,
        )}
      >
        <Form {...form}>
          <form className="space-y-8 dark:bg-black sm:border-2 sm:border-white rounded-md sm:w-3/5  p-4 text-black dark:text-white" onSubmit={mutate}>
            <h1 className={cn(`font-bold text-2xl py-4`)}>Registration form</h1>
            <div className="grid sm:grid-cols-2 gap-4 ">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-full">
                          <SelectItem value="Tronc commun">
                            Tronc commun
                          </SelectItem>
                          <SelectItem value="ISI">ISI</SelectItem>
                          <SelectItem value="SRT">SRT</SelectItem>
                          <SelectItem value="Genie Civil">
                            Genie Civil
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <select className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" {...field}>
                        <option value="" disabled selected>Select language</option>
                        <option value="english">English</option>
                        <option value="french">French</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split('T')[0]
                            : ''
                        }
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNI Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your CNI number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          setImage(file)
                          field.onChange(file)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthCertificate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Certificate</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          setBirthCertificate(file)
                          field.onChange(file)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomOrBus"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Room or Bus</FormLabel>
                    <FormControl className="w-full">
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val)
                          setRoomOrBus(val)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pick one" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="''">None</SelectItem>
                          <SelectItem value="room">Room</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {roomOrBus == 'bus' ? (
                <FormField
                  control={form.control}
                  name="roomOrBus"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Pick up location</FormLabel>
                      <FormControl className="w-full">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            <SelectItem value="150000">MECC</SelectItem>
                            <SelectItem value="200000">Poste</SelectItem>
                            <SelectItem value="250000">Vogt</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <></>
              )}
              {roomOrBus == 'room' ? (
                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Room type</FormLabel>
                      <FormControl className="w-full">
                        <Select
                          onValueChange={(value) => {
                            field.onChange(Number(value))
                            setRoomType(Number(value))
                          }}
                          defaultValue={''}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pick one" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            <SelectItem value="20000">Room</SelectItem>
                            <SelectItem value="40000">Studio</SelectItem>
                            <SelectItem value="60000">Duplex</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <></>
              )}

              {roomType ? (
                <FormField
                  control={form.control}
                  name="paidRoom"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Room number</FormLabel>
                      <FormControl className="w-full">
                        <Select
                          onValueChange={(val) => {
                            setRoom(roomById(Number(val)))
                            console.log(room)
                            field.onChange(Number(room.price))
                          }}
                          defaultValue={'0'}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pick one" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rooms?.map((val) => (
                              <SelectItem
                                value={val.id.toString()}
                                key={val.id}
                                hidden={!(roomType == val.price)}
                              >
                                {val.number}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <></>
              )}
            </div>
            <motion.button
              type="submit"
              className={cn(
                `w-full rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3`,
              )}
            >
              Submit
            </motion.button>
          </form>
        </Form>
      </main>
    </div>
  )
}
