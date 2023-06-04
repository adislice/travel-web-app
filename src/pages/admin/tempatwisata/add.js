import { Button } from "@/components/Button"
import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import ImageUpload from "@/components/ImageUpload"
import ImageUploadBox from "@/components/ImageUploadBox"
import ImageUploadItem from "@/components/ImageUploadItem"
import { useNav } from "@/context/navigationContext"
import { addTempatWisata } from "@/services/TempatWisataService"
import { Label, Textarea, TextInput } from "flowbite-react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Swal from "sweetalert2"

const AddTempatWisataPage = () => {
  const methods = useForm({ mode: "onBlur" })
  const router = useRouter()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [imageArray, setImageArray] = useState([])
  const [navigation, setNavigation] = useNav()

  useEffect(() => {
    setNavigation([
      {
        title: "Tempat Wisata",
        url: "/admin/tempatwisata",
      },
      {
        title: "Tambah Tempat Wisata",
        url: "/admin/tempatwisata/add",
      },
    ])
  }, [])

  const onChangePicture = (e) => {
    // if (e.target.files[0] == undefined) {
    //   return
    // }
    // let imgObject = URL.createObjectURL(e.target.files[0])
    // setImageArray(olditem => [...olditem, {
    //   name: e.target.files[0].name,
    //   url: imgObject,
    //   blob: e.target.files[0]
    // }])
    // console.log(e.target.files[0].name)
    const inputArray = e.target.files
    Array.from(inputArray).forEach((file) => {
      let imgObject = URL.createObjectURL(file)
      setImageArray((olditem) => [
        ...olditem,
        {
          name: file.name,
          url: imgObject,
          blob: file,
        },
      ])
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods

  useEffect(() => {
    if (isSubmitSuccess) {
      reset()
    }
  }, [isSubmitSuccess])

  async function submitForm(data, e) {
    e.preventDefault()
    setIsSubmitSuccess(false)
    data["images"] = imageArray
    const result = addTempatWisata(data)
    result
      .then((success) => {
        if (success) {
          setIsSubmitSuccess(true)
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
      .catch((error) => {})
  }

  const deleteImage = (index) => {
    const temp = [...imageArray]
    temp.splice(index, 1)
    setImageArray(temp)
    console.log(imageArray)
  }

  const check = () => {
    console.log("a")
  }

  return (
    <AdminLayout>
      <Head>
        <title>Tambah Tempat Wisata</title>
      </Head>
      <div className="flex items-center gap-2 p-5 md:px-0 ">
        <Link href={"./"}>
          <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
        </Link>
        <h3 className="text-xl font-semibold text-gray-800">
          Tambah Tempat Wisata
        </h3>
      </div>
      <div className="wrapper">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submitForm)}
            className="rounded-xl border bg-white md:p-4"
          >
            <div className="relative flex flex-wrap overflow-x-auto">
              <div id="kiri" className="p-4 md:w-1/2 ">
                <div className="mb-2 block">
                  <Label
                    htmlFor="nama"
                    value="Nama Tempat Wisata"
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
                <div className="flex gap-2">
                  <div className="mb-2 block w-1/2">
                    <Label
                      htmlFor="provinsi"
                      value="Provinsi"
                      className="mb-2 inline-block"
                    />

                    <TextInput
                      id="provinsi"
                      type="text"
                      sizing="md"
                      name="provinsi"
                      {...register("provinsi", { required: true })}
                    />
                  </div>
                  <div className="mb-2 block w-1/2">
                    <Label
                      htmlFor="kota"
                      value="Kota/Kab"
                      className="mb-2 inline-block"
                    />

                    <TextInput
                      id="kota"
                      type="text"
                      sizing="md"
                      name="kota"
                      {...register("kota", { required: true })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="mb-2 block w-1/2">
                    <Label
                      htmlFor="latitude"
                      value="Latitude"
                      className="mb-2 inline-block"
                    />

                    <TextInput
                      id="latitude"
                      type="text"
                      sizing="md"
                      name="latitude"
                      {...register("latitude", { required: true })}
                    />
                  </div>
                  <div className="mb-2 block w-1/2">
                    <Label
                      htmlFor="longitude"
                      value="Longitude"
                      className="mb-2 inline-block"
                    />

                    <TextInput
                      id="longitude"
                      type="text"
                      sizing="md"
                      name="longitude"
                      {...register("longitude", { required: true })}
                    />
                  </div>
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
              <div id="kanan" className="p-4 md:w-1/2 ">
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
                      multiple={true}
                      accept="image/*"
                      onChange={onChangePicture}
                    />
                  </ImageUpload>
                </div>
              </div>
            </div>
            <Button type="submit">Simpan</Button>
          </form>
        </FormProvider>
      </div>
    </AdminLayout>
  )
}

export default AddTempatWisataPage
