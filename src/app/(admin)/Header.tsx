import Link from 'next/link'

import { getCurrentUser } from '@/lib/session'
import { notFound } from 'next/navigation'
import HeaderButton from '../../components/HeaderButton'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const user = await getCurrentUser()
  if (!user) {
    notFound()
  }

  const links = [
    { url: '/admin', name: 'Home' },
    { url: '/admin/posts', name: 'Posts' },
    { url: '/admin/categories', name: 'Categories' },
  ]

  return (
    <nav className="fixed z-30 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-shrink-0 flex justify-start items-center">
              <Link href="/admin" className="mr-14">
                <div className="text-3xl font-black">BuyABlog</div>
                <div className="text-xs font-bold tracking-widest">ADMIN</div>
              </Link>
              <div className="justify-between items-center flex order-1">
                <ul className="flex flex-col mt-4 space-x-6 text-sm font-medium lg:flex-row xl:space-x-8 lg:mt-0">
                  {links.map((l, i) => (
                    <li key={i}>
                      <HeaderButton url={l.url}>{l.name}</HeaderButton>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-gray-600 mr-2">
                Hello, {user.name}!
              </div>
              <div className="mr-2">
                &middot;
              </div>
              <div className="space-x-6 text-sm font-medium">
                <LogoutButton/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}