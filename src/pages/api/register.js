import { validate } from "@/lib/validator";
import { createUserCustomer } from "@/services/UserService";
import { hash } from "bcryptjs";
import { check, validationResult } from "express-validator";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const { nama, email, no_telp, password } = req.body
    
    await validate(req, res, [
      check('nama').notEmpty().withMessage("Nama tidak boleh kosong").isAlpha('en-US', {ignore: ' '}),
      check('email').isEmail().withMessage("Email tidak valid"),
      check('no_telp').notEmpty().withMessage("Nomor telepon tidak boleh kosong"),
      check('password').notEmpty().withMessage("Password tidak boleh kosong").isLength({min: 8, max: 20}).withMessage("Password harus antara 8 - 20 karakter")
    ])

    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ errors: validationErrors.array() });
    }

    let result = await createUserCustomer({
      nama,
      email,
      no_telp,
      password
    })

    if (!result.status) {
      return res.status(404).json({ status: "error", message: result.message })
    }

    return res.status(200).json({ status: "success", message: result.message })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
    
  }

}