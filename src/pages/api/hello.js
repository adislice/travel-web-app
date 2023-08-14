
export default async function handler(req, res) {
  try {
    const users = await prisma.tempat_wisata.findMany()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error })
  }
  
}
