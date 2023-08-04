import { renderToStaticMarkup } from "react-dom/server"
import pdf from "html-pdf"
import {join, resolve} from 'path'
import { auth, database } from "@/lib/firebase"
import { and, collection, doc, getDoc, getDocs, orderBy, query, Timestamp, where } from "firebase/firestore"
import moment from "moment"
import { formatRupiah, formatTimestampLaporan, formatTimestampLengkap } from "@/lib/helper"

export const config = {
  api: {
      externalResolver: true
  }
}

function TestLaporan({data}) {
  return (
    <div className="p-2">
      <h4 className="text">Biro Perjalanan Wisata</h4>
      <h1 className="text-3xl font-bold mb-2">Kencana Wisata</h1>
      <hr />
      <div className="mt-6"></div>

      <div className="">
        <u><h3 className="font-bold text-xl underline text-center">Laporan Pemesanan Paket Wisata</h3></u>
      </div>

      <table width="100%" className="table1 mt-10">
        <tr>
          <th>No.</th>
          <th>Tanggal</th>
          <th>Nama Pemesan</th>
          <th>Paket Wisata</th>
          <th>Kendaraan</th>
          <th>Total Bayar</th>
          <th>Status Pembayaran</th>
          <th>Tanggal Pembayaran</th>
        </tr>
        {data.map((item, index) => (
          <tr key={item.id}>
            <td>{index+1}</td>
            <td>{formatTimestampLaporan(item.created_at)}</td>
            <td>{item.user.nama}</td>
            <td>{item.paket_wisata?.nama}</td>
            <td>{item.jenis_kendaraan?.nama} ({item.jenis_kendaraan?.jumlah_seat} seat)</td>
            <td>{formatRupiah(item.total_bayar)}</td>
            <td>{item.status}</td>
            <td>{formatTimestampLaporan(item.pembayaran?.tanggal_bayar)}</td>
          </tr>
        ))}
      </table>

    </div>
  )
}

export default async function handler(req, res) {
  const { tglAwal, tglAkhir, status } = req.query

  
  if (tglAwal == undefined || tglAkhir == undefined || status == undefined) {
    return res.status(404).json({
      status: "error",
      msg: "Request tidak valid!"
    })
  }

  const dbCol = collection(database, "pemesanan")

  const fromDate = new Date(tglAwal)
  const toDate = new Date(tglAkhir)
  
  const timestampStart = Timestamp.fromDate(fromDate)
  const timestampEnd = Timestamp.fromDate(toDate)
  const dateQuery = and(
    where("created_at", ">=", timestampStart),
    where("created_at", "<=", timestampEnd)
  )
  let q = query(
    dbCol,
    and(
      where("created_at", ">=", timestampStart),
      where("created_at", "<=", timestampEnd)
    ),
    orderBy("created_at", "desc")
  )

  if (status == "SELESAI") {
    q = query(
      dbCol,
      and(
        where("created_at", ">=", timestampStart),
        where("created_at", "<=", timestampEnd),
        where('status', '==', 'SELESAI')
      ),
      orderBy("created_at", "desc")
    )
  }

  const result = await getDocs(q)

  const datas = result.docs.map(item => {
    return item.data()
  })

  // return res.status(200).json(datas)



  const basePath = "file://" + resolve(join(process.cwd(), '/public/'))
  
  const html = renderToStaticMarkup(
    <html style={{zoom: 0.68}}>
      <head>
        <link rel="stylesheet" href={`${basePath}/phantom.css`} />
        <link rel="stylesheet" href={`${basePath}/laporan.css`} />
      </head>

      <body style={{width: "", fontFamily: "sans-serif"}}>
        <TestLaporan data={datas} />
      </body>
    </html>
  )

  const options = {
    format: "A4",
    orientation: "landscape",
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
    const formattedDate = moment(date).locale('id').format('D MMMM YYYY, HH:mm')
    return formattedDate
  } catch (error) {
    return ""
  }
  
}