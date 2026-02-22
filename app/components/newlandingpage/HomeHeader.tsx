"use client";
import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useUserStore } from '@/lib/utils/store';

const HomeHeader: React.FC = () => {
    useEffect(() => {
        useUserStore.persist.rehydrate();
    }, []);

    return (
        // 1. Removed bg-white, shadow-sm, and sticky. 
        // 2. Added bg-transparent so it bleeds directly into the video banner behind it.
        <header className="w-full h-24 bg-transparent flex flex-row items-center justify-between px-6 md:px-12 z-[100] transition-all">
            
            {/* Logo Section (Left) */}
            <div className="flex items-center">
                <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
                    <Image
                        src="/images/logo5.svg" // Swapped to logo5.svg (assuming this is your light/white logo for dark backgrounds!)
                        alt="Company Logo"
                        width={180}
                        height={45}
                        className="w-32 md:w-40 h-auto drop-shadow-md"
                        priority
                    />
                </Link>
            </div>

            {/* Dashboard Button Section (Right) */}
            <div className="flex items-center">
                <Link 
                    href="/pages/newuser"
                    className="bg-green-600 text-white px-6 py-2.5 rounded-full font-bold text-sm md:text-base shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:bg-green-500 hover:shadow-[0_0_25px_rgba(22,163,74,0.6)] transition-all duration-300 transform active:scale-95 border border-green-400/50 backdrop-blur-sm"
                >
                    My Dashboard
                </Link>
            </div>
            
        </header>
    );
};

export default HomeHeader;

// "use client";
// import Link from 'next/link';
// import React, { useEffect } from 'react';
// import Image from 'next/image';
// import { useUserStore } from '@/lib/utils/store';

// const HomeHeader: React.FC = () => {
//     useEffect(() => {
//         useUserStore.persist.rehydrate();
//     }, []);

//     return (
//         <header className="w-full h-20 bg-white/95 backdrop-blur-md flex flex-row items-center justify-between px-6 md:px-12 shadow-sm sticky top-0 z-[100] transition-all">
            
//             {/* Logo Section (Left) */}
//             <div className="flex items-center">
//                 <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
//                     <Image
//                         src="/images/logo4.svg"
//                         alt="Company Logo"
//                         width={180}
//                         height={45}
//                         className="w-32 md:w-40 h-auto"
//                         priority
//                     />
//                 </Link>
//             </div>

//             {/* Dashboard Button Section (Right) */}
//             <div className="flex items-center">
//                 <Link 
//                     href="/pages/newuser"
//                     className="bg-green-600 text-white px-6 py-2.5 rounded-full font-bold text-sm md:text-base shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300 transform active:scale-95 border border-green-500"
//                 >
//                     My Dashboard
//                 </Link>
//             </div>
            
//         </header>
//     );
// };

// export default HomeHeader;