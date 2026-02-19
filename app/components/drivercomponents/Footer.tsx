import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-[#003D3D] text-white pt-14 pb-6">
            <div className="max-w-7xl mx-auto px-6">

                {/* TOP GRID */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-5 mb-12 ">

                    {/* LOGO + DESCRIPTION */}
                    <div className="">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold">BulQ</span>
                        </div>

                        <p className="text-sm opacity-80 max-w-xs">
                            Your global logistics and warehouse partner. Seamless shopping,
                            worldwide shipping.
                        </p>
                    </div>

                    {/* COMPANY */}
                    <div>
                        <h4 className="font-semibold mb-3">Company</h4>
                        <ul className="space-y-2 text-sm opacity-80">
                            <li className="hover:opacity-100 cursor-pointer">Home</li>
                            <li className="hover:opacity-100 cursor-pointer">Careers</li>
                            <li className="hover:opacity-100 cursor-pointer">Blogs</li>
                            <li className="hover:opacity-100 cursor-pointer">Press</li>
                        </ul>
                    </div>

                    {/* SUPPORT */}
                    <div>
                        <h4 className="font-semibold mb-3">Support</h4>
                        <ul className="space-y-2 text-sm opacity-80">
                            <li className="hover:opacity-100 cursor-pointer">Help Center</li>
                            <li className="hover:opacity-100 cursor-pointer">Contact Us</li>
                            <li className="hover:opacity-100 cursor-pointer">Shipping Info</li>
                            <li className="hover:opacity-100 cursor-pointer">Returns</li>
                        </ul>
                    </div>

                    {/* LEGAL */}
                    <div>
                        <h4 className="font-semibold mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm opacity-80">
                            <li className="hover:opacity-100 cursor-pointer">Privacy</li>
                            <li className="hover:opacity-100 cursor-pointer">Terms</li>
                            <li className="hover:opacity-100 cursor-pointer">Cookie Policy</li>
                        </ul>
                    </div>

                    {/* CONNECT + WAREHOUSE */}
                    <div>
                        <h4 className="font-semibold mb-3">Connect</h4>
                        <ul className="space-y-2 text-sm opacity-80 mb-6">
                            <li className="hover:opacity-100 cursor-pointer">Facebook</li>
                            <li className="hover:opacity-100 cursor-pointer">Twitter X</li>
                            <li className="hover:opacity-100 cursor-pointer">Instagram</li>
                            <li className="hover:opacity-100 cursor-pointer">LinkedIn</li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="font-semibold mb-3">All Warehouse</h4>
                        <ul className="space-y-2 text-sm opacity-80">
                            <li>United State</li>
                            <li>UK</li>
                            <li>Nigeria</li>
                            <li>All Hub</li>
                        </ul>
                    </div>
                </div>

                {/* LINE */}
                <div className="border-t border-white/20 my-6" />

                {/* BOTTOM BAR */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
                    <p>© 2023 BulQ Logistics. All rights reserved.</p>

                    {/* SOCIAL ICONS */}
                    <div className="flex gap-6 text-lg">
                        <a href="#" aria-label="Facebook">
                            <FaFacebookF className="cursor-pointer hover:opacity-100 transition" />
                        </a>

                        <a href="#" aria-label="Twitter X">
                            <BsTwitterX className="cursor-pointer hover:opacity-100 transition" />
                        </a>

                        <a href="#" aria-label="Instagram">
                            <FaInstagram className="cursor-pointer hover:opacity-100 transition" />
                        </a>

                        <a href="#" aria-label="LinkedIn">
                            <FaLinkedinIn className="cursor-pointer hover:opacity-100 transition" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
