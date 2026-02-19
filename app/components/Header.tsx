"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../public/images/logo5.svg';
import { LogoutUser } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isShipmentOpen, setIsShipmentOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle
    const [rotate, setRotate] = useState(false);
    const [loggedIn, setLoggedIn] = useState(true); // Example loggedIn state
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const router = useRouter();


    const handleServicesClick = () => {
        setIsServicesOpen(!isServicesOpen);
        setIsShipmentOpen(false);
    };

    const handleShipmentClick = () => {
        setIsShipmentOpen(!isShipmentOpen);
        setIsServicesOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        setRotate(!rotate);
    };
  

    return (
        <nav className="bg-appNav shadow-md shadow-appTitleBgColor w-full pt-2 md:px-4  md:py-2 border-b-3 border-appTitleBgColor">
            <div className=" mx-auto px-0 flex items-center justify-between py-1">
                {/* Logo */}
                <div className="flex items-center justify-center pl-4 md:pl-0">
                    <Link href="/" className="flex items-center justify-center w-full">
                        <Image
                            src={logo}
                            alt="Description of the image"
                            className="w-24 md:w-44"
                        />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden pr-4 md:pr-0">
                    <button
                        onClick={toggleMobileMenu}
                        className={`text-white px-3 py-1 ${isMobileMenuOpen ? 'bg-appBlack' : 'bg-appBlue'}`}
                    >
                        {/* Menu icon */}
                        {isMobileMenuOpen ? "Close" : "Menu"}
                    </button>
                </div>

                {/* Desktop Navigation Tabs */}
                <div className="hidden md:flex space-x-6">
                    <div className="relative">
                        <button
                            onClick={handleServicesClick}
                            className="text-white focus:outline-none font-bold border-2 border-appNav hover:border-appTitleBgColor px-2 hover:bg-appTitleBgColor hover:text-appWhite"
                        >
                            Our Services
                        </button>
                        {isServicesOpen && (
                            <ul className="logisticsHeaderUl z-50">
                                <li className="logisticsHeaderLi">
                                    <Link href="">Pick up</Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href="">Delivery</Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href="">Scheduling</Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={handleShipmentClick}
                            className="text-white focus:outline-none font-bold border-2 border-appNav hover:border-appTitleBgColor px-2 hover:bg-appTitleBgColor hover:text-appWhite"
                        >
                            Track Shipment
                        </button>
                        {isShipmentOpen && (
                            <ul className="logisticsHeaderUl z-50">
                                <li className="logisticsHeaderLi">
                                    <Link href="">Pick up</Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href="">Delivery</Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href="">Scheduling</Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href="/location">Location</Link>
                                </li>
                            </ul>
                        )}
                    </div>

                    <Link href="/bulq-discount" className="logisticsHeaderp">
                        <p>Bulq Discount</p>
                    </Link>

                    <Link href="" className="logisticsHeaderp">
                        <p>Become a Partner</p>
                    </Link>
                </div>

                {/* Desktop Login/Register buttons */}
                <div className="hidden md:flex space-x-4">
                
                    {loggedIn ? (
                        <div className="hidden sm:flex justify-end flex-row lg:pr-3 sm:pr-6 py-3 pl-8 Drops relative">
                            <div className="flex justify-center items-center flex-row">
                                <Image
                                    className="w-10 h-10"
                                    src="https://i.ibb.co/QMddNDb/Ellipse-14.png"
                                    alt="individual person"
                                />
                                <div className="ml-2">
                                    <p className="text-lg leading-4 font-semibold text-white">
                                        <span>Welcome</span> David Hulk
                                    </p>
                                    <p className="font-normal text-xs leading-3 text-white mt-1">
                                        david@alphahulk.com
                                    </p>
                                </div>
                                <svg
                                    onClick={toggleDropdown}
                                    className={`${rotate ? 'rotate-180' : ''
                                        } bg-white cursor-pointer transform duration-100 xl:ml-3 lg:ml-3 ml-2 p-1 rounded-full`}
                                    width={20}
                                    height={20}
                                    viewBox="0 0 14 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 1L7 7L13 1"
                                        stroke="#1F2937"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-6 mt-16 w-48 bg-white shadow-lg rounded-lg z-50">
                                    <ul className="pt-2 bg-appTitleBgColor rounded-md">
                                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer text-white font-semibold">
                                            <Link href="/pages/userdashboard">
                                             My Dashboard
                                            </Link>
                                           
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer text-white font-semibold">
                                            <Link href="/pages/userdashboard/settings">
                                                Settings
                                            </Link>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer text-white font-semibold">Tracking ID</li>
                                        <li className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer text-white font-semibold">Orders</li>
                                        <hr className="border-t" />
                                        <li className="bg-white text-center px-4 py-2 hover:bg-black hover:text-white cursor-pointer text-red-600 font-semibold"
                                        
                                        >
                                            <a 
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        LogoutUser();
                                        // router.push("/login");
                                      }}
                                    className="block px-4 py-2 hover:bg-gray-100 hover:text-appBanner">
                                        LOGOUT
                                    </a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-4 account">
                            <Link href="/signin">
                                <p className="px-4 py-1 bg-appTitleBgColor text-appWhite font-semibold">Login</p>
                            </Link>
                            <Link href="/signup">
                                <p className="px-4 py-1 bg-appBlack text-appWhite font-semibold">Sign Up</p>
                            </Link>
                        </div>
                    )}
                    
                </div>
            </div>

            {/* Mobile Navigation Tabs */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white text-appBlack space-y-2 px-4 py-2 mt-4">

                    <div className=" w-full flex flex-col">

                        <button
                            onClick={handleServicesClick}
                            className="w-6/12 text-left focus:outline-none font-bold md:border-2 md:border-appNav px-0 mt-2"
                        >
                            Our Services
                        </button>
                        {isServicesOpen && (
                            <ul className='w-6/12 bg-appTitleBgColor text-white'>
                                <li className="logisticsHeaderLi">
                                    <Link href="">Pick up</Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href="">Delivery</Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href="">Scheduling</Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href="/location">Location</Link>
                                </li>
                            </ul>
                        )}

                        <button
                            onClick={handleShipmentClick}
                            className="w-6/12 text-left focus:outline-none font-bold md:border-2 md:border-appNav px-0 mt-2"
                        >
                            Track Shipment
                        </button>
                        {isShipmentOpen && (
                            <ul className='w-6/12 bg-appTitleBgColor text-white'>
                                <li className="logisticsHeaderLi">
                                    <Link href="">Pick up</Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href=""> Delivery </Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href="">Scheduling</Link>
                                </li>
                                <li className="logisticsHeaderLi">
                                    <Link href="/location">Location</Link>
                                </li>
                            </ul>
                        )}

                        <Link href="" className="block w-6/12 mt-2 font-bold">
                            Bulq Discount
                        </Link>
                        <Link href="" className="block w-6/12 mt-2 font-bold">
                            Become a Partner
                        </Link>

                        <div className="flex w-10/12 md:w-6/12 items-start md:items-center justify-between mt-4">
                            {/* <Link href="/signin" className="block px-4 py-1 bg-appTitleBgColor text-appWhite font-semibold">
                                Log In
                            </Link>
                            <Link href="/signup" className="block px-4 py-1 bg-appBlack text-appWhite font-semibold">
                                Sign Up
                            </Link> */}
                            {loggedIn ? (
                                <div className="sm:flex justify-end flex-row lg:pr-3 sm:pr-6 py-3 md:pl-8 Drops relative w-full bg-appNav">

                                    <div className="flex justify-start items-center flex-row pl-4 md:pl-0">
                                        <Image
                                            className="w-10 h-10"
                                            src="https://i.ibb.co/QMddNDb/Ellipse-14.png"
                                            alt="individual person"
                                        />
                                        <div className="ml-2">
                                            <p className="text-lg leading-4 font-semibold text-white">
                                                <span>Welcome</span> David Hulk
                                            </p>
                                            <p className="font-normal text-xs leading-3 text-white mt-1">
                                                david@alphahulk.com
                                            </p>
                                        </div>
                                        <svg
                                            onClick={toggleDropdown}
                                            className={`${rotate ? 'rotate-180' : ''
                                                } bg-white cursor-pointer transform duration-100 md:ml-3 ml-2 p-1 rounded-full`}
                                            width={20}
                                            height={20}
                                            viewBox="0 0 14 8"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M1 1L7 7L13 1"
                                                stroke="#1F2937"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="md:absolute right-0 md:right-6 mt-4 md:mt-16 w-full md:w-48 bg-white shadow-lg rounded-lg z-50">
                                            <ul className="pt-2 bg-appTitleBgColor rounded-md w-full">
                                                <li className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer text-white font-semibold">
                                                    <Link href="/pages/userdashboard">
                                                        My Dashboard
                                                    </Link>

                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer text-white font-semibold">
                                                    <Link href="/pages/userdashboard/settings">
                                                        Settings
                                                    </Link>
                                                </li>
                                                <li className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer text-white font-semibold">Tracking ID</li>
                                                <li className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer text-white font-semibold">Orders</li>
                                                <hr className="border-t" />
                                                <li className="bg-white text-center px-4 py-2 hover:bg-black hover:text-white cursor-pointer text-red-600 font-semibold">LOGOUT</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // this show when the is login function is not true
                                <div className="flex items-center justify-center gap-4 account">
                                    <Link href="/signin">
                                        <p className="px-4 py-1 bg-appTitleBgColor text-appWhite font-semibold">Login</p>
                                    </Link>
                                    <Link href="/signup">
                                        <p className="px-4 py-1 bg-appBlack text-appWhite font-semibold">Sign Up</p>
                                    </Link>
                                </div>
                            )}

                        </div>

                    </div>

                </div>
            )}
        </nav>
    );
};

export default Header;
