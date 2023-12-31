import '../globals.css'
import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'

import Header from './Header'
import { authOptions } from '@/lib/auth'
import { getCurrentUser } from '@/lib/session'

const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'Buyablog Admin Panel',
}

export default async function RootLayout({
                                           children,
                                         }: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect(authOptions.pages?.signIn || '/api/auth/signin')
  }

  return (
    <html lang="en" className={'light h-full'}>
      <body className={inter.className + ' h-full pb-6 bg-white'}>
        <Header/>
        <main className='container mx-auto pt-16'>
          <div className='py-6'>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
