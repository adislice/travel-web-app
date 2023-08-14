
import { JWT_EXPIRES_IN } from "@/lib/configs";
import { signJWT } from "@/lib/token";
import { validate } from "@/lib/validator";
import { getUserByEmail } from "@/services/UserService";
import { compare } from "bcryptjs";
import { check, validationResult } from "express-validator"
import { NextResponse } from "next/server";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {email, password} = req.body

  await validate(req, res, [
    check('email').isEmail().withMessage("Email tidak valid"),
    check('password').not().isEmpty()
  ])

  const validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ errors: validationErrors.array() });
  }

  const checkUser = await getUserByEmail(email)
  if (!checkUser.status) {
    return res.status(404).json({ status: "error", message: checkUser.msg })
  }
  const user = checkUser.data

  if (!user || !(await compare(password, user.password))) {
    return res.status(400).json({status:"error", message: "Email atau password salah!"})
  }

  const token = await signJWT(
    { sub: user.email },
    { exp: `${JWT_EXPIRES_IN}m` }
  );

  const tokenMaxAge = parseInt(JWT_EXPIRES_IN) * 60;
  const cookieOptions = {
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV !== "development",
    maxAge: tokenMaxAge,
  };

  return res.status(200).json({
    status: "success",
    token,
    ...user
  })




}
