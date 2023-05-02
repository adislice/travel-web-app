import { Icons } from '@/components/Icons'
import { useEffect } from 'react'

const TestPage = () => {
  return (
    <div className='flex h-screen items-center justify-center flex-col'>
      <Icons.login className='animate-pulse h-[4.5rem] w-[4.5rem] mb-2 text-gray-700' />
      <div>...</div>
    </div>

  )
}

export default TestPage