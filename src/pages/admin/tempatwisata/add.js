import AdminLayout from '@/components/dashboard/Layout'
import { Icons } from '@/components/Icons'
import ImageUpload from '@/components/ImageUpload'
import ImageUploadBox from '@/components/ImageUploadBox'
import ImageUploadItem from '@/components/ImageUploadItem'
import { addTempatWisata } from '@/services/tempat-wisata-service'
import { Button, Label, Textarea, TextInput } from 'flowbite-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

const AddTempatWisataPage = () => {
  const methods = useForm({ mode: 'onBlur' })
  const router = useRouter()
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [picture, setPicture] = useState(null);
  const [imageArray, setImageArray] = useState([])
  const [progresspercent, setProgresspercent] = useState(0);

  const onChangePicture = (e) => {
    let imgObject = URL.createObjectURL(e.target.files[0])
    setImageArray(olditem => [{
      name: e.target.files[0].name,
      url: imgObject,
      blob: e.target.files[0]
    }, ...olditem])
    console.log(e.target.files[0].name)
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = methods

  useEffect(() => {
    if (isSubmitSuccess) {
      reset()
    }
  }, [isSubmitSuccess])

  async function submitForm(data, e) {
    e.preventDefault()
    setIsSubmitSuccess(false)
    data['images'] = imageArray
    const result = addTempatWisata(data)
    result.then(success => {
      if (success) {
        setIsSubmitSuccess(true)
        Swal.fire({
          title: "Sukses!",
          text: "Berhasil menambah data tempat wisata",
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: "Baik",
          showCloseButton: true,
          showCancelButton: true
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            router.push(router.asPath + '/..')
          }
        })
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menambah data. Cek kembali inputan!",
          icon: 'error'
        })
      }
    })
      .catch(error => {

      })
  }

  return (
    <AdminLayout>
      <Head>
        <title>Tambah Tempat Wisata</title>
      </Head>
      <div className='flex gap-2 items-center p-5 '>
        <Link href={'./'}>
          <Icons.back className='h-6 w-6 rounded-full hover:bg-gray-200' />
        </Link>
        <h3 className='text-xl text-gray-800 font-semibold'>Tambah Tempat Wisata</h3>

      </div>
      <div className="wrapper px-5">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitForm)} >
            <div className="relative overflow-x-auto border rounded-xl flex flex-wrap bg-white">

              <div id='kiri' className='md:w-1/2 p-4 '>
                <div className="mb-2 block">
                  <Label
                    htmlFor="nama"
                    value="Nama Tempat Wisata"
                    className='mb-2 inline-block'
                  />

                  <TextInput
                    id="nama"
                    type="text"
                    sizing="md"
                    name='nama'
                    {...register("nama", { required: true })}
                  />
                </div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="alamat"
                    value="Alamat"
                    className='mb-2 inline-block'
                  />

                  <TextInput
                    id="alamat"
                    type="text"
                    sizing="md"
                    name='alamat'
                    {...register("alamat", { required: true })}
                  />
                </div>
                <div className='flex gap-2'>
                  <div className="mb-2 block w-1/2">
                    <Label
                      htmlFor="latitude"
                      value="Latitude"
                      className='mb-2 inline-block'
                    />

                    <TextInput
                      id="latitude"
                      type="text"
                      sizing="md"
                      name='latitude'
                      {...register("latitude", { required: true })}
                    />
                  </div>
                  <div className="mb-2 block w-1/2">
                    <Label
                      htmlFor="longitude"
                      value="Longitude"
                      className='mb-2 inline-block'
                    />

                    <TextInput
                      id="longitude"
                      type="text"
                      sizing="md"
                      name='longitude'
                      {...register("longitude", { required: true })}
                    />
                  </div>
                </div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="deskripsi"
                    value="Deskripsi"
                    className='mb-2 inline-block'
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
              <div id="kanan" className='md:w-1/2 p-4 '>
                <div className="mb-2 block">
                  <div className='text-sm font-medium text-gray-900 dark:text-gray-300 mb-2 inline-block'>Gambar</div>
                  <ImageUpload>
                    {imageArray.map((item, index) => (
                      <ImageUploadItem key={index}>
                        <img src={item.url && item.url} alt="" className='h-full object-cover' />
                      </ImageUploadItem>
                    ))}

                    <ImageUploadBox labelFor='uploadimgbtn'>
                      <Icons.tambahGambar className="h-6 w-6 text-gray-700" />
                    </ImageUploadBox>
                    <input
                      type="file"
                      id='uploadimgbtn'
                      hidden={true}
                      
                      onChange={onChangePicture}
                    />
                  </ImageUpload>
                </div>
              </div>

            </div>
            <Button color="dark" type='submit' className='rounded-md mt-4' size="sm">Submit</Button>
          </form>
        </FormProvider>
      </div>
    </AdminLayout>
  )
}

export default AddTempatWisataPage