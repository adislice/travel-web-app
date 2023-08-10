import AdminLayout from "@/components/dashboard/Layout"
import { useRouter } from "next/router"
import { useNav } from "@/context/navigationContext"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Icons } from "@/components/Icons"
import { getDetailPaketWisata } from "@/services/PaketWisataService"
import Swal from "sweetalert2"
import { LinkButton } from "@/components/Button"
import nl2br from 'react-nl2br'
import { formatRupiah } from "@/lib/helper"

function PaketWisataShow() {
  const router = useRouter()
  const [navigation, setNavigation] = useNav()
  const { id } = router.query
  const [dataPaketWisata, setDataPaketWisata] = useState({})

  useEffect(() => {
    setNavigation([
      {
        title: "Paket Wisata",
        url: "/admin/tempatwisata",
      },
      {
        title: "Detail Paket Wisata",
        url: router.asPath,
      },
    ])

    getDetailPaketWisata(id).then((data) => {
      if (data.status == 1) {
        Swal.fire({
          title: "Kesalahan!",
          text: data.msg,
          icon: "error",
        }).then(({isConfirmed}) => {
          if (isConfirmed) {
            router.push("/admin/paketwisata")
          }
        })
      } else {
        console.log(data.data)
        setDataPaketWisata(data.data)
      }
    })

    return () => {}
  }, [])

  return (
    <AdminLayout>
      <Head>
        <title>Paket Wisata</title>
      </Head>
      <div className="flex items-center justify-between px-5 py-5 md:px-0">
        <div className="flex items-center gap-x-2">
          <Link href={"./../"}>
            <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
          </Link>
          <h3 className="text-xl font-semibold text-gray-800 md:text-xl">
            Detail Paket Wisata
          </h3>
        </div>
      </div>
      <div className="wrapper space-y-5">
        <section className="rounded-xl border bg-white" id="detail">
          <h3 className="p-6 text-lg font-bold">Detail</h3>
          <div className="flex flex-col md:flex-row">
            <div className="w-full px-6 md:w-1/2">
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">
                  Nama Paket Wisata
                </h5>
                <p className="text-gray-800">{dataPaketWisata.nama}</p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Deskripsi</h5>
                <p className="text-gray-800">{dataPaketWisata.deskripsi}</p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Fasilitas</h5>
                <p className="text-gray-800">{nl2br(dataPaketWisata.fasilitas) || "-"}</p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">
                  Waktu Perjalanan
                </h5>
                <p className="text-gray-800">
                  <ul>
                    <li>{dataPaketWisata.waktu_perjalanan?.hari} hari</li>
                    <li>{dataPaketWisata.waktu_perjalanan?.malam} malam</li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="w-full px-6 md:w-1/2">
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Foto</h5>
                <div
                  className="my-2 w-full gap-2 rounded-xl border p-4"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))",
                  }}
                >
                  {dataPaketWisata?.foto?.map((foto, index) => (
                    <div className="aspect-square w-full max-w-[8rem]" key={index}>
                      <img
                        src={foto}
                        alt={foto}
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
          </div>
        </section>

        {/* Section Destinasi Wisata */}
        <section className="rounded-xl border bg-white" id="destinasi">
          <h3 className="p-6 text-lg font-bold">Destinasi Tujuan Wisata</h3>
          <div className="mb-5 rounded-xl bg-white md:px-4">
            <div className="mb-4 block">
              <div className="mt-2 flex flex-col gap-2">
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
                      {dataPaketWisata?.destinasi_wisata_array?.length == 0 && (
                        <tr className=" bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                          <td className="px-4 py-4 text-center" colSpan={5}>
                            Tujuan Wisata Kosong
                          </td>
                        </tr>
                      )}
                      {dataPaketWisata?.destinasi_wisata_array?.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                        >
                          <td className="w-11">
                            <img
                              src={item.foto?.[0]}
                              alt={item.foto?.[0]}
                              className="mx-auto my-2 h-12 w-12 rounded object-cover"
                            />
                          </td>
                          <td className="px-4 py-4">
                            {/* <Href href={`${router.asPath}/${item.id}/show`} className="text-gray-900"> */}
                            {item.nama}
                            {/* </Href> */}
                          </td>

                          <td className="px-4 py-4">{item.kota}, {item.provinsi}</td>
                          {/* <td className="px-4 py-4">{item.latitude}, {item.longitude}</td> */}
                          <td className="px-4 py-4">
                            <div className="mr-2 w-fit rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Tujuan ke-{index + 1}
                            </div>
                          </td>
                          <td className="space-x-2 px-4 py-4 text-right">
                            <LinkButton href={`/admin/tempatwisata/${item.id}/show`}>
                              Lihat
                            </LinkButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Produk Paket Wisata */}
        <section className="rounded-xl border bg-white " id="destinasi">
          <h3 className="p-6 text-lg font-bold">Produk Paket Wisata</h3>
          <div className="mt-2 flex flex-col gap-2 px-4 mb-4">
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
                    {dataPaketWisata.produk?.length == 0 && (
                      <tr className=" bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                        <td className="px-4 py-4 text-center" colSpan={5}>
                          Produk Kosong
                        </td>
                      </tr>
                    )}

                    {dataPaketWisata.produk?.map((produk, index) => (
                      <tr key={`pw-${index}`}>
                        <td className="px-4 py-4">{index + 1}</td>
                        <td className="px-4 py-4">
                          {produk.jenis_kendaraan_data?.nama}
                        </td>
                        <td className="px-4 py-4">{formatRupiah(produk.harga)}</td>

                        <td className="px-4 py-4">
                          {produk.jenis_kendaraan_data?.jumlah_seat} seat
                        </td>
                        <td className="">
                          
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export default PaketWisataShow
