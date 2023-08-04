import { Icons } from "@/components/Icons"
import ModalResetPassword from "@/components/ModalResetPassword"
import { useFirebaseAuth } from "@/context/FirebaseAuthContext"
import { auth } from "@/lib/firebase"
import { checkRole, logIn, logOut } from "@/services/AuthService"
import { onAuthStateChanged } from "firebase/auth"
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { Inter } from "next/font/google"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Swal from "sweetalert2"

function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState({ error: false, errorMsg: "" })
  const methods = useForm({ mode: "onBlur" })
  const router = useRouter()
  const [done, setDone] = useState(false)
  const [authUser, authUserData] = useFirebaseAuth()
  const [modalResetOpened, setModalResetOpened] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin/dashboard")
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
console.log("authuser: ", authUser, " authuserdata: ", authUserData)
  }, [authUser, authUserData])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  async function onSubmit(data) {
    setLoading(true)
    const { result, error } = await logIn(data.email, data.password)
    if (result) {
      const checkAdmin = await checkRole(result.user.uid)
      if (checkAdmin) {
        Swal.fire({
          title: "Sukses",
          text: "Login berhasil!",
          icon: "success",
          confirmButtonText: "OK"
        })
        router.push("/admin/dashboard")
      } else {
        await logOut()
        Swal.fire({
          title: "Login gagal!",
          text: "Silahkan cek kembali email dan password!!",
          icon: "error",
          confirmButtonText: "OK",
        })
        setLoading(false)
      }
      
      setLoading(true)
    }

    if (error) {
      let code = error.code
      console.log(code)
      switch (code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          Swal.fire({
            title: "Login gagal!",
            text: "Silahkan cek kembali email dan password!",
            icon: "error",
            confirmButtonText: "OK",
          })
          break
        default:
          Swal.fire({
            title: "Login gagal!",
            text: "Silahkan coba beberapa saat lagi!",
            icon: "error",
            confirmButtonText: "OK",
          })
          break
      }
      setLoading(false)
    }
  }
  

  return (
    <>
    <Head>
      <title>Login Admin Kencana Wisata</title>
    </Head>
    {(authUserData === undefined) ? (<div></div>) : (
      <div className={`flex h-screen min-h-screen items-center justify-center`}>
      <div className="m-5 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.login className="m-3 mx-auto h-10 w-10" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Selamat datang kembali
          </h1>
          <p className="text-muted text-sm">
            Masukkan email dan password untuk login
          </p>
        </div>

        <div className="grid gap-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <TextInput
                  type="email"
                  {...register("email", { required: "Masukkan email" })}
                  sizing="md"
                  name="email"
                  placeholder="Email@gmail.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
                <TextInput
                  type="password"
                  {...register("password", { required: "Masukkan password" })}
                  sizing="md"
                  name="password"
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
                <Button color="dark" type="submit" disabled={loading}>
                  {loading && (
                    <Spinner
                      size="sm"
                      className="mr-2 fill-white text-transparent"
                      aria-label="Alternate spinner button example"
                    />
                  )}
                  Login
                </Button>
                <div>
                  <span>Lupa password? </span>
                  <span  className="text-center hover:underline" onClick={(e) => {e.preventDefault();setModalResetOpened(true)}}>
                  Reset password Anda
                </span>
                </div>
                
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
    )}

    <ModalResetPassword isModalOpened={modalResetOpened} setModalOpened={setModalResetOpened} />
    
    
    </>
  )
}

export default LoginPage
