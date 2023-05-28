import AdminLayout from '@/components/dashboard/Layout'
import { Icons } from '@/components/Icons'
import Href from '@/components/Link'
import LoadingDataSpinner from '@/components/LoadingDataSpinner'
import { NavigationContext } from '@/context/navigationContext'
import { database } from '@/lib/firebase'
import { deleteTempatWisata, getTempatWisata, getTempatWisataRealtime } from '@/services/TempatWisataService'
import { collection, getDocs } from 'firebase/firestore'
import { initFlowbite } from 'flowbite'
import { Button, Spinner } from 'flowbite-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const TempatWisataPage = () => {
  const [loading, setLoading] = useState(true)
  const [datas, setDatas] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [tempSearch, setTempSearch] = useState("")
  const [navigation, setNavigation] = useContext(NavigationContext)
  const router = useRouter()

  // setNavigation([
  //   {
  //     title: "Tempat Wisata",
  //     url: "/admin/dashboard/tempatwisata"
  //   }
  // ])
  console.log(navigation)

  useEffect(() => {
    setNavigation([
      {
        title: "Tempat Wisata",
        url: "/admin/tempatwisata"
      }
    ])

    console.log(searchQuery)
    setLoading(true)
    const replace = searchQuery == "" ? false : true
    const unsubscribe = getTempatWisataRealtime(datas, setDatas, searchQuery, setLoading)
    
    // return () => unsubscribe()
    return () => {
      console.log('unsubscribe')
      unsubscribe()
    }
  }, [searchQuery])

  useEffect(() => {
    console.log(datas)
  }, [datas])

  const handleHapus = (id) => {
    Swal.fire({
      title: 'Anda Yakin?',
      text: "Anda yakin ingin menghapus data ini?",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yakin!'
    }).then((result) => {
      if (result.value) {
        deleteTempatWisata(id)
          .then(data => {
            Swal.fire({
              'title': 'Sukses',
              'icon': 'success',
              'text': 'Data berhasil dihapus!'
            })
            let result = getTempatWisata()
            result.then((data) => {
              setDatas(data)
            }).catch(error => {
              console.log(error)
            })
          })
          .catch(error => {
            Swal.fire({
              title: "Gagal!",
              text: "Gagal menghapus data!",
              icon: 'error'
            })
          })

      }
    });
  }

  const performSearch = () => {
    setDatas([])
    setSearchQuery(tempSearch)
  }

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      performSearch()
    }
  }

  return (
    <AdminLayout>
      <Head>
        <title>Tempat Wisata</title>
      </Head>
      <div className='px-5 md:px-0 py-5 flex justify-between items-center'>
        <h3 className='text-xl md:text-2xl text-gray-800 font-semibold'>Tempat Wisata</h3>

        <div className="actionbutton space-x-2 flex flex-row">
          <Link
            href={'tempatwisata/add'}
            type="button"
            className="inline-flex font-medium items-center gap-x-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-md text-sm py-2 px-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"

          >
            <Icons.tambah className='h-5 w-5' />
            Tambah
          </Link>

        </div>
      </div>
      <div className="wrapper  ">
        <div className="bg-white border rounded-xl">
          <div className='flex justify-end'>
            <div className="relative w-full lg:w-80 m-4">
              <input
                type="search"
                id="search-dropdown"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                placeholder="Cari..."
                required=""
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                onKeyDown={handleEnter}
              />
              <button
                type="button"
                onClick={performSearch}
                className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-600 rounded-r-lg border border-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Icons.cari className='h-5 w-5' />
                <span className="sr-only">Search</span>
              </button>
            </div>

          </div>
          <div className="relative overflow-x-auto">
            {loading ? <LoadingDataSpinner /> : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr className='border-t border-b'>
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
                      Alamat
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
                  {datas.map((item, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th
                        scope="row"
                        className="w-3 px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {index + 1}
                      </th>
                      <td className='w-11'>
                        <img src={item.thumbnail_foto} alt={item.thumbnail_foto} className='mx-auto w-12 h-12 my-2 object-cover rounded' />
                      </td>
                      <td className="px-4 py-4">

                        <Href href={`${router.asPath}/${item.id}/show`} className="text-gray-900">
                          {item.nama}
                        </Href>

                      </td>
                      <td className="px-4 py-4">{item.alamat}</td>
                      <td className="px-4 py-4">{item.latitude}, {item.longitude}</td>
                      <td className="px-4 py-4 text-right space-x-2 flex">
                        <Link
                          href={`/admin/tempatwisata/${item.id}/edit`}
                          className="p-2 border border-gray-200 rounded-lg inline-block font-medium text-blue-600 dark:text-blue-500 hover:bg-gray-100 hover:underline"
                        >
                          <Icons.edit className='h-5 w-5' />
                        </Link>
                        <button onClick={() => handleHapus(item.id)} className="p-2 border border-gray-200 rounded-lg text-red-600 hover:bg-gray-100 hover:underline">
                          <Icons.hapus className='h-5 w-5' />
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


export default TempatWisataPage