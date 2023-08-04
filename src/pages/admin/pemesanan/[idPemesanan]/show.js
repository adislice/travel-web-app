import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import { useNav } from "@/context/navigationContext"
import { formatRupiah, formatTanggalLengkap, formatTimestampLengkap } from "@/lib/helper"
import { getDetailPemesananRealtime } from "@/services/PemesananService"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"

function DetailPemesananPage() {
  const [dataPemesanan, setDataPemesanan] = useState({})
  const [navigation, setNavigation] = useNav()
  const router = useRouter()
  const { idPemesanan } = router.query

  useEffect(() => {
    setNavigation([
      {
        title: "Pemesanan Paket Wisata",
        url: "/admin/pemesanan",
      },
      {
        title: "Detail Pemesanan",
        url: router.asPath,
      },
    ])
  }, [])

  useEffect(() => {
    const unsubs = getDetailPemesananRealtime(
      idPemesanan,
      setDataPemesanan,
      (error) => {
        console.log(error)
      }
    )

    return () => unsubs()
  }, [router.isReady])

  return (
    <AdminLayout>
      <Head>
        <title>Detail Pemesanan</title>
      </Head>
      <div className="flex items-center justify-between px-5 py-5 md:px-0">
        <div className="flex items-center gap-x-2">
          <Link href={"./../"}>
            <Icons.back className="h-6 w-6 rounded-full hover:bg-gray-200" />
          </Link>
          <h3 className="text-xl font-semibold text-gray-800 md:text-xl">
            Detail Pemesanan
          </h3>
        </div>
      </div>
      <div className="wrapper space-y-5">
        <section className="rounded-xl border bg-white" id="detail">
          <div className="flex flex-col md:flex-row">
            <div className="w-full p-6 md:w-1/2">
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Kode Pemesanan</h5>
                <p className="text-gray-700">
                  {dataPemesanan.kode_pemesanan || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Tanggal Pemesanan</h5>
                <p className="text-gray-700">
                  {formatTimestampLengkap(dataPemesanan.created_at) || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Nama Pemesan</h5>
                <p className="text-gray-700">
                  {dataPemesanan.user_nama || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">
                  No. Telepon Pemesan
                </h5>
                <p className="text-gray-700">
                  {dataPemesanan.user_no_telp || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Email Pemesan</h5>
                <p className="text-gray-700">
                  {dataPemesanan.user_email || "-"}
                </p>
              </div>
              <div className="mb-6">
              <h5 className="font-semibold text-gray-900">Tanggal Keberangkatan</h5>
                <p className="text-gray-700">
                  {formatTanggalLengkap(dataPemesanan.tanggal_keberangkatan) || "-"}
                </p>
              </div>
              <div className="mb-6">
              <h5 className="font-semibold text-gray-900">Jam Keberangkatan</h5>
                <p className="text-gray-700">
                  {dataPemesanan.jam_keberangkatan || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">
                  Lokasi Penjemputan
                </h5>
                <iframe
                className="my-2"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen=""
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAr4xlzzVJARvrYjj-qE00fNqMv4D-LY-U&q=${dataPemesanan.lokasi_jemput_lat},${dataPemesanan.lokasi_jemput_lng}`}
                  width="100%"
                  height={350}
                ></iframe>
              </div>
            </div>
            <div className="w-full p-6 md:w-1/2">
            
              <div className="mb-6">
              <h5 className="font-semibold text-gray-900">Jam Keberangkatan</h5>
                <p className="text-gray-700">
                  {dataPemesanan.jam_keberangkatan || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">
                  Nama Paket Wisata
                </h5>
                <p className="text-gray-700">
                  {dataPemesanan.paket_wisata_nama || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Jenis Kendaraan</h5>
                <p className="text-gray-700">
                  {dataPemesanan.jenis_kendaraan_nama || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Jumlah Seat</h5>
                <p className="text-gray-700">
                  {dataPemesanan.jenis_kendaraan_jumlah_seat || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Harga</h5>
                <p className="text-gray-700">
                  {formatRupiah(dataPemesanan.produk_harga) || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Promo</h5>
                <p className="text-gray-700">
                  <div>{dataPemesanan.promo_nama || "-"}</div>
                  <div>Kode Promo: {dataPemesanan.promo_kode || "-"}</div>
                  <div>Diskon (%): {dataPemesanan.promo_persen || "0"}%</div>
                  <div>Potongan: {formatRupiah(dataPemesanan.promo_potongan) || "0"}</div>
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Total Bayar</h5>
                <p className="text-gray-700">
                  {formatRupiah(dataPemesanan.total_bayar)}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Metode Pembayaran</h5>
                <p className="text-gray-700">
                  {dataPemesanan.metode_bayar}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Batas Pembayaran</h5>
                <p className="text-gray-700">
                  {formatTimestampLengkap(dataPemesanan.batas_bayar) || "-"}
                </p>
              </div>
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Status</h5>
                {dataPemesanan.status == "SELESAI" && (
                  <span class="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">SELESAI</span>
                )}
                {dataPemesanan.status == "PENDING" && (
                  <span class="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">PENDING</span>
                )}
                {dataPemesanan.status == "DIBATALKAN" && (
                  <span class="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">DIBATALKAN</span>
                )}
              </div>
              {dataPemesanan?.status == "SELESAI" && (
                <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Tanggal Dibayar</h5>
                <p className="text-gray-700">
                  {formatTimestampLengkap(dataPemesanan.tanggal_bayar) || "-"}
                </p>
              </div>
              )}
              
              
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

export default DetailPemesananPage
