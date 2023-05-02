import { Icons } from '@/components/Icons'
import { useAuth } from '@/context/authContext'
import signIn from '@/lib/signIn'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState({ error: false, errorMsg: '' })
  const methods = useForm({ mode: 'onBlur' })
  const router = useRouter()
  const { authUser } = useAuth();

  useEffect(() => {
    console.log(authUser)
    if (authUser) {
      router.push('/admin/dashboard')
    }
    return
  }, [])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  async function onSubmit(data) {
    setLoading(true)
    const { result, error } = await signIn(data.email, data.password)
    if (result) {
      Swal.fire({
        title: 'Sukses',
        text: 'Login berhasil!',
        icon: 'success',
        timer: '2500',
      })
      router.push('/admin/dashboard')
    }

    if (error) {
      let code = error.code
      console.log(code)
      switch (code) {
        case 'auth/user-not-found':
          Swal.fire({
            title: 'Login gagal!',
            text: 'Pengguna tidak ditemukan!',
            icon: 'error',
            confirmButtonText: 'Tutup'
          })
          break;
        case 'auth/wrong-password':
          Swal.fire({
            title: 'Login gagal!',
            text: 'Email atau password salah!',
            icon: 'error',
            confirmButtonText: 'Tutup'
          })
          break;
        default:
          Swal.fire({
            title: 'Login gagal!',
            text: 'Silahkan coba beberapa saat lagi!',
            icon: 'error',
            confirmButtonText: 'Tutup'
          })
          break;
      }
    }

    setLoading(false)
  }

  return (
    <div className={`flex items-center justify-center min-h-screen h-screen`}>
      <div className="m-5 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.login className="h-10 w-10 m-3 mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">Selamat datang kembali</h1>
          <p className="text-sm text-muted">Masukkan email dan password untuk login</p>
        </div>
        
        <div className="grid gap-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <TextInput
                  type="email"
                  {...register("email", { required: "Masukkan email" })}
                  sizing="md"
                  name='email'
                  placeholder='Email@gmail.com'
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                <TextInput
                  type="password"
                  {...register("password", { required: "Masukkan password" })}
                  sizing="md"
                  name='password'
                  placeholder='Password'
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                <Button color="dark" type='submit' disabled={loading}>
                  {loading && <Spinner size="sm" className='mr-2 text-transparent fill-white' aria-label="Alternate spinner button example" />}
                  Login
                </Button>
                <Link className='hover:underline text-sm text-center' href="#">Lupa password?</Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default LoginPage