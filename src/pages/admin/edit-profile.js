import AdminLayout from '@/components/dashboard/Layout'
import { useFirebaseAuth } from '@/context/FirebaseAuthContext'
import { getUserDetailRealtime } from '@/services/UserService'
import { useRouter } from 'next/router'
import {useEffect, useState} from 'react'
import Swal from 'sweetalert2'

function EditProfilePage() {
    const [authUser, authUserData] = useFirebaseAuth()
    const router = useRouter()
    const [userData, setUserData] = useState({})

    useEffect(() => {
        if (authUserData) {
            setUserData(authUserData)
        }
    }, [router.isReady, authUserData])

    return (
        <AdminLayout>
            <h1>Edit Profile</h1>
            <div>
                Hi, {userData.nama}
                
            </div>
        </AdminLayout>
    )
}

export default EditProfilePage