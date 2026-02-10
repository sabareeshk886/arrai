import { DefaultSession } from "next-auth"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: UserRole
            clientId?: string
        } & DefaultSession["user"]
    }

    interface User {
        role: UserRole
        clientId?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: UserRole
        clientId?: string
    }
}
