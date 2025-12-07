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
                                className="mr-3 text-xl"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}

                        {/* LOGO */}
                        <Logo />
                    </div>
                    {/* MAIN NAV IF USER LOGGED IN */}
                    {(pathname === "/" )&& (
                        <div className="hidden md:flex space-x-8">
                            <Link className="hover:text-blue-600" to="/price-calculator">Price Calculator</Link>
                            <Link className="hover:text-blue-600" to="/track-package">Track Package</Link>
                            <Link className="hover:text-blue-600" to="/become-partner">Become Partner</Link>
                        </div>
                    )}

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
