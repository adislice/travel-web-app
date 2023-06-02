import { database } from "@/lib/firebase"
import {
  collection,
  collectionGroup,
  getCountFromServer,
} from "firebase/firestore"

export async function getRekapDashboard() {
  const userColl = collection(database, "users")
  const userCount = await getCountFromServer(userColl)

  const paketWisataColl = collection(database, "paket_wisata")
  const paketWisataCount = await getCountFromServer(paketWisataColl)

  const tempatWisataColl = collection(database, "tempat_wisata")
  const tempatWisataCount = await getCountFromServer(tempatWisataColl)

  const transaksiColl = collectionGroup(database, "transaksi")
  const transaksiCount = await getCountFromServer(transaksiColl)

  return {
    users: userCount.data().count,
    paket_wisata: paketWisataCount.data().count,
    tempat_wisata: tempatWisataCount.data().count,
    transaksi: transaksiCount.data().count,
  }
}
