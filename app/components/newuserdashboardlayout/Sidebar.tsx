'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome,
    FiPackage,
    FiMapPin,
    FiClock,
    FiMap,
    FiSettings,
    FiLogOut,
    FiChevronLeft,
    FiChevronRight,
    FiMenu,
    FiX
} from 'react-icons/fi';
// Import your profile action, store, and logout action
import { getMyProfile } from '@/lib/user/actions';
import { useUserStore } from "@/lib/utils/store";
import { LogoutUser } from '@/lib/actions';

// --- NAVIGATION CONFIG ---
const navItems = [
    { name: 'Dashboard', path: '/pages/newuser', icon: FiHome },
    { name: 'Packages', path: '/pages/newuser/packages', icon: FiPackage },
    { name: 'Tracking', path: '/pages/newuser/tracking', icon: FiMapPin },
    { name: 'History', path: '/pages/newuser/history', icon: FiClock },
    { name: 'Addresses', path: '/pages/newuser/address', icon: FiMap },
    { name: 'Settings', path: '/pages/newuser/settings', icon: FiSettings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter(); 
    const { user, destroyUserInfo } = useUserStore(); 

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    // --- USER STATE ---
    const [userProfile, setUserProfile] = useState<{ firstName?: string, lastName?: string } | null>(null);

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), []);

    // Fetch User Profile on Mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getMyProfile();
                setUserProfile(data as any); 
            } catch (error) {
                console.error("Failed to fetch user profile for sidebar:", error);
            }
        };
        fetchProfile();
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileOpen]);

    // --- LOGOUT LOGIC ---
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

    // --- HELPER FUNCTIONS FOR DYNAMIC DATA ---
    const fullName = userProfile 
        ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() 
        : 'Loading...';
        
    const initials = userProfile 
        ? `${userProfile.firstName?.charAt(0) || ''}${userProfile.lastName?.charAt(0) || ''}`.toUpperCase() 
        : '...';

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-appTitleBgColor text-white border-r border-white/10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-appBanner/10 blur-[80px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

            {/* --- LOGO AREA --- */}
            <div className={`flex items-center h-20 px-6 border-b border-white/5 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}>
                <Link href="/user" className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-gradient-to-br from-appBanner to-appNav rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                        <span className="font-black text-xl tracking-tighter">B</span>
                    </div>
                    {!isCollapsed && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-extrabold text-xl tracking-tight">
                            BulQ
                        </motion.span>
                    )}
                </Link>
            </div>

            {/* --- NAVIGATION LINKS --- */}
            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                {navItems.map((item) => {
                    const isActive = mounted && (pathname === item.path || pathname?.startsWith(`${item.path}/`));
                    const Icon = item.icon;

                    return (
                        <Link key={item.path} href={item.path}>
                            <motion.div
                                whileHover={{ scale: isCollapsed ? 1.05 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative flex items-center p-3 rounded-xl cursor-pointer transition-colors group ${isCollapsed ? 'justify-center' : 'justify-start'} ${!isActive && 'hover:bg-white/5'}`}
                                title={isCollapsed ? item.name : ''}
                            >
                                {/* Fluid Active Background Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSidebarPill"
                                        className="absolute inset-0 bg-gradient-to-r from-appBanner/20 to-transparent border-l-4 border-appBanner rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <Icon className={`w-5 h-5 relative z-10 transition-colors duration-300 ${isActive ? 'text-appBanner' : 'text-gray-400 group-hover:text-white'}`} />
                                
                                {!isCollapsed && (
                                    <span className={`ml-4 font-bold text-sm relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                        {item.name}
                                    </span>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            {/* --- BOTTOM SECTION (Profile & Logout) --- */}
            <div className="p-4 border-t border-white/5 relative z-10 bg-black/10">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-4`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                         {/* Dynamic Initials */}
                         <span className="font-bold text-xs text-white tracking-widest">{initials}</span>
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                            {/* Dynamic Name */}
                            <span className="text-sm font-bold text-white truncate">{fullName}</span>
                            <span className="text-[10px] font-bold text-appBanner uppercase tracking-widest truncate">Standard Tier</span>
                        </div>
                    )}
                </div>

                {/* THE LOGOUT BUTTON WITH onClick HANDLER */}
                <motion.button 
                    onClick={handleLogout}
                    whileHover={{ scale: isCollapsed ? 1.05 : 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center p-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors group ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                    title={isCollapsed ? "Log Out" : ""}
                >
                    <FiLogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    {!isCollapsed && <span className="ml-4 font-bold text-sm">Log Out</span>}
                </motion.button>
            </div>
        </div>
    );

    return (
        <>
            {/* MOBILE FLOATING HEADER */}
            <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-appTitleBgColor/90 backdrop-blur-md border-b border-white/10 z-[40] flex items-center justify-between px-4">
                <div className="w-8 h-8 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center shadow-lg">
                    <span className="font-black text-white">B</span>
                </div>
                <button onClick={() => setIsMobileOpen(true)} className="p-2 text-white/80 hover:text-white bg-white/5 rounded-lg border border-white/10">
                    <FiMenu size={24} />
                </button>
            </div>

            {/* MOBILE SLIDE-OUT MENU */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-[280px] z-[60] lg:hidden shadow-2xl"
                        >
                            <SidebarContent />
                            <button onClick={() => setIsMobileOpen(false)} className="absolute top-5 right-4 p-2 bg-white/10 rounded-full text-white/70 hover:text-white border border-white/10">
                                <FiX size={20} />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* DESKTOP SIDEBAR */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden lg:block h-screen sticky top-0 z-[40] shrink-0 shadow-2xl relative"
            >
                <SidebarContent />
                
                <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-24 w-6 h-6 bg-appBanner border-2 border-appTitleBgColor rounded-full flex items-center justify-center text-white shadow-lg z-50"
                >
                    {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
                </motion.button>
            </motion.aside>
        </>
    );
}

// // src/components/user/Sidebar.tsx
// "use client"
// import Link from 'next/link'
// import Image from 'next/image';
// import { usePathname, useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import {
//     FiHome,
//     FiPackage,
//     FiTruck,
//     FiCreditCard,
//     FiArchive,
//     FiMap,
//     FiClock,
//     FiSettings,
//     FiLogOut,
//     FiMenu,
//     FiX,
//     FiUser
// } from 'react-icons/fi'
// import logoImage from '@/public/images/logo5.svg';
// import { useUserStore } from '@/lib/utils/store';
// import { LogoutUser } from '@/lib/actions';


// const Sidebar = () => {
//     useEffect(() => {
//         // toast.success(`welcome ${user?.firstName}`);
//         useUserStore.persist.rehydrate();
//     }, []);

//     const { user, destroyUserInfo } = useUserStore();
//     const pathname = usePathname()
//     const [isOpen, setIsOpen] = useState(false)
//     const router = useRouter();

//     const navItems = [
//         { name: 'Dashboard', href: '/pages/newuser', icon: <FiHome className="h-5 w-5" /> },
//         { name: 'My Packages', href: '/pages/newuser/packages', icon: <FiPackage className="h-5 w-5" /> },
//         { name: 'Shipping', href: '/pages/newuser/shipping', icon: <FiTruck className="h-5 w-5" /> },
//         { name: 'Subscription', href: '/pages/newuser/subscription', icon: <FiCreditCard className="h-5 w-5" /> },
//         { name: 'Address', href: '/pages/newuser/address', icon: <FiArchive className="h-5 w-5" /> },
//         { name: 'Tracking', href: '/pages/newuser/tracking', icon: <FiMap className="h-5 w-5" /> },
//         { name: 'History', href: '/pages/newuser/history', icon: <FiClock className="h-5 w-5" /> },
//         { name: 'Settings', href: '/pages/newuser/settings', icon: <FiSettings className="h-5 w-5" /> },
//     ]

//     const handleSignOut = () => {
//         console.log('Signing out...');
//     };

//     return (
//         <>
//             {/* Mobile Menu Button */}
//             <div className="lg:hidden fixed top-4 left-4 z-50">
//                 <button
//                     onClick={() => setIsOpen(!isOpen)}
//                     className="p-2 rounded-xl bg-appTitleBgColor text-appWhite hover:bg-appNav transition-all duration-300 shadow-lg border border-appBanner/20"
//                 >
//                     {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
//                 </button>
//             </div>

//             {/* Overlay */}
//             {isOpen && (
//                 <div
//                     className="lg:hidden fixed inset-0 bg-appBlack/50 z-30 backdrop-blur-sm"
//                     onClick={() => setIsOpen(false)}
//                 />
//             )}

//             {/* Sidebar */}
//             <div className={`
//                 fixed lg:static inset-y-0 left-0 z-40
//                 w-80 lg:w-72 xl:w-80
//                 bg-appNav shadow-2xl
//                 border-r border-appTitleBgColor
//                 transform transition-transform duration-300 ease-in-out
//                 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//                 flex flex-col
//                 h-screen lg:h-full
//             `}>
//                 {/* Logo Section */}
//                 <div className="flex-shrink-0 p-2 border-b border-appTitleBgColor bg-appTitleBgColor">
//                     <div className="flex items-center space-x-3 flex-col">
//                         <div className="w-64 h-auto rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
//                             <Image
//                                 src={logoImage}
//                                 alt="Logo"
//                                 width={180}
//                                 height={78}
//                                 className="object-cover"
//                             />
//                         </div>
//                         <div>
//                             <p className="text-appBanner text-lg font-semibold">User Portal</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Navigation - Scrollable */}
//                 <nav className="flex-1 overflow-y-auto p-6">
//                     <ul className="space-y-2">
//                         {navItems.map((item) => (
//                             <li key={item.name}>
//                                 <Link
//                                     href={item.href}
//                                     onClick={() => setIsOpen(false)}
//                                     className={`
//                                         flex items-center p-4 rounded-2xl font-semibold transition-all duration-200 group
//                                         ${pathname === item.href
//                                             ? 'bg-appBanner shadow-lg text-appWhite transform scale-105'
//                                             : 'text-appWhite hover:bg-appTitleBgColor hover:shadow-md'
//                                         }
//                                     `}
//                                 >
//                                     <span className={`mr-4 text-lg transition-transform duration-200 ${pathname === item.href ? 'scale-110' : 'group-hover:scale-110'
//                                         }`}>
//                                         {item.icon}
//                                     </span>
//                                     <span className="text-sm">{item.name}</span>
//                                 </Link>
//                             </li>
//                         ))}
//                     </ul>
//                 </nav>

//                 {/* User Info Section */}
//                 <div className="p-6 border-t border-appTitleBgColor bg-appTitleBgColor">

//                     <button
//                         // onClick={handleSignOut}
//                         onClick={(e) => {
//                             e.preventDefault();
//                             LogoutUser();
//                             destroyUserInfo(user)
//                             router.push("/pages/signin");
//                         }}
//                         className="w-full flex items-center justify-center p-4 rounded-2xl font-semibold text-appWhite bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
//                     >
//                         <FiLogOut className="mr-3 text-lg" />
//                         <span>Sign Out</span>
//                     </button>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Sidebar