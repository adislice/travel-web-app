import { PAGE_MAX_ITEM } from "@/lib/constant"
import { database, storage } from "@/lib/firebase"
import { async } from "@firebase/util"
import {
  addDoc,
  and,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  FieldValue,
  GeoPoint,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  or,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useState } from "react"

export async function getTempatWisata() {
  try {
    const dbInstance = collection(database, "tempat_wisata")
    let result = []
    let docs = await getDocs(dbInstance)

    for (let index = 0; index < docs.docs.length; index++) {
      const element = docs.docs[index]

      result.push({
        id: element.id,
        ...element.data(),
      })
    }

    return result
  } catch (e) {
    throw e
  }
}

export function getTempatWisataRealtime(
  dataState,
  setDataState,
  searchQuery,
  pageNum,
  setLoadingNext,
  setLoading = null
) {
  const twCol = collection(database, "tempat_wisata")

  searchQuery = searchQuery ?? ""
  const q = query(
    twCol,
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
    orderBy("nama", "asc"),
    orderBy("created_at", "desc"),
    limit(PAGE_MAX_ITEM * pageNum),
  )
  console.log("searcing " + searchQuery)

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
    setLoadingNext(false)

  }, (error) => {
    console.log(error)
  })

  return unsub
}

export async function addTempatWisata(formData) {
  console.log(formData)
  try {
    let imgData = formData.images

    const dbInstance = collection(database, "tempat_wisata")
    const ref = doc(dbInstance)
    const id = ref.id
    let imgUpResult = await uploadFiles(formData.images, id)

    const fotoUrlList = imgUpResult.map((item) => {
      return item.url
    })
    const data = {
      id: id,
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      provinsi: formData.provinsi,
      kota: formData.kota,
      latitude: formData.latitude.toString(),
      longitude: formData.longitude.toString(),
      foto: fotoUrlList,
      created_at: serverTimestamp(),
    }
    console.log("get id: " + id)
    let result = await setDoc(ref, data)
      .then(() => {
        // console.log(docRef.id)
        // const imagesRef = doc(dbInstance, docRef.id)
        // const fotoColRef = collection(docRef, "foto")
        // console.log(imagesRef)
        return true
      })
      .catch((error) => {
        console.log(error)
        return false
      })
    return result
  } catch (error) {
    throw error
  }
}

export async function editTempatWisata(id, formData) {
  console.log(formData)
  try {
    let imgData = formData.images
    let imgUpResult = await uploadFiles(formData.images, id)
    console.log(imgUpResult)

    const dbInstance = collection(database, "tempat_wisata")
    const docRef = doc(dbInstance, id)

    const fotoUrlList = imgUpResult.map((item) => {
      return item.url
    })

    const data = {
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      provinsi: formData.provinsi,
      kota: formData.kota,
      foto: fotoUrlList,
      latitude: formData.latitude.toString(),
      longitude: formData.longitude.toString(),
    }

    let res = await updateDoc(docRef, data)
    
    return true
  } catch (error) {
    throw error
  }
}

export async function uploadFiles(images, prefix='') {
  const promises = images.map((file, index) => {
    const fileExt = file.name.split('.').pop();
    const randNum = Math.floor(1000 + Math.random() * 9000)
    const today = new Date()
    const unique = `${today.getFullYear()}${today.getMonth()+1}${today.getDay()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}${today.getMilliseconds()}_${randNum}`
    const storageRef = ref(storage, `images/tempat_wisata/${prefix}_${unique}.${fileExt}`)
    if (file.blob instanceof File) {
      return uploadBytes(storageRef, file.blob)
    } else {
      return file.blob
    }
  })

  const res = await Promise.all(promises)

  const links = await Promise.all(
    res.map(async (r, index) => {
      if (images[index].blob instanceof File) {
        return {
          name: images[index].name,
          url: await getDownloadURL(r.ref),
        }
      } else {
        return {
          name: images[index].name,
          url: images[index].blob,
        }
      }
    })
  )
  return links
}

export async function getDetailTempatWisata(id) {
  try {
    const dbInstance = collection(database, "tempat_wisata")
    const docRef = doc(database, "tempat_wisata", id)
    const docSnap = await getDoc(docRef)

    const result = {
      ...docSnap.data(),
    }

    console.log(result)

    return result
  } catch (e) {
    throw e
  }
}

export async function deleteTempatWisata(id) {
  try {
    const dbInstance = collection(database, "tempat_wisata")
    const docRef = doc(dbInstance, id)
    const fotoColRef = collection(docRef, "foto")
    let fotoDocs = await getDocs(fotoColRef)

    for (const elem of fotoDocs.docs) {
      await deleteDoc(elem.ref)
    }

    return await deleteDoc(docRef)
  } catch (e) {
    throw e
  }
}

export async function cekPaketWisataExist(idTempatWisata) {
  try {
    const dbRef = collectionGroup(database, "paket_wisata")
    const dbQuery = query(dbRef, where("tempat_wisata", "array-contains", idTempatWisata))
    const querySnap = await getDocs(dbQuery)
    if (querySnap.empty) {
      return {
        status: false
      }
    }
    const docs = querySnap.docs.map((item) => {
      return { id: item.id, ...item.data() }
    })
    return {
      status: true,
      data: docs
    }
  } catch (error) {
    throw error
  }
}
