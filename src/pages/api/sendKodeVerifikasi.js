import { createTransport } from "nodemailer"


export default async function handler(req, res) {
  try {
    const {email, kode} = req.body

    if (email == undefined || kode == undefined) {
      return res.status(404).json({
        status: "error",
        msg: "Parameter email dan kode diperlukan!"
      })
    }

    // buat transporter
    const transporter  =  createTransport({
      host: "",
      port: ,
      secure: false,
      auth: {
        user: "",
        pass: ""
      },
      tls: {
        ciphers: 'SSLv3'
      }

    })

    // kirim email berisi kode
    let result = await transporter.sendMail({
      from: "",
      to: email,
      subject: "Kode Verifikasi",
      text: "Kode Verifikasi Akun Anda: " + kode
    })
    console.log(result)
    return res.status(200).json({
      status: "success",
      msg: "Kode berhasil dikirim!"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: "error",
      msg: "Kode gagal dikirim!"
    })
  }
  
}
