import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const SidebarLink = ({children, to = '#', active = false}) => {
  const router = useRouter()
  return (
    <li>
      <Link
        href={to}
        className={`flex items-center px-4 py-3 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${active ? 'bg-blue-100 text-sky-600' : 'text-gray-900'}`}
      >
        {children}
        
      </Link>
    </li>
  )
}

export default SidebarLink