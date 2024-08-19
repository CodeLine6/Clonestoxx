"use client"

import { useSession, signOut } from 'next-auth/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'

function UserButton() {
    const { data: session } = useSession()
    const user = session?.user

    if (!user) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user.image} />
                    <AvatarFallback>
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem><Link href="/dashboard/profile" className='w-full' >Profile</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton