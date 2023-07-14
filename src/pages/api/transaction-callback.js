import { database, storage } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"

export default async function handler(req, res) {

  try {
    const reqBody = req.body 

    const paymentType = reqBody.payment_type
    const transactionStatus = reqBody.transaction_status
    const batasPembayaran = reqBody.expiry_time
    const totalBayar = reqBody.gross_amount
    const kodeTransaksi = reqBody.order_id

    if (kodeTransaksi == undefined) {
      return res.status(404).json({
        status: "error",
        msg: "Transaksi tidak ditemukan!"
      })
    }

    const dbCol = collection(database, 'transaksi')
    const transaksiQuery = query(dbCol, where('kode_transaksi', '==', kodeTransaksi))
    const result = await getDocs(transaksiQuery)
    if (result.empty) {
      return res.status(404).json({
        status: "error",
        msg: "Transaksi tidak ditemukan!"
      })
    }
    const transaksiRef = result.docs[0].ref

    if (transactionStatus == "pending") {
      var date = new Date(batasPembayaran);
      var timestampBatas = Timestamp.fromDate(date);
      if (paymentType == 'bank_transfer') {
        const detailPembayaran = {
          jenis: paymentType,
          no_va: reqBody.va_numbers[0].va_number,
          bank: reqBody.va_numbers[0].bank,
          batas_bayar: timestampBatas
        }

        await updateDoc(transaksiRef, {
          status: 'PENDING',
          detail_pembayaran: detailPembayaran
        })
      } else if (paymentType == "cstore") {
        const detailPembayaran = {
          jenis: paymentType,
          code: reqBody.payment_code,
          store: reqBody.store,
          batas_bayar: timestampBatas
        }

        await updateDoc(transaksiRef, {
          detail_pembayaran: detailPembayaran
        })
      }
    } else if (transactionStatus == "settlement") {
      var date = new Date(reqBody.settlement_time);
      var tglBayar = Timestamp.fromDate(date)
      await updateDoc(transaksiRef, {
        status: "SELESAI",
        'detail_pembayaran.tanggal_bayar': tglBayar
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
