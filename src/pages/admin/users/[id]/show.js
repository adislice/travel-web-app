import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import { useNav } from "@/context/navigationContext"
import { formatTimestampLengkap } from "@/lib/helper"
import { getUserDetailRealtime } from "@/services/UserService"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"

function UserDetailPage() {
  const [userData, setUserData] = useState({})
  const [navigation, setNavigation] = useNav()
  const router = useRouter()
  const { id: idUser } = router.query

  useEffect(() => {
    setNavigation([
      {
        title: "Kelola Pengguna",
        url: "/admin/users",
      },
      {
        title: "Detail Pengguna",
        url: router.asPath,
      },
    ])
    const unsubs = getUserDetailRealtime(idUser, setUserData, (error) => {
      Swal.fire({
        title: "Kesalahan",
        text: error,
        icon: "error",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          router.push("/admin/users")
        }
      })
    })

    return () => unsubs()
  }, [])

  return (
    <AdminLayout>
      <Head>
        <title>Detail Pengguna - {userData.nama}</title>
      </Head>
      <div className="flex items-center justify-between px-5 py-5 md:px-0">
        <div className="flex items-center gap-x-2">
          <Link href={"./../"}>
            <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
          </Link>
          <h3 className="text-xl font-semibold text-gray-800 md:text-xl">
            Detail Pengguna
          </h3>
        </div>
      </div>
      <div className="wrapper space-y-5">
        <section className="rounded-xl border bg-white">
          <div className="flex flex-col">
            <div className="flex w-full py-10 flex-col md:flex-row">
              <div className="w-44 h-44 mx-10 mb-10 self-center">
                {userData?.foto ? (
                  <img className="h-full w-full rounded-full object-cover" src={userData?.foto} alt="" />
                ) : (
                  <div className="grid h-full w-full place-content-center rounded-full bg-gray-300">
                    <Icons.user2 className="h-16 w-16 text-gray-700" />
                  </div>
                )}
              </div>
              <div className="mx-10 flex flex-col">
              <div className="mb-6">
                  <h5 className="font-semibold text-gray-900">
                    Nama Pengguna
                  </h5>
                  <p className="text-gray-800">{userData.nama}</p>
                </div>
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900">
                    Email
                  </h5>
                  <p className="text-gray-800">{userData.email}</p>
                </div>
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900">
                    Nomor Telepon
                  </h5>
                  <p className="text-gray-800">{userData.no_telp || "-"}</p>
                </div>
              </div>
              <div className="mx-10 flex flex-col">
              <div className="mb-6">
                  <h5 className="font-semibold text-gray-900">
                    Role
                  </h5>
                  <p className="text-gray-800">{userData.role}</p>
                </div>
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900">
                    Bergabung Sejak
                  </h5>
                  <p className="text-gray-800">{formatTimestampLengkap(userData.created_at)}</p>
                </div>
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900">
                    Nomor Telepon
                  </h5>
                  <p className="text-gray-800">{userData.no_telp || "-"}</p>
                </div>
              </div>
              
            </div>
            
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export default UserDetailPage
