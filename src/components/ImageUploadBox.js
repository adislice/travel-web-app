import React from "react"

const ImageUploadBox = ({ children, labelFor }) => {
  return (
    <label
      htmlFor={labelFor}
      className="grid h-24 w-24 cursor-pointer place-items-center rounded-md border-2 border-dashed border-gray-400 object-cover hover:bg-gray-100"
    >
      {children}
    </label>
  )
}

export default ImageUploadBox
