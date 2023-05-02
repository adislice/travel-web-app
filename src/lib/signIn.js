import { signInWithEmailAndPassword } from 'firebase/auth'
import React from 'react'
import { auth } from './firebase'

async function signIn(email, password) {
  let result = null, error = null
  try {
    result = await signInWithEmailAndPassword(auth, email, password)
  } catch (e) {
    error = e
  }
  
  return { result, error }
}

export default signIn