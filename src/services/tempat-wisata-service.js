import { database } from "@/lib/firebase"
import { async } from "@firebase/util"
import { addDoc, collection, GeoPoint, getDocs, setDoc } from "firebase/firestore"
import { useState } from "react"

export async function getTempatWisata() {
  
  try {
    const dbInstance = collection(database, 'tempat_wisata')
    let result = []
    await getDocs(dbInstance)
      .then((data) => {
        if (!data.empty) {
          data.docs.map((doc) => {
            result.push({id: doc.id, ...doc.data()})
          })
        
        }

      })
    return result
  } catch (e) {
    throw e
  }
}

export async function addTempatWisata(formData) {
  
  try {
    const dbInstance = collection(database, 'tempat_wisata')
    const coords = new GeoPoint(Number(formData.latitude), Number(formData.longitude))
    const data = {
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      alamat: formData.alamat,
      coordinate: coords
    }
    
    let result = await addDoc(dbInstance, data)
      .then(() => {
        return true
      })
      .catch(error => {return false})
    return result
  } catch (error) {
    throw error
  }
}
