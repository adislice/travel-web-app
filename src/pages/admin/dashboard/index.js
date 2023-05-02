import { useAuth } from '@/context/authContext'
import AdminLayout from '@/components/dashboard/Layout'
import Head from 'next/head'

function DashboardIndexPage() {
  const { authUser, loading } = useAuth()

  return (
    <AdminLayout>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h3 className='p-5 text-2xl text-gray-800 font-semibold'>Dashboard</h3>
      
      <div className='px-5'>Selamat datang, {authUser?.displayName} 👋</div>
      </AdminLayout>
  )
}

export default DashboardIndexPage