"use client";
import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useUserStore } from '@/lib/utils/store';

interface Header2Props {
    onLoginClick?: () => void;
    onRegisterClick?: () => void;
}

const Header2: React.FC<Header2Props> = ({ onLoginClick, onRegisterClick }) => {
    useEffect(() => {
        useUserStore.persist.rehydrate();
    }, []);

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '#services' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Contact', href: '#contact' }
    ];

    return (
        <header className="w-full h-20 bg-white/95 backdrop-blur-md flex flex-row items-center justify-between px-6 md:px-12 shadow-sm sticky top-0 z-[100] transition-all">
            {/* Logo Section */}
            <div className="flex items-center">
                <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
                    <Image
                        src="/images/logo4.svg"
                        alt="Company Logo"
                        width={180}
                        height={45}
                        className="w-32 md:w-40 h-auto"
                        priority
                    />
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center">
                <ul className="flex flex-row items-center gap-10">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className="text-gray-600 hover:text-appNav font-medium transition-all duration-200 text-sm tracking-wide relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-appNav transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 md:gap-5">
                <button 
                    onClick={onLoginClick}
                    className="text-gray-700 font-bold text-sm md:text-base hover:text-appNav transition-colors px-4 py-2"
                >
                    Sign In
                </button>
                
                <button 
                    onClick={onRegisterClick}
                    className="bg-appTitleBgColor text-white px-6 py-2.5 rounded-full font-bold text-sm md:text-base shadow-md hover:bg-appNav hover:shadow-lg transition-all duration-300 transform active:scale-95"
                >
                    Register Free
                </button>
            </div>

            {/* Mobile Menu Icon (Visual Only for now) */}
            <div className="lg:hidden flex items-center ml-4">
                <button className="text-gray-800">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Header2;
// "use client";
// import Link from 'next/link';
// import React, { useState, useEffect, useCallback } from 'react';
// import Image from 'next/image';
// import dynamic from 'next/dynamic';
// import { LogoutUser } from '@/lib/actions';
// import { useUserStore } from '@/lib/utils/store';
// import { useRouter } from 'next/navigation';

// // const UserLogin = dynamic(() => import('../usercomponents/UserLogin'), {
// //     ssr: false,
// //     loading: () => null
// // });
// interface Header2Props {
//     onLoginClick?: () => void;
//     onRegisterClick?: () => void;
// }

// const Header2: React.FC<Header2Props> = ({ onLoginClick, onRegisterClick }) => {
//     useEffect(() => {
//         // toast.success(`welcome ${user?.firstName}`);
//         useUserStore.persist.rehydrate();
//     }, []);
//     const [showLogin, setShowLogin] = useState(false);
//     const [modalKey, setModalKey] = useState(0);
//     const router = useRouter();

//     const navItems = [
//         { name: 'Home', href: '/pages/home' },
//         { name: 'How It Works', href: '/pages/how-it-works' },
//         { name: 'Pricing', href: '/pages/pricing' },
//         { name: 'FAQ', href: '/pages/faq' },
//         { name: 'Contact', href: '/pages/contact' }
//     ];

//     const handleOpenModal = () => {
//         setModalKey(Date.now());
//         setShowLogin(true);
//     };

//     const handleCloseModal = useCallback(() => {
//         setShowLogin(false);
//         setModalKey(Date.now());
//         document.body.classList.remove('modal-open');
//     }, []);

//     useEffect(() => {
//         return () => {
//             document.body.classList.remove('modal-open');
//         };
//     }, []);
//     const { user, destroyUserInfo } = useUserStore();

//     return (
//         <>
//             <header className="w-full h-18 bg-white flex flex-row items-center justify-between px-4 sm:px-8 py-4 shadow-sm sticky top-0 z-50">
//                 <div className="flex items-center justify-center pl-2 md:pl-0">
//                     <Link href="/" className="flex items-center w-60 text-green-800" aria-label="Home">
//                         <Image
//                             src="/images/logo4.svg"
//                             alt="Company Logo"
//                             width={192}
//                             height={48}
//                             className="w-40 h-10 md:w-48 md:h-12"
//                             priority
//                         />
//                     </Link>
//                 </div>

//                 <nav className="hidden md:flex w-auto lg:w-[484px] bg-white px-6">
//                     <ul className="flex w-full flex-row items-center justify-between gap-8">
//                         {navItems.map((item) => (
//                             <li key={item.name}>
//                                 <Link
//                                     href={item.href}
//                                     className="text-gray-800 hover:text-blue-600 transition-colors text-sm lg:text-base"
//                                 >
//                                     {item.name}
//                                 </Link>
//                             </li>
//                         ))}
//                     </ul>
//                 </nav>

//                 <div className="flex items-center">
//                     {/* <button
//                         // className="px-6 py-2 bg-appNav rounded-md text-white hover:bg-opacity-90 transition-colors text-sm md:text-base"
//                         className="w-full flex items-center justify-center p-4 rounded-2xl font-semibold text-appWhite bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
//                         // onClick={handleOpenModal}
//                         aria-label="Sign In"
//                         onClick={(e) => {
//                             e.preventDefault();
//                             LogoutUser();
//                             destroyUserInfo(user)
//                             router.push("/pages/signin");
//                         }}
//                     >
//                         Sign Out
//                     </button> */}
//                     {/* 3. Wire them up to your actual buttons inside the header */}
//                     <button onClick={onLoginClick}>Sign In</button>
//                     <button onClick={onRegisterClick}>Register</button>
//                 </div>
//             </header>

//             {/* {showLogin && (
//                 <div key={modalKey} className="fixed inset-0 z-[1000]">
//                     <UserLogin isModal onClose={handleCloseModal} />
//                 </div>
//             )} */}
//         </>
//     );
// };

// export default Header2;