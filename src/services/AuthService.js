import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export async function logIn(email, password) {
  let result = null,
    error = null
  try {
    result = await signInWithEmailAndPassword(auth, email, password)
  } catch (e) {
    error = e
  }

  return { result, error }
}

export async function logOut() {
  const result = auth.signOut()
  return result
}
