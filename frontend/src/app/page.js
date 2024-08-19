"use client"
import { signIn } from "next-auth/react"

const Page = () => <button onClick={() => signIn(undefined, { callbackUrl: '/signin' })}>
Sign in
</button>

export default Page 