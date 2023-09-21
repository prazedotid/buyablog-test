import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import LoginForm from './form'
import { authOptions } from '@/lib/auth'

export default async function Login() {
  const session = await getServerSession(authOptions)
  if (session) {
    redirect('/admin')
  }

  return (
    <section className="bg-gray-100">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="mb-6 text-2xl font-semibold text-gray-900">
          <div className="text-3xl font-black">BuyABlog</div>
          <div className="text-xs font-bold tracking-widest">ADMIN</div>
        </div>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <LoginForm/>
          </div>
        </div>
      </div>
    </section>
  )
}