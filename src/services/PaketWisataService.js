import { PAGE_MAX_ITEM } from "@/lib/constant"
import { database, storage } from "@/lib/firebase"
import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
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

export function getAllPaketWisataRealtime(
  setDataState,
  searchQuery,
  pageNum,
  setLoading
) {
  const dbCol = collection(database, "paket_wisata")

  searchQuery = searchQuery ?? ""
  const q = query(
    dbCol,
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
  }, (error) => {
    console.log(error)
  })

  return unsub
}

export async function addPaketWisata(formData) {
  try {
    const dbCol = collection(database, "paket_wisata")
    const ref = doc(dbCol)
    const id = ref.id
    let imgData = formData.foto
    let imgUpResult = await uploadFiles(imgData, id)

    const tujuanWisata = formData.tempat_wisata.map((item) => {
      return item.tempat_wisata_id
    })

    const fotoUrlList = imgUpResult.map((item) => {
      return item.url
    })

    const dataPaket = {
      id: ref.id,
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
      const newProdukRef = doc(produkCol)
      await setDoc(newProdukRef, {
        id: newProdukRef.id,
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

export async function updatePaketWisata(id, formData) {
  try {
    console.log("formdata:", formData)
    console.log("update paket id: ", id)
    const dbCol = collection(database, "paket_wisata")
    const docRef = doc(dbCol, id)
    let imgData = formData.foto
    let imgUpResult = await uploadFiles(imgData, id)

    const tujuanWisata = formData.tempat_wisata.map((item) => {
      return item.id
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
      jam_keberangkatan: formData.jam_keberangkatan,
      waktu_perjalanan: formData.waktu_perjalanan
    }
    console.log("updated:", dataPaket)
    const result = await updateDoc(docRef, dataPaket)

    const produkCol = collection(docRef, "produk")
    // update semua produk is_deleted
    const delProduk = await getDocs(produkCol)
    console.log(produkCol.path)
    for (let index = 0; index < delProduk.docs.length; index++) {
      const element = delProduk.docs[index];
      console.log("deleting produk:", element.id)
      await updateDoc(element.ref, {is_deleted: true})
    }
    const produkList = formData.produk
    for (let index = 0; index < produkList.length; index++) {
      const produk = produkList[index]
      if (produk.id) {
        const produkRef = doc(produkCol, produk.id)
        const updatedProduk = {
          harga: parseFloat(produk.harga),
          jenis_kendaraan_id: produk.jenis_kendaraan_id,
          is_deleted: false,
        }
        await updateDoc(produkRef, updatedProduk)
      } else {
        const newDataRef = doc(produkCol)
        await setDoc(newDataRef, {
          id: newDataRef.id,
          harga: parseFloat(produk.harga),
          jenis_kendaraan_id: produk.jenis_kendaraan_id,
          is_deleted: false,
          created_at: serverTimestamp(),
        })
      }
      
    }
    return true
  } catch (error) {
    throw error
  }
}

export async function deletePaketWisata(idPaket) {
  try {
    const dbCol = collection(database, "paket_wisata")
    const docRef = doc(dbCol, idPaket)
    const result = await deleteDoc(docRef)
    return {status: true, msg: "Paket wisata berhasil dihapus!"}
  } catch (error) {
    console.log(error.message)
    return {status: false, msg: error.message}
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
    console.log("getting paket id:"+ idPaket)
    const dbCol = collection(database, "paket_wisata")
    const data = await getDoc(doc(dbCol, idPaket))
    if (!data.exists()) {
      return {
        status: 1,
        msg: "Data tidak ditemukan"
      }
    }

    const dataPw = {...data.data(), id: data.id}

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
    const produkCol = collection(dbCol, idPaket, 'produk')
    const produkDocs = await getDocs(query(produkCol, where("is_deleted",'==', false)))
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
