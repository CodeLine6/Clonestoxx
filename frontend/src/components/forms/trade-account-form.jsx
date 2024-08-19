"use client"

import { tradeAccountSchema } from "@/schemas/tradeAccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import { Heading } from "../ui/heading";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { createTradeAccount, updateTradeAccount } from "@/actions/tradeAccounts";
import { useToast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

function TradeAccountForm({ accountData }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const title = accountData ? "Edit Trade Account" : "Add Trade Account"
    const description = accountData ? "Edit a trade account" : "Add a new trade account"
    const toastMessage = accountData ? 'Trade Account Updated.' : 'Trade Account Created.';
    const action = accountData ? 'Save changes' : 'Create';
    const { accountId } = useParams()
    const router = useRouter();

    const defaultValues = accountData ?? {
        appId: '',
        appSecret: '',
        accountUserId: '',
    }

    const form = useForm({
        resolver: zodResolver(tradeAccountSchema),
        defaultValues
    })

    const onCreate = async (data) => {
        setIsSubmitting(true)
        console.log(data)
        try {
            const newTradeAccount = await createTradeAccount(data)

            if (newTradeAccount.success) {
                form.reset()
                router.push('/dashboard/trade-accounts')
                return toast({
                    title: toastMessage,
                    description: "Your trade account has been created successfully",
                    variant: "success"
                })
            }

            toast({
                title: "Error",
                description: newTradeAccount.message,
                variant: "destructive"
            })
        }
        catch (e) {
            toast({
                title: "Error",
                description: e.message,
                variant: "destructive"
            })
        }
        finally {
            setIsSubmitting(false)
        }
    }

    const onUpdate = async (data) => {
        setIsSubmitting(true)
        try {
            const updatedTradeAccount = await updateTradeAccount({
                ...data,
                id: accountId
            })

            if (updatedTradeAccount.success) {
                return toast({
                    title: toastMessage,
                    description: "Your trade account has been updated successfully",
                    variant: "success"
                })
            }

            toast({
                title: "Error",
                description: updatedTradeAccount.message,
                variant: "destructive"
            })
        }
        catch (e) {
            toast({
                title: "Error",
                description: e.message,
                variant: "destructive"
            })
        }
        finally {
            setIsSubmitting(false)
        }
    }


    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(accountData ? onUpdate : onCreate)} className='w-full space-y-8'>
                    <div className="gap-8 md:grid md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormDescription>Give a unique title to identify this trade account (optional)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="appId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>App ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="App ID" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter your app ID</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="appSecret"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>App Secret</FormLabel>
                                    <FormControl>
                                        <Input placeholder="App Secret" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter your app secret</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="accountUserId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Account User ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Account User ID" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter your account user ID</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contact Number" {...field} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                                    </FormControl>
                                    <FormDescription>Enter your contact number</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PIN</FormLabel>
                                    <FormControl>
                                        <Input placeholder="PIN" {...field} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
                                    </FormControl>
                                    <FormDescription>Enter your PIN</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="totp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>TOTP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="TOTP" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter your TOTP</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={isSubmitting} >{isSubmitting ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : action}</Button>
                </form>
            </Form>
        </>
    )
}

export default TradeAccountForm