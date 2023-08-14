import { validate } from "@/lib/validator"
import { createTempatWisata } from "@/services/TempatWisataService"
import { check, validationResult } from "express-validator"


export default async function handler(req, res) {
  try {
    let body = req.body

    await validate(req, res, [
      check("nama").notEmpty(),
      check("deskripsi").notEmpty(),
      check("foto").notEmpty(),
      check("latitude").notEmpty(),
      check("longitude").notEmpty(),
      check("kota").notEmpty(),
      check("provinsi").notEmpty()
    ])

    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ errors: validationErrors.array() });
    }

    const {nama, deskripsi, foto, latitude, longitude, kota, provinsi} = body
    let data = {
      nama,
      deskripsi,
      foto,
      latitude,
      longitude,
      kota,
      provinsi
    }
    let result = await createTempatWisata(data)
    if (!result) {
      return res.status(404).json({ status: "error", message: "Gagal menambah data!" })
    }

    return res.status(200).json({ status: "success", message: "Berhasil menambah data!" })

  } catch (error) {
    res.status(500).json({ error })
    
  }
}