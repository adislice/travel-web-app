import { Spinner } from 'flowbite-react'
import React from 'react'

function LoadingDataSpinner() {
  return (
    <div className='flex items-center justify-center flex-col p-8'>
      <Spinner
        aria-label="Large spinner example"
        size="lg"
      />
      <small className='text-sm mt-2'>Loading data...</small>
    </div>
  )
}

export default LoadingDataSpinner