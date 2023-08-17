import { PAGE_MAX_ITEM } from "@/lib/constant"
import { database } from "@/lib/firebase"
import { collection, and, Timestamp, query, orderBy, limit, onSnapshot, where, doc, getDoc, getDocs, deleteDoc } from "firebase/firestore"

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
      let allData = []
      for (let idx = 0; idx < snapshot.docs.length; idx++) {
        const item = snapshot.docs[idx];
        let itemData = item.data()
        itemData['id'] = item.id
        allData.push(itemData)
      }
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
      let dataPemesanan = snapshot.data()
      dataPemesanan['id'] = snapshot.id
      getDoc(doc(collection(database, 'paket_wisata'), dataPemesanan.paket_wisata_id)).then((docSnap) => {
        dataPemesanan['paket_wisata_nama'] = docSnap.data()['nama']
        getDoc(doc(collection(database, `paket_wisata/${dataPemesanan.paket_wisata_id}/produk`), dataPemesanan.produk_id)).then((docSnap) => {
          dataPemesanan['produk_harga'] = docSnap.data()['harga']
          getDoc(doc(collection(database, `jenis_kendaraan`), docSnap.data()['jenis_kendaraan_id'])).then((docSnapJk) => {
            console.log("data jk", docSnapJk.data())
            dataPemesanan['jenis_kendaraan_nama'] = docSnapJk.data()['nama']
            dataPemesanan['jenis_kendaraan_jumlah_seat'] = docSnapJk.data()['jumlah_seat']
          }).finally(() => {
            setData(dataPemesanan)
          })
        })
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

    if (status == "SELESAI" || status == "PENDING" || status == "DIPROSES") {
      q = query(
        dbCol,
        and(
          where("created_at", ">=", timestampStart),
          where("created_at", "<=", timestampEnd),
          where('status', '==', status)
        ),
        orderBy("created_at", "desc")
      )
    }
    

    const result = await getDocs(q)
    let allData = []
    for (let index = 0; index < result.docs.length; index++) {
      const item = result.docs[index];
      let itemData = item.data()
      const pw = await getDoc(doc(database, `paket_wisata/${itemData['paket_wisata_id']}`))
      itemData['paket_wisata_nama'] = pw.data()['nama']
      const produk = await getDoc(doc(database, `paket_wisata/${itemData['paket_wisata_id']}/produk/${itemData['produk_id']}`))
      const jk = await getDoc(doc(database, `jenis_kendaraan/${produk.data()['jenis_kendaraan_id']}`))
      itemData['jenis_kendaraan_nama'] = jk.data()['nama']
      itemData['jenis_kendaraan_jumlah_seat'] = jk.data()['jumlah_seat']
      allData.push(itemData)
    }
    // const datas = result.docs.map(item => {
    //   return item.data()
    // })
    console.log(allData)

    return allData
    } catch (error) {
      console.log(error)
      throw error
    } 
}

export function deletePemesanan(idPemesanan) {
  return deleteDoc(doc(database, "pemesanan", idPemesanan))
}

