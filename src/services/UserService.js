import { PAGE_MAX_ITEM } from "@/lib/constant"
import { auth, database, storage } from "@/lib/firebase"
import { FirebaseError } from "firebase/app"
import { createUserWithEmailAndPassword, updateCurrentUser } from "firebase/auth"
import { collection, onSnapshot, query, or, and, where, limit, doc, Firestore, FirestoreError, serverTimestamp, setDoc, getDocs } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

export function getAllUserRealtime(
  dataState,
  setDataState,
  searchQuery,
  pageNum,
  setLoadingNext,
  setLoading = null,
) {
  const userCol = collection(database, 'users')
  const q = query(
    userCol,
    or(
      // query as-is:
      and(
        where("nama", ">=", searchQuery),
        where("nama", "<=", searchQuery + "\uf8ff")
      ),
      // capitalize first letter:
      and(
        where(
          "nama",
          ">=",
          searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)
        ),
        where(
          "nama",
          "<=",
          searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1) + "\uf8ff"
        )
      ),
      // lowercase:
      and(
        where("nama", ">=", searchQuery.toLowerCase()),
        where("nama", "<=", searchQuery.toLowerCase() + "\uf8ff")
      )
    ),
    limit(PAGE_MAX_ITEM * pageNum)
  )
  console.log("searcing " + searchQuery)

  const unsub = onSnapshot(q, (snapshot) => {
    console.log("ketemu")
    if (snapshot.empty) {
      setLoading(false)
    }
    const allData = snapshot.docs.map((item) => {
      return {id: item.id, ...item.data()}
    })
    setLoadingNext(false)
    setDataState(allData)
    setLoading(false)
  })

  return unsub
  
}
/**
 * Multiply two numbers.
 * @param {string} idUser - Id user.
 * @param {Function} setData - When data fetched.
 * @param {(error: string) => void} onError - On error
 * @returns {Firestore.Unsubscribe} The product of a and b.
 */
export function getUserDetailRealtime(idUser, setData, onError) {
  const dbCol = collection(database, "users")
  const unsubscribe = onSnapshot(doc(dbCol, idUser), (snapshot) => {
    if (snapshot.exists()) {
      setData({
        id: snapshot.id,
        ...snapshot.data()
      })
    } else {
      onError("Data tidak ditemukan!")
    }
  }, (error) => {
    onError(error.message)
  })

  return unsubscribe
}

export async function addAdmin(formData) {
  try {
    const daftarUserAuth = await daftarAuth(formData.email, formData.password)
    if (!daftarUserAuth.status) {
      return {status: false, msg: daftarUserAuth.msg}
    }

    const cek = await cekEmail(formData.email)
    if (!cek) {
      return {status: false, msg: "Email sudah digunakan"}
    }
    const dbCol = collection(database, "users")
    const userRef = doc(dbCol, daftarUserAuth.user.uid)
    const idUser = daftarUserAuth.user.uid
    
    let imgUrl = null
    let data = {
      nama: formData.nama,
      email: formData.email,
      no_telp: formData.no_telp,
      role: "ADMIN",
      created_at: serverTimestamp()
    }
    if (formData.foto?.length > 0) {
      const uploadUrl = await uploadFile(idUser, formData.foto[0])
      imgUrl = uploadUrl
      data['foto'] = uploadUrl
    }

    const result = await setDoc(userRef, data)
    return {status: true, msg: "Sukses"}
  } catch (error) {
    console.log("add admin: ", error)
    throw error
  }
  
}

async function cekEmail(email) {
  try {
    const dbCol = collection(database, "users")
    const q = query(dbCol, where('email', '==', email))
    const res = await getDocs(q)
    if (res.empty) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

async function daftarAuth(email, password) {
  try {
    let currentUser = auth.currentUser
    const result = await createUserWithEmailAndPassword(auth, email, password)
    updateCurrentUser(auth, currentUser)
    if (result) {
      return {status: true, user: result.user}
    } else {
      return {status: false, msg: "Terjadi kesalahan. Silahkan coba beberapa saat lagi"}
    }
    
  } catch (error) {
    console.log("create user: ", error)
    return {status: false, msg: error.message}
  }
}

async function uploadFile(idUser, file) {
  try {
    if (file instanceof File) {
      const fileExt = file.name.split('.').pop();
      const storageRef = ref(storage, `images/users/${idUser}.${fileExt}`)
      const result = await uploadBytes(storageRef, file)
      const url = await getDownloadURL(result.ref)
      return url
    } else {
      return file
    }
  } catch (error) {
    throw error
  }
}