import { useAuth } from '@/context/authContext'
import { NavigationContextProvider } from '@/context/navigationContext'
import TestPage from '@/pages/test'
import { initFlowbite } from 'flowbite'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const AdminLayout = ({ children }) => {
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const router = useRouter()
  const { authUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/login')
    }
  }, [authUser, loading])

  useEffect(() => {
    initFlowbite()
  }, [])

  return (!authUser) ? null : (
      <div>

        <Sidebar sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened} />
        <div className="sm:ml-64 bg-main-container">
          <Navbar sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened} />
          <div className='p-5'>
            {/* <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14"> */}
            {children}
            {/* </div> */}
          </div>

        </div>

      </div>
  )
}

export default AdminLayout