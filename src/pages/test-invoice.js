import React from "react"

function TestInvoice() {
  return (
    <div className="">
      <h4 className="text">Biro Perjalanan Wisata</h4>
      <h1 className="text-3xl font-bold mb-2">Kencana Wisata</h1>
      <hr />
      <div className="mt-6"></div>

      <table width="100%">
        <tr>
          <td width="50%" className="py-2">
            <div className="uppercase">Nama Pemesan</div>
            <div className="font-bold">Adi Permana</div>
          </td>
          <td width="50%" className="py-2">
            <div className="uppercase">No. Telepon</div>
            <div className="font-bold">0856587656</div>
          </td>
        </tr>
        <tr>
          <td width="50%" className="py-2">
            <div className="uppercase">Kode Transaksi</div>
            <div className="font-bold">INV-KNC2023-987874845</div>
          </td>
          <td width="50%" className="py-2">
            <div className="uppercase">Waktu Transaksi</div>
            <div className="font-bold">12 Juli 2023, 13:00 WIB</div>
          </td>
        </tr>
        <tr>
          <td width="50%" className="py-2">
            <div className="uppercase">Waktu Pembayaran</div>
            <div className="font-bold">12 Juli 2023, 14:00 WIB</div>
          </td>
          <td width="50%" className="py-2">
            <div className="uppercase">Metode Pembayaran</div>
            <div className="font-bold">Transfer Bank</div>
          </td>
        </tr>
      </table>
      <div className="mt-6">
        
        <table width="100%">
          <tr>
            <td colSpan={3} className="font-bold   pt-6">Rincian Paket Wisata</td>
          </tr>
          <tr>
            <td className="align-top border">Nama Paket Wisata</td>
            {/* <td className="align-top border">:</td> */}
            <td className="align-top border">Paket Wisata Semarang 1</td>
          </tr>
          <tr>
            <td className="align-top border">Destinasi Wisata Tujuan</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border">
              <div>
                <ul className="list-disc pl-6">
                  <li>Dusun Semilir</li>
                  <li>Musem Ambarawa</li>
                  <li>Masjid Agung Jawa Tengah</li>
                  <li>Pusat Oleh-oleh</li>
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td className="align-top border">Kendaraan Kendaraan</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border">Bus Sedang</td>
          </tr>
          <tr>
            <td className="align-top border">Jumlah Seat</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border">18</td>
          </tr>
          <tr>
            <td colSpan={3} className="font-bold  pt-6">Rincian Pembayaran</td>
          </tr>
          <tr>
            <td className="align-top border">Harga</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border text-end">Rp. 5.000.000</td>
          </tr>
          <tr>
            <td className="align-top border">Diskon</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border text-end">- Rp. 500.000</td>
          </tr>
          <tr>
            <td className="align-top border font-bold">Total</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border font-bold text-end">Rp. 4.500.000</td>
          </tr>
        </table>
      </div>
    </div>
  )
}

export default TestInvoice
