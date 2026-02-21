"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { motion, Variants } from 'framer-motion';

// Note: Adjust this import path if needed based on your folder structure!
import logo from '../../../public/images/logo5.svg'; 

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15, // Cascades the columns in one by one
            delayChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
        opacity: 1, 
        y: 0, 
        transition: { type: "spring", stiffness: 120, damping: 15 } 
    }
};

const Footer = () => {
    
    // Social Links Data
    const socialLinks = [
        { icon: <FaFacebookF />, href: '#' },
        { icon: <FaTwitter />, href: '#' },
        { icon: <FaInstagram />, href: '#' },
        { icon: <FaLinkedinIn />, href: '#' },
    ];

    // Navigation Sections Data
    const footerSections = [
        {
            title: "Company",
            links: ['Home', 'Careers', 'Blogs', 'Press']
        },
        {
            title: "Support",
            links: ['Help Center', 'Contact Us', 'Shipping Info', 'Returns']
        },
        {
            title: "Legal",
            links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
        },
        {
            title: "Locations",
            links: ['United States', 'United Kingdom', 'Nigeria', 'All Hubs']
        }
    ];

    return (
        <footer className="relative bg-appTitleBgColor text-white pt-24 pb-10 px-6 sm:px-8 lg:px-12 border-t border-gray-800 overflow-hidden">
            
            {/* Ambient Background Glows (Subtle bottom-anchored lights) */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none z-0">
                <motion.div 
                    animate={{ opacity: [0.03, 0.08, 0.03], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-40 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"
                />
                <motion.div 
                    animate={{ opacity: [0.02, 0.06, 0.02], scale: [1, 1.2, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-40 -right-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px]"
                />
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }} // Triggers just as it enters the screen
                className="max-w-7xl mx-auto relative z-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
                    
                    {/* Brand Column */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-6 group">
                            <Image
                                src={logo}
                                alt="BulQ Logo"
                                width={160}
                                height={50}
                                className="w-auto h-12 transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>
                        
                        <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-xs font-medium">
                            Your global logistics partner. We simplify international shipping so you can shop from anywhere, to everywhere.
                        </p>
                        
                        {/* Social Icons with Spring Physics */}
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.div 
                                    key={index}
                                    whileHover={{ scale: 1.15, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link 
                                        href={social.href}
                                        className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-800/80 border border-gray-700 hover:bg-appNav hover:border-appNav hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] text-gray-300 hover:text-white transition-colors duration-300"
                                    >
                                        <span className="text-lg">{social.icon}</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation Columns */}
                    {footerSections.map((section, idx) => (
                        <motion.div variants={itemVariants} key={idx}>
                            <h3 className="text-white font-bold text-base mb-6 tracking-wider uppercase">{section.title}</h3>
                            <ul className="space-y-4">
                                {section.links.map((item) => (
                                    <motion.li 
                                        key={item}
                                        whileHover={{ x: 6 }} // Magnetic slide effect
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Link 
                                            href="#" 
                                            className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200 flex items-center gap-2 group"
                                        >
                                            <span className="w-0 h-px bg-appNav transition-all duration-300 group-hover:w-3"></span>
                                            {item}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <motion.div 
                    variants={itemVariants} 
                    className="pt-8 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <p className="text-gray-500 text-sm text-center md:text-left font-medium">
                        © {new Date().getFullYear()} BulQ Logistics. All rights reserved.
                    </p>
                    
                    <div className="flex gap-6 text-sm text-gray-500 font-medium">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </motion.div>

            </motion.div>
        </footer>
    );
};

export default Footer;

// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
// import logo from '../../../public/images/logo5.svg'; // Ensure this path is correct

// const Footer = () => {
    
//     // Social Links Data
//     const socialLinks = [
//         { icon: <FaFacebookF />, href: '#' },
//         { icon: <FaTwitter />, href: '#' },
//         { icon: <FaInstagram />, href: '#' },
//         { icon: <FaLinkedinIn />, href: '#' },
//     ];

//     // Navigation Sections Data
//     const footerSections = [
//         {
//             title: "Company",
//             links: ['Home', 'Careers', 'Blogs', 'Press']
//         },
//         {
//             title: "Support",
//             links: ['Help Center', 'Contact Us', 'Shipping Info', 'Returns']
//         },
//         {
//             title: "Legal",
//             links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
//         },
//         {
//             title: "Locations",
//             links: ['United States', 'United Kingdom', 'Nigeria', 'All Hubs']
//         }
//     ];

//     return (
//         <footer className="bg-appTitleBgColor text-white pt-20 pb-10 px-6 sm:px-8 lg:px-12 border-t border-gray-800">
//             <div className="max-w-7xl mx-auto">
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
                    
//                     {/* Brand Column */}
//                     <div className="lg:col-span-2">
//                         <div className="mb-6">
//                             <Image
//                                 src={logo}
//                                 alt="BulQ Logo"
//                                 width={140}
//                                 height={50}
//                                 className="w-auto h-10"
//                             />
//                         </div>
//                         {/* Changed text-gray-400 to text-gray-200 */}
//                         <p className="text-gray-200 text-sm leading-relaxed mb-8 max-w-xs">
//                             Your global logistics partner. We simplify international shipping so you can shop from anywhere, to everywhere.
//                         </p>
                        
//                         {/* Social Icons */}
//                         <div className="flex gap-4">
//                             {socialLinks.map((social, index) => (
//                                 <Link 
//                                     key={index} 
//                                     href={social.href}
//                                     // Changed text-gray-400 to text-gray-200
//                                     className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-appBanner text-gray-200 hover:text-white transition-all duration-300"
//                                 >
//                                     {social.icon}
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Navigation Columns */}
//                     {footerSections.map((section, idx) => (
//                         <div key={idx}>
//                             <h3 className="text-white font-bold text-base mb-6 tracking-wide">{section.title}</h3>
//                             <ul className="space-y-4">
//                                 {section.links.map((item) => (
//                                     <li key={item}>
//                                         <Link 
//                                             href="#" 
//                                             // Changed text-gray-400 to text-gray-200
//                                             className="text-gray-200 hover:text-appBanner text-sm transition-colors duration-200 block"
//                                         >
//                                             {item}
//                                         </Link>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Bottom Bar */}
//                 <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
//                     <p className="text-gray-500 text-sm text-center md:text-left">
//                         © {new Date().getFullYear()} BulQ Logistics. All rights reserved.
//                     </p>
                    
//                     <div className="flex gap-6 text-sm text-gray-500">
//                         <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
//                         <Link href="#" className="hover:text-white transition-colors">Terms</Link>
//                         <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
//                     </div>
//                 </div>

//             </div>
//         </footer>
//     );
// };

// export default Footer;