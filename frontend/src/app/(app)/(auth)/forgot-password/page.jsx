"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { forgetPasswordSchema } from "@/schemas/forgetPasswordSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import axios from "axios"

const ForgetPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [resetPasswordLinkSent, setResetPasswordLinkSent] = useState(false)
    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            email: ""
        }
    })

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post("/api/forget-password", {
                email: data.email
            })

            if (response.data.success) setResetPasswordLinkSent(true)

            else {
                toast({
                    title: "Error Completing Reset Request",
                    description: response.data.message,
                    variant: "destructive"
                })
            }
        }
        catch (err) {
            let errorMessage = err?.response?.data.message
            if (errorMessage) {
                toast({
                    title: "Error Completing Reset Request",
                    description: errorMessage,
                    variant: "destructive"
                })
            }
        } finally {
            setIsSubmitting(false)
        }

    }

    if (resetPasswordLinkSent) {
        return <Card className="w-full max-w-md p-8 rounded-lg shadow-md">
            <CardHeader>
                <CardTitle>Check Your Email</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-5">An email has been sent to your email address to reset your password</p>
                <Link href="/sign-in" className="underline">Back to Log In</Link>
            </CardContent>
        </Card>
    }
    return <Card className="w-full max-w-md p-8 rounded-lg shadow-md">
        <CardHeader>
            <CardTitle>Forget Password</CardTitle>
            <CardDescription>Enter your email and we will send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} placeholder="Enter your email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait</> : "Send Reset Link"}</Button>
                </form>
            </Form>
        </CardContent>
    </Card>
}

export default ForgetPassword