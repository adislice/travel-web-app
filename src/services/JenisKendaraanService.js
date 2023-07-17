import { PAGE_MAX_ITEM } from "@/lib/constant"
import { database } from "@/lib/firebase"
import { collection, onSnapshot, query, or, and, where, limit, doc, Firestore, FirestoreError, serverTimestamp, addDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"

export function getAllJenisKendaraanRealtime(
  setDataState,
  searchQuery,
  pageNum,
  setLoading
) {
  const dbCol = collection(database, 'jenis_kendaraan')
  const q = query(
    dbCol,
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
    if (snapshot.empty) {
      setLoading(false)
    }
    const allData = snapshot.docs.map((item) => {
      return {id: item.id, ...item.data()}
    })
    setDataState(allData)
    setLoading(false)
  }, (error) => {
    console.log(error)
  })

  return unsub
  
}

export async function addJenisKendaraan(formData) {
  try {
    const dbCol = collection(database, 'jenis_kendaraan')
    const data = {
      nama: formData.nama,
      jumlah_seat: parseInt(formData.jumlah_seat),
      created_at: serverTimestamp()
    }
    await addDoc(dbCol, data)
  } catch (error) {
    console.log("add jenis kendaraa: ", error)
    throw error
  }
}

export async function getDetailJenisKendaraan(idJenis) {
  try {
    const dbCol = collection(database, 'jenis_kendaraan')
    const docRef = doc(dbCol, idJenis)
    const res = await getDoc(docRef)
    if (res.exists) {
      return {status: true, data: {...res.data(), id: res.id}}
    } else {
      return {status: false, msg: "Data tidak ditemukan!"}
    }
  } catch (error) {
    console.log("get jenis: ", error)
    return {status: false, msg: "Data tidak ditemukan!"}
  }
}

export async function updateJenisKendaraan(idJenis, formData) {
  try {
    const dbCol = collection(database, 'jenis_kendaraan')
    const docRef = doc(dbCol, idJenis)
    const data = {
      nama: formData.nama,
      jumlah_seat: parseInt(formData.jumlah_seat),
    }
    await updateDoc(docRef, data)
  } catch (error) {
    console.log("update jenis: ", error)
    throw error
  }
}

export async function deleteJenisKendaraan(idJenis) {
  try {
    const dbCol = collection(database, 'jenis_kendaraan')
    const docRef = doc(dbCol, idJenis)
    
    await deleteDoc(docRef)
  } catch (error) {
    console.log("delete jenis: ", error)
    throw error
  }
}