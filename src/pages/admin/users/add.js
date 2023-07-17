import { Button } from "@/components/Button"
import AdminLayout from "@/components/dashboard/Layout"
import FormInputError from "@/components/FormInputError"
import { Icons } from "@/components/Icons"
import { addAdmin } from "@/services/UserService"
import { FileInput, Label, TextInput } from "flowbite-react"
import Head from "next/head"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Swal from "sweetalert2"

function TambahAdminPage() {
  const [foto, setFoto] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

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

  useEffect(() => {
    console.log("imgwatch ", imgWatch)
    if (imgWatch?.length > 0) {
      const file = imgWatch[0]
      setFoto(file)
      setPreviewImage(URL.createObjectURL(file))
    } else {
      setFoto(null)
      setPreviewImage(null)
    }
    
  }, [imgWatch])

  function submitForm(formData) {
    console.log(formData)
    addAdmin(formData).then((res) => {
      if (res.status) {
        Swal.fire({
          title: "Sukses",
          text: "Berhasil menambah admin!",
          icon: "success",
          confirmButtonText: "OK"
        })
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Gagal menambah admin!",
          icon: "error",
          confirmButtonText: "OK"
        })
      }
    }).catch((error) => {
      Swal.fire({
        title: "Gagal",
        text: "Gagal menambah admin!",
        icon: "error",
        confirmButtonText: "OK"
      })
    })
  }

  return (
    <AdminLayout>
      <Head>
        <title>Tambah Admin</title>
      </Head>

      <div className="flex items-center gap-2 p-5 md:px-0 ">
        <Link href={"./"}>
          <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
        </Link>
        <h3 className="text-xl font-semibold text-gray-800">Tambah Admin</h3>
      </div>
      <div className="wrapper flex flex-col">
        <div className="mb-5 rounded-xl bg-white p-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)} className="">
              <div className="relative flex flex-wrap overflow-x-auto">
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
                    <FileInput type="file" id="foto" {...register("foto")} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="nama"
                      value="Nama Admin"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Nama Admin
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
                <div className="w-full p-4 md:w-1/2 ">
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
                      {...register("password", {
                        required: "Password tidak boleh kosong",
                        pattern: {
                          value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,}$/,
                          message:
                            "Password harus memiliki panjang 6 karakter dan terdiri dari kombinasi huruf dan angka",
                        },
                      })}
                    />
                    <FormInputError errorState={errors.password} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="password_c"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <TextInput
                      id="password_c"
                      className="focus:ring-primary-400"
                      type="password"
                      sizing="md"
                      placeholder="Masukkan konfirmasi password"
                      {...register("password_c", {
                        required: "Konfirmasi password tidak boleh kosong",
                        validate: (value) => {
                          const { password } = getValues()
                          return (
                            password === value ||
                            "Konfirmasi password tidak cocok"
                          )
                        },
                      })}
                    />
                    <FormInputError errorState={errors.password_c} />
                  </div>
                </div>
              </div>
              <Button type="submit">Simpan</Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </AdminLayout>
  )
}

export default TambahAdminPage
