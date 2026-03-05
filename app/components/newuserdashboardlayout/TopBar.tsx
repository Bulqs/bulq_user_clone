"use client"

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from "next/navigation"
import { 
    FiBell, FiSearch, FiUser, FiSettings, 
    FiHelpCircle, FiLogOut, FiMessageSquare 
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from "@/lib/utils/store"
import { LogoutUser } from '@/lib/actions'
import { Variants } from 'framer-motion' // Make sure Variants is imported!

// --- FRAMER MOTION VARIANTS ---
const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } }
}

const TopBar = () => {
    const router = useRouter()
    const { user, destroyUserInfo } = useUserStore()
    
    const [mounted, setMounted] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showMobileSearch, setShowMobileSearch] = useState(false)

    // Hydration safeguard for Zustand
    useEffect(() => {
        useUserStore.persist.rehydrate()
        setMounted(true)
    }, [])

    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'

    const notifications = [
        { id: 1, text: 'Your package has been delivered', time: '2 min ago', unread: true },
        { id: 2, text: 'New shipping rate available', time: '1 hour ago', unread: true },
        { id: 3, text: 'Subscription renewal in 3 days', time: '2 hours ago', unread: false },
    ]

    const unreadCount = notifications.filter(n => n.unread).length

    // Dynamic User Initials safely handled
    const userInitial = mounted && user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'
    const displayName = mounted && user?.firstName ? user.firstName : 'User'
    const fullName = mounted && user?.firstName ? `${user.firstName} ${user.lastName}` : 'Loading...'

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await LogoutUser();
            destroyUserInfo(user);
            router.push("/pages/signin");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (!mounted) return <header className="h-20 bg-appWhite shadow-sm border-b border-gray-200 sticky top-0 z-30" />;

    return (
        <header className="bg-appWhite/90 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-30 transition-all duration-300">
            <div className="flex items-center justify-between p-4 lg:px-8">
                
                {/* --- LEFT SECTION (Greeting) --- */}
                <div className="flex items-center space-x-4">
                    <div className="hidden lg:block">
                        <h1 className="text-xl font-extrabold text-appBlack tracking-tight">{greeting}</h1>
                        <p className="text-appTitleBgColor/80 text-sm font-medium">Welcome back, {fullName}!</p>
                    </div>
                </div>

                {/* --- DESKTOP SEARCH BAR --- */}
                <div className="hidden md:flex flex-1 max-w-2xl mx-6">
                    <div className="relative w-full group">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-appBanner transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search packages, tracking, locations..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 hover:bg-gray-100 focus:bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all duration-300 font-medium text-appBlack placeholder-gray-400 shadow-inner"
                        />
                    </div>
                </div>

                {/* --- RIGHT SECTION (Actions & Profile) --- */}
                <div className="flex items-center space-x-2 md:space-x-3">
                    
                    {/* Mobile Search Toggle */}
                    <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className="md:hidden p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-appBanner transition-colors border border-gray-200"
                    >
                        <FiSearch size={20} />
                    </motion.button>

                    {/* Messages */}
                    <motion.button 
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-appBanner transition-colors border border-gray-200 group"
                    >
                        <FiMessageSquare size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-appBanner rounded-full ring-2 ring-white"></span>
                    </motion.button>

                    {/* Notifications */}
                    <div className="relative">
                        <motion.button 
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-appBanner transition-colors border border-gray-200 group"
                        >
                            <FiBell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                            )}
                        </motion.button>
                    </div>

                    {/* User Profile Menu */}
                    <div className="relative ml-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-appBanner to-appNav flex items-center justify-center shadow-md">
                                <span className="text-appWhite font-bold text-sm">{userInitial}</span>
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-sm font-bold text-appBlack leading-tight">{displayName}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-appTitleBgColor/70">Premium</p>
                            </div>
                        </motion.button>

                        {/* --- DROPDOWN MENUS --- */}
                        <AnimatePresence>
                            {showUserMenu && (
                                <>
                                    {/* Backdrop for clicking outside */}
                                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                    
                                    <motion.div 
                                        variants={dropdownVariants}
                                        initial="hidden" animate="show" exit="exit"
                                        className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
                                    >
                                        <div className="p-5 bg-gray-50 border-b border-gray-100">
                                            <p className="text-appBlack font-extrabold text-lg">{fullName}</p>
                                            <p className="text-appTitleBgColor/70 text-xs font-medium mt-0.5">{user?.email || 'user@example.com'}</p>
                                        </div>
                                        <div className="p-2">
                                            <motion.button whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.02)' }} className="w-full flex items-center gap-3 px-4 py-3 text-appTitleBgColor rounded-xl transition-colors font-semibold text-sm">
                                                <FiUser className="text-gray-400" size={18} /> Profile Settings
                                            </motion.button>
                                            <motion.button whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.02)' }} className="w-full flex items-center gap-3 px-4 py-3 text-appTitleBgColor rounded-xl transition-colors font-semibold text-sm">
                                                <FiSettings className="text-gray-400" size={18} /> Preferences
                                            </motion.button>
                                            <motion.button whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.02)' }} className="w-full flex items-center gap-3 px-4 py-3 text-appTitleBgColor rounded-xl transition-colors font-semibold text-sm">
                                                <FiHelpCircle className="text-gray-400" size={18} /> Help & Support
                                            </motion.button>
                                        </div>
                                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                                            <motion.button 
                                                whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 rounded-xl transition-colors font-bold text-sm"
                                            >
                                                <FiLogOut size={18} /> Sign Out
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* --- MOBILE SEARCH EXPAND (Optional smooth dropdown) --- */}
            <AnimatePresence>
                {showMobileSearch && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="md:hidden px-4 pb-4 overflow-hidden"
                    >
                        <div className="relative w-full">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-appBanner font-medium shadow-inner"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MOBILE GREETING --- */}
            <div className="lg:hidden px-4 pb-4 pt-1">
                <h1 className="text-xl font-extrabold text-appBlack tracking-tight">{greeting}</h1>
                <p className="text-appTitleBgColor/80 text-sm font-medium">Welcome back, {displayName}!</p>
            </div>
        </header>
    )
}

export default TopBar

// // src/components/user/TopBar.tsx
// "use client"
// import { FiBell, FiSearch, FiUser, FiSettings, FiHelpCircle, FiLogOut, FiMessageSquare } from 'react-icons/fi'
// import { useEffect, useState } from 'react'
// import { useUserStore } from "@/lib/utils/store";
// import { usePathname, useRouter } from "next/navigation";
// import { LogoutUser } from '@/lib/actions';

// const TopBar = () => {

//     useEffect(() => {
//         // toast.success(`welcome ${user?.firstName}`);
//         useUserStore.persist.rehydrate();
//       }, []);
//     const currentHour = new Date().getHours()
//     const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'
//     const [showNotifications, setShowNotifications] = useState(false)
//     const [showUserMenu, setShowUserMenu] = useState(false)
//     const router = useRouter();

//     const { user, destroyUserInfo } = useUserStore();
//     const notifications = [
//         { id: 1, text: 'Your package has been delivered', time: '2 min ago', unread: true },
//         { id: 2, text: 'New shipping rate available', time: '1 hour ago', unread: true },
//         { id: 3, text: 'Subscription renewal in 3 days', time: '2 hours ago', unread: false },
//     ]

//     const unreadCount = notifications.filter(n => n.unread).length

//     return (
//         <header className="bg-appWhite shadow-sm border-b border-gray-200 sticky top-0 z-30">
//             <div className="flex items-center justify-between p-4 lg:px-6">
//                 {/* Left Section */}
//                 <div className="flex items-center space-x-4">
//                     <div className="hidden lg:block">
//                         <h1 className="text-2xl font-bold text-appBlack">{greeting}</h1>
//                         <p className="text-appTitleBgColor text-sm">Welcome back, {user.firstName + " " + user.lastName}!</p>
//                     </div>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="hidden md:flex flex-1 max-w-2xl mx-4">
//                     <div className="relative w-full">
//                         <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                         <input
//                             type="text"
//                             placeholder="Search packages, locations..."
//                             className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-transparent transition-all duration-200"
//                         />
//                     </div>
//                 </div>

//                 {/* Right Section */}
//                 <div className="flex items-center space-x-3">
//                     {/* Mobile Search Button */}
//                     <button className="md:hidden p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack">
//                         <FiSearch size={20} />
//                     </button>

//                     {/* Notifications */}
//                     <button className="relative p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack group">
//                         <FiBell size={20} />
//                         {unreadCount > 0 && (
//                             <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
//                         )}
//                     </button>

//                     {/* Messages */}
//                     <button className="relative p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-appTitleBgColor hover:text-appBlack group">
//                         <FiMessageSquare size={20} />
//                         <span className="absolute top-2 right-2 w-2 h-2 bg-appBanner rounded-full"></span>
//                     </button>

//                     {/* User Menu */}
//                     <div className="relative">
//                         <button
//                             onClick={() => setShowUserMenu(!showUserMenu)}
//                             className="flex items-center space-x-3 p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
//                         >
//                             <div className="w-10 h-10 rounded-xl bg-appBanner flex items-center justify-center shadow-lg">
//                                 <span className="text-appWhite font-semibold text-sm">O</span>
//                             </div>
//                             <div className="hidden lg:block">
//                                 <p className="text-sm font-semibold text-appBlack">{user.firstName}</p>
//                                 <p className="text-xs text-appTitleBgColor">Premium User</p>
//                             </div>
//                         </button>

//                         {/* User Dropdown Menu */}
//                         {showUserMenu && (
//                             <div className="absolute right-0 mt-2 w-56 bg-appWhite rounded-2xl border border-gray-200 shadow-xl z-30">
//                                 <div className="p-4 border-b border-gray-200">
//                                     <p className="text-appBlack font-semibold">{user.firstName}</p>
//                                     <p className="text-appTitleBgColor text-sm">{user.email}</p>
//                                 </div>
//                                 <div className="p-2">
//                                     <button className="w-full flex items-center gap-3 px-3 py-2 text-appTitleBgColor hover:bg-gray-50 rounded-lg transition-colors text-sm">
//                                         <FiUser className="h-4 w-4" />
//                                         Profile Settings
//                                     </button>
//                                     <button className="w-full flex items-center gap-3 px-3 py-2 text-appTitleBgColor hover:bg-gray-50 rounded-lg transition-colors text-sm">
//                                         <FiSettings className="h-4 w-4" />
//                                         Account Settings
//                                     </button>
//                                     <button className="w-full flex items-center gap-3 px-3 py-2 text-appTitleBgColor hover:bg-gray-50 rounded-lg transition-colors text-sm">
//                                         <FiHelpCircle className="h-4 w-4" />
//                                         Help & Support
//                                     </button>
//                                 </div>
//                                 <div className="p-2 border-t border-gray-200">
//                                     <button className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm">
//                                         <FiLogOut className="h-4 w-4" 
//                                         onClick={(e) => {
//                                                     e.preventDefault();
//                                                     LogoutUser();
//                                                     destroyUserInfo(user)
//                                                     router.push("/pages/signin");
//                                                   }}
//                                         />
//                                         Sign Out
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile Title */}
//             <div className="lg:hidden px-4 pb-4">
//                 <h1 className="text-xl font-bold text-appBlack">{greeting}</h1>
//                 <p className="text-appTitleBgColor text-sm">Welcome back, Olawale!</p>
//             </div>

//             {/* Close dropdowns when clicking outside */}
//             {(showNotifications || showUserMenu) && (
//                 <div
//                     className="fixed inset-0 z-10"
//                     onClick={() => {
//                         setShowNotifications(false)
//                         setShowUserMenu(false)
//                     }}
//                 />
//             )}
//         </header>
//     )
// }

// export default TopBar