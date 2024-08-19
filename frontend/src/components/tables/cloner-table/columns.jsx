'use client';

import CellActions from "./cell-actions";

export const columns = [
    {
        accessorKey: 'name',
        header: 'NAME',
        cell: ({ getValue }) => {
            const value = getValue();
            return value === '' ? '(Unnamed)' : value;
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellActions cloner={row.original} />
    }
]