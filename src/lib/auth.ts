import { compare } from 'bcrypt'
import { DefaultSession, NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import prisma from '@/lib/prisma'

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string
    };
  }
}

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
      },
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user && token.user) token.user.id = user.id
      return token
    },
    session: async ({ session, token }) => {
      if (session.user && token.user) session.user.id = token.user.id
      return session
    }
  },
}