'use client'

import Link from 'next/link'

import HeaderButton from '@/components/HeaderButton'
import React, { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon'
import { Transition } from '@headlessui/react'
import { SearchIcon } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    router.push('/?' + new URLSearchParams({ page: '1', search: formData.get('search') as string }).toString())
    setIsSearchOpen(false)
  }

  return (
    <>
      <nav className="mb-10">
        <div className="container mx-auto">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 flex items-center mr-auto">
                <Link href="/" className="text-3xl font-black">
                  BuyABlog
                </Link>
              </div>
              <div className="hidden sm:ml-12 sm:flex sm:items-center">
                <div className="flex items-center space-x-6 text-sm font-medium">
                  <HeaderButton url="/">Home</HeaderButton>
                  <HeaderButton url="/about">About</HeaderButton>
                  <button onClick={() => setIsSearchOpen(true)}>
                    <SearchIcon size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {typeof window === 'object' && createPortal(
        <Transition
          as={Fragment}
          show={isSearchOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70">
            <form onSubmit={handleSearchSubmit} className="h-full flex items-start justify-center pt-16">
              <input name="search" type="text"
                     className="block bg-white border border-gray-300 px-6 py-6 text-xl rounded w-1/2 focus:outline-none"
                     placeholder="Search..."/>
            </form>

            <div className="absolute right-0 top-0 pt-6 pr-6">
              <button className="rounded-full bg-gray-200 p-4" onClick={() => setIsSearchOpen(false)}>
                <CloseIcon/>
              </button>
            </div>
          </div>
        </Transition>,
        document.body,
      )}
    </>
  )
}