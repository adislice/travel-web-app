import { Button } from "@/components/Button"
import AdminLayout from "@/components/dashboard/Layout"
import FormInputError from "@/components/FormInputError"
import { Icons } from "@/components/Icons"
import { addPromo } from "@/services/PromoService"
import { addAdmin } from "@/services/UserService"
import { FileInput, Label, TextInput } from "flowbite-react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Datepicker from "react-tailwindcss-datepicker"
import Swal from "sweetalert2"

const currentDate = new Date()
const firstDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
)
const lastDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0
)

function TambahPromoPage() {
  const router = useRouter()
  const [dataInput, setDataInput] = useState({
    nama: "",
    kode: "",
    persen: 0,
    min_pembelian: 0,
    max_potongah: 0,
    tanggal_mulai: "",
    tanggal_akhir: ""
  })
  const [dateRangeValue, setDateRangeValue] = useState({
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth,
  })

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

  const handleDateRangeChange = (newValue) => {
    console.log("newValue:", newValue)
    setDateRangeValue(newValue)
  }

  function submitForm(formData) {
    console.log(formData)
    console.log(dateRangeValue)
    Swal.fire({
      title: "Silahkan tunggu...",
      text: "Menyimpan data..."
    })
    Swal.showLoading()
    addPromo(formData, dateRangeValue).then((res) => {
      if (res.status) {
        Swal.fire({
          title: "Sukses!",
          text: "Berhasil menambah data promo",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "Baik",
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            router.push(router.asPath + "/..")
          }
        })
      } else {
        Swal.fire({
          title: "Gagal!",
          text: res.msg,
          icon: "error",
          confirmButtonText: "Baik",
        })
      }
      
    }).catch((error) => {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menambah data promo. Silahkan coba beberapa saat lagi",
        icon: "error",
        confirmButtonText: "Baik",
      })
    })
  }

  return (
    <AdminLayout>
      <Head>
        <title>Tambah Promo</title>
      </Head>

      <div className="flex items-center gap-2 p-5 md:px-0 ">
        <Link href={"./"}>
          <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
        </Link>
        <h3 className="text-xl font-semibold text-gray-800">Tambah Promo</h3>
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
                      Nama Promo
                    </label>
                    <TextInput
                      id="nama"
                      className="focus:ring-primary-400"
                      type="text"
                      sizing="md"
                      placeholder="Masukkan nama promo"
                      {...register("nama", {
                        required: "Nama tidak boleh kosong",
                      })}
                    />
                    <FormInputError errorState={errors.nama} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="kode"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Kode Promo
                    </label>
                    <TextInput
                      id="kode"
                      className="focus:ring-primary-400"
                      type="text"
                      sizing="md"
                      placeholder="Masukkan kode promo"
                      {...register("kode", {
                        required: "Kode promo tidak boleh kosong",
                      })}
                    />
                    <FormInputError errorState={errors.kode} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="persen"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Diskon %
                    </label>
                    <TextInput
                      id="persen"
                      className="focus:ring-primary-400"
                      type="tel"
                      sizing="md"
                      placeholder="Masukkan diskon"
                      {...register("persen", {
                        required: "Diskon tidak boleh kosong",
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Hanya menerima angka!',
                      },
                      })}
                    />
                    <FormInputError errorState={errors.persen} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="min_pembelian"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Minimal Pembelian
                    </label>
                    <TextInput
                      id="min_pembelian"
                      className="focus:ring-primary-400"
                      type="tel"
                      sizing="md"
                      placeholder="Contoh 1000000"
                      {...register("min_pembelian", {
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Hanya menerima angka!',
                      },
                      })}
                    />
                    <div className="text-sm text-gray-600 italic">Isi 0 jika tidak ada minimal pembelian</div>
                    <FormInputError errorState={errors.min_pembelian} />
                  </div>
                  <div className="mb-4 block">
                    <label
                      htmlFor="max_potongan"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Maksimal Potongan (Rp)
                    </label>
                    <TextInput
                      id="max_potongan"
                      className="focus:ring-primary-400"
                      type="tel"
                      sizing="md"
                      placeholder="Contoh 1000000"
                      {...register("max_potongan", {
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Hanya menerima angka!',
                      },
                      })}
                    />
                    <div className="text-sm text-gray-600 italic">Isi 0 jika tidak ada maksimal potongan</div>
                    <FormInputError errorState={errors.max_potongan} />
                  </div>
                  
                </div>
                <div className="w-full p-4 md:w-1/2 flex flex-col">
                <div className="mb-4 block">
                    <label
                      htmlFor="persen"
                      className="mb-2 inline-block font-semibold text-gray-900 dark:text-gray-300"
                    >
                      Periode Promo
                    </label>
                    <Datepicker
                      useRange={false}
                      inputClassName="relative transition-all duration-300 py-2 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-blue-500 focus:ring-blue-500/20"
                      value={dateRangeValue}
                      onChange={handleDateRangeChange}
                    />
                    <FormInputError errorState={errors.persen} />
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

export default TambahPromoPage