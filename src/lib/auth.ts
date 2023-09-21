import { compare } from 'bcrypt'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import prisma from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'admin' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string
          password: string
        }

        const user = await prisma.users.findUnique({
          where: { username },
        })
        if (!user) {
          return null
        }

        const isValidPassword = await compare(password, user.password)
        if (!isValidPassword) {
          throw new Error('Invalid password.')
        }

        return user
      }
    })
  ],
}