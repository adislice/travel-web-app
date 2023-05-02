import React from 'react'

const ImageUploadItem = ({children}) => {
  return (
    <div className='h-24 w-24 border border-gray-300 overflow-hidden rounded-md grid place-items-center object-cover'>
                 {children}
    </div>
  )
}

export default ImageUploadItem