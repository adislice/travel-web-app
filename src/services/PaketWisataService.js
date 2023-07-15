import { database, storage } from "@/lib/firebase"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
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
    const dbCol = collection(database, "paket_wisata")
    const ref = doc(dbCol)
    const id = ref.id
    let imgData = formData.foto
    let imgUpResult = await uploadFiles(imgData, id)

    const tujuanWisata = formData.tempat_wisata.map((item) => {
      // const twRef = doc(database, `/tempat_wisata/${item.tempat_wisata_id}`)
      return item.tempat_wisata_id
    })

    const fotoUrlList = imgUpResult.map((item) => {
      return item.url
    })

    const dataPaket = {
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      fasilitas: formData.fasilitas,
      tempat_wisata: tujuanWisata,
      foto: fotoUrlList,
      created_at: serverTimestamp(),
      jam_keberangkatan: formData.jam_keberangkatan,
      waktu_perjalanan: formData.waktu_perjalanan
    }
    const result = await setDoc(ref, dataPaket)

    const produkCol = collection(ref, "produk")
    const produkList = formData.produk
    for (let index = 0; index < produkList.length; index++) {
      const produk = produkList[index]
      await addDoc(produkCol, {
        harga: parseFloat(produk.harga),
        jenis_kendaraan_id: produk.jenis_kendaraan_id,
        is_deleted: false,
        created_at: serverTimestamp(),
      })
    }
    return true
  } catch (error) {
    throw error
  }
}

export async function uploadFiles(images, prefix='') {
  const promises = images.map((file) => {
    const fileExt = file.name.split('.').pop();
    const randNum = Math.floor(1000 + Math.random() * 9000)
    const today = new Date()
    const unique = `${today.getFullYear()}${today.getMonth()+1}${today.getDay()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}${today.getMilliseconds()}_${randNum}`
    const storageRef = ref(storage, `images/paket_wisata/${prefix}_${unique}.${fileExt}`)
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

export async function getPaketWisataProduk(idPaket) {
  try {
    const dbCol = collection(database, `/paket_wisata/${idPaket}/produk`)
    const docsSnap = await getDocs(dbCol)
    const result = docsSnap.docs.map((item) => {
      return { id: item.id, ...item.data() }
    })
    return result
  } catch (e) {
    throw e
  }
}

export async function getAllJenisKendaraan() {
  try {
    const dbCol = collection(database, "jenis_kendaraan")
    const docSnap = await getDocs(dbCol)
    const result = docSnap.docs.map((item) => {
      return { id: item.id, ...item.data() }
    })
    return result
  } catch (error) {
    throw e
  }
}

export async function getDetailPaketWisata(idPaket) {
  try {
    const dbCol = collection(database, "paket_wisata")
    const data = await getDoc(doc(dbCol, idPaket))
    if (!data.exists()) {
      return {
        status: 1,
        msg: "Data tidak ditemukan"
      }
    }

    const dataPw = data.data()

    // get destinasi wisata
    const twArray = []
    for (let index = 0; index < dataPw.tempat_wisata.length; index++) {
      const element = dataPw.tempat_wisata[index];
      const tw = await getDoc(doc(database, 'tempat_wisata', element))
      if (tw.exists()) {
        twArray.push({
          id: tw.id,
          ...tw.data()
        })
      }
    }

    // get produk paket wisata
    const produkArray = []
    const produkDocs = await getDocs(collection(dbCol, idPaket, 'produk'))
    if (!produkDocs.empty) {
      for (let index = 0; index < produkDocs.docs.length; index++) {
        const item = produkDocs.docs[index];
        const idJenisKendaraan = item.data().jenis_kendaraan_id
        const jenis = await getDoc(doc(database, 'jenis_kendaraan', idJenisKendaraan))
        if (jenis.exists()) {
          const dataProduk = {
            ...item.data(),
            id: item.id,
            jenis_kendaraan_data: jenis.data()
          }
          produkArray.push(dataProduk)
        }
      }
      // produkDocs.docs.forEach((produk) => {
      //   produkArray.push({
      //     id: produk.id,
      //     ...produk.data()
      //   })
      // })
    }

    return {
      status: 0,
      data: {
        ...dataPw,
        destinasi_wisata_array: twArray,
        produk: produkArray
      }
    }

  } catch (error) {
    throw error
  }
}
