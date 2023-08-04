import { PAGE_MAX_ITEM } from "@/lib/constant"
import { database } from "@/lib/firebase"
import { collection, and, Timestamp, query, orderBy, limit, onSnapshot, where, doc, getDoc, getDocs } from "firebase/firestore"

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

export async function getDataLaporan(tglAwal, tglAkhir, status) {
  try {
    console.log("get data laporan...")
    const dbCol = collection(database, "pemesanan")
    const fromDate = new Date(tglAwal)
    const toDate = new Date(tglAkhir)
    const timestampStart = Timestamp.fromDate(fromDate)
    const timestampEnd = Timestamp.fromDate(toDate)
    const dateQuery = and(
      where("created_at", ">=", timestampStart),
      where("created_at", "<=", timestampEnd)
    )
    let q = query(
      dbCol,
      and(
        where("created_at", ">=", timestampStart),
        where("created_at", "<=", timestampEnd)
      ),
      orderBy("created_at", "desc")
    )

    if (status == "SELESAI") {
      q = query(
        dbCol,
        and(
          where("created_at", ">=", timestampStart),
          where("created_at", "<=", timestampEnd),
          where('status', '==', 'SELESAI')
        ),
        orderBy("created_at", "desc")
      )
    }

    const result = await getDocs(q)

    const datas = result.docs.map(item => {
      return item.data()
    })
    console.log(datas)

    return datas
    } catch (error) {
      console.log(error)
      throw error
    } 
}