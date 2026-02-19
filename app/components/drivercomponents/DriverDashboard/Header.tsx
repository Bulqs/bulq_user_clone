// components/Header.tsx
"use client"
import { FiMenu, FiBell, FiSearch, FiMessageSquare } from 'react-icons/fi';

interface HeaderProps {
    onMenuToggle: () => void;
    title?: string;
}

const Header = ({ onMenuToggle, title = "Driver Dashboard" }: HeaderProps) => {
    return (
        <header className="bg-appWhite shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between p-4 lg:px-6">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack"
                    >
                        <FiMenu size={20} />
                    </button>

                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-bold text-appBlack">{title}</h1>
                        <p className="text-appTitleBgColor text-sm">Welcome back, Driver!</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                    <div className="relative w-full">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search orders, locations..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-3">
                    {/* Notifications */}
                    <button className="relative p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack group">
                        <FiBell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Messages */}
                    <button className="relative p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack group">
                        <FiMessageSquare size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-appBanner rounded-full"></span>
                    </button>

                    {/* Profile Quick View */}
                    <div className="flex items-center space-x-3 p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-appBanner flex items-center justify-center shadow-lg">
                            <span className="text-appWhite font-semibold text-sm">DN</span>
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-semibold text-appBlack">Driver Name</p>
                            <p className="text-xs text-appTitleBgColor">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Title */}
            <div className="lg:hidden px-4 pb-4">
                <h1 className="text-xl font-bold text-appBlack">{title}</h1>
                <p className="text-appTitleBgColor text-sm">Welcome back, Driver!</p>
            </div>
        </header>
    );
};

export default Header;