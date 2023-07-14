import { Button } from "@/components/Button"
import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import ImageUpload from "@/components/ImageUpload"
import ImageUploadBox from "@/components/ImageUploadBox"
import ImageUploadItem from "@/components/ImageUploadItem"
import {
  addTempatWisata,
  editTempatWisata,
  getDetailTempatWisata,
} from "@/services/TempatWisataService"
import { Label, Textarea, TextInput } from "flowbite-react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Swal from "sweetalert2"

const EditTempatWisataPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [imageArray, setImageArray] = useState([])
  const methods = useForm({ mode: "onBlur" })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods

  useEffect(() => {
    getDetailTempatWisata(id).then((data) => {
      setValue("nama", data.nama)
      setValue("alamat", data.alamat)
      setValue("latitude", data.latitude)
      setValue("longitude", data.longitude)
      setValue("deskripsi", data.deskripsi)
      let imgArr = []
      data?.foto?.map((foto) => {
        imgArr.push({
          name: "",
          url: foto,
          blob: foto,
        })
      })
      setImageArray(imgArr)
    })
  }, [])

  const deleteImage = (index) => {
    const temp = [...imageArray]
    temp.splice(index, 1)
    setImageArray(temp)
    console.log(imageArray)
  }

  const submitForm = (data, e) => {
    e.preventDefault()
    setIsSubmitSuccess(false)
    data["images"] = imageArray
    editTempatWisata(id, data).then((success) => {
      if (success) {
        setIsSubmitSuccess(true)
        Swal.fire({
          title: "Sukses!",
          text: "Berhasil mengubah data!",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "Baik",
          showCloseButton: true,
          showCancelButton: true,
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            router.push("/admin/tempatwisata")
          }
        })
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal mengubah data!",
          icon: "error",
        })
      }
    })
  }
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

  return (
    <AdminLayout>
      <Head>
        <title>Edit Tempat Wisata</title>
      </Head>
      <div className="flex items-center gap-2 p-5 md:px-0 ">
        <Link href={"./../"}>
          <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
        </Link>
        <h3 className="text-xl font-semibold text-gray-800">
          Edit Tempat Wisata
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
                <div className="mb-2 block">
                  <Label
                    htmlFor="alamat"
                    value="Alamat"
                    className="mb-2 inline-block"
                  />

                  <TextInput
                    id="alamat"
                    type="text"
                    sizing="md"
                    name="alamat"
                    {...register("alamat", { required: true })}
                  />
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
                      onChange={onChangePicture}
                    />
                  </ImageUpload>
                </div>
              </div>
            </div>
            <Button>
              Simpan
            </Button>
          </form>
        </FormProvider>
      </div>
    </AdminLayout>
  )
}

export default EditTempatWisataPage
