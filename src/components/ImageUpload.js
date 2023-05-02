import React from 'react'

function ImageUpload({children}) {
  return (
    <div className='flex gap-2 w-full border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5'>
      {children}
    </div>
  )
}

export default ImageUpload