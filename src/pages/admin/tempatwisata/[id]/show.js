import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import { useNav } from "@/context/navigationContext"
import { getDetailTempatWisata } from "@/services/TempatWisataService"
// import FsLightbox from 'fslightbox-react'
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

const TempatWisataShowPage = () => {
  const [tempatWisata, setTempatWisata] = useState({})
  const [imageIndex, setImageIndex] = useState(0)
  const [navigation, setNavigation] = useNav()
  const router = useRouter()
  const { id } = router.query
  const [toggler, setToggler] = useState(false)
  const [imgSources, setImgSources] = useState([])

  useEffect(() => {
    setNavigation([
      {
        title: "Tempat Wisata",
        url: "/admin/tempatwisata",
      },
      {
        title: "Detail Tempat Wisata",
        url: router.asPath,
      },
    ])

    getDetailTempatWisata(id).then((data) => {
      setTempatWisata(data)
      let arr = []
      data.foto.map((item) => {
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
      <div className="flex items-center gap-2 px-5 py-5 ">
        <Link href={"./../"}>
          <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
        </Link>
        <h3 className="text-xl font-semibold text-gray-800">
          Detail Tempat Wisata
        </h3>
      </div>
      <div className="wrapper md:px-5">
        <div className="rounded-xl bg-white ">
          <div className="flex flex-col gap-8 p-8 sm:flex-row">
            <div className="flex-shrink flex-grow basis-1 space-y-6">
              <div>
                <div className="mb-1 font-bold">Nama</div>
                <div className="text-gray-700">{tempatWisata.nama}</div>
              </div>
              <div>
                <div className="mb-1 font-bold">Deskripsi</div>
                <div className="text-gray-700">{tempatWisata.deskripsi}</div>
              </div>
            </div>
            <div className="flex-shrink flex-grow basis-1 space-y-6">
              <div>
                <div className="mb-1 font-bold">Alamat</div>
                <div className="text-gray-700">{tempatWisata.alamat}</div>
              </div>
              <div>
                <div className="mb-1 font-bold">Lokasi Koordinat</div>
                <div className="text-gray-700">
                  <p>Latitude: {tempatWisata.latitude}</p>
                  <p>Longitude: {tempatWisata.longitude}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="mb-1 px-8 font-bold">Foto</div>
            <div className="flex px-8 pb-8">
              <div className="flex w-full flex-wrap gap-2 rounded-xl border p-4">
                {tempatWisata?.foto?.map((foto, index) => (
                  <div className="aspect-video w-72" key={index}>
                    <img
                      src={foto.url}
                      alt={foto.nama}
                      className="h-full w-full rounded-lg object-cover"
                      onClick={() => {
                        setImageIndex(index)
                        setToggler(!toggler)
                      }}
                    />
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
