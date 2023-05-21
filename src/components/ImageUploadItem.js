import React from 'react'
import { Icons } from './Icons'

const ImageUploadItem = ({children, onDeleteClicked}) => {
  return (
    <div className='relative h-24 w-24 border border-gray-300 overflow-hidden rounded-md grid place-items-center object-cover'>
      {children}
      <button type='button' className='absolute opacity-0 z-30 hover:opacity-100 bg-white shadow p-1 rounded-full' onClick={onDeleteClicked}><Icons.hapus className='text-red-500' /></button>
    </div>
  )
}

export default ImageUploadItem