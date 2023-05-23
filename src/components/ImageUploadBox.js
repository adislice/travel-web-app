import React from 'react'

const ImageUploadBox = ({children, labelFor}) => {
  return (
    <label htmlFor={labelFor} className='cursor-pointer h-24 w-24 border-2 border-gray-400 hover:bg-gray-100 border-dashed rounded-md grid place-items-center object-cover'>
                 {children}
    </label>
  )
}

export default ImageUploadBox