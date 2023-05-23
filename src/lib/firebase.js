import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCV2AavPjh2mj7LY8ZAcINUb4UyGalZYko",
  authDomain: "travelers-c6460.firebaseapp.com",
  projectId: "travelers-c6460",
  storageBucket: "travelers-c6460.appspot.com",
  messagingSenderId: "1075612398303",
  appId: "1:1075612398303:web:b5032f35b6a79d30d3af6a",
  measurementId: "G-D3HVZW3BM6"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const database = getFirestore(app)
export const storage = getStorage(app)