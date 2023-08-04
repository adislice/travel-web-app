import { PAGE_MAX_ITEM } from "@/lib/constant"
import { database } from "@/lib/firebase"
import { collection, onSnapshot, query, or, and, where, limit, doc, Firestore, FirestoreError, serverTimestamp, addDoc, getDoc, updateDoc, deleteDoc, Timestamp, getDocs, FieldPath, FieldValue, documentId, setDoc } from "firebase/firestore"

const dbCol = collection(database, 'promo')

export function getAllPromoRealtime(
  setDataState,
  searchQuery,
  pageNum,
  setLoading
) {
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

export async function addPromo(formData, dateRange) {
  try {
    const tglStart = Timestamp.fromDate(new Date(dateRange.startDate))
    const tglEnd = Timestamp.fromDate(new Date(dateRange.endDate))
    const newKode = formData.kode.toUpperCase()
    const cekQuery = query(dbCol, where('kode', '==', newKode))
    const cekKode = await getDocs(cekQuery)
    if (!cekKode.empty) {
      return {status: false, msg: "Kode promo sudah digunakan!"}
    }
    const newDataRef = doc(dbCol)
    const data = {
      id: newDataRef.id,
      nama: formData.nama,
      kode: newKode,
      persen: parseInt(formData.persen) || 0,
      min_pembelian: parseInt(formData.min_pembelian) || 0,
      max_potongan: parseInt(formData.max_potongan) || 0,
      tanggal_mulai: tglStart,
      tanggal_akhir: tglEnd,
      created_at: serverTimestamp()
    }
    await setDoc(newDataRef, data)
    return {status: true, msg: "Berhasil menyimpan promo!"}
  } catch (error) {
    console.log("add promo: ", error)
    throw error
  }
}

export function getDetailPromoRealtime(idPromo, setData, onError) {
  const unsubscribe = onSnapshot(doc(dbCol, idPromo), (snapshot) => {
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

export async function updatePromo(idPromo, formData, dateRange) {
  try {
    const tglStart = Timestamp.fromDate(new Date(dateRange.startDate))
    const tglEnd = Timestamp.fromDate(new Date(dateRange.endDate))
    const newKode = formData.kode.toUpperCase()
    const cekQuery = query(dbCol, and(
      where('kode', '==', newKode),
      where(documentId(), '!=', idPromo)
    ))
    const cekKode = await getDocs(cekQuery)
    if (!cekKode.empty) {
      return {status: false, msg: "Kode promo sudah digunakan!"}
    }

    const docRef = doc(dbCol, idPromo)
    const newData = {
      nama: formData.nama,
      kode: newKode,
      persen: parseInt(formData.persen) || 0,
      min_pembelian: parseInt(formData.min_pembelian) || 0,
      max_potongan: parseInt(formData.max_potongan) || 0,
      tanggal_mulai: tglStart,
      tanggal_akhir: tglEnd,
    }
    await updateDoc(docRef, newData)
    return {status: true, msg: "Berhasil mengubah promo!"}
  } catch (error) {
    console.log("update promo: ", error)
    throw error
  }
}

export async function getDetailPromo(idPromo) {
  try {
    const docRef = doc(database, "promo", idPromo)
    const docSnap = await getDoc(docRef)

    const result = {
      ...docSnap.data(),
      id: docSnap.id
    }

    console.log(result)

    return result
  } catch (e) {
    throw e
  }
}

export async function deletePromo(idJenis) {
  try {
    const docRef = doc(dbCol, idJenis)
    
    await deleteDoc(docRef)
  } catch (error) {
    console.log("delete promo: ", error)
    throw error
  }
}