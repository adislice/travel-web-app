import { getAllPaketWisata } from "@/services/PaketWisataService"

export default async function handler(req, res) {
  try {
    const result = await getAllPaketWisata("")
    if (!result) {
      return res.status(404).json({ status: "error", message: "Data tidak ditemukan" })
    }

    return res.status(200).json({ status: "success", data: result })
  } catch (error) {
    res.status(500).json({ status: "error", message: error })
  }
}