import { useAuth } from "@/context/authContext"
import { useFirebaseAuth } from "@/context/FirebaseAuthContext"
import { NavigationContext } from "@/context/navigationContext"
import { auth, database } from "@/lib/firebase"
import { logOut } from "@/services/AuthService"
import { collection, doc, getDoc } from "firebase/firestore"
import { initFlowbite } from "flowbite"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import CurrentTime from "../CurrentTime"
import { Icons } from "../Icons"
import UserPlaceholder from "../UserPlaceholder"

const Navbar = ({ setSidebarOpened }) => {
  const router = useRouter()
  const [authUser, authUserData] = useFirebaseAuth()
  const [navigation, setNavigation] = useContext(NavigationContext)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    initFlowbite()
  }, [])

  function logout() {
    Swal.fire({
      title: "Anda Yakin?",
      text: "Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      confirmButtonText: "Yakin!",
    }).then((result) => {
      if (result.value) {
        logOut()
          .then(() => {
            Swal.fire({
              title: "Sukses",
              icon: "success",
              text: "Berhasil keluar!",
            })
            router.push("/login")
          })
          .catch(() => {
            Swal.fire({
              title: "Gagal!",
              text: "Gagal logout!",
              icon: "error",
            })
          })
      }
    })
  }
  // console.log(authUserData?.displayName)
  return (
    <nav className="sticky top-0 z-50 w-full border-b shadow-sm border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="px-3 py-3">
        <div className="flex items-stretch gap-3">
          <div className="flex items-center justify-start">
            <button
              type="button"
              className="inline-flex items-center rounded-lg p-1 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
              onClick={() => setSidebarOpened((oldValue) => !oldValue)}
            >
              <span className="sr-only">Open sidebar</span>
              <Icons.menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center overflow-auto whitespace-nowrap text-sm dark:text-white">
            {navigation.map((item, index, navigation) => (
              <div key={`nav-${index}`}>
                <Link
                  href={item.url}
                  className={
                    navigation.length != index + 1 ? "text-gray-600" : ""
                  }
                >
                  {item.title}
                </Link>
                {navigation.length == index + 1 ? null : (
                  <span className="mx-2">/</span>
                )}
              </div>
            ))}
          </div>
          <div className="ml-auto flex shrink-0 items-center">
            <div className="ml-3 flex items-center">
              <div>
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm hover:bg-gray-100 rounded"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  {authUserData != null ? (
                  <img
                    className="h-8 w-8 rounded-full bg-gray-800 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    src={authUserData?.foto}
                    alt={`${authUserData?.nama} user photo`}
                  />
                  ) : (
                    <UserPlaceholder nama={authUserData?.nama} className="h-8 w-8 my-0"/>
                  )}
                  
                  <div className="hidden md:block">{authUserData?.nama}</div>
                  <Icons.chevronDown className="h-4 w-4" />
                </button>
              </div>
              <div
                className="z-50 my-4 hidden list-none divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white text-base shadow-xl dark:divide-gray-600 dark:bg-gray-700"
                id="dropdown-user"
              >
                <div className="px-4 py-3" role="none">
                  <p
                    className="text-sm text-gray-900 dark:text-white"
                    role="none"
                  >
                    {authUserData?.displayName}
                  </p>
                  <p
                    className="truncate text-sm text-gray-600 dark:text-gray-300"
                    role="none"
                  >
                    {authUserData?.email}
                  </p>
                </div>
                <ul className="py-1" role="none">
                  <li>
                    <div
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      <CurrentTime />
                    </div>
                  </li>
                </ul>
                <ul className="py-1" role="none">
                  
                  
                  <li>
                    <a
                      href="#"
                      onClick={logout}
                      className="flex gap-2 py-2 px-4 text-sm text-red-700 hover:bg-red-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      <Icons.logout className="h-5 w-5" />
                      <span>Keluar</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
