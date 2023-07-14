
import React from 'react'
import * as Dialog from "@radix-ui/react-dialog"
import { Icons } from './Icons'
import { FormProvider, useForm } from 'react-hook-form'
import { Label, TextInput } from 'flowbite-react'
import { Button } from './Button'

function ModalProdukPaketWisata({isModalOpened, setModalOpened, setAddedProduk, jenisKendaraan }) {
  const methodsProduk = useForm({ mode: "onBlur" })
  const {
    register: registerProduk,
    handleSubmit: handleSubmitProduk,
    formState: { errors: errorsProduk },
    reset: resetProduk,
  } = methodsProduk

  function saveProduk(formData, e) {
    setAddedProduk((oldItem) => [...oldItem, formData])
    setModalOpened(false)
    resetProduk()
  }

  return (
    <Dialog.Root
        open={isModalOpened}
        onOpenChange={setModalOpened}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-[99] bg-black/60" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-[100] flex max-h-[85vh] min-h-[20vh] w-[90vw] max-w-[60vw] translate-x-[-50%] translate-y-[-50%] flex-col rounded-[6px]  bg-white focus:outline-none ">
            <div className="relative flex max-h-screen max-w-4xl flex-col overflow-auto rounded-lg bg-white shadow dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between rounded-t border-b px-3 py-2 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tambah Produk Paket Wisata
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalTambahProdukOpen(false)}
                  className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="defaultModal"
                >
                  <Icons.close className="h-5 w-5" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="flex grow flex-col space-y-6 overflow-auto p-5">
                {/* form tambah */}
                <FormProvider {...methodsProduk}>
                  <form onSubmit={handleSubmitProduk(saveProduk)}>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="jenis_kendaraan_id"
                        value="Jenis Kendaraan Kendaraan"
                        className="mb-2 inline-block font-semibold"
                      />

                      <select
                        id="jenis_kendaraan_id"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        {...registerProduk("jenis_kendaraan_id", {
                          required: true,
                        })}
                      >
                        {jenisKendaraan.map((item) => (
                          <option key={`jenis-${item.id}`} value={item.id}>
                            {item.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2 block">
                      <Label
                        htmlFor="harga"
                        value="Harga"
                        className="mb-2 inline-block font-semibold"
                      />
                      <TextInput
                        id="harga"
                        type="number"
                        sizing="md"
                        name="harga"
                        {...registerProduk("harga", { required: true })}
                      />
                    </div>

                    <div className="flex justify-end py-2">
                      <Button type="submit">Simpan</Button>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
  )
}

export default ModalProdukPaketWisata