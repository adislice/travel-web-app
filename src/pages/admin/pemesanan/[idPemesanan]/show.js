import { Button } from "@/components/Button"
import AdminLayout from "@/components/dashboard/Layout"
import { Icons } from "@/components/Icons"
import { useNav } from "@/context/navigationContext"
import { formatRupiah, formatTanggalLengkap, formatTimestampLengkap, hitungSelisihTanggal } from "@/lib/helper"
import { deletePemesanan, getDetailPemesananRealtime } from "@/services/PemesananService"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"

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

  const hitungPersenRefund = (tglBerangkat, tglBatal) => {
    const result = hitungSelisihTanggal(tglBerangkat?.toDate(), tglBatal?.toDate()) 
    console.log("selisih:", result, "todate:", tglBerangkat.toDate())
    if (result < 5) {
      return 0
    } else {
      return 60
    }
  }

  const confirmPengembalianDana = () => {
    Swal.fire({
      title: "Konfirmasi Pengembalian Dana",
      html: `Apakah anda yakin telah menyelesaikan pengembalian dana?<br />Data pemesanan ini akan dihapus setelah Anda menekan tombol Yakin.<br />Tindakan ini tidak dapat dibatalkan!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Batal",
      confirmButtonText: "Yakin!",
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: "Pengembalian dana...",
        })
        Swal.showLoading()
        deletePemesanan(idPemesanan).then(() => {
          Swal.fire({
            title: "Sukses",
            text: "Konfirmasi pengembalian dana berhasil dan data pemesanan berhasil dihapus!",
            icon: "success"
          })
          router.push("/admin/pemesanan")
        }).catch((error) => {
          Swal.fire({
            title: "Gagal",
            text: "Terjadi kesalahan. Gagal mengembalian dana!",
            icon: "error"
          })
        })
      }
    })
  }

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
                  <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">SELESAI</span>
                )}
                {dataPemesanan.status == "PENDING" && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">PENDING</span>
                )}
                {dataPemesanan.status == "DIBATALKAN" && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">DIBATALKAN</span>
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
              {dataPemesanan?.status == "DIBATALKAN" && (
              <div className="mb-6">
                <h5 className="font-semibold text-gray-900">Konfirmasi Pengembalian Dana</h5>
                <p className="text-gray-700">
                  Pelanggan membatalkan pemesanan yang telah dibayar. Dibatalkan pada {formatTanggalLengkap(dataPemesanan.tanggal_pembatalan)}. 
                  Sehingga dana yang perlu dikembalikan sebesar {hitungPersenRefund(dataPemesanan?.tanggal_keberangkatan, dataPemesanan.tanggal_pembatalan)}% x {formatRupiah(dataPemesanan?.total_bayar)} = <b>{formatRupiah(dataPemesanan?.total_bayar * hitungPersenRefund(dataPemesanan?.tanggal_keberangkatan, dataPemesanan.tanggal_pembatalan)/100)}</b>.<br /><br />
                  Klik tombol di bawah ini jika Anda telah menyelesaikan pengembalian dana.<br />
                </p>
                <Button className="my-4" onClick={() => confirmPengembalianDana()}>Konfirmasi</Button>
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
