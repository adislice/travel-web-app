import AdminLayout from '@/components/dashboard/Layout'
import { Icons } from '@/components/Icons'
import Href from '@/components/Link'
import LoadingDataSpinner from '@/components/LoadingDataSpinner'
import { database } from '@/lib/firebase'
import { getAllPaketWisata } from '@/services/PaketWisataService'
import { getTempatWisata } from '@/services/TempatWisataService'
import { collection, getDocs } from 'firebase/firestore'
import { initFlowbite } from 'flowbite'
import { Button } from 'flowbite-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const PaketWisataPage = () => {
  const [loading, setLoading] = useState(false)
  const [dataPaket, setDataPaket] = useState([])
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    let result = getAllPaketWisata().then((data) => {
      setDataPaket(data)
    }).finally(() => setLoading(false))
    
  }, [])

  useEffect(() => {
    console.log(dataPaket)
  }, [dataPaket])

  return (
    <AdminLayout>
      <Head>
        <title>Paket Wisata</title>
      </Head>
      <div className='p-5 flex justify-between items-center'>
        <h3 className='text-xl md:text-2xl text-gray-800 font-semibold'>Paket Wisata</h3>

        <div className="actionbutton space-x-2 flex flex-row">
          <button
            type="button"
            className="inline-flex items-center gap-x-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm py-2 px-3.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => router.push(`${router.asPath}/add`)}
          >
            <Icons.tambah className='h-5 w-5' />
            Tambah
          </button>

        </div>
      </div>
      <div className="wrapper px-5">
        <div className="relative overflow-x-auto border rounded-lg bg-white">
          {loading ? <LoadingDataSpinner /> : (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
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
                    Created At
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataPaket.map((item, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      className="w-3 px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {index + 1}
                    </th>
                    <td className='w-11'>
                      <img src={item.thumbnail_foto} alt="Foto Paket Wisata" className='mx-auto w-12 h-12 my-2 object-cover rounded' />
                    </td>
                    <td className="px-4 py-4">

                      <Href href={`${router.asPath}/${item.id}`} className="text-gray-900">
                        {item.nama}
                      </Href>

                    </td>
                    <td className="px-4 py-4">{item.created_at?.toDate().toDateString()}</td>
                    
                    <td className="px-4 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/tempatwisata/${item.id}/edit`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </Link>
                      <button onClick={() => handleHapus(item.id)} className="text-red-600 hover:underline">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          )}
        </div>

      </div>

    </AdminLayout>
  )
}


export default PaketWisataPage