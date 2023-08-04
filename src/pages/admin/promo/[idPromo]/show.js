import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import { useNav } from "@/context/navigationContext"
import { formatRupiah, formatTimestampLengkap } from "@/lib/helper"
import { getDetailPromoRealtime } from "@/services/PromoService"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

function DetailPromoPage() {
  const [dataPromo, setDataPromo] = useState({})
  const [navigation, setNavigation] = useNav()
  const router = useRouter()
  const { idPromo } = router.query

  useEffect(() => {
    setNavigation([
      {
        title: "Kelola Promo",
        url: "/admin/promo",
      },
      {
        title: "Detail Promo",
        url: router.asPath,
      },
    ])
  }, [])

  useEffect(() => {
    const unsubs = getDetailPromoRealtime(
      idPromo,
      setDataPromo,
      (error) => {
        console.log(error)
      }
    )

    return () => unsubs()
  }, [router.isReady])

  return (
    <AdminLayout>
      <Head>
        <title>Detail Promo - {dataPromo.nama}</title>
      </Head>
      <div className="flex items-center justify-between px-5 py-5 md:px-0">
        <div className="flex items-center gap-x-2">
          <Link href={"./../"}>
            <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
          </Link>
          <h3 className="text-xl font-semibold text-gray-800 md:text-xl">
            Detail Promo
          </h3>
        </div>
      </div>
      <div className="wrapper space-y-5">
        <section className="rounded-xl border bg-white" id="detail">
          <div className="flex flex-col md:flex-row">
            <div className="w-full p-6 md:w-1/2">
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Nama Promo</h5>
                <p className="text-gray-700">
                  {dataPromo.nama || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Kode Promo</h5>
                <p className="text-gray-700">
                {dataPromo.kode || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Diskon %</h5>
                <p className="text-gray-700">
                  {dataPromo.persen || "-"} %
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">
                  Minimal Transaksi
                </h5>
                <p className="text-gray-700">
                  {formatRupiah(dataPromo.min_pembelian) || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Maksimal Potongan</h5>
                <p className="text-gray-700">
                  {formatRupiah(dataPromo.max_potongan) || "-"}
                </p>
              </div>
              
            </div>
            <div className="w-full p-6 md:w-1/2">
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">
                  Tanggal Mulai
                </h5>
                <p className="text-gray-700">
                  {formatTimestampLengkap(dataPromo.tanggal_mulai) || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Tanggal Berakhir</h5>
                <p className="text-gray-700">
                {formatTimestampLengkap(dataPromo.tanggal_akhir) || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Tanggal Dibuat</h5>
                <p className="text-gray-700">
                {formatTimestampLengkap(dataPromo.created_at) || "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="w-full p-6 md:w-1/2">

            </div>
            <div className="w-full p-6 md:w-1/2">
              
            </div>
            </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export default DetailPromoPage
