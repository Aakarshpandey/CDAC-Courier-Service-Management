import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Logo/Logo";
import { ArrowLeft, Settings, Bell } from "lucide-react";


export default function Navbar({ user,profileImage }) {
    const { pathname } = useLocation();
    const isLoggedIn = Boolean(user);
    const navigate = useNavigate();
    
  
    const onLogout = () => {
        navigate('/');
    }

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* BACK BUTTON */}
                    <div className="flex items-center space-x-3">
                        {pathname != "/" && (
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
                    {(pathname === "/") && (
                        <div className="hidden md:flex space-x-8">
                            <Link className="hover:text-blue-600" to="/price-calculator">Price Calculator</Link>
                            <Link className="hover:text-blue-600" to="/track-package">Track Package</Link>
                            <Link className="hover:text-blue-600" to="/become-partner">Become Partner</Link>
                        </div>
                    )}

                    {/* AUTH AREA */}
                    <div className="flex items-center space-x-4">
                        {/* If logged out show Login + Signup */}
                        {!isLoggedIn && (
                            <>
                                <Link className="hover:bg-blue-600 rounded-sm px-4 py-2 text-gray-700 hover:text-sky-50" to='/login' >Login</Link>
                                <Link className="hover:bg-blue-600 rounded-sm px-4 py-2 text-gray-700 hover:text-sky-50" to='/register' >Register</Link>
                            </>
                        )}

                        {/* If logged in show notifications, settings, logout + username */}
                        {isLoggedIn && (
                            <>
                                <button 
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                    title="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                </button>
                                
                                <Link 
                                    to="/user-edit-profile" 
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                    title="Settings"
                                >
                                    <Settings className="w-5 h-5" />
                                </Link>
                                
                                <button className="text-red-600 hover:text-red-700 font-medium" onClick={onLogout}>Logout</button>
                                
                                <div className="flex items-center gap-2">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-13 h-13 rounded-full object-cover border-4 border-blue-100"
                                        />
                                    ) : (
                                        <div className="w-13 h-13 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-4 border-blue-100">
                                            <span className="text-white text-3xl font-semibold mb-1">
                                                {user.name[0]}
                                                {/* {user.lastName[0]} */}
                                            </span>
                                        </div>
                                    )}
                                    <span>{user.name}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}