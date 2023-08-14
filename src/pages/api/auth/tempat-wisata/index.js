import { getAllTempatWisata } from "@/services/TempatWisataService"

export default async function handler(req, res) {
  try {
    const result = await getAllTempatWisata("")
    if (!result) {
      return res.status(404).json({ status: "error", message: "Data tidak ditemukan" })
    }

    return res.status(200).json({ status: "success", data: result })
  } catch (error) {
    res.status(500).json({ error })
  }
}