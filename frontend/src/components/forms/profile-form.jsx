'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { useToast } from '@/components/ui/use-toast';
import { profileSchema } from '@/schemas/userSchema';
import { Separator } from '../ui/separator';
import FileUpload from '../profile-image';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import ProfileEmailInput from '../ProfileEmailInput';

const ProdfileForm = ({ sessionData }) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session, update } = useSession()

    const initialValues = {
        firstName: sessionData.user.firstName,
        lastName: sessionData.user.lastName,
        email: sessionData.user.email,
        image: sessionData.user.image || '',
        contactNumber: sessionData.user.contactNumber || '',
    }

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: initialValues,
        mode: 'onChange'
    })


    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/update-profile/${sessionData.user.username}`, data)

            if (response.data.success) {
                await update({ ...session, user: { ...session.user, ...data } })
                toast({
                    title: "Profile updated successfully",
                    description: "Your profile has been updated successfully",
                    variant: "success"
                })
            }
            else {
                if (response.status === 404) {
                    toast({
                        title: "User not found",
                        description: "The user you're trying to update does not exist",
                        variant: "destructive"
                    })
                }
                else {
                    toast({
                        title: "Error updating profile",
                        description: "An error occurred while updating your profile",
                        variant: "destructive"
                    })
                }
            }
        }
        catch (err) {
            console.error("Error updating profile", err)
            toast({
                title: "Error updating profile",
                description: err.message,
                variant: "destructive"
            })
        }
        finally { setIsSubmitting(false) }
    }

    return <>
        <div className="flex items-center justify-between">
            <Heading title={"Profile"} description={"Update your profile"} />
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Image</FormLabel>
                            <FormControl>
                                <FileUpload
                                    onChange={field.onChange}
                                    value={field.value}
                                    onRemove={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="gap-8 md:grid md:grid-cols-3">
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

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <ProfileEmailInput username={sessionData.user.username} form={form} {...field} />
                                </FormControl>
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
                                    <Input placeholder="Contact Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={isSubmitting || form.formState.errors.email} className="">{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}</Button>
            </form>
        </Form>
    </>

}

export default ProdfileForm