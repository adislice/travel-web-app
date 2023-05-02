import { useAuth } from '@/context/authContext'
import TestPage from '@/pages/test'
import { initFlowbite } from 'flowbite'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const AdminLayout = ({ children }) => {
  const router = useRouter()
  const { authUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !authUser){
      router.push('/login')
    }
  }, [authUser, loading])

  useEffect(() => {
    initFlowbite()
  }, [])

  return (!authUser) ? null : (
    <div className=''>
      <Navbar />
      <Sidebar />
      <div className="sm:ml-64 mt-14">
        {/* <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14"> */}
          {children}
        {/* </div> */}

      </div>

    </div>
  )
}

export default AdminLayout