import Link from "next/link"
import { twMerge } from "tailwind-merge"

export function LinkButton({children, className, href, ...otherProps}) {
  const mergedClassName = twMerge(
    "inline-flex items-center gap-x-1 rounded-md font-semibold bg-blue-600 px-3.5 py-2 text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    className
  )

  return (
    <Link className={mergedClassName} href={href} {...otherProps}>
      {children}
    </Link>
  )
}

export function Button({children, className, ...otherProps}) {
  const mergedClassName = twMerge(
    "inline-flex items-center gap-x-1 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    className
  )

  return (
  <button className={mergedClassName} {...otherProps}>
    {children}
  </button>)
}
