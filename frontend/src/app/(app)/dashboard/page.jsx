import { ScrollArea } from '@radix-ui/react-scroll-area'

function Dashboard() {
    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>
        </ScrollArea>
    )
}

export default Dashboard