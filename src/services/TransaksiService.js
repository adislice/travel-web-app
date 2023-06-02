import { database } from "@/lib/firebase"
import {
  collection,
  collectionGroup,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore"

export function getAllTransaksiRealtime(state, setState, filter, setLoading) {
  const queryTransaksi = query(collectionGroup(database, "transaksi"))
  const unsubscribe = onSnapshot(queryTransaksi, (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        const userCol = change.doc.ref.parent.parent
        if (!state.some((e) => e.id === change.doc.id)) {
          const user = await getDoc(userCol)
          const paketWisataProduk = await getDoc(
            change.doc.data().paket_wisata_produk_id
          )
          const paketWisataRef = paketWisataProduk.ref.parent.parent
          const paketWisata = await getDoc(paketWisataRef)
          const newData = {
            id: change.doc.id,
            user_id: userCol.id,
            user: user.data(),
            paket_wisata: paketWisata.data(),
            paket_wisata_produk: paketWisataProduk.data(),
            ...change.doc.data(),
          }
          setState((oldData) => [...oldData, newData])
          setLoading(false)
        }
      }
    })
  })

  return unsubscribe
}
