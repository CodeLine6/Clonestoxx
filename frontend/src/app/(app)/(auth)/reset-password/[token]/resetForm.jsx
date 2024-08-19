"use client"

import resetPassword from '@/actions/resetPassword'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

const ResetForm = ({ userId }) => {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const response = await resetPassword(userId, data.password)

            if (response.success) {
                toast({
                    title: "Password Reset Successful",
                    description: "You can now login with your new password",
                    variant: "success"
                })
                router.push("/sign-in")
            }

            else {
                toast({
                    title: "Error Completing Reset Request",
                    description: response.message,
                    variant: "destructive"
                })
            }
        }

        catch (err) {
            toast({
                title: "Error Completing Reset Request",
                description: err.message,
                variant: "destructive"
            })
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return <Card className="w-full max-w-md p-8 rounded-lg shadow-md">
        <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Set your new password</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Re-Enter Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait</> : "Submit"}</Button>
                </form>
            </Form>
        </CardContent>
    </Card>
}

export default ResetForm