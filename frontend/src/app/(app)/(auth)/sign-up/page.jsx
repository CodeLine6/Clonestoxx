"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { signUpSchema } from "@/schemas/userSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from "usehooks-ts"
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"

const Page = () => {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 500)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            contactNumber: "",
        }
    })

    useEffect(() => {
        const checkUsrnameAvailability = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message)
                }
                catch (err) {
                    const axiosError = err
                    setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username')
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsrnameAvailability()
    }, [username])

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post("/api/sign-up", data)

            if (response.data.success) {
                toast({
                    title: "Success",
                    description: response.data.message,
                    variant: "success"
                })
                router.replace(`/verify/${username}`)
            } else {
                toast({
                    title: "Error",
                    description: response.data.message,
                    variant: "destructive"
                })
            }


        } catch (err) {
            let errorMessage = err?.response?.data.message
            if (errorMessage) {
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive"
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return <Card className="w-full max-w-md p-8 rounded-lg shadow-md">
        <CardHeader>
            <CardTitle className="text-4xl font-extrabold tracking-tight">
                Sign Up
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div id="fullname" className="grid sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="First Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Last Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field}
                                        onChange={e => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }} />
                                </FormControl>
                                {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4" />}
                                <p className={`text-sm ${usernameMessage === "Username is available" ? "text-green-600" : "text-red-600"}`}>
                                    {usernameMessage}
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div id="credentials" className="grid sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contact Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait</> : "Sign Up"}</Button>
                </form>
            </Form>
            <div className="text-center mr-4">
                <p>Already have an account?
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 ml-2">Sign In</Link></p>
            </div>
        </CardContent>
    </Card>
}

export default Page