"use client"

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

import { clonerSchema } from "@/schemas/clonerSchema";
import { upsertCloner } from "@/actions/cloners";
import { useToast } from "../ui/use-toast";

import { Separator } from "../ui/separator";
import { Heading } from "../ui/heading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClonerForm = ({ clonerData, tradeAccountsList }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const { clonerId } = useParams();
    const router = useRouter();

    const isEditMode = !!clonerData;
    const formConfig = {
        title: isEditMode ? "Edit Cloner" : "Add Cloner",
        description: isEditMode ? "Edit a cloner" : "Add a new cloner",
        toastMessage: isEditMode ? 'Cloner Updated.' : 'Cloner Created.',
        action: isEditMode ? 'Save changes' : 'Create'
    };

    const defaultValues = clonerData ?? {
        name: undefined,
        masterAccountId: undefined,
        childAccounts: [{ accountId: undefined, modifierPercentage: 100 }],
    };

    const form = useForm({
        resolver: zodResolver(clonerSchema),
        defaultValues
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "childAccounts",
    });

    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const result = await upsertCloner(isEditMode ? { id: clonerId, ...data } : data);
            if (!result.success) {
                throw new Error(result.message);
            }
            toast({
                title: formConfig.toastMessage,
                description: `Cloner has been ${isEditMode ? 'updated' : 'created'} successfully`,
            });
            router.push('/dashboard/cloners'); // Assuming you want to redirect after successful submission
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAvailableAccounts = (index) => {
        const childAccounts = form.getValues("childAccounts");
        const masterAccountId = index !== -1 ? form.getValues("masterAccountId") : { id: null };
        return tradeAccountsList.filter(account =>
            account.id !== masterAccountId &&
            childAccounts.every((child, idx) => idx === index || child.accountId !== account.id)
        );
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={formConfig.title} description={formConfig.description} />
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Cloner Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="masterAccountId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Master Account</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Master Account" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {getAvailableAccounts(-1).map((account) => (
                                            <SelectItem key={account.id} value={account.id}>
                                                {account.title !== "" ? account.title : "(Untitled)"} - App ID: {account.appId}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <FormLabel>Child Accounts</FormLabel>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-32"
                                onClick={() => append({ accountId: undefined, modifierPercentage: 100 })}
                            >
                                Add New Child
                            </Button>
                        </div>
                        <div className='gap-8 md:grid md:grid-cols-3'>
                            {fields.map((field, index) => (
                                <ChildAccountField
                                    key={field.id}
                                    index={index}
                                    remove={remove}
                                    form={form}
                                    getAvailableAccounts={() => getAvailableAccounts(index)}
                                    canRemove={fields.length > 1}
                                />
                            ))}
                        </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            formConfig.action
                        )}
                    </Button>
                </form>
            </Form>
        </>
    );
};

const ChildAccountField = ({ index, remove, form, getAvailableAccounts, canRemove }) => (
    <fieldset className="grid gap-6 rounded-lg border p-4 relative">
        <legend className="-ml-1 px-1 text-sm font-medium">
            Child #{index + 1}
        </legend>
        {canRemove && (
            <Button
                type="button"
                className="absolute right-2"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
            >
                <X className="h-4 w-4" />
            </Button>
        )}
        <div className="grid gap-3">
            <FormField
                control={form.control}
                name={`childAccounts.${index}.accountId`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Select an account</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Child Account" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {getAvailableAccounts().length > 0 && getAvailableAccounts().map((account) => (
                                    <SelectItem key={account.id} value={account.id}>
                                        {account.title || "(Untitled)"} - App ID: {account.appId}
                                    </SelectItem>
                                ))}
                                {
                                    getAvailableAccounts().length === 0 && (
                                        <SelectItem value={null}>
                                            No Accounts Available
                                        </SelectItem>
                                    )
                                }
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="grid gap-3">
            <FormField
                control={form.control}
                name={`childAccounts.${index}.modifierPercentage`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Modifier Percentage</FormLabel>
                        <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    </fieldset>
);

export default ClonerForm;