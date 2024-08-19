'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';

export const TradeAccountsTable = ({ data }) => {
    const router = useRouter();

    return (
        <>
            <div className="flex items-start justify-between">
                <Heading
                    title={`Trade Accounts (${data.length})`}
                    description="Manage your trade accounts."
                />
                <Button
                    className="text-xs md:text-sm"
                    onClick={() => router.push(`/dashboard/trade-accounts/new`)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="appId" columns={columns} data={data} />
        </>
    );
};