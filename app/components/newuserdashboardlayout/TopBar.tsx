// src/components/user/TopBar.tsx
"use client"
import { FiBell, FiSearch, FiUser, FiSettings, FiHelpCircle, FiLogOut, FiMessageSquare } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { useUserStore } from "@/lib/utils/store";
import { usePathname, useRouter } from "next/navigation";
import { LogoutUser } from '@/lib/actions';

const TopBar = () => {

    useEffect(() => {
        // toast.success(`welcome ${user?.firstName}`);
        useUserStore.persist.rehydrate();
      }, []);
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const router = useRouter();

    const { user, destroyUserInfo } = useUserStore();
    const notifications = [
        { id: 1, text: 'Your package has been delivered', time: '2 min ago', unread: true },
        { id: 2, text: 'New shipping rate available', time: '1 hour ago', unread: true },
        { id: 3, text: 'Subscription renewal in 3 days', time: '2 hours ago', unread: false },
    ]

    const unreadCount = notifications.filter(n => n.unread).length

    return (
        <header className="bg-appWhite shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between p-4 lg:px-6">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-bold text-appBlack">{greeting}</h1>
                        <p className="text-appTitleBgColor text-sm">Welcome back, {user.firstName + " " + user.lastName}!</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                    <div className="relative w-full">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search packages, locations..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-3">
                    {/* Mobile Search Button */}
                    <button className="md:hidden p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack">
                        <FiSearch size={20} />
                    </button>

                    {/* Notifications */}
                    <button className="relative p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack group">
                        <FiBell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {/* Messages */}
                    <button className="relative p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack group">
                        <FiMessageSquare size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-appBanner rounded-full"></span>
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-appBanner flex items-center justify-center shadow-lg">
                                <span className="text-appWhite font-semibold text-sm">O</span>
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-semibold text-appBlack">{user.firstName}</p>
                                <p className="text-xs text-appTitleBgColor">Premium User</p>
                            </div>
                        </button>

                        {/* User Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-appWhite rounded-2xl border border-gray-200 shadow-xl z-30">
                                <div className="p-4 border-b border-gray-200">
                                    <p className="text-appBlack font-semibold">{user.firstName}</p>
                                    <p className="text-appTitleBgColor text-sm">{user.email}</p>
                                </div>
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-appTitleBgColor hover:bg-gray-50 rounded-lg transition-colors text-sm">
                                        <FiUser className="h-4 w-4" />
                                        Profile Settings
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-appTitleBgColor hover:bg-gray-50 rounded-lg transition-colors text-sm">
                                        <FiSettings className="h-4 w-4" />
                                        Account Settings
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-appTitleBgColor hover:bg-gray-50 rounded-lg transition-colors text-sm">
                                        <FiHelpCircle className="h-4 w-4" />
                                        Help & Support
                                    </button>
                                </div>
                                <div className="p-2 border-t border-gray-200">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm">
                                        <FiLogOut className="h-4 w-4" 
                                        onClick={(e) => {
                                                    e.preventDefault();
                                                    LogoutUser();
                                                    destroyUserInfo(user)
                                                    router.push("/pages/signin");
                                                  }}
                                        />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Title */}
            <div className="lg:hidden px-4 pb-4">
                <h1 className="text-xl font-bold text-appBlack">{greeting}</h1>
                <p className="text-appTitleBgColor text-sm">Welcome back, Olawale!</p>
            </div>

            {/* Close dropdowns when clicking outside */}
            {(showNotifications || showUserMenu) && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => {
                        setShowNotifications(false)
                        setShowUserMenu(false)
                    }}
                />
            )}
        </header>
    )
}

export default TopBar