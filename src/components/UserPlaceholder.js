import { twMerge } from "tailwind-merge"

function UserPlaceholder({nama, className}) {
  const mergedClassName = twMerge(
    "mx-auto my-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-medium",
    className
  )
  return (
    <div className={mergedClassName}>
      {nama?.[0]}
    </div>
  )
}

export default UserPlaceholder
