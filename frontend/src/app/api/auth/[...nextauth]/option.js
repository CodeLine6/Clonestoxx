import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

const prisma = new PrismaClient()

export const authOptions = {
    providers : [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier : {label: "Username", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if(!credentials) return null
                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            OR : [
                                {email: credentials.identifier},
                                {username: credentials.identifier}
                            ]
                        }
                    })

                    if(!user) throw new Error("User not found")
                    if(!user.isVerified) {
                        throw new Error("Please verify your email")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(!isPasswordCorrect) throw new Error("Incorrect password")
                    return user    
                }
                catch (error) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks : {
        async jwt({ token, user,trigger,session }) {
            if(user) {
                token._id  = user.id.toString()
                token.isVerified = user.isVerified
                token.username = user.username
                token.email = user.email
                token.firstName = user.firstName
                token.lastName = user.lastName
                token.image = user.image
                token.contactNumber = user.contactNumber
            }

            if(trigger === "update") {
                return {...token,...session.user}
            }
            return token
          },
        async session({ session, token }) {
            if(token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.username = token.username
                session.user.email = token.email
                session.user.firstName = token.firstName
                session.user.lastName = token.lastName
                session.user.image = token.image
                session.user.contactNumber = token.contactNumber
            }
            return session
          },
    },
    pages: {
        signIn: "/sign-in",
        
    },
    adapter: PrismaAdapter(prisma),
    session : {
        strategy: "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET,}