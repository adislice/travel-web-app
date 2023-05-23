import AdminLayout from '@/components/dashboard/Layout'
import { Icons } from '@/components/Icons'
import ImageUpload from '@/components/ImageUpload'
import ImageUploadBox from '@/components/ImageUploadBox'
import ImageUploadItem from '@/components/ImageUploadItem'
import { Button, Label, Textarea, TextInput } from 'flowbite-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as Dialog from '@radix-ui/react-dialog';
import { getTempatWisata } from '@/services/TempatWisataService'
import Href from '@/components/Link'
import { addPaketWisata } from '@/services/PaketWisataService'
import Swal from 'sweetalert2'

const AddPaketWisataPage = () => {
  const [dataTempatWisata, setDataTempatWisata] = useState([])
  const [dialogTambahOpened, setDialogTambahOpened] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [imageArray, setImageArray] = useState([])
  const [tujuanWisata, setTujuanWisata] = useState([])
  const router = useRouter()
  const methods = useForm({ mode: 'onBlur' })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = methods


  // effects
  useEffect(() => {
    let result = getTempatWisata()
    result.then((data) => {
      const dataCheckbox = data.map((item) => {
        return { checked: false, ...item }
      })
      setDataTempatWisata(dataCheckbox)
    }).catch(error => {
      console.log(error)
    })

    return () => { }
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
    setImageArray(olditem => [...olditem, {
      name: e.target.files[0].name,
      url: imgObject,
      blob: e.target.files[0]
    }])
    console.log(e.target.files[0].name)
  };

  const submitForm = (data, e) => { 
    e.preventDefault()
    data['foto'] = imageArray
    data['tempat_wisata'] = tujuanWisata
    console.log(data)
    addPaketWisata(data).then((success) => {
      if (success) {
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
    }).catch((error) => {
      console.log(error)
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menambah data. Cek kembali inputan!",
        icon: 'error'
      })
    })
  }

  const saveSelection = () => {
    const selId = selectedId
    if (selId) {
      const selData = dataTempatWisata.find(item => item.id == selId)
      const dataNew = {
        nama: selData.nama,
        thumbnail_foto: selData.thumbnail_foto,
        tempat_wisata_id: selData.id,
        alamat: selData.alamat
      }
      setTujuanWisata(old => [...old, dataNew])
    }
    setSelectedId('')
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

  return (
    <AdminLayout>
      <Head>
        <title>Tambah Tempat Wisata</title>
      </Head>

      <div className='flex gap-2 items-center pb-5 '>
        <Link href={'./'}>
          <Icons.back className='h-6 w-6 rounded-full hover:bg-gray-200' />
        </Link>
        <h3 className='text-xl text-gray-800 font-semibold'>Tambah Paket Wisata</h3>

      </div>
      <div className="wrapper flex flex-col gap-5">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitForm)} className="md:p-4 border rounded-xl bg-white">
            <h3 className='pt-3 px-4 text-lg font-bold'>Detail</h3>
            <div className="relative overflow-x-auto flex flex-wrap">
              <div id='kiri' className='w-full md:w-1/2 p-4 '>
                <div className="mb-2 block">
                  <Label
                    htmlFor="nama"
                    value="Nama Paket Wisata"
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
              <div id="kanan" className='w-full md:w-1/2 p-4 '>

                <div className="mb-2 block">
                  <div className='text-sm font-medium text-gray-900 dark:text-gray-300 mb-2 inline-block'>Gambar</div>
                  <ImageUpload>
                    {imageArray.map((item, index) => (
                      <ImageUploadItem key={index} onDeleteClicked={() => deleteImage(index)}>
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
            <button
              type="submit"
              className="mx-4 mb-4 inline-flex items-center gap-x-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm py-2 px-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Simpan
            </button>

          </form>
        </FormProvider>

        <div className='md:p-4 border rounded-xl bg-white'>
          <div className="mb-4 block">
            <div className='flex flex-row items-center'>
            <h3 className='py-3 px-4 text-lg font-bold'>Tempat Wisata Tujuan</h3>
              <button
                type='button'
                onClick={() => setDialogTambahOpened(true)}
                className='ml-auto flex items-center w-fit px-2 py-1 text-sm mx-2 text-gray-900 focus:outline-none bg-white rounded border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
              >
                <Icons.tambah className='h-4 w-4 mr-1.5' />Pilih Tempat Wisata</button>
            </div>
            <div className='flex flex-col gap-2 mt-2'>
              <div className="relative overflow-x-auto border rounded-lg bg-white">

                <table className="w-full text-sm text-left text-gray-800 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                    {tujuanWisata.map((item, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className='w-11'>
                          <img src={item.thumbnail_image} alt={item.nama} className='mx-auto w-12 h-12 my-2 object-cover rounded' />
                        </td>
                        <td className="px-4 py-4">
                          {/* <Href href={`${router.asPath}/${item.id}/show`} className="text-gray-900"> */}
                            {item.nama}
                          {/* </Href> */}
                        </td>
                        
                        <td className="px-4 py-4">{item.alamat}</td>
                        {/* <td className="px-4 py-4">{item.latitude}, {item.longitude}</td> */}
                        <td className="px-4 py-4">
                          <div className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 w-fit">
                            Tujuan ke-{index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right space-x-2">
                          <button type='button' onClick={() => deleteSelection(index)} className='h-1 pr-4 text-red-500'><Icons.sampah /></button>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>

              </div>
              
            </div>
          </div>
        </div>
      </div>

      <Dialog.Root open={dialogTambahOpened} onOpenChange={setDialogTambahOpened} >
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-[99]" />
          <Dialog.Content className="z-[100] data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] min-h-[60vh] w-[90vw] max-w-[60vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px]  focus:outline-none flex flex-col ">
            <Dialog.Title className="text-mauve12 m-0 mb-4 text-[17px] font-medium">
              Tambah Tempat Wisata Tujuan
            </Dialog.Title>

            {/* <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              Pilih tempat wisata yang ingin ditambahkan, lalu klik Tambah.
            </Dialog.Description> */}
            <div className='border rounded p-4 flex-1 overflow-auto'>
              <div className='flex flex-col gap-2' onChange={onChangeRadio}>
                {dataTempatWisata.map((item, index) => (
                  <label key={`tw-${index}`} htmlFor={`tw-${item.id}`} className="flex flex-row items-center label-custom relative">
                    <input type="radio" name="pilih-tw" id={`tw-${item.id}`} value={item.id} className="right-4 absolute" />

                    <div className='flex gap-2 border-2 border-transparent w-full p-2 rounded-lg'>
                      <img src={item.thumbnail_foto} alt="" className='h-14 w-14 rounded' />
                      <div className="flex flex-col">
                        <div>{item.nama}</div>
                        <div className="text-sm text-gray-600">{item.alamat}</div>
                      </div>

                    </div>
                  </label>
                ))}

              </div>

            </div>
            <div className="mt-[25px] flex justify-end flex-grow-0 flex-shrink-0 basis-[auto]">

              <button
                onClick={saveSelection}
                type="button"
                className=" inline-flex items-center gap-x-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm py-2 px-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Tambah
              </button>

            </div>
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
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