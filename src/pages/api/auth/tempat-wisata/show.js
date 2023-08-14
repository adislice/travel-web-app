import { getTempatWisata } from "@/services/TempatWisataService"

export default async function handler(req, res) {
  try {
    const { id } = req.query
    let result = await getTempatWisata(id)
    if (!result.status) {
      return res.status(404).json({status: "error", message: result.message})
    }
    return res.status(200).json({status: "success", data: result.data})
  } catch (error) {
    res.status(500).json({ error })
    
  }
}