// // components/Aside.tsx
// "use client"
// import Link from 'next/link';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import {
//     FiPackage,
//     FiTruck,
//     FiDollarSign,
//     FiTrendingUp,
//     FiHelpCircle,
//     FiSettings,
//     FiLogOut,
//     FiUser,
// } from 'react-icons/fi';
// import { FaCar } from 'react-icons/fa';
// import logoImage from '@/public/images/logo5.svg';


// interface AsideProps {
//     isOpen: boolean;
//     onClose: () => void;
// }

// const Aside = ({ isOpen, onClose }: AsideProps) => {
//     const pathname = usePathname();

//     const navItems = [
//         { name: 'DASHBOARD', path: '/pages/driver/driverdashboard/dashboard', icon: <FiPackage /> },
//         { name: 'Available Orders', path: '/pages/driver/driverdashboard/orders', icon: <FiPackage /> },
//         { name: 'My Deliveries', path: '/pages/driver/driverdashboard/deliveries', icon: <FiTruck /> },
//         { name: 'Earning', path: '/pages/driver/driverdashboard/earnings', icon: <FiDollarSign /> },
//         { name: 'Performance', path: '/pages/driver/driverdashboard/performance', icon: <FiTrendingUp /> },
//         { name: 'My Vehicles', path: '/pages/driver/driverdashboard/vehicles', icon: <FaCar /> },
//         { name: 'Help Center', path: '/pages/driver/driverdashboard/help', icon: <FiHelpCircle /> },
//         { name: 'Settings', path: '/pages/driver/driverdashboard/settings', icon: <FiSettings /> },
//     ];

//     const handleSignOut = () => {
//         console.log('Signing out...');
//     };

//     return (
//         <>
//             {/* Mobile backdrop */}
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//                     onClick={onClose}
//                 />
//             )}

//             {/* Sidebar */}
//             <aside
//                 className={`fixed lg:relative z-50 w-80 bg-appNav shadow-2xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
//                     } lg:translate-x-0 transition-transform duration-300 ease-in-out h-full flex flex-col border-r border-appTitleBgColor`}
//             >
//                 {/* Brand Section */}
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
//                             <p className="text-appBanner text-lg font-semibold">Driver Portal</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Navigation */}
//                 <nav className="p-6 flex-1">
//                     <ul className="space-y-2">
//                         {navItems.map((item) => (
//                             <li key={item.path}>
//                                 <Link
//                                     href={item.path}
//                                     className={`flex items-center p-4 rounded-2xl font-semibold transition-all duration-200 group ${pathname === item.path
//                                         ? 'bg-appBanner shadow-lg text-appWhite transform scale-105'
//                                         : 'text-appWhite hover:bg-appTitleBgColor hover:shadow-md'
//                                         }`}
//                                     onClick={onClose}
//                                 >
//                                     <span className={`mr-4 text-lg transition-transform duration-200 ${pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
//                                         }`}>
//                                         {item.icon}
//                                     </span>
//                                     <span className="text-sm">{item.name}</span>
//                                 </Link>
//                             </li>
//                         ))}
//                     </ul>
//                 </nav>

//                 {/* Profile Section */}
//                 <div className="p-6 border-t border-appTitleBgColor bg-appTitleBgColor">
//                     <button
//                         onClick={handleSignOut}
//                         className="w-full flex items-center justify-center p-4 rounded-2xl font-semibold text-appWhite bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
//                     >
//                         <FiLogOut className="mr-3 text-lg" />
//                         <span>Sign Out</span>
//                     </button>
//                 </div>
//             </aside>
//         </>
//     );
// };

// export default Aside;




// components/Aside.tsx
"use client"
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    FiPackage,
    FiTruck,
    FiDollarSign,
    FiTrendingUp,
    FiHelpCircle,
    FiSettings,
    FiLogOut,
    FiUser,
    FiMessageSquare,
} from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import logoImage from '@/public/images/logo5.svg';


interface AsideProps {
    isOpen: boolean;
    onClose: () => void;
}

const Aside = ({ isOpen, onClose }: AsideProps) => {
    const pathname = usePathname();

    const navItems = [
        { name: 'DASHBOARD', path: '/pages/driver/driverdashboard/dashboard', icon: <FiPackage /> },
        { name: 'Available Orders', path: '/pages/driver/driverdashboard/orders', icon: <FiPackage /> },
        { name: 'My Deliveries', path: '/pages/driver/driverdashboard/deliveries', icon: <FiTruck /> },
        // { name: 'Earning', path: '/pages/driver/driverdashboard/earnings', icon: <FiDollarSign /> },
        { name: 'Performance', path: '/pages/driver/driverdashboard/performance', icon: <FiTrendingUp /> },
        { name: 'My Vehicles', path: '/pages/driver/driverdashboard/vehicles', icon: <FaCar /> },
        { name: 'Messages', path: '/pages/driver/driverdashboard/messages', icon: <FiMessageSquare /> },
        { name: 'Help Center', path: '/pages/driver/driverdashboard/help', icon: <FiHelpCircle /> },
        { name: 'Settings', path: '/pages/driver/driverdashboard/settings', icon: <FiSettings /> },
    ];

    const handleSignOut = () => {
        console.log('Signing out...');
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:relative z-50 w-80 bg-appNav shadow-2xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 transition-transform duration-300 ease-in-out h-full flex flex-col border-r border-appTitleBgColor`}
            >
                {/* Brand Section */}
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
                            <p className="text-appBanner text-lg font-semibold">Driver Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-6 flex-1">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center p-4 rounded-2xl font-semibold transition-all duration-200 group ${pathname === item.path
                                        ? 'bg-appBanner shadow-lg text-appWhite transform scale-105'
                                        : 'text-appWhite hover:bg-appTitleBgColor hover:shadow-md'
                                        }`}
                                    onClick={onClose}
                                >
                                    <span className={`mr-4 text-lg transition-transform duration-200 ${pathname === item.path ? 'scale-110' : 'group-hover:scale-110'
                                        }`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Profile Section */}
                <div className="p-6 border-t border-appTitleBgColor bg-appTitleBgColor">
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center p-4 rounded-2xl font-semibold text-appWhite bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                        <FiLogOut className="mr-3 text-lg" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Aside;