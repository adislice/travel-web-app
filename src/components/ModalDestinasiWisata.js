
import React from 'react'
import * as Dialog from "@radix-ui/react-dialog"
import { Icons } from './Icons'

function ModalDestinasiWisata({isModalOpened, setModalOpened, allData, selectedData, setSelectedData}) {

  function handleCheckbox(e, id) {
    if (e.target.checked) {
      const check = selectedData.find((item) => item.id == id)
      if (check) {
        return
      }
      const selData = allData.find((item) => item.id == id)
      const dataNew = {
        ...selData,
        id: id,
        tempat_wisata_id: selData.id,
      }
      
      setSelectedData((old) => [...old, dataNew])
    } else {
      console.log("unchecked " + id)
      setSelectedData((value) => value.filter((it) => it.id !== id))
    }
  }

  function findUrutan(id) {
    const check = selectedData.find((it) => it.id == id)
    if (check) {
      const idx = selectedData.findIndex((x) => x.id == id)
      return idx + 1
    }
    return
  }

  return (
    <Dialog.Root
        open={isModalOpened}
        onOpenChange={setModalOpened}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-[99] bg-black/60" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-[100] flex max-h-[85vh] min-h-[60vh] w-[90vw] max-w-[60vw] translate-x-[-50%] translate-y-[-50%] flex-col rounded-[6px]  bg-white p-[25px] focus:outline-none ">
            <Dialog.Title className="text-mauve12 m-0 mb-4 text-[17px] font-medium">
              Tambah Tempat Wisata Tujuan
            </Dialog.Title>
            <div className="flex-1 overflow-auto rounded border p-4">
              <div className="grid grid-cols-2 gap-2">
                {allData.map((item, index) => (
                  <label
                    key={`tw-${index}`}
                    htmlFor={`tw-${item.id}`}
                    className="label-custom relative flex flex-row items-center"
                  >
                    <input
                      type="checkbox"
                      name="pilih-tw"
                      id={`tw-${item.id}`}
                      value={item.id}
                      className="absolute right-4"
                      checked={
                        selectedData.find((it) => it.id == item.id)
                          ? true
                          : false
                      }
                      onChange={(e) => handleCheckbox(e, item.id)}
                    />

                    <div className="flex w-full gap-2 rounded-lg border-2 border-transparent p-2">
                      <div className="relative">
                        <img
                          src={item.foto?.[0]}
                          alt=""
                          className="h-14 w-14 rounded object-cover"
                        />
                        {selectedData.find((it) => it.id == item.id) ? (
                          <div className="absolute left-[50%] top-[50%] flex h-6 w-6 translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-full bg-white text-sm font-semibold text-blue-700 shadow-lg">
                            {findUrutan(item.id)}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-col">
                        <div>{item.nama}</div>
                        <div className="text-sm text-gray-600">
                          {item.kota}, {item.provinsi}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-[25px] flex flex-shrink-0 flex-grow-0 basis-[auto] justify-end">
              <button
                onClick={() => setModalOpened(false)}
                type="button"
                className=" inline-flex items-center gap-x-1 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Simpan
              </button>
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

export default ModalDestinasiWisata