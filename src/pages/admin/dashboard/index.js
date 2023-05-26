import { useAuth } from '@/context/authContext'
import AdminLayout from '@/components/dashboard/Layout'
import Head from 'next/head'
import { Icons } from '@/components/Icons'
import { useContext, useEffect, useState } from 'react'
import { getRekapDashboard } from '@/services/DashboardService'
import { useNav } from '@/context/navigationContext'

function DashboardIndexPage() {
  const { authUser, loading } = useAuth()
  const [navigation, setNavigation] = useNav()
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    paket_wisata: 0,
    tempat_wisata: 0,
    transaksi: 0
  })


  useEffect(() => {
    setNavigation([
      {
        title: "Dashboard",
        url: "/admin/dashboard"
      }
    ])
    
    getRekapDashboard().then((data) => {
      setDashboardData(data)
    })
  }, [])

  return (
    <AdminLayout>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h3 className='p-5 text-2xl text-gray-800 font-semibold'>Dashboard</h3>

      <div className='p-5 rounded-lg bg-white'>
        <div className='mb-4'>Selamat datang, {authUser?.displayName} 👋</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className='dashboard-card rounded-lg bg-green-100 flex flex-row items-center p-5'>
            <div>
              <h5 className='text-sm font-semibold'>User</h5>
              <div className='text-2xl font-bold'>{dashboardData.users}</div>
              <div className='text-xs flex'>
                User terdaftar
                <Icons.arrowRight className='arrow h-4 w-4' />
                </div>
            </div>
            <div className='ml-auto'>
              <Icons.users className='h-10 w-10 text-green-500' />
            </div>
          </div>
          <div className='dashboard-card rounded-lg bg-blue-100 flex flex-row items-center p-5'>
            <div>
              <h5 className='text-sm font-semibold'>Paket Wisata</h5>
              <div className='text-2xl font-bold'>{dashboardData.paket_wisata}</div>
              <div className='text-xs flex flex-row'>Paket wisata tersedia
              <Icons.arrowRight className='arrow h-4 w-4' /></div>
            </div>
            <div className='ml-auto'>
              <Icons.paketwisata className='h-10 w-10 text-blue-500' />
            </div>
          </div>
          <div className='dashboard-card rounded-lg bg-rose-100 flex flex-row items-center p-5'>
            <div>
              <h5 className='text-sm font-semibold'>Tempat Wisata</h5>
              <div className='text-2xl font-bold'>{dashboardData.tempat_wisata}</div>
              <div className='text-xs flex flex-row'>Tempat wisata dilayani
              <Icons.arrowRight className='arrow h-4 w-4' /></div>
            </div>
            <div className='ml-auto'>
              <Icons.tempatwisata className='h-10 w-10 text-rose-500' />
            </div>
          </div>
          <div className='dashboard-card rounded-lg bg-amber-100 flex flex-row items-center p-5'>
            <div>
              <h5 className='text-sm font-semibold'>Transaksi</h5>
              <div className='text-2xl font-bold'>{dashboardData.transaksi}</div>
              <div className='text-xs flex flex-row'>Transaksi berhasil
              <Icons.arrowRight className='arrow h-4 w-4' /></div>
            </div>
            <div className='ml-auto'>
              <Icons.transaksi className='h-10 w-10 text-amber-500' />
            </div>
          </div>
        </div>
      </div>


    </AdminLayout>
  )
}

export default DashboardIndexPage