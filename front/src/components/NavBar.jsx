import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MoonIcon, SunIcon, ArrowLeftStartOnRectangleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'


function NavBar() {
    const [theme, setTheme] = useState("light");
    const nav = useNavigate();
    const loc = useLocation();
    useEffect(() => {
        const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        setTheme(saved)
        document.documentElement.classList.toggle('dark', saved === 'dark')
        function onThemeChange(e) {
            const t = e?.detail || localStorage.getItem('theme')
            setTheme(t)
            document.documentElement.classList.toggle('dark', t === 'dark')
        }
        window.addEventListener('themechange', onThemeChange)
        return () => window.removeEventListener('themechange', onThemeChange)
    }, [])
    function toggleTheme() {
        const t = theme === 'light' ? 'dark' : 'light'
        setTheme(t)
        localStorage.setItem('theme', t)
        document.documentElement.classList.toggle('dark', t === 'dark')
        window.dispatchEvent(new CustomEvent('themechange', { detail: t }))
    }

    function logout() {
        sessionStorage.removeItem('token')
        nav('/login')
    }
    const authed = Boolean(sessionStorage.getItem('token'));
    return (
        <nav className="w-full bg-slate-800 text-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link to={authed ? '/boards' : '/login'} className="font-bold tracking-tight text-3xl">TaskBoard</Link>
                <div className="flex items-center gap-4">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center cursor-pointer rounded-full sm:rounded-lg bg-brand text-white px-4 py-2 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-opacity-90 active:scale-95"
                    >
                        {/* Icon with rotation */}
                        <span
                            className={`h-6 w-6 sm:mr-2 transform transition-transform duration-300 ${theme === 'light' ? 'rotate-0' : 'rotate-180'
                                }`}
                        >
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </span>
                        {/* Text for desktop */}
                        <span className="hidden sm:inline">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>

                    {/* Logout or Login */}
                    {authed ? (
                        <button
                            onClick={logout}
                            className="flex items-center justify-center cursor-pointer rounded-full sm:rounded-lg bg-red-500 text-white px-4 py-2 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-red-600 active:scale-95"
                        >
                            <span className="h-6 w-6 sm:mr-2">
                                <ArrowRightEndOnRectangleIcon />
                            </span>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    ) : (
                        loc.pathname !== '/login' && (
                            <Link
                                to="/login"
                                className="flex items-center justify-center rounded-full sm:rounded-lg bg-brand text-white px-4 py-2 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-opacity-90 active:scale-95"
                            >
                                <span className="h-6 w-6 sm:mr-2">
                                    <ArrowLeftStartOnRectangleIcon />
                                </span>
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )
                    )}
                </div>


            </div>
        </nav>
    )
}

export default NavBar