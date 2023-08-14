import { getPaketWisata } from "@/services/PaketWisataService"


export default async function handler(req, res) {
  try {
    const { id } = req.query
    let result = await getPaketWisata(id)
    if (!result.status) {
      return res.status(404).json({status: "error", message: result.message})
    }
    return res.status(200).json({status: "success", data: result.data})
  } catch (error) {
    console.log(error)
    return res.status(500).json({status: "error", message: error})
    
  }
}
