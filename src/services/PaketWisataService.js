import { database, storage } from "@/lib/firebase"
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

export async function getAllPaketWisata() {
  try {
    const dbCol = collection(database, "paket_wisata")
    let docsRef = await getDocs(dbCol)
    const result = docsRef.docs.map((item) => {
      return { id: item.id, ...item.data() }
    })
    return result
  } catch (error) {}
}

export async function addPaketWisata(formData) {
  try {
    let imgData = formData.foto
    let imgUpResult = await uploadFiles(imgData)

    const dbCol = collection(database, "paket_wisata")
    const tujuanWisata = formData.tempat_wisata.map((item, index) => {
      const twRef = doc(database, `/tempat_wisata/${item.tempat_wisata_id}`)
      return { order: index + 1, tempat_wisata_id: item.tempat_wisata_id }
    })

    const dataPaket = {
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      tempat_wisata: tujuanWisata,
      thumbnail_foto: imgUpResult?.[0]?.url,
      created_at: serverTimestamp(),
    }
    const result = await addDoc(dbCol, dataPaket)
    const imagesRef = doc(dbCol, result.id)
    const fotoColRef = collection(result, "foto")
    console.log(imagesRef)

    for (let index = 0; index < imgUpResult.length; index++) {
      const item = imgUpResult[index]
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
    const storageRef = ref(storage, `images/paket_wisata/${file.name}`)
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
