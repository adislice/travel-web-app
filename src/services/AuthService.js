import { auth, database } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { collection, doc, getDoc } from "firebase/firestore"

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

export async function checkRole(idUser) {
  try {
    const dbCol = collection(database, "users")
    const docRef = doc(dbCol, idUser)
    const result = await getDoc(docRef)
    if (result.exists()) {
      const userData = result.data()
      if (userData.role.toUpperCase() == "ADMIN") {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  } catch (error) {
    return false
  }
  
}

export async function logOut() {
  const result = auth.signOut()
  return result
}
