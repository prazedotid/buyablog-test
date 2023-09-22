'use client'

import { clsx } from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  url: string
  children: React.ReactNode
}

export default function HeaderButton({url, children}: Props) {
  const pathName = usePathname()
  const className = clsx('rounded', pathName === url ? 'text-blue-600' : 'text-gray-60')

  return (
    <Link href={url} className={className}>{children}</Link>
  )
}