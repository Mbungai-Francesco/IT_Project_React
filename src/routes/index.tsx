'use client'

import { createFileRoute } from '@tanstack/react-router'
import { useAdminContext } from '@/hooks/useAdminContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/')({
  component: App,
})

// const defaultAdmin: Admin = { id: 1, name : 'Forche', email : '', password: '' }

const formSchema = z.object({
  email: z.string({
    required_error: "Email is required.",
  }).email({
    message: "Invalid email format.",
  }),
  password: z.string().min(4, {
    message: 'Password must be at least 4 characters.',
  }),
})

function App() {
  const { admin, theme } = useAdminContext()

  console.log(admin)
  console.log(theme)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   username: '',
    // },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <div className={cn(`${theme}`)}>
      <main className={cn(`bg-pink-600 dark:bg-black h-screen w-full flex flex-col justify-center items-center`)}>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8 dark:bg-black border-white border-2 rounded-md w-[35%] p-4 text-black dark:text-white"
          >
            <div className={cn(`text-center py-4`)}>
              <h1 className={cn(`font-bold text-2xl`)}>Login to Your Account</h1>
              <p className={cn(`text-sm`)}>Enter you username and password to login</p>
            </div>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className={cn(`w-full`)}>Submit</Button>
          </form>
        </Form>
      </main>
    </div>
  )
}
