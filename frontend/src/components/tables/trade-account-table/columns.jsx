'use client';

import { CellAction } from './cell-action';

export const columns = [
    {
        accessorKey: 'title',
        header: 'TITLE',
        cell: ({ getValue }) => {
            const value = getValue();
            return value === '' ? '(Unnamed)' : value;
        }
    },
    {
        accessorKey: 'appId',
        header: 'APP ID'
    },
    {
        accessorKey: 'accountUserId',
        header: 'USER ID'
    },
    {
        accessorKey: 'contactNumber',
        header: 'CONTACT NUMBER'
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />
    }
];