import { validate } from "@/lib/validator"
import { updateTempatWisata } from "@/services/TempatWisataService";
import { check, validationResult } from "express-validator"

export default async function handler(req, res) {
  try {
    if (req.method !== "PATCH") {
      return res.status(405).json({ message: "Method not allowed" });
    }
    const { id } = req.query
    if (!id) {
      return res.status(404).json({status: "error", message: "Data tidak ditemukan"})
    }

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

    const {nama, deskripsi, foto, latitude, longitude, kota, provinsi} = req.body

    let result = await updateTempatWisata(id, {
      nama,
      deskripsi,
      foto,
      latitude,
      longitude,
      kota,
      provinsi
    })

    if (!result) {
      return res.status(404).json({status: "error", message: "Gagal mengubah data!"})
    }
    return res.status(200).json({status: "success", message: "Berhasil mengubah data!"})

  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "error", message: error })
  }
}