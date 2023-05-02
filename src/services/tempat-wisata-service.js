import { database, storage } from "@/lib/firebase"
import { async } from "@firebase/util"
import { addDoc, collection, doc, GeoPoint, getDocs, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useState } from "react"

export async function getTempatWisata() {

  try {
    const dbInstance = collection(database, 'tempat_wisata')
    let result = []
    let docs = await getDocs(dbInstance)
    
    for (let index = 0; index < docs.docs.length; index++) {
      const element = docs.docs[index];
      let fotosRef = collection(element.ref, 'foto')
      let fotos = await getDocs(fotosRef, 'foto')
      let fotosArray = fotos.docs.map(foto => {
        return foto.data()
      })

      result.push({
        id: element.id,
        ...element.data(),
        foto: fotosArray
      })
      
    }
    
    return result
  } catch (e) {
    throw e
  }
}

export async function addTempatWisata(formData) {
  console.log(formData)
  try {
    let imgData = formData.images
    let imgUpResult = await uploadFiles(formData.images)

    const dbInstance = collection(database, 'tempat_wisata')
    const coords = new GeoPoint(Number(formData.latitude), Number(formData.longitude))
    const data = {
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      alamat: formData.alamat,
      coordinate: coords
    }

    let result = await addDoc(dbInstance, data)
      .then((docRef) => {
        console.log(docRef.id)
        const imagesRef = doc(dbInstance, docRef.id)
        const fotoColRef = collection(docRef, 'foto')
        console.log(imagesRef)

        imgUpResult.map((item) => {
          console.log('adding ' + item.name + ', url: ' + item.url)
          addDoc(fotoColRef, {
            nama: item.name,
            url: item.url
          })
        })

        return true
      })
      .catch(error => {
        console.log(error)
        return false
      })
    return result
  } catch (error) {
    throw error
  }
}

export async function uploadFiles(images) {
  const promises = images.map((file) => {
    const storageRef = ref(storage, `images/tempat_wisata/${file.name}`);
    return uploadBytes(storageRef, file.blob);
  });

  const res = await Promise.all(promises);

  const links = await Promise.all(res.map(async (r, index) => {
    return {
      name: images[index].name,
      url: await getDownloadURL(r.ref)
    }
  }
  ));
  return links
}
