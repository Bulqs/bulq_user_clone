// src/components/admin/AdminSidebar.tsx
"use client"
import Link from 'next/link'
import Image from 'next/image';
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
    FiHome,
    FiUsers,
    FiPackage,
    FiTruck,
    FiDollarSign,
    FiBell,
    FiMenu,
    FiX,
    FiLogOut,
    FiDatabase,
    FiChevronDown,
    FiChevronRight,
    FiBarChart2
} from 'react-icons/fi'

import logoImage from '@/public/images/logo5.svg';

const AdminSidebar = () => {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [expandedItems, setExpandedItems] = useState<string[]>([])

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(item => item !== itemId)
                : [...prev, itemId]
        )
    }

    const navItems = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            href: '/pages/admindashboard',
            icon: <FiHome className="h-5 w-5" />,
            subItems: []
        },
        {
            id: 'user-management',
            name: 'User Management',
            href: '#',
            icon: <FiUsers className="h-5 w-5" />,
            subItems: [
                { name: 'All Users', href: '/pages/admindashboard/usermanagement/all-users' },
                { name: 'Active Users', href: '/pages/admindashboard/usermanagement/active-users' },
                { name: 'Inactive Users', href: '/pages/admindashboard/usermanagement/inactive-users' },
                { name: 'Access Control', href: '/pages/admindashboard/usermanagement/access-control' },
                { name: 'Restrictions', href: '/pages/admindashboard/usermanagement/restrictions' }
            ]
        },
        {
            id: 'warehouse',
            name: 'Warehouse',
            href: '#',
            icon: <FiPackage className="h-5 w-5" />,
            subItems: [
                { name: 'Inventory', href: '/pages/admindashboard/warehouse/inventory' },
                { name: 'Storage', href: '/pages/admindashboard/warehouse/storage' },
                { name: 'Locations', href: '/pages/admindashboard/warehouse/locations' },
                { name: 'Activities', href: '/pages/admindashboard/warehouse/activities' }
            ]
        },
        {
            id: 'shipments',
            name: 'Shipments',
            href: '#',
            icon: <FiTruck className="h-5 w-5" />,
            subItems: [
                { name: 'All Shipments', href: '/pages/admindashboard/shipments/all' },
                { name: 'Pending', href: '/pages/admindashboard/shipments/pending' },
                { name: 'In Transit', href: '/pages/admindashboard/shipments/in-transit' },
                { name: 'Delivered', href: '/pages/admindashboard/shipments/delivered' },
                { name: 'Tracking', href: '/pages/admindashboard/shipments/tracking' },
                { name: 'History', href: '/pages/admindashboard/shipments/history' }
            ]
        },
        {
            id: 'payments',
            name: 'Payments',
            href: '#',
            icon: <FiDollarSign className="h-5 w-5" />,
            subItems: [
                { name: 'Invoices', href: '/pages/admindashboard/payments/invoices' },
                { name: 'Payments', href: '/pages/admindashboard/payments/all' },
                { name: 'Reports', href: '/pages/admindashboard/payments/reports' }
            ]
        },
        {
            id: 'notifications',
            name: 'Notifications',
            href: '#',
            icon: <FiBell className="h-5 w-5" />,
            subItems: [
                { name: 'System Alerts', href: '/pages/admindashboard/notifications/alerts' },
                { name: 'Notifications', href: '/pages/admindashboard/notifications/all' },
                { name: 'Settings', href: '/pages/admindashboard/notifications/settings' }
            ]
        },
        {
            id: 'reports',
            name: 'Reports',
            href: '#',
            icon: <FiBarChart2 className="h-5 w-5" />,
            subItems: [
                { name: 'Shipment Reports', href: '/pages/admindashboard/reports/shipments' },
                { name: 'Warehouse Reports', href: '/pages/admindashboard/reports/warehouse' },
                { name: 'Payment Reports', href: '/pages/admindashboard/reports/payments' }
            ]
        },
        {
            id: 'system',
            name: 'System',
            href: '#',
            icon: <FiDatabase className="h-5 w-5" />,
            subItems: []
        }
    ]

    const handleSignOut = () => {
        console.log('Admin signing out...');
    };

    const isItemActive = (itemHref: string, subItems: any[]) => {
        if (pathname === itemHref) return true;
        return subItems.some(subItem => pathname === subItem.href);
    };

    const handleMainItemClick = (item: any) => {
        if (item.subItems.length > 0) {
            toggleExpanded(item.id);
        } else {
            setIsOpen(false);
        }
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

            {/* Sidebar - Fixed height */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-40
                w-80 lg:w-72 xl:w-80
                bg-appNav shadow-2xl
                border-r border-appTitleBgColor
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
                h-screen
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
                            <p className="text-appBanner text-lg font-semibold">Admin Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation - Scrollable if needed */}
                <nav className="flex-1 overflow-y-auto p-6">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <div className="space-y-1">
                                    {/* Main Navigation Item */}
                                    <div className={`
                                        flex items-center justify-between p-4 rounded-2xl font-semibold transition-all duration-200 group cursor-pointer
                                        ${isItemActive(item.href, item.subItems)
                                            ? 'bg-appBanner shadow-lg text-appWhite transform scale-105'
                                            : 'text-appWhite hover:bg-appTitleBgColor hover:shadow-md'
                                        }
                                    `}>
                                        {item.subItems.length > 0 ? (
                                            // For items with submenus, use a button to toggle
                                            <button
                                                onClick={() => handleMainItemClick(item)}
                                                className="flex items-center flex-1 text-left"
                                            >
                                                <span className={`mr-4 text-lg transition-transform duration-200 ${isItemActive(item.href, item.subItems) ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                    {item.icon}
                                                </span>
                                                <span className="text-sm">{item.name}</span>
                                            </button>
                                        ) : (
                                            // For items without submenus, use a Link
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center flex-1"
                                            >
                                                <span className={`mr-4 text-lg transition-transform duration-200 ${isItemActive(item.href, item.subItems) ? 'scale-110' : 'group-hover:scale-110'}`}>
                                                    {item.icon}
                                                </span>
                                                <span className="text-sm">{item.name}</span>
                                            </Link>
                                        )}

                                        {/* Expand/Collapse Arrow */}
                                        {item.subItems.length > 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleExpanded(item.id);
                                                }}
                                                className="p-1 hover:bg-appBanner/20 rounded-lg transition-colors"
                                            >
                                                {expandedItems.includes(item.id) ? (
                                                    <FiChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <FiChevronRight className="h-4 w-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Sub Navigation Items */}
                                    {item.subItems.length > 0 && expandedItems.includes(item.id) && (
                                        <ul className="ml-4 space-y-1 border-l-2 border-appBanner/30 pl-2">
                                            {item.subItems.map((subItem) => (
                                                <li key={subItem.name}>
                                                    <Link
                                                        href={subItem.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={`
                                                            flex items-center p-3 rounded-xl font-medium transition-all duration-200 text-sm
                                                            ${pathname === subItem.href
                                                                ? 'bg-appBanner/20 text-appWhite shadow-md'
                                                                : 'text-appWhite/80 hover:bg-appTitleBgColor hover:text-appWhite'
                                                            }
                                                        `}
                                                    >
                                                        <span className="mr-3 opacity-70">•</span>
                                                        <span>{subItem.name}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Admin Info Section - Fixed at bottom */}
                <div className="flex-shrink-0 p-6 border-t border-appTitleBgColor bg-appTitleBgColor">
                    <button
                        onClick={handleSignOut}
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

export default AdminSidebar