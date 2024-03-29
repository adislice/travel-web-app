import { Button } from "@/components/Button"
import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import Href from "@/components/Link"
import LoadingDataSpinner from "@/components/LoadingDataSpinner"
import { useNav } from "@/context/navigationContext"
import { PAGE_MAX_ITEM, StatusPemesanan } from "@/lib/constant"
import { database } from "@/lib/firebase"
import { formatRupiah, formatTimestamp } from "@/lib/helper"
import { getDetailPaketWisata, getNamaPaketWisata } from "@/services/PaketWisataService"
import { getAllPemesananRealtime } from "@/services/PemesananService"
import { collection, getCountFromServer } from "firebase/firestore"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Datepicker from "react-tailwindcss-datepicker"

const currentDate = new Date()
const firstDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
)
const lastDayOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0
)

const TransaksiPage = () => {
  const [dataTransaksi, setDataTransaksi] = useState([])
  const [dataPemesanan, setDataPemesanan] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingPw, setLoadingPw] = useState(true)
  const [pageNum, setPageNum] = useState(1)
  const [isFetchingNewData, setFetchingNewData] = useState(false)
  const [totalData, setTotalData] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [tempSearch, setTempSearch] = useState("")
  const [searching, setSearching] = useState(false)
  const [navigation, setNavigation] = useNav()
  const [filterStatus, setFilterStatus] = useState("SEMUA")
  const [triggerFilter, setTriggerFilter] = useState(false)


  const router = useRouter()

  useEffect(() => {
    const unsubscribe = getAllPemesananRealtime(
      (result) => {
        setDataPemesanan(result)
        setDataTransaksi(result)
      },
      null,
      null,
      filterStatus,
      pageNum,
      (isLoad) => {
        setLoading(isLoad)
        setSearching(isLoad)
        setFetchingNewData(isLoad)
      }
    )

    return () => {
      console.log("ubsubs pemesanan")
      unsubscribe()
    }
  }, [pageNum, triggerFilter])

  const loadMore = () => {
    setFetchingNewData(true)
    setPageNum((oldPageNum) => oldPageNum + 1)
  }

  useEffect(() => {
    setNavigation([
      {
        title: "Pemesanan Paket Wisata",
        url: "/admin/pemesanan",
      },
    ])

    const fetchCount = async () => {
      try {
        const countSnap = await getCountFromServer(
          collection(database, "pemesanan")
        )
        setTotalData(countSnap.data().count)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCount()
    const intervalId = setInterval(fetchCount, 5000)
    return () => clearInterval(intervalId)
  }, [])


  useEffect(() => {
    var tempData = dataTransaksi
    const getDataPw = async () => {
      setLoadingPw(true)
      let newArr = []
      for (let i = 0; i < tempData.length; i++) {
        let item = tempData[i]
        var idPw = item.paket_wisata_id
        let res = await getNamaPaketWisata(idPw)
        item['paket_wisata_nama'] = res?.data?.nama 
        newArr.push(item)
        console.log("tempDatanew: ", tempData)
      }
      setDataPemesanan(newArr)
      setLoadingPw(false)
    }
    getDataPw()
  }, [dataTransaksi])



  return (
    <AdminLayout>
      <Head>
        <title>Pemesanan Paket Wisata</title>
      </Head>
      <div className="flex items-center justify-between px-5 py-5 md:px-0">
        <h3 className="text-xl font-semibold text-gray-800 md:text-2xl">
          Kelola Pemesanan Paket Wisata
        </h3>
      </div>
      <div className="wrapper">
        <div className="rounded-xl border bg-white">
          <div className="flex items-center justify-end gap-2 p-4">
            <Button
              id="filterStatusDropdown"
              data-dropdown-toggle="dropdown"
              className="border border-gray-300 bg-white font-normal text-gray-800 hover:bg-gray-200"
              type="button"
            >
              <Icons.filter className="mr-1 h-4 w-4" />
              Status: {filterStatus}
              <Icons.chevronDown className="h-4 w-4" />
            </Button>
            {/* Dropdown menu */}
            <div
              id="dropdown"
              className="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="filterStatusDropdown"
              >
                <li key={"status-semua"}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setFilterStatus("SEMUA")
                      setTriggerFilter((oldState) => !oldState)
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Semua
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setFilterStatus(StatusPemesanan.SELESAI)
                      setTriggerFilter((oldState) => !oldState)
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Selesai
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setFilterStatus(StatusPemesanan.DIPROSES)
                      setTriggerFilter((oldState) => !oldState)
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Diproses
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setFilterStatus(StatusPemesanan.PENDING)
                      setTriggerFilter((oldState) => !oldState)
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Pending
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setFilterStatus(StatusPemesanan.DIBATALKAN)
                      setTriggerFilter((oldState) => !oldState)
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dibatalkan
                  </a>
                </li>
              </ul>
            </div>

            
            <Button onClick={() => setTriggerFilter((oldState) => !oldState)}>
              Tampilkan
            </Button>
          </div>
          <div className="relative overflow-x-auto">
            {loading ? (
              <LoadingDataSpinner />
            ) : (
              <table className="w-full text-left text-sm text-gray-700 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr className="border-b border-t">
                    <th scope="col" className="px-4 py-3">
                      No.
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Kode Pemesanan
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Nama Pemesan
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Tanggal
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
                  {dataPemesanan?.length == 0 && (
                    <tr>
                      <td colSpan={7} className="p-2 text-center border-b">
                        Data kosong!
                      </td>
                    </tr>
                  )}
                  {dataPemesanan?.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="w-3 whitespace-nowrap px-3 py-2 font-medium text-gray-900 dark:text-white"
                      >
                        {index + 1}
                      </th>
                      <td className="px-3 py-2">
                        <Href
                          href={`${router.asPath}/${item.id}/show`}
                          className="text-gray-900"
                        >
                          {item.kode_pemesanan}
                        </Href>
                      </td>
                      <td className="px-3 py-2">{item.user_nama}</td>
                      <td className="px-3 py-2">{formatTimestamp(item.created_at)}</td>
                      <td className="px-3 py-2">
                      {loadingPw ? "loading..." : item.paket_wisata_nama }

                      </td>
                      
                      <td className="px-3 py-2">
                        {formatRupiah(item.total_bayar)}
                      </td>
                      <td className="px-3 py-2">
                        {item.status == StatusPemesanan.SELESAI && (
                          <span className="mr-2 rounded bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            SELESAI
                          </span>
                        )}
                        {item.status == StatusPemesanan.PENDING && (
                          <span className="mr-2 rounded bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            PENDING
                          </span>
                        )}
                        {item.status == StatusPemesanan.DIPROSES && (
                          <span className="mr-2 rounded bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            PENDING
                          </span>
                        )}
                        {item.status == StatusPemesanan.DIBATALKAN && (
                          <span className="mr-2 rounded bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                            DIBATALKAN
                          </span>
                        )}
                      </td>
                      <td className="flex px-3 py-2 text-right">
                        <button
                          // onClick={() => handleHapus(item.id)}
                          className="invisible rounded-r-lg border border-red-700 bg-red-600 p-2 text-white hover:bg-red-500 hover:underline"
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
          <div className="flex flex-row items-center">
            <div className="m-2 px-3 text-sm font-semibold text-gray-600">
              Menampilkan {dataPemesanan?.length} dari {totalData} data
            </div>
            <Button
              className="m-2 ml-auto border border-gray-300 bg-white text-blue-600 hover:bg-gray-200"
              onClick={loadMore}
              disabled={isFetchingNewData}
            >
              Tampilkan +{PAGE_MAX_ITEM} Data
              {isFetchingNewData ? (
                <Icons.loading className="h-5 w-5 animate-spin" />
              ) : (
                <Icons.arrowDown className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default TransaksiPage
