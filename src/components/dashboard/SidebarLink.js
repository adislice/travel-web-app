import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const SidebarLink = ({children, to = '#', active = false}) => {
  const router = useRouter()
  return (
    <li>
      <Link
        href={to}
        className={`flex items-center px-3 py-2.5 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${active ? 'bg-gray-200' : ''}`}
      >
        {children}
        
      </Link>
    </li>
  )
}

export default SidebarLink