import Link from 'next/link'
import { MailsIcon } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="flex justify-center mt-16">
      <div className="pt-16 space-y-12">
        <nav className="text-sm font-medium text-center space-x-6">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </nav>

        <div className="flex items-center justify-center">
          <a
            target="_blank"
            href="mailto:galihpras33@gmail.com"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="px-4 text-gray-800 hover:text-blue-500"
          >
            <MailsIcon className="w-8 h-8"/>
          </a>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            &copy; <Link href="/">BuyABlog</Link>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}