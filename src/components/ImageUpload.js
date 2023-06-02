import React from "react"

function ImageUpload({ children }) {
  return (
    <div className="flex w-full flex-wrap gap-2 rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
      {children}
    </div>
  )
}

export default ImageUpload
