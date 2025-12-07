import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react';
import Logo from '../Logo/Logo';

function Navbar({ user }) {
    const location = useLocation();
    const isLoggedIn = Boolean(user);
    console.log(location)
    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        {(location.pathname === "/becomepartner" || location.pathname === "/trackpackage") && (
                            <button
                                className="text-xl"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <Logo />
                    </div>

                    {/* Navigation Links */}
                    {(location.pathname == "/" || !isLoggedIn) && (<div className="hidden md:flex  space-x-8">
                        <a href="#" className="text-gray-700 hover:text-blue-600">Price Calculator</a>
                        <a href="/trackpackage" className="text-gray-700 hover:text-blue-600">Track Package</a>
                        <a href="/becomepartner" className="text-gray-700 hover:text-blue-600">Become Partner</a>

                    </div>)}

                    {/* Auth Buttons user not logged in */}
                    <div className="flex items-center space-x-4">
                        {!isLoggedIn && (
                            <>
                                <Link
                                    className="hover:bg-blue-600 rounded-sm px-4 py-2 text-gray-700 hover:text-sky-50"
                                    to='/login'>Login</Link>
                                <Link
                                    className="hover:bg-blue-600 rounded-sm px-4 py-2 text-gray-700 hover:text-sky-50"
                                    to='/register'>Register</Link>
                            </>
                        )}
                        {/* User info if logged in */}
                        {isLoggedIn && (
                            <>
                                <button className="hover:text-red-500">Logout</button>
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex justify-center items-center">
                                        {user.name[0]}
                                    </div>
                                    <span>{user.name}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
