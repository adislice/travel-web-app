import { renderToStaticMarkup } from "react-dom/server"
import pdf from "html-pdf"
import {join, resolve} from 'path'
import { auth, database } from "@/lib/firebase"
import { collection, doc, getDoc } from "firebase/firestore"
import moment from "moment"

export const config = {
  api: {
      externalResolver: true
  }
}

function TestInvoice({data}) {
  return (
    <div className="p-2">
      <h4 className="text">Biro Perjalanan Wisata</h4>
      <h1 className="text-3xl font-bold mb-2">Kencana Wisata</h1>
      <hr />
      <div className="mt-6"></div>

      <table width="100%">
        <tr>
          <td width="50%" className="py-2">
            <div className="uppercase">Nama Pemesan</div>
            <div className="font-semibold">{data.user?.nama}</div>
          </td>
          <td width="50%" className="py-2">
            <div className="uppercase">No. Telepon</div>
            <div className="font-semibold">{data.user?.no_telp}</div>
          </td>
        </tr>
        <tr>
          <td width="50%" className="py-2">
            <div className="uppercase">Kode Pemesanan</div>
            <div className="font-semibold">{data.kode_transaksi}</div>
          </td>
          <td width="50%" className="py-2">
            <div className="uppercase">Waktu Transaksi</div>
            <div className="font-semibold">{formatTanggal(data.tanggal)}</div>
          </td>
        </tr>
        <tr>
          <td width="50%" className="py-2">
            <div className="uppercase">Waktu Pembayaran</div>
            <div className="font-semibold">{formatTanggal(data.detail_pembayaran?.tanggal_bayar)}</div>
          </td>
          <td width="50%" className="py-2">
            <div className="uppercase">Metode Pembayaran</div>
            <div className="font-semibold">{data.detail_pembayaran?.jenis_pembayaran}</div>
          </td>
        </tr>
      </table>
      <div className="mt-6">
        
        <table width="100%" className="mr-1">
          <tr>
            <td colSpan={3} className="font-semibold   pt-6">Rincian Paket Wisata</td>
          </tr>
          <tr>
            <td className="align-top border p-1">Nama Paket Wisata</td>
            {/* <td className="align-top border">:</td> */}
            <td className="align-top border p-1">Paket Wisata Semarang 1</td>
          </tr>
          <tr>
            <td className="align-top border p-1">Destinasi Wisata Tujuan</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border p-1">
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
            <td className="align-top border p-1">Kendaraan Kendaraan</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border p-1">Bus Sedang</td>
          </tr>
          <tr>
            <td className="align-top border p-1">Jumlah Seat</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border p-1">18</td>
          </tr>
          <tr>
            <td colSpan={3} className="font-semibold pt-6">Rincian Pembayaran</td>
          </tr>
          <tr>
            <td className="align-top border p-1">Harga</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border text-end p-1">Rp. 5.000.000</td>
          </tr>
          <tr>
            <td className="align-top border p-1">Diskon</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border text-end p-1">- Rp. 500.000</td>
          </tr>
          <tr>
            <td className="align-top border font-semibold p-1">Total</td>
            {/* <td className="align-top">:</td> */}
            <td className="align-top border font-semibold text-end p-1">Rp. 4.500.000</td>
          </tr>
        </table>
      </div>
    </div>
  )
}

export default async function handler(req, res) {
  const { id } = req.query

  if (id == undefined) {
    return res.status(404).json({
      status: "error",
      msg: "Request tidak valid!"
    })
  }

  const transaksiRef = collection(database, 'transaksi')
  const transaksi = await getDoc(doc(transaksiRef, id))
  if (!transaksi.exists()) {
    return res.status(404).json({
      status: "erorr",
      msg: "Transaksi tidak ditemukan!"
    })
  }

  const basePath = "file://" + resolve(join(process.cwd(), '/public/'))
  
  const html = renderToStaticMarkup(
    <html style={{zoom: 0.68}}>
      <head>
        <link rel="stylesheet" href={`${basePath}/phantom.css`} />
      </head>
      <body style={{width: "", fontFamily: "sans-serif"}}>
        <TestInvoice data={transaksi.data()} />
      </body>
    </html>
  )

  const options = {
    format: "A4",
    orientation: "portrait",
    border: "20mm",
    footer: {
      height: "10mm",
    },
    type: "pdf",
    timeout: 30000,
    base: basePath,
    localUrlAccess: true
  }

  pdf.create(html, options).toBuffer((err, buffer) => {
    if (err) {
      return res.status(404).json({
        status: "error",
        msg: err.message
      })

    } else {
      res.setHeader('Content-Type', 'application/pdf')
      return res.status(200).end(buffer)
    }
    // res.setHeader('Content-disposition', 'attachment; filename="article.pdf')
    
  })

}

function formatTanggal(timestamp) {
  try {
    const date = new Date(timestamp.seconds * 1000)
    const formattedDate = moment(date).locale('id').format('D MMMM YYYY, HH:mm:ss [WIB]')
    return formattedDate
  } catch (error) {
    return ""
  }
  
}