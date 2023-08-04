import * as Dialog from "@radix-ui/react-dialog"
import { FormProvider, useForm } from "react-hook-form"
import FormInputError from "./FormInputError"
import { Label, TextInput } from "flowbite-react"
import { Button } from "./Button"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Swal from "sweetalert2"

export default function ModalResetPassword({ isModalOpened, setModalOpened }) {
  const methods = useForm({ mode: "onBlur" })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods

  const submitForm= (formData) => {
    sendPasswordResetEmail(auth, formData.email_reset).then(() => {
      setModalOpened(false)
      Swal.fire({
        title: "Berhasil!",
        text: "Tautan untuk reset password dikirim ke Email Anda. Silahkan cek email Anda dan klik tautan tersebut",
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "Ok",
      })
    }).catch((error) => {
      setModalOpened(false)
      Swal.fire({
        title: "Gagal!",
        text: "Reset password gagal. Silahkan coba beberapa saat lagi",
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "Ok",
      })
    })
  }


  return (
    <Dialog.Root
      open={isModalOpened}
      onOpenChange={setModalOpened}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-[99] bg-black/60" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-[100] flex  w-[40vw] max-w-[60vw] translate-x-[-50%] translate-y-[-50%] flex-col rounded-[6px]  bg-white p-[25px] focus:outline-none ">
          <Dialog.Title className="text-mauve12 m-0 mb-4 text-[17px] font-medium">
            Reset Password
          </Dialog.Title>
          <div className="flex-1 overflow-auto rounded p-4">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(submitForm)} className="flex flex-col items-start">
                <div className="mb-2 block w-full">
                  <Label
                    htmlFor="email_reset"
                    value="Masukkan Email Anda yang Terdaftar"
                    className="mb-2 inline-block font-semibold"
                  />
                  <TextInput
                    id="email_reset"
                    type="email"
                    sizing="md"
                    name="email_reset"
                    placeholder="Email@gmail.com"
                    {...register("email_reset", {
                      required: "Email tidak boleh kosong",
                    })}
                  />
                  <FormInputError errorState={errors.email_reset} />
                </div>
                <Button type="submit" className="ml-auto">Reset</Button>
              </form>
            </FormProvider>

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}