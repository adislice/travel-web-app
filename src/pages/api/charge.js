import axios from "axios"
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { database, storage } from "@/lib/firebase"

const isProduction = false
const serverKey = process.env.MIDTRANS_SERVER_KEY

export default async function handler(req, res) {
  const apiUrl = isProduction ? "https://app.midtrans.com/snap/v1/transactions" : "https://app.sandbox.midtrans.com/snap/v1/transactions"

  if (req.method != 'POST') {
    return res.status(404).json({
      error: "Wrong HTTP request!"
    })
  }

  const reqBody = req.body
  console.log(reqBody)
  const response = await chargeAPI(apiUrl, reqBody)

  console.log(response)

  const kodePemesanan = reqBody.transaction_details.order_id
  const url = response.redirect_url
  const transactionToken = response.token

  const dbCol = collection(database, 'pemesanan')
  const pemesananQuery = query(dbCol, where('kode_pemesanan', '==', kodePemesanan))
  const result = await getDocs(pemesananQuery)
  if (!result.empty) {
    const pemesananRef = result.docs[0].ref
    const updateResult = await updateDoc(pemesananRef, {
      payment_url: url,
      status: 'DIPROSES',
    })
  }
  


  
  return res.status(200).json(response)

}

async function chargeAPI(apiUrl, requestBody) {

  const headers = {
    'Content-Type' : 'application/json',
    'Accept' : 'application/json',
    'Authorization' : 'Basic ' + Buffer.from(serverKey+'').toString('base64')
  }

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers
    })

    return response.data

  } catch (err) {
    return {
      error: err.message
    }
  }
}
