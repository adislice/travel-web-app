import { database, storage } from "@/lib/firebase"
import { async } from "@firebase/util"
import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  GeoPoint,
  getDoc,
  getDocs,
  onSnapshot,
  or,
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
    )
  )
  console.log("searcing " + searchQuery)

  const unsub = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      console.log(change.doc.data())
      if (change.type === "added") {
        if (!dataState.some((e) => e.id === change.doc.id)) {
          const newData = {
            id: change.doc.id,
            ...change.doc.data(),
          }
          setDataState((oldData) => [...oldData, newData])
          console.log("added ")
          setLoading(false)
        }
      }
    })
  })

  return unsub
}

export async function addTempatWisata(formData) {
  console.log(formData)
  try {
    let imgData = formData.images
    let imgUpResult = await uploadFiles(formData.images)

    const dbInstance = collection(database, "tempat_wisata")
    const coords = new GeoPoint(
      Number(formData.latitude),
      Number(formData.longitude)
    )
    const data = {
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      alamat: formData.alamat,
      latitude: formData.latitude,
      longitude: formData.longitude,
      thumbnail_foto: imgUpResult[0].url,
      created_at: serverTimestamp(),
    }

    let result = await addDoc(dbInstance, data)
      .then((docRef) => {
        console.log(docRef.id)
        const imagesRef = doc(dbInstance, docRef.id)
        const fotoColRef = collection(docRef, "foto")
        console.log(imagesRef)

        imgUpResult.map((item) => {
          console.log("adding " + item.name + ", url: " + item.url)
          addDoc(fotoColRef, {
            nama: item.name,
            url: item.url,
          })
        })

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
    let imgUpResult = await uploadFiles(formData.images)
    console.log(imgUpResult)

    const dbInstance = collection(database, "tempat_wisata")
    const docRef = doc(dbInstance, id)

    const data = {
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      alamat: formData.alamat,
      latitude: formData.latitude,
      longitude: formData.longitude,
    }

    let res = await updateDoc(docRef, data)
    const fotoColRef = collection(docRef, "foto")
    let docs = await getDocs(fotoColRef)

    for (const elem of docs.docs) {
      await deleteDoc(elem.ref)
    }

    for (const item of imgUpResult) {
      console.log("adding " + item.name + ", url: " + item.url)
      await addDoc(fotoColRef, {
        nama: item.name,
        url: item.url,
      })
    }

    return true
  } catch (error) {
    throw error
  }
}

export async function uploadFiles(images) {
  const promises = images.map((file) => {
    const storageRef = ref(storage, `images/tempat_wisata/${file.name}`)
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
    const fotoRef = collection(docRef, "foto")
    const fotoSnap = await getDocs(fotoRef)
    let fotoArray = fotoSnap.docs.map((foto) => {
      return foto.data()
    })

    const result = {
      ...docSnap.data(),
      foto: fotoArray,
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
