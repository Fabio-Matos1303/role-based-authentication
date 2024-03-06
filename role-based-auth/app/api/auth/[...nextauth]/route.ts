import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

const authOption = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!profile?.email) {
        throw new Error('Email not found')
      }

      await prisma.user.upsert({
        where: {
          email: profile.email
        },
        create: {
          name: profile.name,
          email: profile.email
        },
        update: {
          name: profile.name
        }
      })

      return true
    }
  }
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }