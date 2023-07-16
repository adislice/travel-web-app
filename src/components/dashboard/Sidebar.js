import { useRouter } from "next/router"
import React from "react"
import { Icons } from "../Icons"
import Navbar from "./Navbar"
import SidebarLink from "./SidebarLink"

const links = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Icons.dashboard,
  },
  {
    title: "Pengguna",
    url: "/admin/users",
    icon: Icons.users
  },
  {
    title: "Tempat Wisata",
    url: "/admin/tempatwisata",
    icon: Icons.tempatwisata,
  },
  {
    title: "Paket Wisata",
    url: "/admin/paketwisata",
    icon: Icons.paketwisata,
  },
  {
    title: "Pemesanan",
    url: "/admin/pemesanan",
    icon: Icons.transaksi,
  },
  {
    title: "Laporan",
    url: "/admin/laporan",
    icon: Icons.laporan,
  },
]

const Sidebar = ({ sidebarOpened, setSidebarOpened }) => {
  const router = useRouter()
  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white pt-16 transition-transform dark:border-gray-700 dark:bg-gray-800 sm:translate-x-0 sm:pt-0 ${
          sidebarOpened ? "transform-none" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="px-5 py-3.5 text-xl font-bold">Kencana Admin</div>
        <div className="h-full overflow-y-auto bg-white px-3 pb-4 pt-4 dark:bg-gray-800">
          <ul className="space-y-2">
            {links.map((item, index) => (
              <SidebarLink
                key={index}
                to={item.url}
                active={router.asPath.startsWith(item.url) ? true : false}
              >
                {<item.icon className="mr-4 h-5 w-5" />}
                <span className="">{item.title}</span>
              </SidebarLink>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
