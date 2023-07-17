import { PAGE_MAX_ITEM } from "@/lib/constant"
import { database } from "@/lib/firebase"
import { collection, and, Timestamp, query, orderBy, limit, onSnapshot, where, doc, getDoc } from "firebase/firestore"

export function getAllPemesananRealtime(
  setDataState,
  fromDate = null,
  toDate = null,
  filterStatus = "SEMUA",
  pageNum,
  setLoading
) {
  const dbCol = collection(database, "pemesanan")
  let q = query(
    dbCol,
    orderBy("created_at", "desc"),
    limit(PAGE_MAX_ITEM * pageNum),
  )

  if (fromDate != null && toDate != null) {
    const timestampStart = Timestamp.fromDate(fromDate)
    const timestampEnd = Timestamp.fromDate(toDate)
    const dateQuery = and(
      where("created_at", ">=", timestampStart),
      where("created_at", "<=", timestampEnd)
    )
    q = query(
      dbCol,
      and(
        where("created_at", ">=", timestampStart),
        where("created_at", "<=", timestampEnd)
      ),
      orderBy("created_at", "desc"),
      limit(PAGE_MAX_ITEM * pageNum),
    )
  } 

  if (filterStatus == "SELESAI") {
    q = query(q, where('status', '==', 'SELESAI'))
  } else if (filterStatus == "DIBATALKAN") {
    q = query(q, where('status', '==', 'DIBATALKAN'))
  } else if (filterStatus == "PENDING") {
    q = query(q, where('status', '==', 'PENDING'))
  } else if (filterStatus == "DIPROSES") {
    q = query(q, where('status', '==', 'DIPROSES'))
  }

  // console.log("searcing " + )

  const unsub = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      setDataState([])
    } else {
      const allData = snapshot.docs.map((item) => {
        return {id: item.id, ...item.data()}
      })
      console.log("all data", allData)
      setDataState(allData)
    }
    setLoading(false)
  }, (error) => {
    console.log(error)
  })

  return unsub
}

export function getDetailPemesananRealtime(idPemesanan, setData, onError) {
  const dbCol = collection(database, "pemesanan")
  const unsubscribe = onSnapshot(doc(dbCol, idPemesanan), (snapshot) => {
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