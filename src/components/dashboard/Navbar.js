import { useAuth } from '@/context/authContext'
import { NavigationContext } from '@/context/navigationContext'
import { auth } from '@/lib/firebase'
import { logOut } from '@/services/AuthService'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import CurrentTime from '../CurrentTime'
import { Icons } from '../Icons'

const Navbar = ({ setSidebarOpened }) => {
  const router = useRouter()
  const { authUser, loading } = useAuth();
  const [navigation, setNavigation] = useContext(NavigationContext)

  function logout() {
    Swal.fire({
      title: 'Anda Yakin?',
      text: "Anda yakin ingin keluar?",
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: "Batal",
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yakin!'
    }).then((result) => {
      if (result.value) {
        logOut().then(() => {
            Swal.fire({
              'title': 'Sukses',
              'icon': 'success',
              'text': 'Berhasil keluar!'
            })
            router.push('/login')
          }).catch(() => {
            Swal.fire({
              title: "Gagal!",
              text: "Gagal logout!",
              icon: 'error'
            })
          })

      }
    })
  }
  // console.log(authUser?.displayName)
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3">
        <div className="flex items-stretch gap-3">
          <div className="flex items-center justify-start">
            <button
              type="button"
              className="inline-flex items-center p-1 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={() => setSidebarOpened((oldValue) => !oldValue)}
            >
              <span className="sr-only">Open sidebar</span>
              <Icons.menu className='w-6 h-6' />
            </button>
          </div>

          <div className="flex whitespace-nowrap dark:text-white text-sm overflow-auto items-center">
            {navigation.map((item, index, navigation) => (
              <div key={`nav-${index}`}>
                <Link href={item.url} className={navigation.length != index + 1 ? "text-gray-600" : ""}>{item.title}</Link>
                {navigation.length == index + 1 ? null : (
                  <span className='mx-2'>/</span>
                )}
              </div>
            ))}
          </div>
          <div className="ml-auto flex items-center shrink-0">
            <div className="flex items-center ml-3">
              <div>
                <button
                  type="button"
                  className="flex text-sm items-center gap-2"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full bg-gray-800 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user photo"
                  />
                  <div className='hidden md:block'>{authUser?.displayName}</div>
                  <Icons.chevronDown className='h-4 w-4' />
                </button>
              </div>
              <div
                className="z-50 border border-gray-100 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-xl dark:bg-gray-700 dark:divide-gray-600"
                id="dropdown-user"
              >
                <div className="px-4 py-3" role="none">
                  <p
                    className="text-sm text-gray-900 dark:text-white"
                    role="none"
                  >
                    {authUser?.displayName}
                  </p>
                  <p
                    className="text-sm text-gray-600 truncate dark:text-gray-300"
                    role="none"
                  >
                    {authUser?.email}
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      Earnings
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      onClick={logout}
                      className="flex gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      role="menuitem"
                    >
                      <Icons.logout className='h-5 w-5' />
                      <span>Sign out</span>
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