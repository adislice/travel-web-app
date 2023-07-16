import { Button, LinkButton } from "@/components/Button"
import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import Href from "@/components/Link"
import LoadingDataSpinner from "@/components/LoadingDataSpinner"
import { NavigationContext } from "@/context/navigationContext"
import { PAGE_MAX_ITEM } from "@/lib/constant"
import { database } from "@/lib/firebase"
import {
  cekPaketWisataExist,
  deleteTempatWisata,
  getTempatWisata,
  getTempatWisataRealtime,
} from "@/services/TempatWisataService"
import { collection, getCountFromServer, getDocs } from "firebase/firestore"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"

const TempatWisataPage = () => {
  const [loading, setLoading] = useState(true)
  const [datas, setDatas] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [tempSearch, setTempSearch] = useState("")
  const [navigation, setNavigation] = useContext(NavigationContext)
  const [pageNum, setPageNum] = useState(1)
  const [isFetchingNewData, setFetchingNewData] = useState(false)
  const [totalData, setTotalData] = useState(0)
  const [searching, setSearching] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setNavigation([
      {
        title: "Tempat Wisata",
        url: "/admin/tempatwisata",
      },
    ])

    console.log(searchQuery)
    setLoading(true)
    const replace = searchQuery == "" ? false : true
    const unsubscribe = getTempatWisataRealtime(
      datas,
      setDatas,
      searchQuery,
      pageNum,
      setFetchingNewData,
      (load) => {
        setLoading(load)
        setSearching(load)
      }
    )

    return () => {
      console.log("unsubscribe tempat wisata")
      unsubscribe()
    }
  }, [searchQuery, pageNum])

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const countSnap = await getCountFromServer(
          collection(database, "tempat_wisata")
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

  const loadMore = () => {
    setFetchingNewData(true)
    setPageNum((oldPageNum) => oldPageNum + 1)
  }

  const handleHapus = (id) => {
    Swal.fire({
      title: "Anda Yakin?",
      text: "Anda yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      confirmButtonText: "Yakin!",
    }).then((result) => {
      if (result.value) {
        cekPaketWisataExist(id).then((response) => {
          if (response.status) {
            const pwHtml = response.data.map((item) => {
              return `<a class="underline" href='/admin/paketwisata/${item.id}'>${item.nama}</a>`
            })
            Swal.fire({
              title: "Gagal Menghapus!",
              icon: "error",
              text: "Terdapat paket wisata yang memiliki tempat wisata ini!",
              html: `
              <p>Terdapat paket wisata yang memiliki tempat wisata ini:</p>
              ${pwHtml.join(", ")}
              `,
            })
          } else {
            deleteTempatWisata(id)
              .then((data) => {
                Swal.fire({
                  title: "Sukses",
                  icon: "success",
                  text: "Data berhasil dihapus!",
                })
                let result = getTempatWisata()
                result
                  .then((data) => {
                    setDatas(data)
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              })
              .catch((error) => {
                Swal.fire({
                  title: "Gagal!",
                  text: "Gagal menghapus data!",
                  icon: "error",
                })
              })
          }
        })
      }
    })
  }

  const performSearch = () => {
    if (tempSearch != searchQuery) {
      setSearchQuery(tempSearch)
      setSearching(true)
    }
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => performSearch(), 600)
    return () => clearTimeout(timeOutId)
  }, [tempSearch])

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      performSearch()
    }
  }

  return (
    <AdminLayout>
      <Head>
        <title>Tempat Wisata</title>
      </Head>
      <div className="flex items-center justify-between px-5 py-5 md:px-0">
        <h3 className="text-xl font-semibold text-gray-800 md:text-2xl">Tempat Wisata</h3>

        <div className="actionbutton flex flex-row space-x-2">
          <LinkButton href={"tempatwisata/add"} type="button">
            <Icons.tambah className="h-5 w-5" />
            Tambah
          </LinkButton>
        </div>
      </div>
      <div className="wrapper  ">
        <div className="md:rounded-xl border bg-white">
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
                className="absolute right-0 top-0 rounded-r-lg border border-blue-600 bg-blue-600 p-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {searching ? (
                  <Icons.loading className="h-5 w-5 animate-spin" />
                ) : (
                  <Icons.cari className="h-5 w-5" />
                )}
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr className="border-b border-t">
                  <th scope="col" className="px-4 py-3">
                    No.
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Gambar
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Nama
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Kota/Kab, Provinsi
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Koordinat
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {datas.length == 0 && !loading && (
                  <tr className="border-b">
                    <td colSpan={5} className="p-2 text-center">
                      Data kosong!
                    </td>
                  </tr>
                )}
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
                        src={item.foto[0] || "/placeholder-image.png"}
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
                    <td className="px-4 py-4">
                      {item.kota}, {item.provinsi}
                    </td>
                    <td className="px-4 py-4">
                      {item.latitude}, {item.longitude}
                    </td>
                    <td className="flex px-4 py-4 text-right">
                      <Link
                        href={`/admin/tempatwisata/${item.id}/edit`}
                        className="inline-block rounded-l-lg border border-blue-700 bg-blue-600 p-2 font-medium text-white hover:bg-blue-500 hover:underline dark:text-blue-500"
                      >
                        <Icons.edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleHapus(item.id)}
                        className="rounded-r-lg border border-red-700 bg-red-600 p-2 text-white hover:bg-red-500 hover:underline"
                      >
                        <Icons.hapus className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* {loading && (<tr className="border-b"><td colSpan={6}><LoadingDataSpinner /></td></tr>)} */}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row items-center">
            <div className="m-2 px-3 text-sm font-semibold text-gray-600">
              Menampilkan {datas.length} dari {totalData} data
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

export default TempatWisataPage
