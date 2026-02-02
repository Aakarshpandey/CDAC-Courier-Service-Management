import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Logo from "../Logo/Logo";
import { Bell } from "lucide-react";
import { clearUser } from "../../store/userSlice";


export default function Navbar({ profileImage }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const isLoggedIn = Boolean(user.name || user.email);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

    const onLogout = () => {
        // Clear Redux state
        dispatch(clearUser());
        // Clear localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        navigate('/');
    }

    return (
        <nav className="bg-white shadow-sm border-b border-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <div className="flex items-center space-x-3">   <Logo /> </div>
                    {/* MAIN NAV IF USER LOGGED IN */}
                    {(pathname === "/") && (
                        <div className="hidden md:flex space-x-8">
                            <Link className="hover:text-blue-600 text-gray-700" to="/price-calculator">Price Calculator</Link>
                            <Link className="hover:text-blue-600 text-gray-700" to="/track-package">Track Package</Link>
                            <Link className="hover:text-blue-600 text-gray-700" to="/become-partner">Become Partner</Link>
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

                        {/* If logged in show notifications, logout + username */}
                        {isLoggedIn && (
                            <>
                                <button
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                    title="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                </button>

                                <button className="text-red-600 hover:text-red-700 font-medium" onClick={onLogout}>Logout</button>

                                <div className="flex items-center gap-2">
                                    {(() => {
                                        const url = profileImage;
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
                                                {user.name?.[0] || "U"}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-gray-800">{user.name}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
