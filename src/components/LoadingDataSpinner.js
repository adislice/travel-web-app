import { Spinner } from "flowbite-react"
import React from "react"

function LoadingDataSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <Spinner aria-label="Large spinner example" size="lg" />
      <small className="mt-2 text-sm">Loading data...</small>
    </div>
  )
}

export default LoadingDataSpinner
