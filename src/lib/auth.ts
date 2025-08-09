// lib/auth.ts
import { NextAuthOptions, type DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'

// Extend NextAuth types: keep default user fields (name, email, image) and add id/role
declare module 'next-auth' {
  interface User {
    role?: string
  }
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = (await prisma.user.findUnique({
          where: { email: credentials.email },
        })) as unknown as { id: string; email: string; name: string | null; role: any; image: string | null; websiteUrl: string | null; bio: string | null; createdAt: Date; updatedAt: Date; password?: string | null }

        if (!user) {
          if (process.env.NODE_ENV !== 'production') console.warn('[auth] user not found for', credentials.email)
          return null
        }

        // Verify using bcrypt against stored hashed password from shared DB
        const isPasswordValid = !!user.password && await compare(credentials.password, user.password)
        if (!isPasswordValid && process.env.NODE_ENV !== 'production') {
          console.warn('[auth] invalid password or missing hash for', credentials.email, 'hasPassword:', !!user.password)
        }

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  debug: process.env.NODE_ENV !== 'production',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
} 