import AdminLayout from '@/components/dashboard/Layout'
import Href from '@/components/Link'
import LoadingDataSpinner from '@/components/LoadingDataSpinner'
import { database } from '@/lib/firebase'
import { getTempatWisata } from '@/services/tempat-wisata-service'
import { collection, getDocs } from 'firebase/firestore'
import { initFlowbite } from 'flowbite'
import { Button, Spinner } from 'flowbite-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const TempatWisataPage = () => {
  const [loading, setLoading] = useState(true)
  const [datas, setDatas] = useState([])
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    let result = getTempatWisata()
    result.then((data) => {
      setDatas(data)
    }).catch(error => {
      console.log(error)
    })
    .finally(() => {
      setLoading(false)
    })

  }, [])

  useEffect(() => {
    console.log(datas)
  }, [datas])

  return (
    <AdminLayout>
      <Head>
        <title>Tempat Wisata</title>
      </Head>
      <h3 className='p-5 text-xl text-gray-800 font-semibold'>Tempat Wisata</h3>
      <div className="wrapper px-5">
        <div className="actionbutton space-x-2 flex flex-row mb-4">
          <Button color="dark" type='submit' className='rounded-md' size="sm" onClick={() => router.push(`${router.asPath}/add`)}>
            Tambah
          </Button>
          <Button color="gray" type='submit' className='rounded-md' size="sm">
            Tambah
          </Button>
          <Button color="gray" type='submit' className='rounded-md' size="sm">
            Tambah
          </Button>
        </div>

        <div className="relative overflow-x-auto border sm:rounded-lg">
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
                      <img src="https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png" alt="Image" className='mx-auto w-10 h-10 object-cover' />
                    </td>
                    <td className="px-4 py-4">

                      <Href href={`${router.asPath}/${item.id}`} className="text-gray-900">
                        {item.nama}
                      </Href>

                    </td>
                    <td className="px-4 py-4">{item.alamat}</td>
                    <td className="px-4 py-4">{item.coordinate?.latitude}, {item.coordinate?.longitude}</td>
                    <td className="px-4 py-4 text-right">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </a>
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


export default TempatWisataPage