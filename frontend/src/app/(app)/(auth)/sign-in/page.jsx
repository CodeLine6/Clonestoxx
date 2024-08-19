"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { signInSchema } from "@/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"


const Signin = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toast } = useToast()
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(signInSchema),
    })

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        const response = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        })
        if (response?.error) {
            if (response?.error === "Error: Incorrect password") {
                toast({
                    title: "Login Failed",
                    description: "Incorrect email or password",
                    variant: "destructive"
                })
            }
            else {
                toast({
                    title: "Login Failed",
                    description: response?.error,
                    variant: "destructive"
                })
            }

            setIsSubmitting(false)
            return
        }

        if (response?.url) {
            router.replace('/dashboard')
        }


    }

    return <Card className="w-full max-w-md p-8 rounded-lg shadow-md">
        <CardHeader>
            <CardTitle className="text-4xl font-extrabold tracking-tight">
                Sign In
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email/Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email/Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex justify-between">
                                    <span>Password</span>
                                    <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 ml-auto underline">Forgot Password?</Link >
                                </FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait</> : "Sign In"}</Button>
                </form>
            </Form>
            <div className="text-center mr-4">
                <p>Create New Account
                    <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 ml-2">Sign Up</Link></p>
            </div>
        </CardContent>
    </Card>
}

export default Signin