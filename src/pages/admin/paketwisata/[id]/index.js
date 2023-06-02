import { useRouter } from "next/router"
import React from "react"

function PaketWisataIndex() {
  const router = useRouter()
  const { id } = router.query
  return <div>PaketWisataIndex: {id}</div>
}

export default PaketWisataIndex
