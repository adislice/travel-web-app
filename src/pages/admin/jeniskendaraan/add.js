import { Button } from "@/components/Button"
import AdminLayout from "@/components/dashboard/Layout"
import FormInputError from "@/components/FormInputError"
import { Icons } from "@/components/Icons"
import { addJenisKendaraan } from "@/services/JenisKendaraanService"
import { addAdmin } from "@/services/UserService"
import { FileInput, Label, TextInput } from "flowbite-react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Swal from "sweetalert2"

function TambahJenisKendaraanPage() {
  const router = useRouter()

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

  function submitForm(formData) {
    console.log(formData)
    Swal.fire({
      title: "Silahkan tunggu...",
      text: "Menyimpan data..."
    })
    Swal.showLoading()
    addJenisKendaraan(formData).then(() => {
      Swal.fire({
        title: "Sukses!",
        text: "Berhasil menambah data jenis kendaraan",
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "Baik",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          router.push(router.asPath + "/..")
        }
      })
    }).catch((error) => {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menambah data jenis kendaraan. Silahkan coba beberapa saat lagi",
        icon: "error",
        confirmButtonText: "Baik",
      })
    })
  }

  return (
    <AdminLayout>
      <Head>
        <title>Tambah Jenis Kendaraan</title>
      </Head>

      <div className="flex items-center gap-2 p-5 md:px-0 ">
        <Link href={"./"}>
          <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
        </Link>
        <h3 className="text-xl font-semibold text-gray-800">Tambah Jenis Kendaraan</h3>
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
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Nama Kendaraan
                    </label>
                    <TextInput
                      id="nama"
                      className="focus:ring-primary-400"
                      type="text"
                      sizing="md"
                      placeholder="Masukkan nama kendaraan"
                      {...register("nama", {
                        required: "Nama tidak boleh kosong",
                      })}
                    />
                    <FormInputError errorState={errors.nama} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="jumlah_seat"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Jumlah Seat
                    </label>
                    <TextInput
                      id="jumlah_seat"
                      className="focus:ring-primary-400"
                      type="number"
                      sizing="md"
                      placeholder="Masukkan jumlah seat"
                      {...register("jumlah_seat", {
                        required: "Jumlah seat tidak boleh kosong",
                      })}
                    />
                    <FormInputError errorState={errors.jumlah_seat} />
                  </div>
                  
                </div>
                
              </div>
              <Button className="mx-4 mb-4" type="submit">Simpan</Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </AdminLayout>
  )
}

export default TambahJenisKendaraanPage