import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import ImageUpload from "@/components/ImageUpload"
import ImageUploadBox from "@/components/ImageUploadBox"
import ImageUploadItem from "@/components/ImageUploadItem"
import { Label, Textarea, TextInput } from "flowbite-react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { getTempatWisata } from "@/services/TempatWisataService"
import {
  addPaketWisata,
  getAllJenisKendaraan,
} from "@/services/PaketWisataService"
import Swal from "sweetalert2"
import "flatpickr/dist/themes/material_blue.css"
import flatpickr from "flatpickr"
import ModalDestinasiWisata from "@/components/ModalDestinasiWisata"
import ModalProdukPaketWisata from "@/components/ModalProdukPaketWisata"
import { useNav } from "@/context/navigationContext"
import FormInputError from "@/components/FormInputError"
import { formatRupiah } from "@/lib/helper"

const AddPaketWisataPage = () => {
  const [dataTempatWisata, setDataTempatWisata] = useState([])
  const [dialogTambahOpened, setDialogTambahOpened] = useState(false)
  const [imageArray, setImageArray] = useState([])
  const [tujuanWisata, setTujuanWisata] = useState([])
  const [isModalTambahProdukOpen, setIsModalTambahProdukOpen] = useState(false)
  const [jenisKendaraan, setJenisKendaraan] = useState([])
  const [addedProduk, setAddedProduk] = useState([])
  const [navigation, setNavigation] = useNav()
  const [timeInputValue, setTimeInputvalue] = useState({ jam: "", menit: "" })
  const inputRef = useRef(null)
  const tujuanWisataRef = useRef(null)
  const produkRef = useRef(null)
  const router = useRouter()
  const methods = useForm({ mode: "onBlur" })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods

  // effects
  useEffect(() => {
    setNavigation([
      {
        title: "Paket Wisata",
        url: "/admin/tempatwisata",
      },
      {
        title: "Tambah Paket Wisata",
        url: router.asPath,
      },
    ])

    // get all tempat wisata
    let result = getTempatWisata()
    result
      .then((data) => {
        const dataCheckbox = data.map((item) => {
          return { checked: false, ...item }
        })
        setDataTempatWisata(dataCheckbox)
      })
      .catch((error) => {
        console.log(error)
      })

    getAllJenisKendaraan()
      .then((data) => {
        setJenisKendaraan(data)
        console.log(data)
      })
      .catch((error) => {
        console.log("error mengambil data jenis kendaraan")
      })

    return () => {}
  }, [])

  useEffect(() => {
    console.log(dataTempatWisata)
  }, [dataTempatWisata])

  // functions
  const onChangePicture = (e) => {
    if (e.target.files[0] == undefined) {
      return
    }
    let imgObject = URL.createObjectURL(e.target.files[0])
    setImageArray((olditem) => [
      ...olditem,
      {
        name: e.target.files[0].name,
        url: imgObject,
        blob: e.target.files[0],
      },
    ])
  }

  const handleChangeJam = (e) => {
    const value = e.target.value
    if (value <= 23) {
      setTimeInputvalue((oldValue) => ({ ...oldValue, jam: value }))
    }
  }

  const handleChangeMenit = (e) => {
    const value = e.target.value
    if (value <= 59) {
      setTimeInputvalue((oldValue) => ({ ...oldValue, menit: value }))
    }
  }

  useEffect(() => {
    console.log(timeInputValue)
    if (timeInputValue.jam != "" && timeInputValue.menit != "") {
      const newVal = `${timeInputValue.jam}:${timeInputValue.menit}`
      console.log(newVal)
      setValue("jam_keberangkatan", newVal)
    }
  }, [timeInputValue])

  const submitForm = (data, e) => {
    console.log(data)
    console.log(inputRef.current)
    e.preventDefault()
    if (tujuanWisata.length == 0) {
      tujuanWisataRef.current.scrollIntoView()
      return
    }
    if (addedProduk.length == 0) {
      produkRef.current.scrollIntoView()
      return
    }
    Swal.fire({
      title: "Menyimpan data...",
    })
    Swal.showLoading()
    data["foto"] = imageArray
    data["tempat_wisata"] = tujuanWisata
    data["produk"] = addedProduk
    console.log(data)
    addPaketWisata(data)
      .then((success) => {
        if (success) {
          Swal.fire({
            title: "Sukses!",
            text: "Berhasil menambah data paket wisata",
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: "Baik",
            showCloseButton: true,
            showCancelButton: true,
          }).then(({ isConfirmed }) => {
            if (isConfirmed) {
              router.push(router.asPath + "/..")
            }
          })
        } else {
          Swal.fire({
            title: "Gagal!",
            text: "Gagal menambah data. Cek kembali inputan!",
            icon: "error",
          })
        }
      })
      .catch((error) => {
        console.log(error)
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menambah data. Cek kembali inputan!",
          icon: "error",
        })
      })
      .finally(() => Swal.hideLoading())
  }

  const deleteSelection = (idx) => {
    const temp = [...tujuanWisata]
    temp.splice(idx, 1)
    setTujuanWisata(temp)
  }

  const deleteSelectedProduk = (idx) => {
    const temp = [...addedProduk]
    temp.splice(idx, 1)
    setAddedProduk(temp)
  }

  function findKendaraan(idKendaraan) {
    const res = jenisKendaraan.find((o) => o.id == idKendaraan)
    return res
  }

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which
    const keyValue = String.fromCharCode(keyCode)
    const regex = /[0-9]/

    if (!regex.test(keyValue)) {
      event.preventDefault()
    }
  }

  const deleteImage = (index) => {
    const temp = [...imageArray]
    temp.splice(index, 1)
    setImageArray(temp)
  }

  return (
    <AdminLayout>
      <Head>
        <title>Tambah Paket Wisata</title>
      </Head>

      <div className="flex items-center gap-2 p-5 md:px-0 ">
        <Link href={"./"}>
          <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
        </Link>
        <h3 className="text-xl font-semibold text-gray-800">
          Tambah Paket Wisata
        </h3>
      </div>
      <div className="wrapper flex flex-col">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submitForm)}
            className="mb-5 rounded-xl bg-white md:p-4"
          >
            <h3 className="px-4 pt-3 text-lg font-semibold text-gray-800">
              Detail
            </h3>
            <div className="relative flex flex-wrap overflow-x-auto">
              <div id="kiri" className="w-full p-4 md:w-1/2 ">
                <div className="mb-2 block">
                  <Label
                    htmlFor="nama"
                    value="Nama Paket Wisata"
                    className="mb-2 inline-block font-semibold"
                  />
                  <TextInput
                    id="nama"
                    type="text"
                    sizing="md"
                    name="nama"
                    placeholder="Masukkan nama paket wisata"
                    {...register("nama", {
                      required: "Nama tidak boleh kosong",
                    })}
                  />
                  <FormInputError errorState={errors.nama} />
                </div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="deskripsi"
                    value="Deskripsi"
                    className="mb-2 inline-block font-semibold"
                  />

                  <Textarea
                    id="deskripsi"
                    placeholder="Masukkan deskripsi"
                    rows={4}
                    {...register("deskripsi", {
                      required: "Deskripsi tidak boleh kosong",
                    })}
                  />
                  <FormInputError errorState={errors.deskripsi} />
                </div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="fasilitas"
                    value="Fasilitas"
                    className="mb-2 inline-block font-semibold"
                  />

                  <Textarea
                    id="fasilitas"
                    placeholder="Masukkan fasilitas"
                    rows={4}
                    {...register("fasilitas", {
                      required: "Fasilitas tidak boleh kosong",
                    })}
                  />
                  <FormInputError errorState={errors.fasilitas} />
                </div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="waktu"
                    value="Waktu Perjalanan Wisata"
                    className="mb-2 inline-block font-semibold"
                  />
                  <div className="flex flex-col md:flex-row">
                    <div className="flex items-center pr-1 md:w-1/2">
                      <TextInput
                        id="waktu_hari"
                        type="number"
                        sizing="md"
                        onKeyPress={handleKeyPress}
                        name="waktu_malam"
                        {...register("waktu_perjalanan.hari", {
                          required:
                            "Waktu perjalanan (hari) tidak boleh kosong",
                          valueAsNumber: true,
                        })}
                      />
                      <div className="ml-2 shrink-0 text-sm ">hari</div>
                    </div>
                    <div className="mx-1 w-[0.125rem] grow self-stretch bg-gray-300"></div>
                    <div className="flex items-center pl-1 md:w-1/2">
                      <TextInput
                        id="waktu_malam"
                        type="number"
                        sizing="md"
                        onKeyPress={handleKeyPress}
                        name="waktu_malam"
                        {...register("waktu_perjalanan.malam", {
                          required:
                            "Waktu perjalanan (malam) tidak boleh kosong",
                          valueAsNumber: true,
                        })}
                      />
                      <div className="ml-2 shrink-0 text-sm">malam</div>
                    </div>
                  </div>
                  <FormInputError errorState={errors.waktu_perjalanan?.hari} />
                  <FormInputError errorState={errors.waktu_perjalanan?.malam} />
                </div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="jam_keberangkatan"
                    value="Jam Keberangkatan"
                    className="mb-2 inline-block font-semibold"
                  />
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                    id="jam_keberangkatan"
                    hidden={true}
                    {...register("jam_keberangkatan", {
                      required: "Jam keberangkatan tidak boleh kosong",
                    })}
                  />
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Jam"
                      value={timeInputValue.jam}
                      onChange={handleChangeJam}
                      className="w-1/2 rounded-l-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                    />
                    <input
                      type="text"
                      placeholder="Menit"
                      value={timeInputValue.menit}
                      onChange={handleChangeMenit}
                      className="w-1/2 rounded-r-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                    />
                  </div>
                  <FormInputError errorState={errors.jam_keberangkatan} />
                </div>
              </div>
              <div id="kanan" className="w-full p-4 md:w-1/2 ">
                <div className="mb-2 block">
                  <div className="mb-2 inline-block text-sm font-semibold text-gray-900 dark:text-gray-300">
                    Gambar
                  </div>
                  <ImageUpload>
                    {imageArray.map((item, index) => (
                      <ImageUploadItem
                        key={index}
                        onDeleteClicked={() => deleteImage(index)}
                      >
                        <img
                          src={item.url && item.url}
                          alt=""
                          className="h-full object-cover"
                        />
                      </ImageUploadItem>
                    ))}

                    <ImageUploadBox labelFor="uploadimgbtn">
                      <Icons.tambahGambar className="h-6 w-6 text-gray-700" />
                    </ImageUploadBox>
                    <input
                      type="file"
                      id="uploadimgbtn"
                      hidden={true}
                      onChange={onChangePicture}
                    />
                  </ImageUpload>
                </div>
              </div>
            </div>
            <button type="submit" className="hidden" id="submit-all">
              Simpan
            </button>
          </form>
        </FormProvider>

        {/* Kelola tujuan tempat wisata */}
        <div className="mb-5 rounded-xl bg-white md:p-4" ref={tujuanWisataRef}>
          <div className="mb-4 block">
            <div className="flex flex-row items-center">
              <h3 className="px-4 py-3 text-lg font-semibold text-gray-800">
                Tempat Wisata Tujuan
              </h3>
              <button
                type="button"
                onClick={() => setDialogTambahOpened(true)}
                className="mx-2 ml-auto flex w-fit items-center rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              >
                <Icons.tambah className="mr-1.5 h-4 w-4" />
                Pilih Tempat Wisata
              </button>
            </div>
            <div className="mt-2 flex flex-col gap-2 px-4">
              <div className="relative overflow-x-auto rounded-lg border bg-white">
                <table className="w-full text-left text-sm text-gray-800 dark:text-gray-400">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Gambar
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Nama
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Alamat
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Urutan
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tujuanWisata.length == 0 && (
                      <tr className=" bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                        <td className="px-4 py-4 text-center" colSpan={5}>
                          Tujuan Wisata Kosong
                        </td>
                      </tr>
                    )}
                    {tujuanWisata.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                      >
                        <td className="w-11">
                          <img
                            src={item.foto?.[0]}
                            alt={item.nama}
                            className="mx-auto my-2 h-12 w-12 rounded object-cover"
                          />
                        </td>
                        <td className="px-4 py-4">{item.nama}</td>

                        <td className="px-4 py-4">{item.kota}, {item.provinsi}</td>
                        <td className="px-4 py-4">
                          <div className="mr-2 w-fit rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Tujuan ke-{index + 1}
                          </div>
                        </td>
                        <td className="space-x-2 px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => deleteSelection(index)}
                            className="h-1 pr-4 text-red-500"
                          >
                            <Icons.sampah />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {tujuanWisata.length == 0 && (
            <p className="text-center text-sm text-red-600">
              Tujuan Wisata tidak boleh kosong
            </p>
          )}
        </div>

        {/* Kelola produk paket wisata */}
        <div className="mb-5 rounded-xl bg-white md:p-4" ref={produkRef}>
          <div className="mb-4 block">
            <div className="flex flex-row items-center">
              <h3 className="px-4 py-3 text-lg font-semibold text-gray-800">
                Produk Paket Wisata
              </h3>
              <button
                type="button"
                onClick={() => setIsModalTambahProdukOpen(true)}
                className="mx-2 ml-auto flex w-fit items-center rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              >
                <Icons.tambah className="mr-1.5 h-4 w-4" />
                Tambah Produk Paket Wisata
              </button>
            </div>
            <div className="mt-2 flex flex-col gap-2 px-4">
              <div className="relative overflow-x-auto rounded-lg border bg-white">
                <table className="w-full text-left text-sm text-gray-800 dark:text-gray-400">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        No.
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Jenis Kendaraan
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Harga
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Jumlah Seat
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {addedProduk.length == 0 && (
                      <tr className=" bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                        <td className="px-4 py-4 text-center" colSpan={5}>
                          Produk Kosong
                        </td>
                      </tr>
                    )}

                    {addedProduk.map((produk, index) => (
                      <tr key={`pw-${index}`}>
                        <td className="px-4 py-4">{index + 1}</td>
                        <td className="px-4 py-4">
                          {findKendaraan(produk.jenis_kendaraan_id)?.nama}
                        </td>
                        <td className="px-4 py-4">
                          {formatRupiah(produk.harga)}
                        </td>

                        <td className="px-4 py-4">
                          {
                            findKendaraan(produk.jenis_kendaraan_id)
                              ?.jumlah_seat
                          }{" "}
                          penumpang
                        </td>
                        <td className="">
                          <button
                            type="button"
                            onClick={() => deleteSelectedProduk(index)}
                            className="mr-4 rounded p-1.5 text-red-600 hover:bg-gray-200"
                          >
                            <Icons.sampah />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {addedProduk.length == 0 && (
            <p className="text-center text-sm text-red-600">
              Produk Paket Wisata tidak boleh kosong
            </p>
          )}
        </div>
        <label
          htmlFor="submit-all"
          className="mb-4 inline-flex items-center gap-x-1 self-end rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Simpan
        </label>
      </div>

      <ModalDestinasiWisata
        isModalOpened={dialogTambahOpened}
        setModalOpened={setDialogTambahOpened}
        allData={dataTempatWisata}
        selectedData={tujuanWisata}
        setSelectedData={setTujuanWisata}
      />

      {/* Modal tambah produk */}
      <ModalProdukPaketWisata
        isModalOpened={isModalTambahProdukOpen}
        setModalOpened={setIsModalTambahProdukOpen}
        jenisKendaraan={jenisKendaraan}
        setAddedProduk={setAddedProduk}
      />
    </AdminLayout>
  )
}

export default AddPaketWisataPage
