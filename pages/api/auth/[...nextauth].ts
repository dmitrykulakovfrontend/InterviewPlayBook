import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import { JWT } from "next-auth/jwt"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "utils/prisma"
import {compare} from "bcrypt"
export const authOptions: next = {
  adapter: PrismaAdapter(prisma),
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
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" },
      email: {label: "Email", type: "text", placeholder: "jsmith@gmail.com"}
    },
    async authorize(credentials) {
      const user = await prisma.user.findFirst({where: { email: credentials?.email,}})
      
      if (!user) throw new Error('No user found with the email');
      if (!credentials?.password || !user.password) return null;

      const validPassword = compare(credentials.password, user.password);

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
    signUp: '/auth/signup',
  },
  session: {
     strategy: "jwt",
     maxAge: 3000,
  }
}
export default NextAuth(authOptions)