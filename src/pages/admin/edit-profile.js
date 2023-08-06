import { Button } from '@/components/Button'
import FormInputError from '@/components/FormInputError'
import { Icons } from '@/components/Icons'
import AdminLayout from '@/components/dashboard/Layout'
import { useFirebaseAuth } from '@/context/FirebaseAuthContext'
import { editPassword, editProfile, getUserDetailRealtime } from '@/services/UserService'
import { FileInput, TextInput } from 'flowbite-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

function EditProfilePage() {
  const [authUser, authUserData] = useFirebaseAuth()
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [currentFoto, setCurrentFoto] = useState(null)
  const methods = useForm({ mode: "onChange" })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = methods
  const imgWatch = watch("foto")
  const methods2 = useForm({ mode: "onChange" })
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    reset: reset2,
    watch: watch2,
    setValue: setValue2,
    getValues: getValues2,
  } = methods2
  const [foto, setFoto] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)


  useEffect(() => {
    if (authUserData) {
      setUserData(authUserData)
    }
  }, [router.isReady, authUserData])

  useEffect(() => {
    console.log(previewImage)
  }, [previewImage])


  useEffect(() => {
    console.log("imgwatch ", imgWatch)
    if (imgWatch?.length > 0) {
      const file = imgWatch[0]
      setFoto(file)
      setPreviewImage(URL.createObjectURL(file))
    } else {
      if (currentFoto) {
        // setFoto(currentFoto)
        setPreviewImage(currentFoto)
      } else {
        setFoto(null)
        setPreviewImage(null)
      }
      
    }

  }, [imgWatch])

  useEffect(() => {
    if (userData != null) {
      setValue("nama", userData.nama)
      setValue("email", userData.email)
      setValue("no_telp", userData.no_telp)
      console.log("userdata.foto ", userData.foto)
      setPreviewImage(userData.foto)
      setCurrentFoto(userData.foto)
    }
    
  }, [userData])

  function submitForm(formData) {
    console.log(formData)
    editProfile(formData).then((res) => {
      if (res.status) {
        Swal.fire({
          title: "Sukses",
          text: "Berhasil mengubah profil!",
          icon: "success",
          confirmButtonText: "OK"
        })
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Gagal mengubah profil!",
          icon: "error",
          confirmButtonText: "OK"
        })
      }
    }).catch((error) => {
      Swal.fire({
        title: "Gagal",
        text: "Gagal mengubah profil!",
        icon: "error",
        confirmButtonText: "OK"
      })
    })
  }

  const hapusInputFoto = (e) => {
    e.preventDefault()
    setValue("foto", [])
    setPreviewImage(currentFoto)
  }

  const ubahPassword = (formData) => {
    console.log(formData)
    editPassword(formData.old_password, formData.password).then((res) => {
      if (res.status) {
        Swal.fire({
          title: "Sukses",
          text: "Berhasil mengubah password!",
          icon: "success",
          confirmButtonText: "OK"
        })
      } else {
        Swal.fire({
          title: "Gagal mengubah password!",
          text: res.msg,
          icon: "error",
          confirmButtonText: "OK"
        })
      }
      
    })
  }


  return (
    <AdminLayout>
      <Head>
        <title>Ubah Profil</title>
      </Head>

      <div className="flex items-center gap-2 p-5 md:px-0 ">
        <Link href={"./"}>
          <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
        </Link>
        <h3 className="text-xl font-semibold text-gray-800">Ubah Profil</h3>
      </div>
      <div className="wrapper flex flex-col">
        <div className="mb-5 rounded-xl bg-white p-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)} className="">
              <div className="relative flex flex-wrap overflow-x-auto">
                <div className="w-full p-4 md:w-1/2 flex flex-col">

                  <div className="mb-4 block">
                    <label
                      htmlFor="nama"
                      value="Nama Admin"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Nama
                    </label>
                    <TextInput
                      id="nama"
                      className="focus:ring-primary-400"
                      type="text"
                      sizing="md"
                      placeholder="Masukkan nama admin"
                      {...register("nama", {
                        required: "Nama tidak boleh kosong",
                      })}
                    />
                    <FormInputError errorState={errors.nama} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="email"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Email
                    </label>
                    <TextInput
                      id="email"
                      className="focus:ring-primary-400"
                      type="email"
                      sizing="md"
                      placeholder="Masukkan email"
                      {...register("email", {
                        required: "Email tidak boleh kosong",
                      })}
                    />
                    <FormInputError errorState={errors.email} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="no_telp"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Nomor Telepon
                    </label>
                    <TextInput
                      id="no_telp"
                      className="focus:ring-primary-400"
                      type="tel"
                      sizing="md"
                      placeholder="Masukkan no telepon"
                      {...register("no_telp", {
                        required: "Nomor telepon tidak boleh kosong",
                        pattern: {
                          value: /^[0-9]{5,20}$/,
                          message: "Nomor telepon tidak valid",
                        },
                      })}
                    />
                    <FormInputError errorState={errors.no_telp} />
                  </div>
                </div>
                <div className="w-full p-4 md:w-1/2 flex flex-col">
                  <div className="mb-4 h-48 w-48 self-center">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-content-center rounded-full bg-gray-300">
                        <Icons.user2 className="h-16 w-16 text-gray-700" />
                      </div>
                    )}
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="foto"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Foto Profil
                    </label>
                    <div className="relative">
                      <FileInput type="file" id="foto" {...register("foto")} />
                      {imgWatch?.length > 0 ? (
                        <Button onClick={(e) => hapusInputFoto(e)} className="absolute right-0 top-0 bg-transparent py-2.5 hover:border hover:border-red-600  text-red-600 hover:bg-red-500 hover:text-white" type="button">
                        <Icons.hapus className="h-5 w-5" />
                        </Button>
                      ) : null}
                      
                    </div>
                    

                  </div>

                </div>
              </div>
              <Button type="submit" className="mx-4">Simpan</Button>
            </form>
          </FormProvider>
        </div>
      </div>
      <div className="wrapper flex flex-col">
        <div className="mb-5 rounded-xl bg-white p-6">
          <FormProvider {...methods2}>
            <form onSubmit={handleSubmit2(ubahPassword)} className="">
              <div className="relative flex flex-wrap overflow-x-auto">
                <div className="w-full p-4 md:w-1/2 flex flex-col">
                <div className="mb-4 block">
                    <label
                      htmlFor="old_password"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Password Lama
                    </label>
                    <TextInput
                      id="old_password"
                      className="focus:ring-primary-400"
                      type="password"
                      sizing="md"
                      placeholder="Masukkan password lama"
                      {...register2("old_password", {
                        required: "Password lama tidak boleh kosong",
                      })}
                    />
                    <FormInputError errorState={errors2.old_password} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="password"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <TextInput
                      id="password"
                      className="focus:ring-primary-400"
                      type="password"
                      sizing="md"
                      placeholder="Masukkan password"
                      {...register2("password", {
                        required: "Password tidak boleh kosong",
                        pattern: {
                          value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,}$/,
                          message:
                            "Password harus memiliki panjang 6 karakter dan terdiri dari kombinasi huruf dan angka",
                        },
                      })}
                    />
                    <FormInputError errorState={errors2.password} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="password_c"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Konfirmasi Password
                    </label>
                    <TextInput
                      id="password_c"
                      className="focus:ring-primary-400"
                      type="password"
                      sizing="md"
                      placeholder="Masukkan konfirmasi password"
                      {...register2("password_c", {
                        required: "Konfirmasi password tidak boleh kosong",
                        validate: (value) => {
                          const { password } = getValues2()
                          return (
                            password === value ||
                            "Konfirmasi password tidak cocok"
                          )
                        },
                      })}
                    />
                    <FormInputError errorState={errors2.password_c} />
                  </div>
                </div>
                <div className="w-full p-4 md:w-1/2 flex flex-col">
                  
                  

                </div>
              </div>
              <Button type="submit" className="mx-4">Ubah Password</Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </AdminLayout>
  )
}

export default EditProfilePage