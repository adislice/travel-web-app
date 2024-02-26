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
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }

    })

    // kirim email berisi kode
    let result = await transporter.sendMail({
      from: process.env.SMTP_USERNAME,
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
