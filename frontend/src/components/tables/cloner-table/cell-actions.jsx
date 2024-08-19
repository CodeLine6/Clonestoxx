'use client';

import { deleteCloner } from '@/actions/cloners'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { RiDeleteBinFill } from "react-icons/ri";
import { FaPlay } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { FaStop } from "react-icons/fa6";

export const maxDuration = 200

import { useEffect, useState } from 'react'
import {
    TooltipProvider,
    TooltipElement,
} from '@/components/ui/tooltip';


function CellActions({ cloner }) {
    const [clonerData, setClonerData] = useState(() => cloner);
    const [socket, setSocket] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const ws = new WebSocket(process.env.NEXT_PUBLIC_CLONESTOXX_BACKEND_WS);

        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
            const data = JSON.parse(event.data);
            if (data.operation === "startCloning") {
                setLoading(false);
                if (data.success) {
                    toast({
                        title: "Cloner Started",
                        description: "Cloner started successfully",
                    })
                    setClonerData({ ...clonerData, state: 'RUNNING' });
                    return
                }

                toast({
                    title: "Error",
                    description: data.message,
                    variant: "destructive"
                })
            }

            if (data.operation === "stopCloning") {
                setLoading(false);
                if (data.success) {
                    toast({
                        title: "Cloner Stopped",
                        description: "Cloner stopped successfully",
                    })
                    setClonerData({ ...clonerData, state: 'STOPPED' });
                    return
                }

                toast({
                    title: "Error",
                    description: data.message,
                    variant: "destructive"
                })
            }
            // Handle incoming messages here
        };

        setSocket(ws);
        return () => {
            ws.close();
        }
    }, [clonerData])

    const onConfirm = async () => {
        setLoading(true);
        try {
            const deleteClonerRequest = await deleteCloner(cloner.id);

            if (!deleteClonerRequest.success) {
                return toast({
                    title: "Error",
                    description: deleteClonerRequest.message,
                    variant: "destructive"
                });
            }

            router.refresh();
            toast({
                title: "Cloner Deleted",
                description: "Your cloner has been deleted successfully",
                variant: "success"
            })

        }
        catch (e) {
            console.error("Error deleting cloner", e.message);
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
    }

    const toggleClonerState = async () => {
        setLoading(true);
        if (clonerData.state === 'RUNNING') {
            if (socket)
                socket.send(JSON.stringify({ operation: "stopCloning", clonerId: cloner.id }));
        }
        else if (clonerData.state === 'STOPPED') {
            if (socket)
                socket.send(JSON.stringify({ operation: "startCloning", clonerId: cloner.id }));
        }
    }

    return (
        <>
            <div className="flex items-center space-x-4 justify-end">
                {loading ? <Loader2 className="h-5 w-5 text-foreground/50 animate-spin" /> : <TooltipProvider>
                    {clonerData.state === 'RUNNING' && <TooltipElement content="Stop Cloner">
                        <FaStop className="h-4 w-4 cursor-pointer text-foreground/50 hover:text-yellow-500" onClick={toggleClonerState} />
                    </TooltipElement>}
                    {clonerData.state === 'STOPPED' &&
                        <>
                            <TooltipElement content="Start Cloner"><FaPlay className="h-4 w-4 text-foreground/50 cursor-pointer hover:text-green-700" onClick={toggleClonerState} /></TooltipElement>
                            <TooltipElement content="Edit Cloner"><MdOutlineEdit className="h-5 w-5 text-foreground/50 cursor-pointer hover:text-primary" onClick={() => router.push(`/dashboard/cloners/${cloner.id}`)} /></TooltipElement>
                            <TooltipElement content="Delete Cloner"><RiDeleteBinFill className="h-5 w-5 text-foreground/50 cursor-pointer hover:text-destructive" onClick={() => setOpen(true)} /></TooltipElement>
                        </>}
                </TooltipProvider>}
            </div>
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this cloner?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading} onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={loading} onClick={onConfirm} className={'bg-red-500 hover:bg-red-600 text-foreground'}>{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Continue'}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default CellActions