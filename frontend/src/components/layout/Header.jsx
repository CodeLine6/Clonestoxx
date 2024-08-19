import Logo from '@/components/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import UserButton from '@/components/UserButton'

function Header() {
    return (
        <nav className='fixed left-0 right-0 flex justify-between items-center border-b border-border h-[60px] px-4 py-2 z-20 bg-background'>
            <Logo />
            <div className='flex items-center gap-4'>
                <ThemeSwitcher />
                <UserButton />
            </div>
        </nav>
    )
}

export default Header