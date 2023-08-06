import { Button } from "@/components/Button"
import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import Href from "@/components/Link"
import LoadingDataSpinner from "@/components/LoadingDataSpinner"
import UserPlaceholder from "@/components/UserPlaceholder"
import { useFirebaseAuth } from "@/context/FirebaseAuthContext"
import { useNav } from "@/context/navigationContext"
import { PAGE_MAX_ITEM } from "@/lib/constant"
import { database } from "@/lib/firebase"
import { getAllUserRealtime } from "@/services/UserService"
import { collection, getCountFromServer, limit, onSnapshot, query, startAfter, where } from "firebase/firestore"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

function UsersIndexPage() {
  const [loading, setLoading] = useState(false)
  const [dataUsers, setDataUsers] = useState([])
  const [loggedUser, setLoggedUser] = useState()
  const router = useRouter()
  const [authUser, authUserData] = useFirebaseAuth()
  const [lastVisible, setLastVisible] = useState(null);
  const [pageNum, setPageNum] = useState(1)
  const [isFetchingNewData, setFetchingNewData] = useState(false)
  const [totalData, setTotalData] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [tempSearch, setTempSearch] = useState("")
  const [searching, setSearching] = useState(false)
  const [navigation, setNavigation] = useNav()

  useEffect(() => {
    const unsubscribe = getAllUserRealtime(dataUsers, setDataUsers, searchQuery, pageNum, setFetchingNewData, (newState) => {
      setLoading(false)
      setSearching(false)
    })
    
    return () => {console.log('ubsubs user'); unsubscribe()}
  }, [loggedUser, pageNum, searchQuery])

  useEffect(() => {
    if (authUser != undefined) {
      setLoggedUser(authUser)
    }
  }, [authUser])

  useEffect(() => {
    setNavigation([
      {
        title: "Kelola Pengguna",
        url: "/admin/users",
      },
      
    ])

    const fetchCount = async () => {
      try {
        const countSnap = await getCountFromServer(query(collection(database, "users"), where("role", "==", "CUSTOMER")))
        setTotalData(countSnap.data().count)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCount()
    const intervalId = setInterval(fetchCount, 5000);
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const timeOutId = setTimeout(() => performSearch(), 600);
    return () => clearTimeout(timeOutId);
  }, [tempSearch])

  const performSearch = () => {
    if (tempSearch != searchQuery) {
      setSearchQuery(tempSearch)
      setSearching(true)
    }
  }

  const loadMore = () => {
    setFetchingNewData(true)
    setPageNum((oldPageNum) => oldPageNum + 1)
  };

  return (
    <AdminLayout>
      <Head>
        <title>Kelola Pengguna Terdaftar</title>
      </Head>
      <div className="flex items-center justify-between px-5 py-5 md:px-0">
        <h3 className="text-xl font-semibold text-gray-800 md:text-2xl">
          Pengguna Terdaftar
        </h3>
      </div>
      <div className="wrapper">
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
              />
              <button
                type="button"
                onClick={performSearch}
                className="absolute right-0 top-0 rounded-r-lg border border-blue-600 bg-blue-600 p-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {searching ? (
                <Icons.loading className="w-5 h-5 animate-spin" />
                ) : (
                  <Icons.cari className="h-5 w-5" />
                )}
                
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
                      Email
                    </th>
                    <th scope="col" className="px-4 py-3">
                      No. Telepon
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataUsers.length == 0 && (<tr><td colSpan={5} className="p-2 text-center">Data kosong!</td></tr>)}
                  {dataUsers.map((item, index) => (
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
                        {item.foto ? (<img
                          src={item.foto || '/placeholder-image.png'}
                          alt={item.nama}
                          className="mx-auto my-2 h-12 w-12 rounded-full object-cover"
                        />) : (
                        <UserPlaceholder nama={item.nama} />
                        )}
                        
                      </td>
                      <td className="px-4 py-4">
                        <Href
                          href={`${router.asPath}/${item.id}/show`}
                          className="text-gray-900"
                        >
                          {item.nama}
                        </Href>
                      </td>
                      <td className="px-4 py-4">{item.email}</td>
                      <td className="px-4 py-4">
                       {item.no_telp}
                      </td>
                      <td className="px-4 py-4">
                       {item.role}
                      </td>
                      <td className="flex px-4 py-4 text-right">
                        {/* {item.id != authUser?.uid && (<>
                          <Link
                          href={`/admin/tempatwisata/${item.id}/edit`}
                          className="inline-block rounded-l-lg border border-blue-700 p-2 font-medium bg-blue-600 text-white hover:bg-blue-500 hover:underline dark:text-blue-500"
                        >
                          <Icons.edit className="h-5 w-5" />
                        </Link>
                        <button
                          // onClick={() => handleHapus(item.id)}
                          className="rounded-r-lg border border-red-700 p-2 bg-red-600 text-white hover:bg-red-500 hover:underline"
                        >
                          <Icons.hapus className="h-5 w-5" />
                        </button></>)} */}
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex flex-row items-center">
            <div className="m-2 text-gray-600 text-sm px-3 font-semibold">Menampilkan {dataUsers.length} dari {totalData} data</div>
          <Button className="m-2 ml-auto bg-white text-blue-600 hover:bg-gray-200 border border-gray-300" 
          onClick={loadMore} 
          disabled={isFetchingNewData}>
            Tampilkan +{PAGE_MAX_ITEM} Data 
            {isFetchingNewData ? (<Icons.loading className="w-5 h-5 animate-spin" />) : (<Icons.arrowDown className="w-5 h-5" />)}
            </Button>
          </div>
          
        </div>
      </div>
    </AdminLayout>
  )
}

export default UsersIndexPage
