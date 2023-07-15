import { auth } from "@/lib/firebase"
import TestPage from "@/pages/test"
import { onAuthStateChanged } from "firebase/auth"
import { Router, useRouter } from "next/router"
import { createContext, useContext, useEffect, useState } from "react"

export const AuthContext = createContext(undefined)

const FirebaseAuthCtx = () => {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const authStateChanged = async (authState) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return
    }
    console.log("subs", authState)

    setLoading(true)
    setAuthUser(authState)
    setLoading(false)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged)
    return () => unsubscribe()
  }, [])

  return {
    authUser,
    loading,
  }
}

export default FirebaseAuthCtx

const AuthUserContext = createContext({
  authUser: null,
  loading: true,
})

export const AuthUserProvider = ({ children }) => {
  const auth = FirebaseAuthCtx()

  return (
    <AuthUserContext.Provider value={auth}>
      {auth.loading ? <TestPage /> : children}
    </AuthUserContext.Provider>
  )
}

export const useAuth = () => useContext(AuthUserContext)
