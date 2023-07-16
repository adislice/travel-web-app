import { PAGE_MAX_ITEM } from "@/lib/constant"
import { database, storage } from "@/lib/firebase"
import { FirebaseError } from "firebase/app"
import { collection, onSnapshot, query, or, and, where, limit, doc, Firestore, FirestoreError } from "firebase/firestore"

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