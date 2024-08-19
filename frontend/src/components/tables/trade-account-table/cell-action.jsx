'use client';

import { deleteTradeAccount } from '@/actions/tradeAccounts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TooltipElement, TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Loader2, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const CellAction = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const isChildofAnActiveCloner = (data.childCloners.map(curr => curr.cloner.state)).includes('RUNNING');
    const isMasterofAnActiveCloner = (data.masterCloners.map(curr => curr.state)).includes('RUNNING');
    const isPartofActiveCloner = isChildofAnActiveCloner || isMasterofAnActiveCloner;
    const isPartofCloner = data.childCloners.length || data.masterCloners.length;
    const onConfirm = async () => {
        setLoading(true);
        try {
            const deleteTradeAccountRequest = await deleteTradeAccount(data.id);

            if (deleteTradeAccountRequest.success) {
                router.refresh();
                return toast({
                    title: "Trade Account Deleted",
                    description: "Your trade account has been deleted successfully",
                    variant: "success"
                })
            }

            if (!deleteTradeAccountRequest.success) {
                toast({
                    title: "Error",
                    description: deleteTradeAccountRequest.message,
                    variant: "destructive"
                });
            }
        }
        catch (e) {
            console.error("Error deleting trade account", e.message);
            toast({
                title: "Error",
                description: e.message,
                variant: "destructive"
            });
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <TooltipProvider>
                    <TooltipElement content={isPartofActiveCloner ? "This trade account is part of an active cloner. You cannot edit it." : ""} >
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.push(`/dashboard/trade-accounts/${data.id}`)}
                            disabled={isPartofActiveCloner}
                        >
                            <Edit className="mr-2 h-4 w-4" /> Update
                        </DropdownMenuItem>
                    </TooltipElement>
                    <TooltipElement content={isPartofCloner ? "Can't delete a trade account that is part of a cloner" : ""}>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setOpen(true)}
                            disabled={isPartofCloner}
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </TooltipElement>
                </TooltipProvider>
            </DropdownMenuContent>
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this trade account?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading} onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={loading} onClick={onConfirm} className={'bg-red-500 hover:bg-red-600 text-foreground'}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Continue'}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DropdownMenu>
    );
};