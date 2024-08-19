
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AuthProvider from "@/context/AuthProvider";


const Providers = ({ children }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    )
}

export default Providers