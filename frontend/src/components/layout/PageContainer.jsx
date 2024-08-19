import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
    children,
    scrollable = false
}) {
    return (
        <ScrollArea className="h-[calc(100dvh-52px)]">
            <div className="h-full  p-4 md:px-8">{children}</div>
        </ScrollArea>
    );
}