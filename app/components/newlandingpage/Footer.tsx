import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import logo from '../../../public/images/logo5.svg'; // Ensure this path is correct

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
        <footer className="bg-appTitleBgColor text-white pt-20 pb-10 px-6 sm:px-8 lg:px-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <Image
                                src={logo}
                                alt="BulQ Logo"
                                width={140}
                                height={50}
                                className="w-auto h-10"
                            />
                        </div>
                        {/* Changed text-gray-400 to text-gray-200 */}
                        <p className="text-gray-200 text-sm leading-relaxed mb-8 max-w-xs">
                            Your global logistics partner. We simplify international shipping so you can shop from anywhere, to everywhere.
                        </p>
                        
                        {/* Social Icons */}
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <Link 
                                    key={index} 
                                    href={social.href}
                                    // Changed text-gray-400 to text-gray-200
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-appBanner text-gray-200 hover:text-white transition-all duration-300"
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {footerSections.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="text-white font-bold text-base mb-6 tracking-wide">{section.title}</h3>
                            <ul className="space-y-4">
                                {section.links.map((item) => (
                                    <li key={item}>
                                        <Link 
                                            href="#" 
                                            // Changed text-gray-400 to text-gray-200
                                            className="text-gray-200 hover:text-appBanner text-sm transition-colors duration-200 block"
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        © {new Date().getFullYear()} BulQ Logistics. All rights reserved.
                    </p>
                    
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;