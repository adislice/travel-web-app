import { useRouter } from 'next/router'
import React from 'react'
import { Icons } from '../Icons'
import Navbar from './Navbar'
import SidebarLink from './SidebarLink'

const links = [
  {
    title: "Dashboard",
    url: '/admin/dashboard',
    icon: Icons.dashboard
  },
  {
    title: "Tempat Wisata",
    url: '/admin/tempatwisata',
    icon: Icons.tempatwisata
  },
  {
    title: "Paket Wisata",
    url: '/admin/paketwisata',
    icon: Icons.paketwisata
  },
  {
    title: "Transaksi",
    url: '/admin/transaksi',
    icon: Icons.transaksi
  },
  {
    title: "Laporan",
    url: '/admin/laporan',
    icon: Icons.laporan
  }
]

const Sidebar = () => {
  const router = useRouter()
  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2">
            {links.map((item, index) => (
              <SidebarLink key={index} to={item.url} active={router.asPath.startsWith(item.url) ? true : false} >
                {<item.icon className='h-5 w-5 mr-2' />}
                <span className="m">{item.title}</span>
              </SidebarLink>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}

export default Sidebar