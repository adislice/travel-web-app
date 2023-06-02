import React from "react"

function Button({ children }) {
  return (
    <button
      type="button"
      class="mr-2 mb-2 rounded-lg bg-gray-800 py-2.5 px-5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
    >
      {children}
    </button>
  )
}

export default Button
