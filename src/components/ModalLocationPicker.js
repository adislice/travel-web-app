import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import { Button } from "./Button"
import { Icons } from "./Icons"
import LocationPicker from "./LocationPicker"

function ModalLocationPicker({isModalOpen, setModalOpen, onLocationChanged, defaultLocation }) {
  const [lokasi, setLokasi] = useState({})

  useEffect(() => {
    onLocationChanged(lokasi)
  }, [lokasi])

  return (
    <Dialog.Root
        open={isModalOpen}
        onOpenChange={setModalOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-[99] bg-black/60" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-[100] flex h-[95vh] min-h-[60vh] w-[95vw] max-w-[100vw] translate-x-[-50%] translate-y-[-50%] flex-col rounded-[6px]  bg-white py-3 focus:outline-none ">
            <Dialog.Title className="text-mauve12 mx-4 mb-3 text-[17px] font-bold">
              Pilih Lokasi
            </Dialog.Title>
            <div className="flex-1 overflow-auto">
            
            <LocationPicker onAddressChanged={setLokasi} defaultLocation={defaultLocation} />
            </div>
            <div className="flex flex-col md:flex-row gap-2 flex-shrink-0 flex-grow-0 basis-[auto] justify-between items-center pt-3 px-3">
              <div className="flex gap-2">
                <div className="text-sm text-gray-800">
                  <span className="font-semibold">Latitude</span>: {lokasi?.latLng?.lat}<br />
                  <span className="font-semibold">Longitude</span>: {lokasi?.latLng?.lng}</div>
                <div className="border"></div>
                <div className="text-sm text-gray-800">
                <span className="font-semibold">Kota/Kab</span>: {lokasi?.address?.kota}<br />
                <span className="font-semibold">Provinsi</span>: {lokasi?.address?.provinsi}</div>
              </div>
              <Button onClick={() => setModalOpen(false)} type="button"
                
                >
                  Simpan
                </Button>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-violet11 focus:shadow-violet7 hover:bg-violet4 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Icons.close />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
  )
}

export default ModalLocationPicker