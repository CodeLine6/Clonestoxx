import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"


const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-hidden pt-16">{children}</main>
            </div>
        </>
    )
}

export default Layout