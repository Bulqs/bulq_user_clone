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
        <header className="w-full h-20 bg-white/95 backdrop-blur-md flex flex-row items-center justify-between px-6 md:px-12 shadow-sm sticky top-0 z-[100] transition-all">
            
            {/* Logo Section (Left) */}
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

            {/* Dashboard Button Section (Right) */}
            <div className="flex items-center">
                <Link 
                    href="/pages/newuser"
                    className="bg-green-600 text-white px-6 py-2.5 rounded-full font-bold text-sm md:text-base shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300 transform active:scale-95 border border-green-500"
                >
                    My Dashboard
                </Link>
            </div>
            
        </header>
    );
};

export default HomeHeader;