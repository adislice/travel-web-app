import { LinkButton } from "@/components/Button"
import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import Href from "@/components/Link"
import LoadingDataSpinner from "@/components/LoadingDataSpinner"
import { useNav } from "@/context/navigationContext"
import { database } from "@/lib/firebase"
import { getAllPaketWisata } from "@/services/PaketWisataService"
import { getTempatWisata } from "@/services/TempatWisataService"
import { collection, getDocs } from "firebase/firestore"
import { initFlowbite } from "flowbite"
import { Button } from "flowbite-react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const PaketWisataPage = () => {
  const [loading, setLoading] = useState(false)
  const [datas, setDatas] = useState([])
  const [navigation, setNavigation] = useNav()
  const router = useRouter()

  useEffect(() => {
    setNavigation([
      {
        title: "Paket Wisata",
        url: "/admin/tempatwisata",
      },
    ])

    setLoading(true)
    let result = getAllPaketWisata()
      .then((data) => {
        setDatas(data)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    console.log(datas)
  }, [datas])

  return (
    <AdminLayout>
      <Head>
        <title>Paket Wisata</title>
      </Head>
      <div className="flex items-center justify-between px-5 py-5 md:px-0">
        <h3 className="text-xl font-semibold text-gray-800 md:text-2xl">
          Paket Wisata
        </h3>

        <div className="actionbutton flex flex-row space-x-2">
          <LinkButton href={"paketwisata/add"} type="button">
            <Icons.tambah className="h-5 w-5" />
            Tambah
          </LinkButton>
        </div>
      </div>
      <div className="wrapper  ">
        <div className="rounded-xl border bg-white">
          <div className="flex justify-end">
            <div className="relative m-4 w-full lg:w-80">
              <input
                type="search"
                id="search-dropdown"
                className="z-20 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:border-l-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
                placeholder="Cari..."
                required=""
                // value={tempSearch}
                // onChange={(e) => setTempSearch(e.target.value)}
                // onKeyDown={handleEnter}
              />
              <button
                type="button"
                // onClick={performSearch}
                className="absolute right-0 top-0 rounded-r-lg border border-blue-600 bg-blue-600 p-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Icons.cari className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
          <div className="relative overflow-x-auto">
            {loading ? (
              <LoadingDataSpinner />
            ) : (
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr className="border-b border-t">
                    <th scope="col" className="px-4 py-3">
                      No.
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Foto
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Nama
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Destinasi Wisata Tujuan
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Tanggal Dibuat
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {datas.length == 0 && (<tr><td colSpan={5} className="p-2 text-center">Data kosong!</td></tr>)}
                  {datas.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="w-3 whitespace-nowrap px-4 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        {index + 1}
                      </th>
                      <td className="w-11">
                        <img
                          src={item.foto[0] || '/placeholder-image.png'}
                          alt={item.nama}
                          className="mx-auto my-2 h-12 w-12 rounded object-cover"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <Href
                          href={`${router.asPath}/${item.id}/show`}
                          className="text-gray-900"
                        >
                          {item.nama}
                        </Href>
                      </td>
                      <td className="px-4 py-4">{item.tempat_wisata.length} tempat wisata</td>
                      <td className="px-4 py-4">
                        {item.created_at?.toDate().toDateString()}
                      </td>
                      <td className="flex px-4 py-4 text-right">
                        <Link
                          href={`/admin/tempatwisata/${item.id}/edit`}
                          className="inline-block rounded-l-lg border border-blue-700 p-2 font-medium bg-blue-600 text-white hover:bg-blue-500 hover:underline dark:text-blue-500"
                        >
                          <Icons.edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleHapus(item.id)}
                          className="rounded-r-lg border border-red-700 p-2 bg-red-600 text-white hover:bg-red-500 hover:underline"
                        >
                          <Icons.hapus className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default PaketWisataPage
