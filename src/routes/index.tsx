'use client'

import { motion } from 'motion/react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAdminContext } from '@/hooks/useAdminContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/api/adminApi'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

// const defaultAdmin: Admin = { id: 1, name : 'Forche', email : '', password: '' }

const formSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email({
      message: 'Invalid email format.',
    }),
  password: z.string().min(4, {
    message: 'Password must be at least 4 characters.',
  }),
})

// ? setting type
type FormValues = z.infer<typeof formSchema>

function App() {
  const { theme } = useAdminContext()
  const navigate = useNavigate()

  // console.log(admin)
  // console.log(theme)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  // 2. Define a submit handler.
  function onSubmit(values: FormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values)
    mutate(values)
  }

  const { isPending, mutate, isError } = useMutation({
    // mutationFn: ,
    mutationFn: (values: FormValues) => {
      return loginUser(values.email, values.password)
    },
    onSuccess: () => {
      console.log('Success !!')
      navigate({ to: '/home' })
    },
    // onError: (error) => {
    //   console.log('Login failed:', error);
    //   // Optionally add error handling here
    //   form.setError('root', {
    //     message: 'Invalid credentials. Please try again.'
    //   });
    // }
  })

  return (
    <div className={cn(`${theme}`)}>
      <title>Login</title>
      <main
        className={cn(
          `bg-white dark:bg-black min-h-screen w-full flex flex-col justify-center items-center`,
        )}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8  dark:bg-black sm:border-2 sm:border-black dark:sm:border-white rounded-md sm:w-[35%]  p-4 text-black dark:text-white"
          >
            <div className={cn(`text-center py-4`)}>
              <h1 className={cn(`font-bold text-2xl`)}>
                Login to Your Account
              </h1>
              <p className={cn(`text-sm`)}>
                Enter you username and password to login
              </p>
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
                    <Input
                      placeholder="example@email.com"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <motion.button
              type="submit"
              className={cn(
                `w-full rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3`,
              )}
              animate={
                isPending
                  ? {
                      backgroundColor: ['#ffffff', '#ffa500', '#ffffff'], // Orange blink
                    }
                  : {}
              }
              transition={
                isPending
                  ? {
                      duration: 2, // Blink speed (3 seconds per cycle)
                      repeat: Infinity, // Loop forever
                      ease: 'linear',
                    }
                  : {}
              }
            >
              Submit
            </motion.button>
            <div>
              <p className={cn(`font-medium`)}>
                I'm a candidate?{' '}
                <Link
                  to="/registration"
                  className={cn(`text-blue-500 underline cursor-pointer`)}
                >
                  Registration
                </Link>
              </p>
              {isError ? (
                <p className={cn(`font-medium text-red-400`)}>
                  Wrong Credentials
                </p>
              ) : (
                <></>
              )}
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
