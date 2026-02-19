"use client"
import { FiBell, FiSearch, FiUser, FiSettings, FiHelpCircle, FiLogOut, FiMessageSquare, FiAlertTriangle } from 'react-icons/fi'
import { useState } from 'react'

const AdminTopBar = () => {
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const notifications = [
        { id: 1, text: 'New user registration pending approval', time: '5 min ago', unread: true, type: 'warning' },
        { id: 2, text: 'System backup completed successfully', time: '1 hour ago', unread: true, type: 'info' },
        { id: 3, text: 'High traffic alert detected', time: '2 hours ago', unread: false, type: 'alert' },
        { id: 4, text: 'Payment processing issue', time: '3 hours ago', unread: true, type: 'error' },
    ]

    const unreadCount = notifications.filter(n => n.unread).length

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'warning': return <FiAlertTriangle className="text-yellow-500" />;
            case 'error': return <FiAlertTriangle className="text-red-500" />;
            default: return <FiBell className="text-blue-500" />;
        }
    }

    return (
        <header className="bg-appWhite shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between p-4 lg:px-6">
                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-bold text-appBlack">{greeting}</h1>
                        <p className="text-appTitleBgColor text-sm">Admin Dashboard Overview</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                    <div className="relative w-full">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users, packages, transactions..."
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

                    {/* System Alerts */}
                    <button className="relative p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack group">
                        <FiAlertTriangle size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Notifications */}
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack group"
                    >
                        <FiBell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-appBanner flex items-center justify-center shadow-lg">
                                <span className="text-appWhite font-semibold text-sm">A</span>
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-sm font-semibold text-appBlack">Admin User</p>
                                <p className="text-xs text-appTitleBgColor">Super Admin</p>
                            </div>
                        </button>

                        {/* User Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-appWhite rounded-2xl border border-gray-200 shadow-xl z-30">
                                <div className="p-4 border-b border-gray-200">
                                    <p className="text-appBlack font-semibold">Admin User</p>
                                    <p className="text-appTitleBgColor text-sm">admin@bulqlogistics.com</p>
                                    <p className="text-appBanner text-xs font-medium mt-1">Super Administrator</p>
                                </div>
                                <div className="p-2">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-appTitleBgColor hover:bg-gray-50 rounded-lg transition-colors text-sm">
                                        <FiUser className="h-4 w-4" />
                                        Admin Profile
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-appTitleBgColor hover:bg-gray-50 rounded-lg transition-colors text-sm">
                                        <FiSettings className="h-4 w-4" />
                                        System Settings
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-appTitleBgColor hover:bg-gray-50 rounded-lg transition-colors text-sm">
                                        <FiHelpCircle className="h-4 w-4" />
                                        Admin Support
                                    </button>
                                </div>
                                <div className="p-2 border-t border-gray-200">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm">
                                        <FiLogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
                <div className="absolute right-32 mt-2 w-80 bg-appWhite rounded-2xl border border-gray-200 shadow-xl z-30">
                    <div className="p-4 border-b border-gray-200">
                        <p className="text-appBlack font-semibold">Notifications</p>
                        <p className="text-appTitleBgColor text-sm">{unreadCount} unread notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notification.unread ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-appBlack">{notification.text}</p>
                                        <p className="text-xs text-appTitleBgColor mt-1">{notification.time}</p>
                                    </div>
                                    {notification.unread && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Title */}
            <div className="lg:hidden px-4 pb-4">
                <h1 className="text-xl font-bold text-appBlack">{greeting}</h1>
                <p className="text-appTitleBgColor text-sm">Admin Dashboard Overview</p>
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

export default AdminTopBar