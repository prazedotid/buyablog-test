import Link from 'next/link'

export function Header() {
  return (
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
              <div className="space-x-6 text-sm font-medium">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}