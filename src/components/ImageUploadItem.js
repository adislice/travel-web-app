import React from "react"
import { Icons } from "./Icons"

const ImageUploadItem = ({ children, onDeleteClicked }) => {
  return (
    <div className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-md border border-gray-300 object-cover">
      {children}
      <button
        type="button"
        className="absolute z-30 rounded-full bg-white p-1 opacity-50 shadow transition-opacity duration-200 hover:opacity-100"
        onClick={onDeleteClicked}
      >
        <Icons.hapus className="text-red-500" />
      </button>
    </div>
  )
}

export default ImageUploadItem
