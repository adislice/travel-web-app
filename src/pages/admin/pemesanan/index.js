import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import Href from "@/components/Link"
import LoadingDataSpinner from "@/components/LoadingDataSpinner"
import { getAllTransaksiRealtime } from "@/services/TransaksiService"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

const TransaksiPage = () => {
  const [dataTransaksi, setDataTransaksi] = useState([])
  const [tempSearch, setTempSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    const unsubs = getAllTransaksiRealtime(
      dataTransaksi,
      setDataTransaksi,
      "",
      setLoading
    )

    return () => {
      console.log("unsubscribe get all transaksi")
      unsubs()
    }
  }, [])

  useEffect(() => {
    console.log(dataTransaksi)
  }, [dataTransaksi])

  const performSearch = () => {}
  const handleEnter = () => {}
  const handleAMonthChange = () => {}

  const pickerLang = {
    months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    from: "From",
    to: "To",
  }

  return (
    <AdminLayout>
      <Head>
        <title>Transaksi</title>
      </Head>
      <div className="flex items-center justify-between py-5 md:px-5">
        <h3 className="text-xl font-semibold text-gray-800 md:text-2xl">
          Transaksi
        </h3>

        {/* <div className="actionbutton space-x-2 flex flex-row">
          <Link
            href={'tempatwisata/add'}
            type="button"
            className="inline-flex items-center gap-x-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm py-2 px-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"

          >
            <Icons.tambah className='h-5 w-5' />
            Tambah
          </Link>

        </div> */}
      </div>
      <div className="wrapper md:px-5 ">
        <div className="rounded-xl border bg-white">
          <div className="flex justify-end">
            <div className="relative m-4 w-full lg:w-80">
              <input
                type="search"
                id="search-dropdown"
                className="z-20 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:border-l-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
                placeholder="Cari..."
                required=""
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={handleEnter}
              />
              <button
                type="button"
                onClick={performSearch}
                className="absolute top-0 right-0 rounded-r-lg border border-blue-600 bg-blue-600 p-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                      Kode Transaksi
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Nama Customer
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Paket Wisata
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Total Bayar
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataTransaksi.map((item, index) => (
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
                      <td className="px-4 py-4">
                        <Href
                          href={`${router.asPath}/${item.id}/show`}
                          className="text-gray-900"
                        >
                          {item.kode_transaksi}
                        </Href>
                      </td>
                      <td className="px-4 py-4">{item.user?.nama}</td>
                      <td className="px-4 py-4">
                        <div>{item.paket_wisata?.nama}</div>
                        <div>{`(${item.paket_wisata_produk?.nama})`}</div>
                      </td>
                      <td className="px-4 py-4">{item.total_bayar}</td>
                      <td className="px-4 py-4">{item.status}</td>
                      <td className="space-x-4 px-4 py-4 text-right">
                        <Link
                          href={`/admin/tempatwisata/${item.id}/edit`}
                          className="inline-block font-medium text-blue-600 hover:underline dark:text-blue-500"
                        >
                          <Icons.edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleHapus(item.id)}
                          className="text-red-600 hover:underline"
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

export default TransaksiPage
