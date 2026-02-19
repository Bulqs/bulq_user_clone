// src/components/user/Sidebar.tsx
"use client"
import Link from 'next/link'
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
    FiHome,
    FiPackage,
    FiTruck,
    FiCreditCard,
    FiArchive,
    FiMap,
    FiClock,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX,
    FiUser
} from 'react-icons/fi'
import logoImage from '@/public/images/logo5.svg';
import { useUserStore } from '@/lib/utils/store';
import { LogoutUser } from '@/lib/actions';


const Sidebar = () => {
    useEffect(() => {
        // toast.success(`welcome ${user?.firstName}`);
        useUserStore.persist.rehydrate();
    }, []);

    const { user, destroyUserInfo } = useUserStore();
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();

    const navItems = [
        { name: 'Dashboard', href: '/pages/newuser', icon: <FiHome className="h-5 w-5" /> },
        { name: 'My Packages', href: '/pages/newuser/packages', icon: <FiPackage className="h-5 w-5" /> },
        { name: 'Shipping', href: '/pages/newuser/shipping', icon: <FiTruck className="h-5 w-5" /> },
        { name: 'Subscription', href: '/pages/newuser/subscription', icon: <FiCreditCard className="h-5 w-5" /> },
        { name: 'Address', href: '/pages/newuser/address', icon: <FiArchive className="h-5 w-5" /> },
        { name: 'Tracking', href: '/pages/newuser/tracking', icon: <FiMap className="h-5 w-5" /> },
        { name: 'History', href: '/pages/newuser/history', icon: <FiClock className="h-5 w-5" /> },
        { name: 'Settings', href: '/pages/newuser/settings', icon: <FiSettings className="h-5 w-5" /> },
    ]

    const handleSignOut = () => {
        console.log('Signing out...');
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl bg-appTitleBgColor text-appWhite hover:bg-appNav transition-all duration-300 shadow-lg border border-appBanner/20"
                >
                    {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-appBlack/50 z-30 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-80 lg:w-72 xl:w-80
                bg-appNav shadow-2xl
                border-r border-appTitleBgColor
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
                h-screen lg:h-full
            `}>
                {/* Logo Section */}
                <div className="flex-shrink-0 p-2 border-b border-appTitleBgColor bg-appTitleBgColor">
                    <div className="flex items-center space-x-3 flex-col">
                        <div className="w-64 h-auto rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                            <Image
                                src={logoImage}
                                alt="Logo"
                                width={180}
                                height={78}
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-appBanner text-lg font-semibold">User Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation - Scrollable */}
                <nav className="flex-1 overflow-y-auto p-6">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`
                                        flex items-center p-4 rounded-2xl font-semibold transition-all duration-200 group
                                        ${pathname === item.href
                                            ? 'bg-appBanner shadow-lg text-appWhite transform scale-105'
                                            : 'text-appWhite hover:bg-appTitleBgColor hover:shadow-md'
                                        }
                                    `}
                                >
                                    <span className={`mr-4 text-lg transition-transform duration-200 ${pathname === item.href ? 'scale-110' : 'group-hover:scale-110'
                                        }`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Info Section */}
                <div className="p-6 border-t border-appTitleBgColor bg-appTitleBgColor">

                    <button
                        // onClick={handleSignOut}
                        onClick={(e) => {
                            e.preventDefault();
                            LogoutUser();
                            destroyUserInfo(user)
                            router.push("/pages/signin");
                        }}
                        className="w-full flex items-center justify-center p-4 rounded-2xl font-semibold text-appWhite bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                        <FiLogOut className="mr-3 text-lg" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Sidebar