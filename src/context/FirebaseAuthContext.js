import { auth, database } from "@/lib/firebase"
import TestPage from "@/pages/test"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDoc, doc } from "firebase/firestore"
import { createContext, useState, useEffect, useContext } from "react"


const FirebaseAuthContext = createContext(undefined)

export const FirebaseAuthProvider = ({children}) => {
  const [user, setUser] = useState(undefined)
  const [authUserData, setAuthUserData] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authState) => {
      console.log("onAuth:", authState)
      if (authState) {
        setUser(authState)
        setLoading(false)
      } else {
        setUser(null)
        setLoading(false)
        setAuthUserData(null)

      }
      
    })
    
    return unsubscribe
  }, [])

  useEffect(() => {
    const getUserFromDb = async () => {
      const dbUser = collection(database, 'users')
      const userSnap = await getDoc(doc(dbUser, user.uid))
      if (userSnap.exists()) {
        const u = userSnap.data()
        setAuthUserData(u)
        console.log("user data: ", u)
      }
    }

    if (user != null) {
      getUserFromDb()
    }
  }, [user])

  return (
    <FirebaseAuthContext.Provider value={[user, authUserData]}>
      {loading ? <TestPage/> : children}
     
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (context === undefined) {
    throw new Error(
      "useFirebaseAuth must be used within a FirebaseAuthProvider"
    )
  }
  return context
}