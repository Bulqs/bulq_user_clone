'use client'

import React, { useEffect, useState } from 'react';
import Heading from '@/app/components/generalheading/Heading';
import { 
    FiFilter, FiChevronDown, FiSearch, FiCopy, FiChevronRight, 
    FiTruck, FiPackage, FiMapPin, FiShoppingBag, FiLayers, 
    FiCalendar, FiHash, FiInbox 
} from 'react-icons/fi';
import { PackageStatus, TimeFilter } from '@/types/user/index';
import Image from 'next/image';
import { BookingFilterParams, FilterBookingViewDTO, BookingResponseDTO } from '@/types/booking';
import { getAllBookings, updateBookingStatus } from '@/lib/user/booking.actions';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// ✅ Imports for Payment & Profile integration
import { getMyProfile } from '@/lib/user/actions';
import { UserResponseDTO } from '@/types/admin';
import BookingPaymentModal from '@/app/components/payment/BookingPaymentModal';

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const rowVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const expandVariants: Variants = {
    hidden: { height: 0, opacity: 0 },
    show: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }
};

const PackagesPage = () => {
    const [statusFilter, setStatusFilter] = useState<PackageStatus | 'All'>('All');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('12 Months');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
    const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

    const statusMapping: Record<string, string> = {
        'Received': 'RECEIVED',
        'In Transit': 'IN_TRANSIT',
        'Awaiting Shipment': 'AWAITING_SHIPMENT',
        'Unclaimed Item': 'UNCLAIMED_ITEMS',
        'Consolidated Packages': 'CONSOLIDATED',
        'All': ''
    };

    const [realPackages, setRealPackages] = useState<FilterBookingViewDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ State for Payment Modal & Profile
    const [profile, setProfile] = useState<UserResponseDTO | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [consolidationTarget, setConsolidationTarget] = useState<string | null>(null);

    // Fetch user profile for the payment modal payload
    useEffect(() => {
        getMyProfile().then((data) => setProfile(data as unknown as UserResponseDTO)).catch(console.error);
    }, []);

    // RESTORED EXACT FETCH LOGIC
    useEffect(() => {
        const fetchFilteredPackages = async () => {
            try {
                setLoading(true);
                const params: BookingFilterParams = {
                    createdAt: 'createdAt',
                    per_page: perPage,
                    page: currentPage - 1,
                    deliveryId: searchQuery.trim() || undefined,
                    status: statusMapping[statusFilter],
                };

                const response = await getAllBookings(params);
                const dataToSet = response?.content || (Array.isArray(response) ? response : []);
                setRealPackages(dataToSet);
            } catch (err) {
                console.error("Fetch Error:", err);
                setRealPackages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredPackages();
    }, [statusFilter, searchQuery, perPage, currentPage]);

    const shouldShowTableView = statusFilter === 'Unclaimed Item' || statusFilter === 'Consolidated Packages';

    const filteredPackages = realPackages.filter((pkg) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        // Safety check in case a package doesn't have a date
        const pkgDateString = pkg.pick_up_date ? pkg.pick_up_date.split(' ')[0] : new Date().toISOString().split('T')[0];
        const pkgDate = new Date(pkgDateString);
        pkgDate.setHours(0, 0, 0, 0);

        let dateMatch = true;
        switch (timeFilter) {
            case 'Today': dateMatch = pkgDate.getTime() === now.getTime(); break;
            case '7 Days': 
                const sevenDaysAgo = new Date(now);
                sevenDaysAgo.setDate(now.getDate() - 7);
                dateMatch = pkgDate >= sevenDaysAgo;
                break;
            case '30 Days':
                const thirtyDaysAgo = new Date(now);
                thirtyDaysAgo.setDate(now.getDate() - 30);
                dateMatch = pkgDate >= thirtyDaysAgo;
                break;
        }

        const searchString = searchQuery.toLowerCase();
        const searchMatch = !searchString || // If search is empty, don't filter
            (pkg.delivery_id && pkg.delivery_id.toLowerCase().includes(searchString)) ||
            (pkg.package_description && pkg.package_description.toLowerCase().includes(searchString)) ||
            (pkg.trackingNumber && pkg.trackingNumber.toLowerCase().includes(searchString)) ||
            (pkg.package_name && pkg.package_name.toLowerCase().includes(searchString));

        return dateMatch && searchMatch;
    });

    const togglePackageExpand = (packageId: string) => {
        setExpandedPackage(expandedPackage === packageId ? null : packageId);
    };

    const copyTrackingNumber = (trackingNumber: string) => {
        navigator.clipboard.writeText(trackingNumber).then(() => {
            setCopiedTracking(trackingNumber);
            setTimeout(() => setCopiedTracking(null), 2000);
        });
    };

    const handleShipNow = async (trackingNumber: string) => {
        try {
            const result = await updateBookingStatus(trackingNumber, 'SHIP_NOW');
            alert(result.message);
        } catch (error: any) {
            alert(error.message || "Failed to update shipment status");
        }
    };

    // ✅ UPDATED: Open Payment Modal to charge the $30 Consolidation fee
    const handleAddToConsolidation = (trackingNumber: string) => {
        setConsolidationTarget(trackingNumber);
        setShowPaymentModal(true);
    };

    const handleClaimItem = (packageId: string) => {
        alert(`Claiming item: ${packageId}`);
    };

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'RECEIVED': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
            case 'IN_TRANSIT': return 'bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
            case 'AWAITING_SHIPMENT': return 'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
            case 'UNCLAIMED_ITEMS': return 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
            default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
        }
    };

    return (
        <div className="pb-12 min-h-screen relative">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mb-6">
                <Heading level="h3" align="left" className="font-extrabold tracking-tight" color='light'>
                    Package Center
                </Heading>
            </motion.div>

            {/* --- FILTERS SECTION --- */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden p-6 mb-6 bg-gradient-to-br from-appTitleBgColor to-[#0B1121] border border-white/10 shadow-2xl relative z-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-appBanner/10 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                    
                    {/* Status Pills */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mr-2 border border-white/5">
                            <FiFilter className="text-white/70" />
                        </div>
                        {(['All', 'Received', 'In Transit', 'Awaiting Shipment', 'Unclaimed Item', 'Consolidated Packages'] as const).map((status) => (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all duration-300 ${statusFilter === status
                                    ? 'bg-appBanner text-white border-appBanner shadow-lg shadow-appBanner/20'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {status}
                            </motion.button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                        
                        {/* Search Bar */}
                        <div className="relative flex-1 xl:flex-none xl:w-64 group">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-appBanner transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tracking or items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner text-white placeholder-gray-500 font-medium transition-all shadow-inner"
                            />
                        </div>

                        {/* Time Filter Dropdown */}
                        <div className="relative">
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                                className="appearance-none bg-black/20 border border-white/10 rounded-xl px-5 py-3 pr-10 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-appBanner/50 cursor-pointer shadow-inner"
                            >
                                {(['12 Months', '30 Days', '7 Days', 'Today'] as const).map((time) => (
                                    <option key={time} value={time} className="bg-gray-900">{time}</option>
                                ))}
                            </select>
                            <FiCalendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Pagination Dropdown */}
                        <div className="relative">
                            <select
                                value={perPage}
                                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="appearance-none bg-black/20 border border-white/10 rounded-xl px-5 py-3 pr-10 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-appBanner/50 cursor-pointer shadow-inner"
                            >
                                {[5, 10, 15, 20].map((num) => (
                                    <option key={num} value={num} className="bg-gray-900">{num} Items</option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* --- DATA TABLE SECTION --- */}
            <div className="rounded-2xl overflow-hidden bg-[#0B1121]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="min-w-full divide-y divide-white/5">
                        <thead className="bg-white/5">
                            <tr>
                                {shouldShowTableView ? (
                                    <>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Package Details</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Vendor</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Destination</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Weight</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Tracking Number</th>
                                        <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Package Identity</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Vendor</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Destination</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Received Date</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Weight</th>
                                        <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </>
                                )}
                            </tr>
                        </thead>

                        <motion.tbody 
                            variants={containerVariants} 
                            initial="hidden" 
                            animate="show" 
                            className="divide-y divide-white/5 bg-transparent"
                        >
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-10 h-10 border-4 border-white/10 border-t-appBanner rounded-full animate-spin"></div>
                                            <p className="text-gray-400 font-medium tracking-wide">Syncing packages...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPackages.length > 0 ? (
                                filteredPackages.map((pkg) => (
                                    <React.Fragment key={pkg.trackingNumber}>
                                        {shouldShowTableView ? (
                                            /* --- FLAT TABLE ROW (For Unclaimed/Consolidated) --- */
                                            <motion.tr variants={rowVariants} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-inner group-hover:border-appBanner/50 transition-colors">
                                                            {pkg.packageImage ? <Image src={pkg.packageImage} alt="pkg" width={48} height={48} className="rounded-xl object-cover" /> : <FiPackage className="w-6 h-6 text-gray-400 group-hover:text-appBanner transition-colors" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white tracking-wide">{pkg.package_name || pkg.package_description}</p>
                                                            <p className="text-xs font-medium text-gray-500 mt-1">{pkg.trackingNumber}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{pkg.package_description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{pkg.package_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{pkg.receiver_address}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(pkg.deliveryStatus!)}`}>
                                                        {pkg.deliveryStatus!.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">{pkg.pick_up_date.split(' ')[0]}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{pkg.weight}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center space-x-2 bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                                                        <span className="font-mono text-gray-300 tracking-tight">{pkg.trackingNumber}</span>
                                                        <button onClick={() => copyTrackingNumber(pkg.trackingNumber)} className="text-gray-500 hover:text-appBanner transition-colors">
                                                            <FiCopy className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        {pkg.deliveryStatus! === 'UNCLAIMED_ITEMS' ? (
                                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleClaimItem(pkg.trackingNumber)} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20">Claim Item</motion.button>
                                                        ) : (
                                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleShipNow(pkg.trackingNumber)} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20">Ship Now</motion.button>
                                                        )}
                                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAddToConsolidation(pkg.trackingNumber)} className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Consolidate</motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ) : (
                                            /* --- EXPANDABLE TABLE ROW --- */
                                            <>
                                                <motion.tr 
                                                    variants={rowVariants} 
                                                    className={`cursor-pointer transition-colors group ${expandedPackage === pkg.trackingNumber ? 'bg-white/[0.02]' : 'hover:bg-white/5'}`}
                                                    onClick={() => togglePackageExpand(pkg.trackingNumber)}
                                                >
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-inner group-hover:border-appBanner/50 transition-colors">
                                                                {pkg.packageImage ? <Image src={pkg.packageImage} alt="pkg" width={48} height={48} className="rounded-xl object-cover" /> : <FiInbox className="w-6 h-6 text-gray-400 group-hover:text-appBanner transition-colors" />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white tracking-wide group-hover:text-appBanner transition-colors">{pkg.package_name || pkg.package_description}</p>
                                                                <p className="text-xs font-medium text-gray-500 mt-1 font-mono">{pkg.trackingNumber}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-200">{pkg.vendor || 'Unknown Vendor'}</td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-400">{pkg.receiver_address}</td>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(pkg.deliveryStatus!)}`}>
                                                            {pkg.deliveryStatus!.replace(/_/g, ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-400">{pkg.pick_up_date.split(' ')[0]}</td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-white">{pkg.weight}</td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                                        <div className="flex items-center justify-end space-x-2 text-gray-400 group-hover:text-white transition-colors">
                                                            <span className="text-xs font-bold uppercase tracking-wider">Details</span>
                                                            <div className={`p-1.5 rounded-md bg-white/5 border border-white/10 transition-transform duration-300 ${expandedPackage === pkg.trackingNumber ? 'rotate-90 bg-appBanner text-white border-appBanner' : ''}`}>
                                                                <FiChevronRight className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </motion.tr>

                                                {/* Hidden Details Dropdown animated with Framer Motion */}
                                                <AnimatePresence>
                                                    {expandedPackage === pkg.trackingNumber && (
                                                        <tr>
                                                            <td colSpan={7} className="p-0 border-b border-white/5">
                                                                <motion.div variants={expandVariants} initial="hidden" animate="show" exit="exit" className="overflow-hidden">
                                                                    <div className="p-6 lg:p-8 bg-black/20 border-t border-white/5 shadow-inner">
                                                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                                                            
                                                                            {/* Left Details Card */}
                                                                            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start space-x-4">
                                                                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                                                                                        <FiShoppingBag className="text-blue-400 w-5 h-5" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Merchant/Vendor</p>
                                                                                        <p className="text-sm font-bold text-white mt-1">{pkg.vendor}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start space-x-4">
                                                                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                                                                                        <FiMapPin className="text-emerald-400 w-5 h-5" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Final Destination</p>
                                                                                        <p className="text-sm font-bold text-white mt-1">{pkg.receiver_address}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start space-x-4">
                                                                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                                                                                        <FiHash className="text-purple-400 w-5 h-5" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tracking Code</p>
                                                                                        <div className="flex items-center gap-2 mt-1">
                                                                                            <code className="text-sm font-mono text-white bg-black/30 px-2 py-0.5 rounded border border-white/10">{pkg.trackingNumber}</code>
                                                                                            <button onClick={() => copyTrackingNumber(pkg.trackingNumber)} className="text-gray-400 hover:text-white transition-colors"><FiCopy size={14}/></button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start space-x-4">
                                                                                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-500/30">
                                                                                        <FiLayers className="text-amber-400 w-5 h-5" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Weight Profile</p>
                                                                                        <p className="text-sm font-bold text-white mt-1">{pkg.weight}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Right Action Panel */}
                                                                            <div className="lg:col-span-4 bg-gradient-to-b from-appTitleBgColor to-black/40 rounded-2xl p-6 border border-white/10 flex flex-col justify-center space-y-3 relative overflow-hidden">
                                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-appBanner/20 blur-[50px] rounded-full pointer-events-none" />
                                                                                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 relative z-10">Next Steps</p>
                                                                                
                                                                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleShipNow(pkg.trackingNumber)} className="relative z-10 w-full bg-gradient-to-r from-appBanner to-appNav hover:from-blue-500 hover:to-cyan-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-appBanner/20 flex items-center justify-center gap-2">
                                                                                    <FiTruck className="w-4 h-4" /> <span>Ship Package Now</span>
                                                                                </motion.button>
                                                                                
                                                                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAddToConsolidation(pkg.trackingNumber)} className="relative z-10 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                                                                    <FiLayers className="w-4 h-4" /> <span>Add to Consolidation</span>
                                                                                </motion.button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={shouldShowTableView ? 9 : 7} className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                                <FiInbox className="w-8 h-8 text-gray-500" />
                                            </div>
                                            <p className="text-gray-400 font-medium">No packages found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </motion.tbody>
                    </table>
                </div>

                {/* --- PAGINATION FOOTER --- */}
                <div className="px-6 py-5 bg-black/20 border-t border-white/5 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Page <span className="text-white px-1">{currentPage}</span>
                    </p>
                    <div className="flex gap-2">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-4 py-2 text-xs font-bold bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            Previous
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={realPackages.length < perPage} onClick={() => setCurrentPage(prev => prev + 1)} className="px-4 py-2 text-xs font-bold bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            Next Page
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* --- PAYMENT MODAL FOR CONSOLIDATION --- */}
            {showPaymentModal && consolidationTarget && (
                <BookingPaymentModal 
                    bookingData={{
                        trackingNumber: consolidationTarget,
                        totalCost: 30, // Fixed $30 fee for now
                        currency: 'USD',
                    } as unknown as BookingResponseDTO} 
                    customerEmail={profile?.email || 'customer@example.com'} 
                    customerName={`${profile?.firstName || 'Customer'} ${profile?.lastName || ''}`.trim()} 
                    onClose={() => {
                        setShowPaymentModal(false);
                        setConsolidationTarget(null);
                    }} 
                />
            )}
        </div>
    );
};

export default PackagesPage;

// 'use client'

// import React, { useEffect, useState } from 'react';
// import Heading from '@/app/components/generalheading/Heading';
// import { 
//     FiFilter, FiChevronDown, FiSearch, FiCopy, FiChevronRight, 
//     FiTruck, FiPackage, FiMapPin, FiShoppingBag, FiLayers, 
//     FiCalendar, FiHash, FiInbox 
// } from 'react-icons/fi';
// import { PackageStatus, TimeFilter } from '@/types/user/index';
// import Image from 'next/image';
// import { BookingFilterParams, FilterBookingViewDTO } from '@/types/booking';
// import { getAllBookings, updateBookingStatus } from '@/lib/user/booking.actions';
// import { motion, AnimatePresence, Variants } from 'framer-motion';

// // --- FRAMER MOTION VARIANTS ---
// const containerVariants: Variants = {
//     hidden: { opacity: 0 },
//     show: { opacity: 1, transition: { staggerChildren: 0.05 } }
// };

// const rowVariants: Variants = {
//     hidden: { opacity: 0, y: 10 },
//     show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
//     exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
// };

// const expandVariants: Variants = {
//     hidden: { height: 0, opacity: 0 },
//     show: { height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
//     exit: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }
// };

// const PackagesPage = () => {
//     const [statusFilter, setStatusFilter] = useState<PackageStatus | 'All'>('All');
//     const [timeFilter, setTimeFilter] = useState<TimeFilter>('12 Months');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
//     const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

//     const statusMapping: Record<string, string> = {
//         'Received': 'RECEIVED',
//         'In Transit': 'IN_TRANSIT',
//         'Awaiting Shipment': 'AWAITING_SHIPMENT',
//         'Unclaimed Item': 'UNCLAIMED_ITEMS',
//         'Consolidated Packages': 'CONSOLIDATED',
//         'All': ''
//     };

//     const [realPackages, setRealPackages] = useState<FilterBookingViewDTO[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [perPage, setPerPage] = useState(10);
//     const [currentPage, setCurrentPage] = useState(1);

//     // RESTORED EXACT FETCH LOGIC
//     useEffect(() => {
//         const fetchFilteredPackages = async () => {
//             try {
//                 setLoading(true);
//                 const params: BookingFilterParams = {
//                     createdAt: 'createdAt',
//                     per_page: perPage,
//                     page: currentPage - 1,
//                     deliveryId: searchQuery.trim() || undefined,
//                     status: statusMapping[statusFilter],
//                 };

//                 const response = await getAllBookings(params);
//                 const dataToSet = response?.content || (Array.isArray(response) ? response : []);
//                 setRealPackages(dataToSet);
//             } catch (err) {
//                 console.error("Fetch Error:", err);
//                 setRealPackages([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFilteredPackages();
//     }, [statusFilter, searchQuery, perPage, currentPage]);

//     const shouldShowTableView = statusFilter === 'Unclaimed Item' || statusFilter === 'Consolidated Packages';

//     // RESTORED EXACT FILTER LOGIC
//     // RESTORED EXACT FILTER LOGIC
//     const filteredPackages = realPackages.filter((pkg) => {
//         // Remove the frontend status match entirely. The backend already filtered this for us!
        
//         const now = new Date();
//         now.setHours(0, 0, 0, 0);
        
//         // Safety check in case a package doesn't have a date
//         const pkgDateString = pkg.pick_up_date ? pkg.pick_up_date.split(' ')[0] : new Date().toISOString().split('T')[0];
//         const pkgDate = new Date(pkgDateString);
//         pkgDate.setHours(0, 0, 0, 0);

//         let dateMatch = true;
//         switch (timeFilter) {
//             case 'Today': dateMatch = pkgDate.getTime() === now.getTime(); break;
//             case '7 Days': 
//                 const sevenDaysAgo = new Date(now);
//                 sevenDaysAgo.setDate(now.getDate() - 7);
//                 dateMatch = pkgDate >= sevenDaysAgo;
//                 break;
//             case '30 Days':
//                 const thirtyDaysAgo = new Date(now);
//                 thirtyDaysAgo.setDate(now.getDate() - 30);
//                 dateMatch = pkgDate >= thirtyDaysAgo;
//                 break;
//         }

//         const searchString = searchQuery.toLowerCase();
//         const searchMatch = !searchString || // If search is empty, don't filter
//             (pkg.delivery_id && pkg.delivery_id.toLowerCase().includes(searchString)) ||
//             (pkg.package_description && pkg.package_description.toLowerCase().includes(searchString)) ||
//             (pkg.trackingNumber && pkg.trackingNumber.toLowerCase().includes(searchString)) ||
//             (pkg.package_name && pkg.package_name.toLowerCase().includes(searchString));

//         return dateMatch && searchMatch;
//     });

//     const togglePackageExpand = (packageId: string) => {
//         setExpandedPackage(expandedPackage === packageId ? null : packageId);
//     };

//     const copyTrackingNumber = (trackingNumber: string) => {
//         navigator.clipboard.writeText(trackingNumber).then(() => {
//             setCopiedTracking(trackingNumber);
//             setTimeout(() => setCopiedTracking(null), 2000);
//         });
//     };

//     // RESTORED EXACT API ACTIONS
//     const handleShipNow = async (trackingNumber: string) => {
//         try {
//             const result = await updateBookingStatus(trackingNumber, 'SHIP_NOW');
//             alert(result.message);
//         } catch (error: any) {
//             alert(error.message || "Failed to update shipment status");
//         }
//     };

//     const handleAddToConsolidation = async (trackingNumber: string) => {
//         try {
//             const result = await updateBookingStatus(trackingNumber, 'CONSOLIDATED');
//             alert(result.message);
//         } catch (error: any) {
//             alert(error.message || "Failed to update shipment status");
//         }
//     };

//     const handleClaimItem = (packageId: string) => {
//         alert(`Claiming item: ${packageId}`);
//     };

//     const getStatusStyle = (status: string) => {
//         switch(status) {
//             case 'RECEIVED': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
//             case 'IN_TRANSIT': return 'bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
//             case 'AWAITING_SHIPMENT': return 'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]';
//             case 'UNCLAIMED_ITEMS': return 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]';
//             default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
//         }
//     };

//     return (
//         <div className="pb-12 min-h-screen relative">
//             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mb-6">
//                 <Heading level="h3" align="left" className="font-extrabold tracking-tight" color='light'>
//                     Package Center
//                 </Heading>
//             </motion.div>

//             {/* --- FILTERS SECTION --- */}
//             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden p-6 mb-6 bg-gradient-to-br from-appTitleBgColor to-[#0B1121] border border-white/10 shadow-2xl relative z-10">
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-appBanner/10 blur-[80px] rounded-full pointer-events-none" />
                
//                 <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                    
//                     {/* Status Pills */}
//                     <div className="flex flex-wrap items-center gap-3">
//                         <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mr-2 border border-white/5">
//                             <FiFilter className="text-white/70" />
//                         </div>
//                         {(['All', 'Received', 'In Transit', 'Awaiting Shipment', 'Unclaimed Item', 'Consolidated Packages'] as const).map((status) => (
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 key={status}
//                                 onClick={() => setStatusFilter(status)}
//                                 className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all duration-300 ${statusFilter === status
//                                     ? 'bg-appBanner text-white border-appBanner shadow-lg shadow-appBanner/20'
//                                     : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
//                                 }`}
//                             >
//                                 {status}
//                             </motion.button>
//                         ))}
//                     </div>

//                     <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                        
//                         {/* Search Bar */}
//                         <div className="relative flex-1 xl:flex-none xl:w-64 group">
//                             <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-appBanner transition-colors" />
//                             <input
//                                 type="text"
//                                 placeholder="Search tracking or items..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner text-white placeholder-gray-500 font-medium transition-all shadow-inner"
//                             />
//                         </div>

//                         {/* RESTORED: Time Filter Dropdown */}
//                         <div className="relative">
//                             <select
//                                 value={timeFilter}
//                                 onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
//                                 className="appearance-none bg-black/20 border border-white/10 rounded-xl px-5 py-3 pr-10 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-appBanner/50 cursor-pointer shadow-inner"
//                             >
//                                 {(['12 Months', '30 Days', '7 Days', 'Today'] as const).map((time) => (
//                                     <option key={time} value={time} className="bg-gray-900">{time}</option>
//                                 ))}
//                             </select>
//                             <FiCalendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                         </div>

//                         {/* Pagination Dropdown */}
//                         <div className="relative">
//                             <select
//                                 value={perPage}
//                                 onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
//                                 className="appearance-none bg-black/20 border border-white/10 rounded-xl px-5 py-3 pr-10 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-appBanner/50 cursor-pointer shadow-inner"
//                             >
//                                 {[5, 10, 15, 20].map((num) => (
//                                     <option key={num} value={num} className="bg-gray-900">{num} Items</option>
//                                 ))}
//                             </select>
//                             <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                         </div>
//                     </div>
//                 </div>
//             </motion.div>

//             {/* --- DATA TABLE SECTION --- */}
//             <div className="rounded-2xl overflow-hidden bg-[#0B1121]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10">
//                 <div className="overflow-x-auto custom-scrollbar">
//                     <table className="min-w-full divide-y divide-white/5">
//                         <thead className="bg-white/5">
//                             <tr>
//                                 {shouldShowTableView ? (
//                                     <>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Package Details</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Description</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Vendor</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Destination</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Date</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Weight</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Tracking Number</th>
//                                         <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Package Identity</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Vendor</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Destination</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Received Date</th>
//                                         <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Weight</th>
//                                         <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Action</th>
//                                     </>
//                                 )}
//                             </tr>
//                         </thead>

//                         <motion.tbody 
//                             variants={containerVariants} 
//                             initial="hidden" 
//                             animate="show" 
//                             className="divide-y divide-white/5 bg-transparent"
//                         >
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan={10} className="py-24 text-center">
//                                         <div className="flex flex-col items-center justify-center space-y-4">
//                                             <div className="w-10 h-10 border-4 border-white/10 border-t-appBanner rounded-full animate-spin"></div>
//                                             <p className="text-gray-400 font-medium tracking-wide">Syncing packages...</p>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ) : filteredPackages.length > 0 ? (
//                                 filteredPackages.map((pkg) => (
//                                     <React.Fragment key={pkg.trackingNumber}>
//                                         {shouldShowTableView ? (
//                                             /* --- FLAT TABLE ROW (For Unclaimed/Consolidated) --- */
//                                             <motion.tr variants={rowVariants} className="hover:bg-white/5 transition-colors group">
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center space-x-4">
//                                                         <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-inner group-hover:border-appBanner/50 transition-colors">
//                                                             {pkg.packageImage ? <Image src={pkg.packageImage} alt="pkg" width={48} height={48} className="rounded-xl object-cover" /> : <FiPackage className="w-6 h-6 text-gray-400 group-hover:text-appBanner transition-colors" />}
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm font-bold text-white tracking-wide">{pkg.package_name || pkg.package_description}</p>
//                                                             <p className="text-xs font-medium text-gray-500 mt-1">{pkg.trackingNumber}</p>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{pkg.package_description}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{pkg.package_name}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{pkg.receiver_address}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(pkg.deliveryStatus!)}`}>
//                                                         {pkg.deliveryStatus!.replace(/_/g, ' ')}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">{pkg.pick_up_date.split(' ')[0]}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{pkg.weight}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                                     <div className="flex items-center space-x-2 bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/5">
//                                                         <span className="font-mono text-gray-300 tracking-tight">{pkg.trackingNumber}</span>
//                                                         <button onClick={() => copyTrackingNumber(pkg.trackingNumber)} className="text-gray-500 hover:text-appBanner transition-colors">
//                                                             <FiCopy className="w-4 h-4" />
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right">
//                                                     <div className="flex items-center justify-end space-x-2">
//                                                         {pkg.deliveryStatus! === 'UNCLAIMED_ITEMS' ? (
//                                                             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleClaimItem(pkg.trackingNumber)} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20">Claim Item</motion.button>
//                                                         ) : (
//                                                             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleShipNow(pkg.trackingNumber)} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20">Ship Now</motion.button>
//                                                         )}
//                                                         <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAddToConsolidation(pkg.trackingNumber)} className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Consolidate</motion.button>
//                                                     </div>
//                                                 </td>
//                                             </motion.tr>
//                                         ) : (
//                                             /* --- EXPANDABLE TABLE ROW --- */
//                                             <>
//                                                 <motion.tr 
//                                                     variants={rowVariants} 
//                                                     className={`cursor-pointer transition-colors group ${expandedPackage === pkg.trackingNumber ? 'bg-white/[0.02]' : 'hover:bg-white/5'}`}
//                                                     onClick={() => togglePackageExpand(pkg.trackingNumber)}
//                                                 >
//                                                     <td className="px-6 py-5 whitespace-nowrap">
//                                                         <div className="flex items-center space-x-4">
//                                                             <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-inner group-hover:border-appBanner/50 transition-colors">
//                                                                 {pkg.packageImage ? <Image src={pkg.packageImage} alt="pkg" width={48} height={48} className="rounded-xl object-cover" /> : <FiInbox className="w-6 h-6 text-gray-400 group-hover:text-appBanner transition-colors" />}
//                                                             </div>
//                                                             <div>
//                                                                 <p className="text-sm font-bold text-white tracking-wide group-hover:text-appBanner transition-colors">{pkg.package_name || pkg.package_description}</p>
//                                                                 <p className="text-xs font-medium text-gray-500 mt-1 font-mono">{pkg.trackingNumber}</p>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-200">{pkg.vendor || 'Unknown Vendor'}</td>
//                                                     <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-400">{pkg.receiver_address}</td>
//                                                     <td className="px-6 py-5 whitespace-nowrap">
//                                                         <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(pkg.deliveryStatus!)}`}>
//                                                             {pkg.deliveryStatus!.replace(/_/g, ' ')}
//                                                         </span>
//                                                     </td>
//                                                     <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-400">{pkg.pick_up_date.split(' ')[0]}</td>
//                                                     <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-white">{pkg.weight}</td>
//                                                     <td className="px-6 py-5 whitespace-nowrap text-right">
//                                                         <div className="flex items-center justify-end space-x-2 text-gray-400 group-hover:text-white transition-colors">
//                                                             <span className="text-xs font-bold uppercase tracking-wider">Details</span>
//                                                             <div className={`p-1.5 rounded-md bg-white/5 border border-white/10 transition-transform duration-300 ${expandedPackage === pkg.trackingNumber ? 'rotate-90 bg-appBanner text-white border-appBanner' : ''}`}>
//                                                                 <FiChevronRight className="w-4 h-4" />
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                 </motion.tr>

//                                                 {/* Hidden Details Dropdown animated with Framer Motion */}
//                                                 <AnimatePresence>
//                                                     {expandedPackage === pkg.trackingNumber && (
//                                                         <tr>
//                                                             <td colSpan={7} className="p-0 border-b border-white/5">
//                                                                 <motion.div variants={expandVariants} initial="hidden" animate="show" exit="exit" className="overflow-hidden">
//                                                                     <div className="p-6 lg:p-8 bg-black/20 border-t border-white/5 shadow-inner">
//                                                                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                                                            
//                                                                             {/* Left Details Card */}
//                                                                             <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                                                 <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start space-x-4">
//                                                                                     <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
//                                                                                         <FiShoppingBag className="text-blue-400 w-5 h-5" />
//                                                                                     </div>
//                                                                                     <div>
//                                                                                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Merchant/Vendor</p>
//                                                                                         <p className="text-sm font-bold text-white mt-1">{pkg.vendor}</p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                                 <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start space-x-4">
//                                                                                     <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
//                                                                                         <FiMapPin className="text-emerald-400 w-5 h-5" />
//                                                                                     </div>
//                                                                                     <div>
//                                                                                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Final Destination</p>
//                                                                                         <p className="text-sm font-bold text-white mt-1">{pkg.receiver_address}</p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                                 <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start space-x-4">
//                                                                                     <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
//                                                                                         <FiHash className="text-purple-400 w-5 h-5" />
//                                                                                     </div>
//                                                                                     <div>
//                                                                                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tracking Code</p>
//                                                                                         <div className="flex items-center gap-2 mt-1">
//                                                                                             <code className="text-sm font-mono text-white bg-black/30 px-2 py-0.5 rounded border border-white/10">{pkg.trackingNumber}</code>
//                                                                                             <button onClick={() => copyTrackingNumber(pkg.trackingNumber)} className="text-gray-400 hover:text-white transition-colors"><FiCopy size={14}/></button>
//                                                                                         </div>
//                                                                                     </div>
//                                                                                 </div>
//                                                                                 <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start space-x-4">
//                                                                                     <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center border border-amber-500/30">
//                                                                                         <FiLayers className="text-amber-400 w-5 h-5" />
//                                                                                     </div>
//                                                                                     <div>
//                                                                                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Weight Profile</p>
//                                                                                         <p className="text-sm font-bold text-white mt-1">{pkg.weight}</p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>

//                                                                             {/* Right Action Panel */}
//                                                                             <div className="lg:col-span-4 bg-gradient-to-b from-appTitleBgColor to-black/40 rounded-2xl p-6 border border-white/10 flex flex-col justify-center space-y-3 relative overflow-hidden">
//                                                                                 <div className="absolute top-0 right-0 w-32 h-32 bg-appBanner/20 blur-[50px] rounded-full pointer-events-none" />
//                                                                                 <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 relative z-10">Next Steps</p>
                                                                                
//                                                                                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleShipNow(pkg.trackingNumber)} className="relative z-10 w-full bg-gradient-to-r from-appBanner to-appNav hover:from-blue-500 hover:to-cyan-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-appBanner/20 flex items-center justify-center gap-2">
//                                                                                     <FiTruck className="w-4 h-4" /> <span>Ship Package Now</span>
//                                                                                 </motion.button>
                                                                                
//                                                                                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAddToConsolidation(pkg.trackingNumber)} className="relative z-10 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
//                                                                                     <FiLayers className="w-4 h-4" /> <span>Add to Consolidation</span>
//                                                                                 </motion.button>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </motion.div>
//                                                             </td>
//                                                         </tr>
//                                                     )}
//                                                 </AnimatePresence>
//                                             </>
//                                         )}
//                                     </React.Fragment>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={shouldShowTableView ? 9 : 7} className="py-24 text-center">
//                                         <div className="flex flex-col items-center justify-center space-y-4">
//                                             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
//                                                 <FiInbox className="w-8 h-8 text-gray-500" />
//                                             </div>
//                                             <p className="text-gray-400 font-medium">No packages found matching your criteria</p>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                         </motion.tbody>
//                     </table>
//                 </div>

//                 {/* --- PAGINATION FOOTER --- */}
//                 <div className="px-6 py-5 bg-black/20 border-t border-white/5 flex items-center justify-between">
//                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
//                         Page <span className="text-white px-1">{currentPage}</span>
//                     </p>
//                     <div className="flex gap-2">
//                         <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-4 py-2 text-xs font-bold bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
//                             Previous
//                         </motion.button>
//                         <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={realPackages.length < perPage} onClick={() => setCurrentPage(prev => prev + 1)} className="px-4 py-2 text-xs font-bold bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
//                             Next Page
//                         </motion.button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PackagesPage;