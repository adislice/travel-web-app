import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import ImageUpload from "@/components/ImageUpload"
import ImageUploadBox from "@/components/ImageUploadBox"
import ImageUploadItem from "@/components/ImageUploadItem"
import { Button, Label, Textarea, TextInput } from "flowbite-react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as Dialog from "@radix-ui/react-dialog"
import { getTempatWisata } from "@/services/TempatWisataService"
import Href from "@/components/Link"
import { addPaketWisata } from "@/services/PaketWisataService"
import Swal from "sweetalert2"

const AddPaketWisataPage = () => {
  const [dataTempatWisata, setDataTempatWisata] = useState([])
  const [dialogTambahOpened, setDialogTambahOpened] = useState(false)
  const [selectedId, setSelectedId] = useState("")
  const [imageArray, setImageArray] = useState([])
  const [tujuanWisata, setTujuanWisata] = useState([])
  const router = useRouter()
  const methods = useForm({ mode: "onBlur" })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods

  // effects
  useEffect(() => {
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
    console.log(e.target.files[0].name)
  }

  const submitForm = (data, e) => {
    e.preventDefault()
    data["foto"] = imageArray
    data["tempat_wisata"] = tujuanWisata
    console.log(data)
    addPaketWisata(data)
      .then((success) => {
        if (success) {
          Swal.fire({
            title: "Sukses!",
            text: "Berhasil menambah data tempat wisata",
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
  }

  const saveSelection = () => {
    const selId = selectedId
    if (selId) {
      const selData = dataTempatWisata.find((item) => item.id == selId)
      const dataNew = {
        nama: selData.nama,
        thumbnail_foto: selData.thumbnail_foto,
        tempat_wisata_id: selData.id,
        alamat: selData.alamat,
      }
      setTujuanWisata((old) => [...old, dataNew])
    }
    setSelectedId("")
    setDialogTambahOpened(false)
  }

  const deleteSelection = (idx) => {
    const temp = [...tujuanWisata]
    temp.splice(idx, 1)
    setTujuanWisata(temp)
  }

  function onChangeRadio(event) {
    setSelectedId(event.target.value)
  }

  function handleCheckbox(e, id) {
    if (e.target.checked) {
      const check = tujuanWisata.find((item) => item.id == id)
      if (check) {
        return
      }
      const selData = dataTempatWisata.find((item) => item.id == id)
      const dataNew = {
        id: id,
        nama: selData.nama,
        thumbnail_foto: selData.thumbnail_foto,
        tempat_wisata_id: selData.id,
        alamat: selData.alamat,
      }
      setTujuanWisata((old) => [...old, dataNew])
    } else {
      console.log("unchecked " + id)
      setTujuanWisata((value) => value.filter((it) => it.id !== id))
    }
  }

  function findUrutan(id) {
    const check = tujuanWisata.find((it) => it.id == id)
    if (check) {
      const idx = tujuanWisata.findIndex((x) => x.id == id)
      return idx + 1
    }
    return
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
      <div className="wrapper">
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
                    className="mb-2 inline-block"
                  />

                  <TextInput
                    id="nama"
                    type="text"
                    sizing="md"
                    name="nama"
                    {...register("nama", { required: true })}
                  />
                </div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="deskripsi"
                    value="Deskripsi"
                    className="mb-2 inline-block"
                  />

                  <Textarea
                    id="deskripsi"
                    placeholder=""
                    required={true}
                    rows={4}
                    {...register("deskripsi", { required: true })}
                  />
                </div>
              </div>
              <div id="kanan" className="w-full p-4 md:w-1/2 ">
                <div className="mb-2 block">
                  <div className="mb-2 inline-block text-sm font-medium text-gray-900 dark:text-gray-300">
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
            <button
              type="submit"
              className="mx-4 mb-4 inline-flex items-center gap-x-1 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Simpan
            </button>
          </form>
        </FormProvider>

        {/* Kelola tujuan tempat wisata */}
        <div className="mb-5 rounded-xl bg-white md:p-4">
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
                      {/* <th scope="col" className="px-4 py-3">
                        Koordinat
                      </th> */}
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
                            src={item.thumbnail_foto}
                            alt={item.nama}
                            className="mx-auto my-2 h-12 w-12 rounded object-cover"
                          />
                        </td>
                        <td className="px-4 py-4">
                          {/* <Href href={`${router.asPath}/${item.id}/show`} className="text-gray-900"> */}
                          {item.nama}
                          {/* </Href> */}
                        </td>

                        <td className="px-4 py-4">{item.alamat}</td>
                        {/* <td className="px-4 py-4">{item.latitude}, {item.longitude}</td> */}
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
        </div>

        {/* Kelola produk paket wisata */}
        <div className="mb-5 rounded-xl bg-white md:p-4">
          <div className="mb-4 block">
            <div className="flex flex-row items-center">
              <h3 className="px-4 py-3 text-lg font-semibold text-gray-800">
                Produk Paket Wisata
              </h3>
              <button
                type="button"
                onClick={() => setDialogTambahOpened(true)}
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
                        Nama Produk
                      </th>

                      <th scope="col" className="px-4 py-3">
                        Harga
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Jenis Kendaraan/Armada
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Kapasitas Penumpang
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <td className="px-4 py-4">1</td>
                    <td className="px-4 py-4">Paket Keluarga</td>
                    <td className="px-4 py-4">Rp. 850.000</td>
                    <td className="px-4 py-4">Mobil Minibus</td>
                    <td className="px-4 py-4">Min: 1, Max: 5</td>
                    <td className="px-4 py-4">Edit</td>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog.Root
        open={dialogTambahOpened}
        onOpenChange={setDialogTambahOpened}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-[99] bg-black/60" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-[100] flex max-h-[85vh] min-h-[60vh] w-[90vw] max-w-[60vw] translate-x-[-50%] translate-y-[-50%] flex-col rounded-[6px]  bg-white p-[25px] focus:outline-none ">
            <Dialog.Title className="text-mauve12 m-0 mb-4 text-[17px] font-medium">
              Tambah Tempat Wisata Tujuan
            </Dialog.Title>

            {/* <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              Pilih tempat wisata yang ingin ditambahkan, lalu klik Tambah.
            </Dialog.Description> */}
            <div className="flex-1 overflow-auto rounded border p-4">
              <div className="grid grid-cols-2 gap-2" onChange={onChangeRadio}>
                {dataTempatWisata.map((item, index) => (
                  <label
                    key={`tw-${index}`}
                    htmlFor={`tw-${item.id}`}
                    className="label-custom relative flex flex-row items-center"
                  >
                    <input
                      type="checkbox"
                      name="pilih-tw"
                      id={`tw-${item.id}`}
                      value={item.id}
                      className="absolute right-4"
                      checked={
                        tujuanWisata.find((it) => it.id == item.id)
                          ? true
                          : false
                      }
                      onChange={(e) => handleCheckbox(e, item.id)}
                    />

                    <div className="flex w-full gap-2 rounded-lg border-2 border-transparent p-2">
                      <div className="relative">
                        <img
                          src={item.thumbnail_foto}
                          alt=""
                          className="h-14 w-14 rounded"
                        />
                        {tujuanWisata.find((it) => it.id == item.id) ? (
                          <div className="absolute left-[50%] top-[50%] flex h-6 w-6 translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-full bg-white text-sm font-semibold text-blue-700 shadow-lg">
                            {findUrutan(item.id)}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-col">
                        <div>{item.nama}</div>
                        <div className="text-sm text-gray-600">
                          {item.alamat}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-[25px] flex flex-shrink-0 flex-grow-0 basis-[auto] justify-end">
              <button
                onClick={() => setDialogTambahOpened(false)}
                type="button"
                className=" inline-flex items-center gap-x-1 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Simpan
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-violet11 focus:shadow-violet7 hover:bg-violet4 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Icons.close />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </AdminLayout>
  )
}

export default AddPaketWisataPage
