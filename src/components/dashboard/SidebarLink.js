import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"

const SidebarLink = ({ children, to = "#", active = false }) => {
  const router = useRouter()
  return (
    <li>
      <Link
        href={to}
        className={`flex items-center rounded-lg px-4 py-3 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
          active ? "text-blue-600 font-semibold" : "text-gray-900"
        }`}
      >
        {children}
      </Link>
    </li>
  )
}

export default SidebarLink
