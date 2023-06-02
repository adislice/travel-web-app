import { useAuth } from "@/context/authContext"
import { NavigationContextProvider } from "@/context/navigationContext"
import TestPage from "@/pages/test"
import { initFlowbite } from "flowbite"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const AdminLayout = ({ children }) => {
  const [sidebarOpened, setSidebarOpened] = useState(false)
  const router = useRouter()
  const { authUser, loading } = useAuth()

  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/login")
    }
  }, [authUser, loading])

  useEffect(() => {
    initFlowbite()
  }, [])

  useEffect(() => {
    if (sidebarOpened) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [sidebarOpened])

  return !authUser ? null : (
    <div>
      <Sidebar
        sidebarOpened={sidebarOpened}
        setSidebarOpened={setSidebarOpened}
      />
      <div className="bg-main-container min-h-screen sm:ml-64">
        <Navbar
          sidebarOpened={sidebarOpened}
          setSidebarOpened={setSidebarOpened}
        />
        <div className="sm:px-5 pb-5">
          {/* <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14"> */}
          {children}
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
