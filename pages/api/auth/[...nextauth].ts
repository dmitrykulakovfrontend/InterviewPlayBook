import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import { JWT } from "next-auth/jwt"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "utils/prisma"
import {compare} from "bcrypt"
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role
      }
  
      return token
    },
    session: async ({ session, token }) => {
      session.user.role = token.role
      return session
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

  CredentialsProvider({
    name: "Credentials",
    credentials: {
      password: { label: "Password", type: "password" },
      email: {label: "Email", type: "text", placeholder: "jsmith@gmail.com"}
    },
    async authorize(credentials) {
      const user = await prisma.user.findFirst({where: { email: credentials?.email,}})
      
      if (!user) throw new Error('No user found with the email');
      if (!credentials?.password || !user.password) return null;

      const validPassword = await compare(credentials.password, user.password);
      console.log(validPassword);

      if (!validPassword) throw new Error('Password doesnt match');
      console.log('valid all right')

      return user;
    }
  })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
     strategy: "jwt",
     maxAge: 3000,
  }
}
export default NextAuth(authOptions)