import { verifyJWT } from "@/lib/token";
import { getUserByEmail } from "@/services/UserService";

export default async function handler(req, res) {
  try {
    let token
    
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization?.substring(7);
    } 
    console.log("token: ", token)

    if (token) {
      const { sub } = await verifyJWT(token);
      console.log(sub)
      let cekUser = await getUserByEmail(sub)
      if (!cekUser.status) {
        return res.status(404).json({status: "error", message: "User tidak ditemukan"})
      }
      let user = cekUser.data
      req.user = { id: sub }
      return res.status(200).json({
        "status": "success",
        "token": token,
        ...user
      })
    } else {
      return res.status(401).json({
        status: "error",
        message: "Token tidak valid"
      })
    }
  } catch (error) {
    console.log(error)
  }
}