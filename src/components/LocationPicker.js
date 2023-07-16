import AdminLayout from '@/components/dashboard/Layout'
import { GEOCODER_API_KEY, GOOGLE_MAPS_LIBRARIES } from '@/lib/constant'
import {useJsApiLoader, GoogleMap, Marker, Autocomplete} from '@react-google-maps/api'
import axios from 'axios'
import { TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import Geocode from "react-geocode"

const defaultCenter = { lat: -7.309180, lng: 109.906461 }

function LocationPicker({onAddressChanged, defaultLocation}) {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [selectedLoc, setSelectedLoc] = useState()
  const [currentCenter, setCurrentCenter] = useState(null)
  const [alamat, setAlamat] = useState({})

  const {isLoaded, loadError} = useJsApiLoader({
    id: 'gmapss',
    googleMapsApiKey: "AIzaSyAr4xlzzVJARvrYjj-qE00fNqMv4D-LY-U",
    libraries: GOOGLE_MAPS_LIBRARIES
  })

  useEffect(() => {
    onAddressChanged(alamat)
    console.log(alamat)
  }, [alamat])

  useEffect(() => {
    console.log(defaultLocation)
    if (defaultLocation?.lat && defaultLocation?.lng) {
      setSelectedLoc({
        lat: Number(defaultLocation.lat),
        lng: Number(defaultLocation.lng)
      })
      setCurrentCenter({
        lat: Number(defaultLocation.lat),
        lng: Number(defaultLocation.lng)
      })
    }
    console.log(defaultLocation)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = GEOCODER_API_KEY;
        const apiUrl = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${selectedLoc.lat},${selectedLoc.lng}&lang=id-ID&apiKey=${apiKey}`;

        const response = await axios.get(apiUrl);
        const data = response.data;
        console.log(data);
        const prov = data.items[0]?.address.county
        const kota = normalizeKota(data.items[0]?.address.city)
        setAlamat({
          latLng: {
            lat: selectedLoc.lat,
            lng: selectedLoc.lng
          },
          address: {
            kota: kota,
            provinsi: prov
          }
        })

        
        // Process the data as needed
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (selectedLoc) {
      fetchData()
    }
    
  }, [selectedLoc])


  if (!isLoaded) {
    return <div>Loading maps...</div>
  }

  const handleClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newMarker = { lat, lng };
    console.log(newMarker)
    setSelectedLoc(newMarker);
  };

  function normalizeKota(inputString = "") {
    const stringArray = inputString.split(" ");
    const wordCount = stringArray.length;
  
    if (wordCount > 1) {
      if (stringArray.slice(-1)[0] == "Kota" || stringArray.slice(-1)[0] == "Kabupaten") {
        const lastWord = stringArray.pop();
        const modifiedString = `${stringArray.join(" ")}`;
        return modifiedString;
      } else {
        return inputString;
      }      
    } else {
      return inputString;
    }
  }

  const handleDragEnd = () => {
    const lat = map.getCenter().lat();
    const lng = map.getCenter().lng()
    setCurrentCenter({ lat, lng });
  };

  return (
    
      <div className='w-full h-full'>
      <GoogleMap id='gmaps' zoom={10}
          center={currentCenter || defaultCenter} mapContainerStyle={{width: '100%', height: '100%'}}
          onLoad={(map) => setMap(map)}
          onClick={handleClick}
          onDragEnd={handleDragEnd}
          options={{
            gestureHandling: "greedy"
          }}
          >
        
        {selectedLoc && (
          <Marker key="marker-1" position={selectedLoc} />
        )}
      </GoogleMap>
      </div>
   
  )
}

export default LocationPicker