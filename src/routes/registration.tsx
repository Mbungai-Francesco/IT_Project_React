import { useAdminContext } from '@/hooks/useAdminContext'
import { cn } from '@/lib/utils'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
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
import type { Registration, Room } from '@/types'
import { getRooms, updateRoom } from '@/api/roomApi'
import { createRegistration } from '@/api/registrationApi'
import { uploadToCloudinary } from '@/api'

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
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date must be in the format YYYY-MM-DD',
    })
    .refine(
      (date) => {
        const now = new Date()
        const dob = new Date(date)
        const minAge = new Date(now.setFullYear(now.getFullYear() - 12))
        return dob <= minAge
      },
      {
        message: 'You must be at least 12 years old.',
      },
    ),
  image: z.instanceof(File),
  cni: z.string().min(10, {
    message: 'CNI must be at least 10 characters.',
  }),
  birthCertificate: z.instanceof(File, {
    message: 'Please upload birth certificate',
  }),
  roomOrBus: z.string().optional(),
  roomType: z.number().optional(),
  paidRoom: z
    .number({
      message: 'paidRoom is required when roomType is provided',
    })
    .optional(),
  paidBus: z.number().optional(),
  roomId: z.number().optional(),
})

const emptyRoom: Room = {
  id: 0,
  studentId: 0,
  occupied: false,
  number: 0,
  price: 0,
}

const emptyFile = new File([], 'empty.txt', { type: 'text/plain' })

// ? setting type
type FormValues = z.infer<typeof formSchema>

function RouteComponent() {
  const [image, setImage] = useState('')
  const [birthCertificate, setBirthCertificate] = useState('')
  const [roomType, setRoomType] = useState(0)
  const [room, setRoom] = useState<Room>(emptyRoom)
  const [roomOrBus, setRoomOrBus] = useState('')
  const [specialty, setSpecialty] = useState('')

  const navigate = useNavigate()
  const { theme } = useAdminContext()
  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
    staleTime: 30000, // 30 seconds
  })

  const roomById = (id: number) => {
    form.setValue('roomId', id)
    form.setValue('paidBus', 0)
    if (rooms) return rooms.find((val) => val.id == id) || emptyRoom
    else return emptyRoom
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // image: image,
      // birthCertificate: birthCertificate,
      roomType: 0,
      paidRoom: 0,
      paidBus: 0,
      roomOrBus: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // imageMutate(values.image)
    // fileMutate(values.birthCertificate)

    console.log(values)
    mutate(values)
  }

  const { mutate: imageMutate, isSuccess: imageSuccess } = useMutation({
    mutationFn: (val: File) => {
      imageToast('Uplaoding', 'Image')
      return uploadToCloudinary(val)
    },
    onSuccess: (data) => {
      setImage(data)
      toast.dismiss(toastImageId)
      imageToast('Image Uploaded', '', 2000, 'green')
    },
    onError: () => {
      toast.dismiss(toastImageId)
      form.setValue("image",emptyFile)
      imageToast('Upload Failed', 'Image', 2000, 'red')
    },
  })
  const { mutate: fileMutate, isSuccess: fileSuccess } = useMutation({
    mutationFn: (val: File) => {
      fileToast('Uplaoding', 'Certificate')
      return uploadToCloudinary(val)
    },
    onSuccess: (data) => {
      setBirthCertificate(data)
      toast.dismiss(toastFileId)
      fileToast('Certificate Uploaded', '', 2000, 'green')
    },
    onError: () => {
      toast.dismiss(toastFileId)
      form.setValue("birthCertificate",emptyFile)
      fileToast('Upload Failed', 'Certificate', 2000, 'red')
    },
  })
  const { mutate: roomMutate } = useMutation({
    mutationFn: () => {
      const inRoom: Room = {
        ...room,
        studentId: data?.id || 0,
        occupied: true,
      }
      fileToast('Reserving', 'Room')
      return updateRoom(inRoom.id, inRoom)
    },
    onSuccess: () => {
      toast.dismiss(toastFileId)
      fileToast('Room reserved', '', 2000, 'green')
    },
    onError: () => {
      toast.dismiss(toastFileId)
      fileToast('Reservation Failed', '', 2000, 'red')
    },
  })

  const { data, mutate } = useMutation({
    mutationFn: (vals: FormValues) => {
      const registrationData: Registration = {
        ...vals,
        image: image,
        birthCertificate: birthCertificate,
        status: 'PENDING',
        dateOfBirth: new Date(vals.dateOfBirth), // Convert here
        roomId: room.id
        // Handle file uploads if needed
      }
      imageToast('Creating', 'candidate')
      return createRegistration(registrationData)
    },
    onSuccess: () => {
      toast.dismiss(toastImageId)
      imageToast('Candidate created', '', 2000, 'green')
      if(room.id)roomMutate()
    },
    onError: () => {
      toast.dismiss(toastImageId)
      imageToast('Creation Failed', 'Image', 2000, 'red')
    },
  })

  let toastImageId: string | number
  let toastFileId: string | number
  let toastRoomId: string | number

  const imageToast = (
    val: string,
    action?: string,
    num?: number,
    col?: string,
  ) => {
    toastImageId = toast(val, {
      description: <p>{action}</p>,
      action: {
        label: num ? (
          <span className="relative flex size-3">
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75',
                col === 'red' && 'bg-red-400',
                col === 'green' && 'bg-green-400',
              )}
            ></span>
            <span
              className={cn(
                'relative inline-flex size-3 rounded-full bg-sky-500',
                col === 'red' && 'bg-red-500',
                col === 'green' && 'bg-green-500',
              )}
            ></span>
          </span>
        ) : (
          <>
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
            </span>
          </>
        ),
        onClick: () => console.log('Undone'),
      },
      style: {
        backgroundColor: 'black',
        color: 'white',
      },
      duration: num ? num : Infinity,
    })
  }
  const fileToast = (
    val: string,
    action?: string,
    num?: number,
    col?: string,
  ) => {
    toastFileId = toast(val, {
      description: <p>{action}</p>,
      action: {
        label: num ? (
          <span className="relative flex size-3">
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75',
                col === 'red' && 'bg-red-400',
                col === 'green' && 'bg-green-400',
              )}
            ></span>
            <span
              className={cn(
                'relative inline-flex size-3 rounded-full bg-sky-500',
                col === 'red' && 'bg-red-500',
                col === 'green' && 'bg-green-500',
              )}
            ></span>
          </span>
        ) : (
          <>
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
            </span>
          </>
        ),
        onClick: () => console.log('Undone'),
      },
      style: {
        backgroundColor: 'black',
        color: 'white',
      },
      duration: num ? num : Infinity,
    })
  }
  const roomToast = (
    val: string,
    action?: string,
    num?: number,
    col?: string,
  ) => {
    toastRoomId = toast(val, {
      description: <p>{action}</p>,
      action: {
        label: num ? (
          <span className="relative flex size-3">
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75',
                col === 'red' && 'bg-red-400',
                col === 'green' && 'bg-green-400',
              )}
            ></span>
            <span
              className={cn(
                'relative inline-flex size-3 rounded-full bg-sky-500',
                col === 'red' && 'bg-red-500',
                col === 'green' && 'bg-green-500',
              )}
            ></span>
          </span>
        ) : (
          <>
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
            </span>
          </>
        ),
        onClick: () => console.log('Undone'),
      },
      style: {
        backgroundColor: 'black',
        color: 'white',
      },
      duration: num ? num : Infinity,
    })
  }

  return (
    <div className={cn(`${theme}`)}>
      <title>Registration</title>
      <main
        className={cn(
          `bg-white dark:bg-black h-fit min-h-screen w-full flex flex-col justify-center items-center`,
        )}
      >
        <Form {...form}>
          <motion.form
            className="space-y-8 dark:bg-black sm:border-2 sm:border-white rounded-md sm:w-3/5  p-4 text-black dark:text-white"
            onSubmit={form.handleSubmit(onSubmit)}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              // type: 'inertia',
              stiffness: 100,
              damping: 10,
              delay: 1,
            }}
          >
            <h1 className={cn(`font-bold text-2xl py-4`)}>Registration form</h1>{' '}
            <div className="grid sm:grid-cols-2 gap-4 ">
              {/* // ? First Name */}
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
              {/* // ? Last Name */}
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
              {/* // ? Email */}
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
              {/* // ? Specialty */}
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val)
                          setSpecialty(val)
                        }}
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
              {/* // ? Level */}
              {specialty ? (
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Level</FormLabel>
                      <FormControl className="w-full">
                        <Select
                          onValueChange={(val) => {
                            field.onChange(parseInt(val[2]))
                          }}
                          defaultValue={''}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pick one" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              value={'TA1'}
                              hidden={!(specialty == 'Tronc commun')}
                            >
                              Inge 1 Anglo
                            </SelectItem>
                            <SelectItem
                              value={'TF1'}
                              hidden={!(specialty == 'Tronc commun')}
                            >
                              Inge 1 Franco
                            </SelectItem>
                            <SelectItem
                              value={'IA3'}
                              hidden={!(specialty == 'ISI')}
                            >
                              Inge 3 ISI Anglo
                            </SelectItem>
                            <SelectItem
                              value={'IF3'}
                              hidden={!(specialty == 'ISI')}
                            >
                              Inge 3 ISI Franco
                            </SelectItem>
                            <SelectItem
                              value={'SR3'}
                              hidden={!(specialty == 'SRT')}
                            >
                              Inge 3 SRT
                            </SelectItem>
                            <SelectItem
                              value={'GC3'}
                              hidden={!(specialty == 'Genie Civil')}
                            >
                              Inge 3 Genie Civil
                            </SelectItem>
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
              {/* // ? Date of birth */}
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
                        value={field.value || ''} // Handles undefined/null
                        onChange={(e) => {
                          // Directly use the YYYY-MM-DD string value
                          field.onChange(e.target.value)
                        }}
                        className="w-full"
                        max={(() => {
                          // Calculate max date (12 years ago from today)
                          const now = new Date()
                          const minAgeDate = new Date(
                            now.setFullYear(now.getFullYear() - 12),
                          )
                          return minAgeDate.toISOString().split('T')[0]
                        })()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* // ? CNI */}
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
              {/* // ? Image */}
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
                          field.onChange(file)
                          imageMutate(file || emptyFile)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* // ? File */}
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
                          field.onChange(file)
                          fileMutate(file || emptyFile)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* // ? Room or Bus */}
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
              {/* // ? Paid Bus */}
              {roomOrBus == 'bus' ? (
                <FormField
                  control={form.control}
                  name="paidBus"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Pick up location</FormLabel>
                      <FormControl className="w-full">
                        <Select
                          onValueChange={(val) => {
                            field.onChange(Number(val))
                            if(room.id) roomToast('Room canceled', '', 2000, 'red')
                            form.setValue('roomId', 0)
                            setRoom(emptyRoom)
                            console.log(form.getValues().paidBus);
                            
                          }}
                          defaultValue={''}
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
              {/* // ? Room Type */}
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
                            if(form.getValues().paidBus) roomToast('Bus canceled', '', 2000, 'red')
                            form.setValue("paidBus",0)
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
              {/* // ? Paid room */}
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
                            console.log(roomById(Number(val)))
                            field.onChange(Number(roomById(Number(val)).price))
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
            <div>
              <motion.button
                type="submit"
                className={cn(
                  `w-full rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3`,
                  !(fileSuccess && imageSuccess) && 'opacity-30',
                )}
                disabled={!(fileSuccess && imageSuccess)}
              >
                Submit
              </motion.button>
              <p className={cn(`py-2 text-sm`)}>
                ** Files need to be uploaded for submit to be enabled
              </p>
            </div>
          </motion.form>
        </Form>
      </main>
    </div>
  )
}
