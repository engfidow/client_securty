import React, { useState, useEffect } from 'react';

import { LogIn, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';


const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate()


    useEffect(() => {
        // Get user data from localStorage on component mount
        const userData = localStorage.getItem("user");
        
        
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                console.log(parsedUser.image);
            } catch (error) {
                console.error("Error parsing user data:", error);
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.getElementById('user-dropdown');
            const trigger = document.getElementById('user-menu-trigger');

            if (dropdown && trigger &&
                !dropdown.contains(event.target) &&
                !trigger.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const handleDashboard = () => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        if (user.role === "admin") {
            navigate('/dashboard');
        } else if (user?.role === "police") {
            navigate("/district-dashboard")
        } else {
            navigate("/branch-dashboard")
        }

    };

    const imageUrl = user?.image && `https://security991.onrender.com/uploads/${user.image}` 

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    if (isLoading) {
        return (
            <nav className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-white font-bold text-xl">Report System</div>
                    <div className="w-20 h-9 bg-white/20 animate-pulse rounded"></div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo/Brand */}
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>

                    <img src={logo} alt="Logo" className="w-8 h-8 rounded-full shadow-lg" />
                    <h1 className="text-xl font-bold text-white">ReportApp</h1>
                </div>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <div className="relative">
                            <button
                                id="user-menu-trigger"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full transition duration-200"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                                    {imageUrl? (
                                            <img src={imageUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            getInitials(user.name)
                                        )}
                                </div>
                                <span className="text-sm font-medium">{user.name}</span>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div
                                    id="user-dropdown"
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>

                                    <button
                                        onClick={handleDashboard}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition duration-300 flex items-center space-x-2"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Login</span>
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white p-2"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-black/40 backdrop-blur-sm border-t border-white/10">
                    <div className="px-4 py-4 space-y-4">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-3 pb-4 border-b border-white/20">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                                         {imageUrl? (
                                            <img src={imageUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            getInitials(user.name)
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{user.name}</p>
                                        <p className="text-white/70 text-sm">{user.email}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDashboard}
                                    className="w-full text-left text-white hover:text-blue-300 flex items-center space-x-2 py-2"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left text-red-400 hover:text-red-300 flex items-center space-x-2 py-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition duration-300 flex items-center justify-center space-x-2"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
