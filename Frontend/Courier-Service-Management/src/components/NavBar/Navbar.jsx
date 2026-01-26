import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import { Bell, Moon, Sun } from "lucide-react";


export default function Navbar({ user, profileImage }) {
    const { pathname } = useLocation();
    const isLoggedIn = Boolean(user);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const [isDark, setIsDark] = useState(() => {
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains("dark");
        }
        return false;
    });

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        const next = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", next);
        setIsDark(next);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
            // ignore
        }
    };
    
  
    const onLogout = () => {
        navigate('/');
    }

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-none border-b border-transparent dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <div className="flex items-center space-x-3">   <Logo /> </div>
                    {/* MAIN NAV IF USER LOGGED IN */}
                    {(pathname === "/") && (
                        <div className="hidden md:flex space-x-8">
                            <Link className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-200" to="/price-calculator">Price Calculator</Link>
                            <Link className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-200" to="/track-package">Track Package</Link>
                            <Link className="hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-200" to="/become-partner">Become Partner</Link>
                        </div>
                    )}

                    {/* AUTH AREA */}
                    <div className="flex items-center space-x-4">
                        {/* If logged out show Login + Signup */}
                        {!isLoggedIn && (
                            <>
                                <Link className="hover:bg-blue-600 rounded-sm px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-sky-50" to='/login' >Login</Link>
                                <Link className="hover:bg-blue-600 rounded-sm px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-sky-50" to='/register' >Register</Link>
                            </>
                        )}

                        {/* If logged in show notifications, settings, logout + username */}
                        {isLoggedIn && (
                            <>
                                <button 
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    title="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                </button>

                                {/* Theme toggle (replaces settings icon) */}
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                                >
                                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>
                                
                                <button className="text-red-600 hover:text-red-700 font-medium" onClick={onLogout}>Logout</button>
                                
                                <div className="flex items-center gap-2">
                                    {(() => {
                                        const url = profileImage || user.profilePhotoUrl;
                                        if (!url) return null;
                                        const resolved = url.startsWith("http") ? url : `${API_URL}${url}`;
                                        return (
                                            <img
                                                src={resolved}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                                            />
                                        );
                                    })() || (
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-blue-100">
                                            <span className="text-white text-lg font-semibold">
                                                {user?.name?.[0] || "U"}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-gray-800 dark:text-gray-200">{user.name}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}