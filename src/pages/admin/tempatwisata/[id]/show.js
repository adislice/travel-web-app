import AdminLayout from '@/components/dashboard/Layout'
import { Icons } from '@/components/Icons'
import { useNav } from '@/context/navigationContext'
import { getDetailTempatWisata } from '@/services/TempatWisataService'
// import FsLightbox from 'fslightbox-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const TempatWisataShowPage = () => {
  const [tempatWisata, setTempatWisata] = useState({})
  const [imageIndex, setImageIndex] = useState(0)
  const [navigation, setNavigation] = useNav()
  const router = useRouter()
  const { id } = router.query
  const [toggler, setToggler] = useState(false);
  const [imgSources, setImgSources] = useState([])

  useEffect(() => {
    setNavigation([
      {
        title: "Tempat Wisata",
        url: "/admin/tempatwisata"
      },
      {
        title: "Detail Tempat Wisata",
        url: router.asPath
      }
    ])

    getDetailTempatWisata(id)
      .then(data => {
        setTempatWisata(data)
        let arr = []
        data.foto.map(item => {
          arr.push(item.url)
        })
        setImgSources(arr)
      })
  }, [])


  return (
    <AdminLayout>
      <Head>
        <title>Detail Tempat Wisata</title>
      </Head>
      <div className='flex gap-2 items-center px-5 py-5 '>
        <Link href={'./../'}>
          <Icons.back className='h-6 w-6 rounded-full hover:bg-gray-200' />
        </Link>
        <h3 className='text-xl text-gray-800 font-semibold'>Detail Tempat Wisata</h3>

      </div>
      <div className="wrapper md:px-5">
        <div className="rounded-xl bg-white ">
          <div className='flex p-8 gap-8 flex-col sm:flex-row'>
            <div className='flex-grow flex-shrink basis-1 space-y-6'>
              <div>
                <div className='font-bold mb-1'>
                  Nama
                </div>
                <div className='text-gray-700'>
                  {tempatWisata.nama}
                </div>
              </div>
              <div>
                <div className='font-bold mb-1'>
                  Deskripsi
                </div>
                <div className='text-gray-700'>
                  {tempatWisata.deskripsi}
                </div>
              </div>
            </div>
            <div className='flex-grow flex-shrink basis-1 space-y-6'>
              <div>
                <div className='font-bold mb-1'>
                  Alamat
                </div>
                <div className='text-gray-700'>
                  {tempatWisata.alamat}
                </div>
              </div>
              <div>
                <div className='font-bold mb-1'>
                  Lokasi Koordinat
                </div>
                <div className='text-gray-700'>
                  <p>Latitude: {tempatWisata.latitude}</p>
                  <p>Longitude: {tempatWisata.longitude}</p>
                </div>
              </div>
            </div>
          </div>
          <div className=''>
            <div className='font-bold mb-1 px-8'>
              Foto
            </div>
            <div className='flex pb-8 px-8'>
              <div className='flex flex-wrap gap-2 border rounded-xl p-4 w-full'>
                {tempatWisata?.foto?.map((foto, index) => (
                  <div className='w-72 aspect-video' key={index}>
                    <img src={foto.url} alt={foto.nama} className="w-full h-full rounded-lg object-cover" onClick={() => {setImageIndex(index);setToggler(!toggler)}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* <FsLightbox
				toggler={toggler}
				sources={imgSources}
        sourceIndex={imageIndex}
			/> */}
        </div>
      </div>
    </AdminLayout>
  )
}

export default TempatWisataShowPage