import Link from "next/link"
import React from "react"

function Href(props) {
  return (
    <Link {...props} className={`hover:underline ${props.className}`}>
      {props.children}
    </Link>
  )
}

export default Href
