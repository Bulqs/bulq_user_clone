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
import { BookingFilterParams, FilterBookingViewDTO } from '@/types/booking';
import { getAllBookings, updateBookingStatus } from '@/lib/user/booking.actions';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

    useEffect(() => {
        const fetchFilteredPackages = async () => {
            try {
                setLoading(true);
                const params: BookingFilterParams = {
                    page: currentPage - 1, 
                    per_page: perPage,
                    status: statusMapping[statusFilter],
                    deliveryId: searchQuery.trim() || undefined,
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
        const statusMatch = statusFilter === 'All' || pkg.deliveryStatus === statusFilter;

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const pkgDate = new Date(pkg.pick_up_date.split(' ')[0]);
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

        const searchMatch =
            pkg.delivery_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.package_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.package_name?.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && dateMatch && searchMatch;
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

    const handleAddToConsolidation = async (trackingNumber: string) => {
        try {
            const result = await updateBookingStatus(trackingNumber, 'CONSOLIDATED');
            alert(result.message);
        } catch (error: any) {
            alert(error.message || "Failed to update shipment status");
        }
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
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(pkg?.deliveryStatus!)}`}>
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
                                                        {pkg.deliveryStatus === 'UNCLAIMED_ITEMS' ? (
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
        </div>
    );
};

export default PackagesPage;

// 'use client'
// import Heading from '@/app/components/generalheading/Heading';
// import React, { useEffect, useState } from 'react';
// import { FiPlus, FiFilter, FiChevronDown, FiSearch, FiCopy, FiChevronRight, FiTruck, FiPackage, FiMapPin, FiShoppingBag, FiLayers, FiCalendar, FiHash } from 'react-icons/fi';
// import { Package, PackageStatus, TimeFilter } from '@/types/user/index';
// import Image from 'next/image';
// import { BookingFilterParams, FilterBookingViewDTO } from '@/types/booking';
// import { getAllBookings, updateBookingStatus } from '@/lib/user/booking.actions';

// // Mock data - replace with your actual data fetching
// const mockPackages: Package[] = [
//     {
//         id: 'PKG-001',
//         description: 'Electronics',
//         vendor: 'Amazon',
//         destination: 'New York',
//         status: 'Received',
//         receivedDate: new Date('2023-05-15'),
//         weight: '2.5 kg',
//         trackingNumber: 'TRK123456789',
//         image: '/images/package1.jpg',
//         name: 'Smartphone & Accessories'
//     },
//     {
//         id: 'PKG-002',
//         description: 'Clothing',
//         vendor: 'Zara',
//         destination: 'Los Angeles',
//         status: 'In Transit',
//         receivedDate: new Date('2023-06-20'),
//         weight: '1.8 kg',
//         trackingNumber: 'TRK987654321',
//         image: '/images/package2.jpg',
//         name: 'Summer Collection'
//     },
//     {
//         id: 'PKG-003',
//         description: 'Books',
//         vendor: 'Barnes & Noble',
//         destination: 'Chicago',
//         status: 'Awaiting Shipment',
//         receivedDate: new Date('2023-07-10'),
//         weight: '3.2 kg',
//         trackingNumber: 'TRK456789123',
//         image: '/images/package3.jpg',
//         name: 'Educational Materials'
//     },
//     {
//         id: 'PKG-004',
//         description: 'Unclaimed Electronics',
//         vendor: 'Best Buy',
//         destination: 'Miami',
//         status: 'Unclaimed Item',
//         receivedDate: new Date('2023-08-01'),
//         weight: '5.1 kg',
//         trackingNumber: 'TRK789123456',
//         image: '/images/package4.jpg',
//         name: 'Gaming Console'
//     },
//     {
//         id: 'PKG-005',
//         description: 'Consolidated Shipment',
//         vendor: 'Multiple',
//         destination: 'Seattle',
//         status: 'Consolidated Packages',
//         receivedDate: new Date('2023-08-15'),
//         weight: '12.8 kg',
//         trackingNumber: 'TRK321654987',
//         image: '/images/package5.jpg',
//         name: 'Consolidated Items'
//     },
//     {
//         id: 'PKG-006',
//         description: 'Unclaimed Clothing',
//         vendor: 'H&M',
//         destination: 'Boston',
//         status: 'Unclaimed Item',
//         receivedDate: new Date('2023-09-01'),
//         weight: '2.3 kg',
//         trackingNumber: 'TRK555444333',
//         image: '/images/package6.jpg',
//         name: 'Winter Apparel'
//     },
//     {
//         id: 'PKG-007',
//         description: 'Consolidated Electronics',
//         vendor: 'Multiple',
//         destination: 'Austin',
//         status: 'Consolidated Packages',
//         receivedDate: new Date('2023-09-10'),
//         weight: '8.7 kg',
//         trackingNumber: 'TRK777888999',
//         image: '/images/package7.jpg',
//         name: 'Tech Bundle'
//     }
// ];

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
//         'All': '' // Empty string typically returns all in Spring Boot
//     };

//     const [realPackages, setRealPackages] = useState<FilterBookingViewDTO[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [perPage, setPerPage] = useState(10); // Default to 10 items
//     const [currentPage, setCurrentPage] = useState(1); // Default to page 1

//     const calculateDateRange = (filter: TimeFilter): string => {
//         const now = new Date();
//         const formatDate = (d: Date) => d.toISOString().split('T')[0];

//         let startDate = new Date();
//         switch (filter) {
//             case 'Today': startDate = now; break;
//             case '7 Days': startDate.setDate(now.getDate() - 7); break;
//             case '30 Days': startDate.setDate(now.getDate() - 30); break;
//             case '12 Months': startDate.setFullYear(now.getFullYear() - 1); break;
//         }

//         return `${formatDate(startDate)} to ${formatDate(now)}`;
//     };

//     useEffect(() => {
//     const fetchFilteredPackages = async () => {
//         try {
//             setLoading(true);
//             const params: BookingFilterParams = {
//                 // Fix: Spring is 0-indexed. UI Page 1 = API Page 0
//                 page: currentPage - 1, 
//                 per_page: perPage,
//                 status: statusMapping[statusFilter],
//                 // Only send deliveryId if there is actually a search string
//                 deliveryId: searchQuery.trim() || undefined,
//             };

//             const response = await getAllBookings(params);
//             // Ensure we extract the content correctly
//             const dataToSet = response?.content || (Array.isArray(response) ? response : []);
//             setRealPackages(dataToSet);

//         } catch (err) {
//             console.error("Fetch Error:", err);
//             setRealPackages([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchFilteredPackages();
// }, [statusFilter, searchQuery, perPage, currentPage]); // Remove timeFilter if backend doesn't handle it yet

//     // useEffect(() => {
//     //     const fetchFilteredPackages = async () => {
//     //         try {
//     //             setLoading(true);

//     //             // 1. Build the API params based on UI state
//     //             const params: BookingFilterParams = {
//     //                 page: currentPage+1,
//     //                 per_page: perPage, // Adjust as needed for the table
//     //                 status: statusMapping[statusFilter],
//     //                 // We map the search query to a field the backend supports (e.g. deliveryId or email)
//     //                 deliveryId: searchQuery,
//     //                 // Note: For TimeFilter, you might need to send a dateRange string to your API
//     //                 // dateRange: calculateDateRange(timeFilter)
//     //             };

//     //             // 2. Fire the API call
//     //             const response = await getAllBookings(params);

//     //             // 3. Extract content (Double-safety check)
//     //             const dataToSet = response?.content || (Array.isArray(response) ? response : []);
//     //             console.log(`Requesting: page=${currentPage}, size=${perPage}`)
//     //             setRealPackages(dataToSet);

//     //         } catch (err) {
//     //             console.error("Package Filter Sync Error:", err);
//     //             setRealPackages([]);
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };

//     //     fetchFilteredPackages();
//     // }, [statusFilter, timeFilter, searchQuery, perPage, currentPage]); // Fires every time a filter changes

//     // Check if current status should show table view
//     const shouldShowTableView = statusFilter === 'Unclaimed Item' || statusFilter === 'Consolidated Packages';

//     // Filter packages based on selected filters
//     const filteredPackages = realPackages.filter((pkg) => {
//         const statusMatch = statusFilter === 'All' || pkg.deliveryStatus === statusFilter;

//         // --- DATE LOGIC ---
//         const now = new Date();
//         now.setHours(0, 0, 0, 0); // Reset time to start of today

//         // Convert backend string "YYYY-MM-DD" to JS Date Object
//         const pkgDate = new Date(pkg.pick_up_date.split(' ')[0]);
//         pkgDate.setHours(0, 0, 0, 0);

//         let dateMatch = true;

//         switch (timeFilter) {
//             case 'Today':
//                 dateMatch = pkgDate.getTime() === now.getTime();
//                 break;
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

//         // --- SEARCH LOGIC ---
//         const searchMatch =
//             pkg.delivery_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             pkg.package_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             pkg.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             pkg.package_name?.toLowerCase().includes(searchQuery.toLowerCase());

//         return statusMatch && dateMatch && searchMatch;
//     });

//     const formatDate = (date: Date) => {
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//         });
//     };

//     const togglePackageExpand = (packageId: string) => {
//         setExpandedPackage(expandedPackage === packageId ? null : packageId);
//     };

//     const copyTrackingNumber = (trackingNumber: string) => {
//         navigator.clipboard.writeText(trackingNumber)
//             .then(() => {
//                 setCopiedTracking(trackingNumber);
//                 setTimeout(() => setCopiedTracking(null), 2000);
//             })
//             .catch(err => {
//                 console.error('Failed to copy tracking number: ', err);
//             });
//     };

//     const handleShipNow = async (trackingNumber: string) => {
//     try {
//         // Optional: Set a loading state here if you have one
//         // setIsProcessing(true);

//         console.log('Requesting Ship Now for package: ', trackingNumber);

//         // 1. Call the API Endpoint
//         // Make sure 'IN_TRANSIT' matches exactly one of the values in your BookingStatus enum
//         const result = await updateBookingStatus(trackingNumber, 'SHIP_NOW');

//         // 2. Success Feedback
//         alert(result.message);
        
//         // 3. Optional: Refresh the list so the item moves/updates in the UI
//         // fetchRecentBookings(); 

//     } catch (error: any) {
//         console.error('Shipment Failed:', error);
//         alert(error.message || "Failed to update shipment status");
//     } finally {
//         // setIsProcessing(false);
//     }
// };

//     const handleAddToConsolidation = async (trackingNumber: string) => {
//         try {
//         // Optional: Set a loading state here if you have one
//         // setIsProcessing(true);

//         console.log('Consolidate Shipping package: ', trackingNumber);

//         // 1. Call the API Endpoint
//         // Make sure 'IN_TRANSIT' matches exactly one of the values in your BookingStatus enum
//         const result = await updateBookingStatus(trackingNumber, 'CONSOLIDATED');

//         // 2. Success Feedback
//         alert(result.message);
        
//         // 3. Optional: Refresh the list so the item moves/updates in the UI
//         // fetchRecentBookings(); 

//     } catch (error: any) {
//         console.error('Shipment Failed:', error);
//         alert(error.message || "Failed to update shipment status");
//     } finally {
//         // setIsProcessing(false);
//     }
//     };

//     const handleClaimItem = (packageId: string) => {
//         console.log('Claiming item:', packageId);
//         // Add your claim item logic here
//         alert(`Claiming item: ${packageId}`);
//     };

//     return (
//         <div className="pb-12">
//             <div className="flex items-center mb-4">
//                 <Heading level="h4" align="left" className="font-bold" color='light'>
//                     All Packages
//                 </Heading>
//             </div>

//             {/* Filters Section */}
//             <div className="rounded-t-lg overflow-hidden p-4 mb-0 bg-gradient-to-b from-appTitleBgColor to-appNav shadow-xl">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     {/* Status Filters */}
//                     <div className="flex flex-wrap items-center gap-2">
//                         <span className="text-sm font-medium text-white flex items-center gap-1">
//                             <FiFilter /> Status:
//                         </span>
//                         {(['All', 'Received', 'In Transit', 'Awaiting Shipment', 'Unclaimed Item', 'Consolidated Packages'] as const).map((status) => (
//                             <button
//                                 key={status}
//                                 onClick={() => setStatusFilter(status)}
//                                 className={`px-3 py-1 text-sm rounded-full transition-colors ${statusFilter === status
//                                     ? 'bg-blue-500 text-white shadow-md'
//                                     : 'bg-white/20 text-white hover:bg-white/30'
//                                     }`}
//                             >
//                                 {status}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Time Filters */}
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm font-medium text-white">Time:</span>
//                         <div className="relative">
//                             <select
//                                 value={timeFilter}
//                                 onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
//                                 className="appearance-none bg-white/20 border border-white/30 rounded-lg px-3 py-1 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
//                             >
//                                 {(['12 Months', '30 Days', '7 Days', 'Today'] as const).map((time) => (
//                                     <option key={time} value={time} className="text-gray-800">
//                                         {time}
//                                     </option>
//                                 ))}
//                             </select>
//                             <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Time and Per Page Filters */}
//                 <div className="flex flex-wrap items-center gap-4">


//                     {/* NEW: Per Page Filter */}
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm font-medium text-white">Show:</span>
//                         <div className="relative">
//                             <select
//                                 value={perPage}
//                                 onChange={(e) => {
//                                     setPerPage(Number(e.target.value));
//                                     setCurrentPage(1); // Reset to page 1 when limit changes
//                                 }}
//                                 className="appearance-none bg-white/20 border border-white/30 rounded-lg px-3 py-1 pr-8 text-sm text-white focus:outline-none backdrop-blur-sm"
//                             >
//                                 {[5, 6, 7, 8, 9, 10].map((per_page) => (
//                                     <option key={per_page} value={per_page} className="text-gray-800">
//                                         {per_page} per page
//                                     </option>
//                                 ))}
//                             </select>
//                             <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-white" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="mt-4 relative max-w-md">
//                     <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
//                     <input
//                         type="text"
//                         placeholder="Search packages..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/70 backdrop-blur-sm"
//                     />
//                 </div>
//             </div>

//             {/* Table Section */}
//             <div className="rounded-b-lg overflow-hidden bg-gradient-to-b from-appNav to-appTitleBgColor shadow-xl mt-0">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-white/20">
//                         <thead className="bg-appTitleBgColor">
//                             <tr>
//                                 {shouldShowTableView ? (
//                                     // Full table headers for Unclaimed Item and Consolidated Packages
//                                     <>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Package
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Description
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Vendor
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Destination
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Status
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Date
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Weight
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Tracking Number
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Actions
//                                         </th>
//                                     </>
//                                 ) : (
//                                     // Compact headers for other statuses
//                                     <>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Package
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Vendor
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Destination
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Status
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Received Date
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Weight
//                                         </th>
//                                         <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
//                                             Actions
//                                         </th>
//                                     </>
//                                 )}
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/10">
//                             {/* filteredPackages.length > 0 */}
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan={9} className="py-20 text-center">
//                                         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mx-auto"></div>
//                                     </td>
//                                 </tr>
//                             ) : realPackages.length > 0 ? (
//                                 realPackages.map((pkg) => (
//                                     <React.Fragment key={pkg.trackingNumber}>
//                                         {shouldShowTableView ? (
//                                             // Full table view for Unclaimed Item and Consolidated Packages
//                                             <tr className="hover:bg-white/5 transition-all duration-300 border-b border-white/10">
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <div className="flex items-center space-x-3">
//                                                         <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10">
//                                                             {pkg.packageImage ? (
//                                                                 <Image
//                                                                     src={pkg.packageImage}
//                                                                     alt={pkg.package_name}
//                                                                     width={40}
//                                                                     height={40}
//                                                                     className="rounded-lg object-cover"
//                                                                 />
//                                                             ) : (
//                                                                 <FiPackage className="w-5 h-5 text-blue-300" />
//                                                             )}
//                                                         </div>
//                                                         <div className="flex-1 min-w-0">
//                                                             <p className="text-sm font-semibold text-white">
//                                                                 {pkg.package_name || pkg.package_description}
//                                                             </p>
//                                                             <p className="text-sm text-white/60 mt-1">
//                                                                 {pkg.trackingNumber}
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
//                                                     {pkg.package_description}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
//                                                     {pkg.package_name} {/**vendor */}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
//                                                     {pkg.receiver_address}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span
//                                                         className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${pkg.deliveryStatus === 'UNCLAIMED_ITEMS'
//                                                             ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
//                                                             : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
//                                                             }`}
//                                                     >
//                                                         {pkg.deliveryStatus} {/**status */}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
//                                                     {pkg.pick_up_date.split(' ')[0]} {/**pkg.pick_up_date */}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 font-medium">
//                                                     {pkg.weight}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
//                                                     <div className="flex items-center space-x-2">
//                                                         <span>{pkg.trackingNumber}</span>
//                                                         <button
//                                                             onClick={() => copyTrackingNumber(pkg.trackingNumber)}
//                                                             className="text-white/50 hover:text-blue-300 transition-colors p-1 hover:bg-white/10 rounded-lg"
//                                                             title="Copy tracking number"
//                                                         >
//                                                             <FiCopy className="w-4 h-4" />
//                                                         </button>
//                                                         {copiedTracking === pkg.trackingNumber && (
//                                                             <span className="text-green-300 text-xs">Copied!</span>
//                                                         )}
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
//                                                     <div className="flex items-center space-x-2">
//                                                         {pkg.deliveryStatus === 'UNCLAIMED_ITEMS' ? (
//                                                             <button
//                                                                 onClick={() => handleClaimItem(pkg.trackingNumber)}
//                                                                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
//                                                             >
//                                                                 Claim Item
//                                                             </button>
//                                                         ) : (
//                                                             <button
//                                                                 onClick={() => handleShipNow(pkg.trackingNumber)}
//                                                                 className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
//                                                             >
//                                                                 Ship Now
//                                                             </button>
//                                                         )}
//                                                         <button
//                                                             onClick={() => handleAddToConsolidation(pkg.trackingNumber)}
//                                                             className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
//                                                         >
//                                                             Consolidate
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ) : (
//                                             // Detailed dropdown view for other statuses
//                                             <>
//                                                 {/* Main Table Row */}
//                                                 <tr
//                                                     className="hover:bg-white/5 cursor-pointer transition-all duration-300 group border-b border-white/10"
//                                                     onClick={() => togglePackageExpand(pkg.trackingNumber)}
//                                                 >
//                                                     <td className="px-6 py-5 whitespace-nowrap">
//                                                         <div className="flex items-center space-x-4">
//                                                             <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
//                                                                 {pkg.packageImage ? (
//                                                                     <Image
//                                                                         src={pkg.packageImage}
//                                                                         alt={pkg.package_name!}
//                                                                         width={48}
//                                                                         height={48}
//                                                                         className="rounded-xl object-cover"
//                                                                     />
//                                                                 ) : (
//                                                                     <FiPackage className="w-6 h-6 text-blue-300" />
//                                                                 )}
//                                                             </div>
//                                                             <div className="flex-1 min-w-0">
//                                                                 <p className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors">
//                                                                     {pkg.package_name || pkg.package_description}
//                                                                 </p>
//                                                                 <p className="text-sm text-white/60 mt-1">
//                                                                     {pkg.trackingNumber}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-5 whitespace-nowrap">
//                                                         <div className="text-sm text-white font-medium">
//                                                             {pkg.vendor}
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-5 whitespace-nowrap">
//                                                         <div className="text-sm text-white/80">
//                                                             {pkg.receiver_address}
//                                                         </div>
//                                                     </td>
//                                                     <td className="px-6 py-5 whitespace-nowrap">
//                                                         <span
//                                                             className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${pkg.deliveryStatus === 'RECEIVED'
//                                                                 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
//                                                                 : pkg.deliveryStatus === 'IN_TRANSIT'
//                                                                     ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
//                                                                     : pkg.deliveryStatus === 'AWAITING_SHIPMENT'
//                                                                         ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
//                                                                         : pkg.deliveryStatus === 'UNCLAIMED_ITEMS'
//                                                                             ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
//                                                                             : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
//                                                                 }`}
//                                                         >
//                                                             {pkg.deliveryStatus}
//                                                         </span>
//                                                     </td>
//                                                     <td className="px-6 py-5 whitespace-nowrap text-sm text-white/80">
//                                                         {pkg.pick_up_date.split(' ')[0]} {/** pkg.pick_up_date */}
//                                                     </td>
//                                                     <td className="px-6 py-5 whitespace-nowrap text-sm text-white/80 font-medium">
//                                                         {pkg.weight}
//                                                     </td>
//                                                     <td className="px-6 py-5 whitespace-nowrap">
//                                                         <div className="flex items-center space-x-3">
//                                                             <button
//                                                                 className="text-white/70 hover:text-blue-300 transition-all duration-200 hover:scale-105 font-medium text-sm"
//                                                                 onClick={(e) => {
//                                                                     e.stopPropagation();
//                                                                     togglePackageExpand(pkg.trackingNumber);
//                                                                 }}
//                                                             >
//                                                                 View Details
//                                                             </button>
//                                                             <FiChevronRight
//                                                                 className={`w-4 h-4 text-white/50 transition-all duration-300 ${expandedPackage === pkg.trackingNumber ? 'rotate-90 text-blue-300' : 'group-hover:text-white/70'}`}
//                                                             />
//                                                         </div>
//                                                     </td>
//                                                 </tr>

//                                                 {/* Expanded Details Row */}
//                                                 {expandedPackage === pkg.trackingNumber && (
//                                                     <tr className="bg-gradient-to-r from-white/5 to-white/3 border-b border-white/10">
//                                                         <td colSpan={7} className="px-6 py-8">
//                                                             <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
//                                                                 {/* Package Overview Card */}
//                                                                 <div className="xl:col-span-4">
//                                                                     <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
//                                                                         <h4 className="text-lg font-bold text-white mb-6 flex items-center">
//                                                                             <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
//                                                                             Package Overview
//                                                                         </h4>
//                                                                         <div className="flex items-start space-x-5">
//                                                                             <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/10">
//                                                                                 {pkg.packageImage! ? (
//                                                                                     <Image
//                                                                                         src={pkg.packageImage!}
//                                                                                         alt={pkg.package_name!}
//                                                                                         width={80}
//                                                                                         height={80}
//                                                                                         className="rounded-2xl object-cover"
//                                                                                     />
//                                                                                 ) : (
//                                                                                     <FiPackage className="w-8 h-8 text-blue-300" />
//                                                                                 )}
//                                                                             </div>
//                                                                             <div className="flex-1">
//                                                                                 <h5 className="text-white font-bold text-lg leading-tight">
//                                                                                     {pkg.package_name || pkg.package_description}
//                                                                                 </h5>
//                                                                                 <div className="space-y-2 mt-3">
//                                                                                     <div className="flex items-center text-sm">
//                                                                                         <span className="text-white/60 font-medium w-24">Package ID:</span>
//                                                                                         <span className="text-white font-semibold">{pkg.trackingNumber}</span>
//                                                                                     </div>
//                                                                                     <div className="flex items-center text-sm">
//                                                                                         <span className="text-white/60 font-medium w-24">Received:</span>
//                                                                                         <span className="text-white font-semibold">{pkg.pick_up_date.split(' ')[0]}</span> {/**pkg.pick_up_date */}
//                                                                                     </div>
//                                                                                     <div className="flex items-center text-sm">
//                                                                                         <span className="text-white/60 font-medium w-24">Status:</span>
//                                                                                         <span className={`px-2 py-1 text-xs rounded-full font-bold ${pkg.deliveryStatus === 'RECEIVED'
//                                                                                             ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
//                                                                                             : pkg.deliveryStatus === 'IN_TRANSIT'
//                                                                                                 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
//                                                                                                 : pkg.deliveryStatus === 'AWAITING_SHIPMENT'
//                                                                                                     ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
//                                                                                                     : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
//                                                                                             }`}>
//                                                                                             {pkg.deliveryStatus}
//                                                                                         </span>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Package Details Card */}
//                                                                 <div className="xl:col-span-5">
//                                                                     <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
//                                                                         <h4 className="text-lg font-bold text-white mb-6 flex items-center">
//                                                                             <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
//                                                                             Package Details
//                                                                         </h4>
//                                                                         <div className="space-y-4">
//                                                                             {[
//                                                                                 {
//                                                                                     label: 'Vendor',
//                                                                                     value: pkg.vendor,
//                                                                                     icon: <FiShoppingBag className="w-4 h-4 text-blue-400" />
//                                                                                 },
//                                                                                 {
//                                                                                     label: 'Destination',
//                                                                                     value: pkg.receiver_address,
//                                                                                     icon: <FiMapPin className="w-4 h-4 text-emerald-400" />
//                                                                                 },
//                                                                                 {
//                                                                                     label: 'Received Date',
//                                                                                     value: pkg.pick_up_date.split(' ')[0],
//                                                                                     icon: <FiCalendar className="w-4 h-4 text-amber-400" />
//                                                                                 },
//                                                                                 {
//                                                                                     label: 'Weight',
//                                                                                     value: pkg.weight,
//                                                                                     icon: <FiLayers className="w-4 h-4 text-purple-400" />
//                                                                                 },
//                                                                                 {
//                                                                                     label: 'Tracking Number',
//                                                                                     value: pkg.trackingNumber,
//                                                                                     icon: <FiHash className="w-4 h-4 text-cyan-400" />,
//                                                                                     copyable: true
//                                                                                 },
//                                                                             ].map((item, index) => (
//                                                                                 <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
//                                                                                     <div className="flex items-center space-x-3">
//                                                                                         <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
//                                                                                             {item.icon}
//                                                                                         </div>
//                                                                                         <span className="text-white/70 font-medium text-sm">{item.label}</span>
//                                                                                     </div>
//                                                                                     <div className="flex items-center space-x-2">
//                                                                                         <span className="text-white font-semibold text-sm">{item.value}</span>
//                                                                                         {item.copyable && (
//                                                                                             <button
//                                                                                                 onClick={() => copyTrackingNumber(pkg.trackingNumber)}
//                                                                                                 className="text-white/50 hover:text-blue-300 transition-colors p-1 hover:bg-white/10 rounded-lg"
//                                                                                                 title="Copy tracking number"
//                                                                                             >
//                                                                                                 <FiCopy className="w-4 h-4" />
//                                                                                             </button>
//                                                                                         )}
//                                                                                     </div>
//                                                                                 </div>
//                                                                             ))}
//                                                                             {copiedTracking === pkg.trackingNumber && (
//                                                                                 <div className="flex items-center justify-center py-2 bg-green-500/20 rounded-lg border border-green-500/30">
//                                                                                     <span className="text-green-300 text-sm font-medium flex items-center">
//                                                                                         <FiCopy className="w-3 h-3 mr-2" />
//                                                                                         Tracking number copied!
//                                                                                     </span>
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Action Buttons Card */}
//                                                                 <div className="xl:col-span-3">
//                                                                     <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
//                                                                         <h4 className="text-lg font-bold text-white mb-6 flex items-center">
//                                                                             <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
//                                                                             Quick Actions
//                                                                         </h4>
//                                                                         <div className="space-y-4">
//                                                                             <button
//                                                                                 onClick={() => handleShipNow(pkg.trackingNumber)}
//                                                                                 className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 group"
//                                                                             >
//                                                                                 <FiTruck className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                                                                                 <span>Ship Now</span>
//                                                                             </button>
//                                                                             <button
//                                                                                 onClick={() => handleAddToConsolidation(pkg.trackingNumber)}
//                                                                                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 group"
//                                                                             >
//                                                                                 <FiPackage className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                                                                                 <span>Add to Consolidation</span>
//                                                                             </button>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 )}
//                                             </>
//                                         )}
//                                     </React.Fragment>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={shouldShowTableView ? 9 : 7} className="px-6 py-8 text-center">
//                                         <div className="text-white/70 text-sm">
//                                             <FiPackage className="w-12 h-12 mx-auto mb-3 text-white/30" />
//                                             No packages found matching your criteria
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                     <div className="px-6 py-4 bg-appTitleBgColor/50 border-t border-white/10 flex items-center justify-between">
//                         <p className="text-sm text-white/60">
//                             Showing page <span className="text-white font-medium">{currentPage}</span>
//                         </p>
//                         <div className="flex gap-2">
//                             <button
//                                 disabled={currentPage === 1}
//                                 onClick={() => setCurrentPage(prev => prev - 1)}
//                                 className="px-3 py-1 text-sm bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
//                             >
//                                 Previous
//                             </button>
//                             <button
//                                 onClick={() => setCurrentPage(prev => prev + 1)}
//                                 className="px-3 py-1 text-sm bg-white/10 text-white rounded hover:bg-white/20"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PackagesPage;