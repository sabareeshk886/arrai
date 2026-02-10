import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                    include: {
                        clientAccess: true,
                    },
                })

                if (!user || !user.password) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    clientId: user.clientAccess?.clientId,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role as UserRole
                token.clientId = (user as any).clientId
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.sub!
                session.user.role = token.role as UserRole
                session.user.clientId = token.clientId as string | undefined
            }
            return session
        },
    },
})
