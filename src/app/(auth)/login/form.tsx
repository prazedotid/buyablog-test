'use client'

import { signIn } from 'next-auth/react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()

    const res = await signIn('credentials', {
      username: formValues.username,
      password: formValues.password,
      redirect: false,
      callbackUrl: '/admin',
    })

    if (!res?.error) {
      router.push('/admin')
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target
    setFormValues({...formValues, [name]: value})
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="admin"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          value={formValues.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
          value={formValues.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign
        in
      </button>
    </form>
  )
}