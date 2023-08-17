import { database } from "@/lib/firebase"
import { collection, deleteDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"
import moment from "moment-timezone"

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
        msg: "Pemesanan tidak ditemukan!!"
      })
    }

    const pemesananRef = result.docs[0].ref

    if (transactionStatus == "pending") {
      const sourceTimeZone = 'Asia/Jakarta';
      const utcDateTime = moment.tz(batasPembayaran, sourceTimeZone).utc();
      var date = utcDateTime.toDate()
      var timestampBatas = Timestamp.fromDate(date);

      await updateDoc(pemesananRef, {
        status: 'PENDING',
        metode_bayar: paymentType,
        batas_bayar: timestampBatas
      })

    } else if (transactionStatus == "settlement") {
      const sourceTimeZone = 'Asia/Jakarta';
      const utcDateTime = moment.tz(reqBody.settlement_time, sourceTimeZone).utc();
      var date = utcDateTime.toDate()
      var tglBayar = Timestamp.fromDate(date)
      await updateDoc(pemesananRef, {
        status: "SELESAI",
        tanggal_bayar: tglBayar
      })
    } else if (transactionStatus == "expire" || transactionStatus == "cancel") {
      // await updateDoc(pemesananRef, {
      //   status: "DIBATALKAN"
      // })
      await deleteDoc(pemesananRef)
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
