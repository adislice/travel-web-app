import { database, storage } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"

export default async function handler(req, res) {

  try {
    const reqBody = req.body 

    const paymentType = reqBody.payment_type
    const transactionStatus = reqBody.transaction_status
    const batasPembayaran = reqBody.expiry_time
    const totalBayar = reqBody.gross_amount
    const kodePemesanan = reqBody.order_id

    if (kodePemesanan == undefined) {
      return res.status(404).json({
        status: "error",
        msg: "Pemesanan tidak ditemukan!"
      })
    }

    const dbCol = collection(database, 'pemesanan')
    const pemesananQuery = query(dbCol, where('kode_pemesanan', '==', kodePemesanan))
    const result = await getDocs(pemesananQuery)
    if (result.empty) {
      return res.status(404).json({
        status: "error",
        msg: "Pemesanan tidak ditemukan!"
      })
    }
    const pemesananRef = result.docs[0].ref

    if (transactionStatus == "pending") {
      var date = new Date(batasPembayaran);
      var timestampBatas = Timestamp.fromDate(date);
      const detailPembayaran = {
        metode: paymentType,
        batas_bayar: timestampBatas
      }

      await updateDoc(pemesananRef, {
        status: 'PENDING',
        pembayaran: detailPembayaran
      })
    } else if (transactionStatus == "settlement") {
      var date = new Date(reqBody.settlement_time);
      var tglBayar = Timestamp.fromDate(date)
      await updateDoc(pemesananRef, {
        status: "SELESAI",
        'pembayaran.tanggal_bayar': tglBayar
      })
    }

    return res.status(200).json({
      status: "OK"
    })
  } catch (error) {
    return res.status(404).json({
      status: "error",
      msg: error.stack
    })
  }
  
  
}
