'use client'

import React, { useEffect, useState } from 'react';
import Heading from '@/app/components/generalheading/Heading';
import { 
    FiFilter, FiChevronDown, FiSearch, FiCopy, FiChevronRight, 
    FiTruck, FiPackage, FiMapPin, FiShoppingBag, FiLayers, 
    FiCalendar, FiHash, FiInbox, FiEye, FiX, FiInfo, FiTag, FiClock, FiPhone, FiMail
} from 'react-icons/fi';
import { PackageStatus, TimeFilter } from '@/types/user/index';
import Image from 'next/image';
import { BookingFilterParams, FilterBookingViewDTO, BookingResponseDTO } from '@/types/booking';
import { getAllBookings, updateBookingStatus } from '@/lib/user/booking.actions';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// ✅ Imports for Payment & Profile integration
import BookingPaymentModal from '@/app/components/payment/BookingPaymentModal';

import { getMyProfile } from '@/lib/user/actions';
import { UserResponseDTO } from '@/types/admin';

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

const modalBackdrop: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
};

const modalContent: Variants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    show: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } }
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

    // ✅ State for Deep Details Modal
    const [selectedPackageDetails, setSelectedPackageDetails] = useState<FilterBookingViewDTO | null>(null);

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
        const searchMatch = !searchString || 
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
            case 'CONSOLIDATED': return 'bg-slate-500/20 text-slate-300 border-slate-500/30 shadow-[0_0_10px_rgba(100,116,139,0.2)]';
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

                        <motion.tbody variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-white/5 bg-transparent">
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
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-xs font-medium text-gray-500 font-mono">{pkg.trackingNumber}</p>
                                                                <button onClick={() => copyTrackingNumber(pkg.trackingNumber)} className="text-gray-600 hover:text-appBanner transition-colors"><FiCopy size={12} /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{pkg.package_description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{pkg.vendor || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{pkg.receiver_address}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(pkg.deliveryStatus!)}`}>
                                                        {pkg.deliveryStatus!.replace(/_/g, ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">{pkg.pick_up_date.split(' ')[0]}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{pkg.weight}</td>
                                                
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedPackageDetails(pkg)} className="bg-white/5 hover:bg-appBanner text-gray-400 hover:text-white border border-white/10 p-2 rounded-lg transition-colors" title="View Full Details">
                                                            <FiEye className="w-4 h-4" />
                                                        </motion.button>
                                                        
                                                        {pkg.deliveryStatus! === 'UNCLAIMED_ITEMS' ? (
                                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleClaimItem(pkg.trackingNumber)} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20">Claim Item</motion.button>
                                                        ) : (
                                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleShipNow(pkg.trackingNumber)} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20">Ship Now</motion.button>
                                                        )}

                                                        {pkg.deliveryStatus !== 'CONSOLIDATED' && (
                                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAddToConsolidation(pkg.trackingNumber)} className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3 py-2 rounded-lg text-xs font-bold transition-colors">Consolidate</motion.button>
                                                        )}
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
                                                            <span className="text-xs font-bold uppercase tracking-wider">Quick View</span>
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
                                                                                        <p className="text-sm font-bold text-white mt-1">{pkg.vendor || 'N/A'}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start space-x-4">
                                                                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                                                                                        <FiMapPin className="text-emerald-400 w-5 h-5" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Final Destination</p>
                                                                                        <p className="text-sm font-bold text-white mt-1 truncate max-w-[200px]">{pkg.receiver_address}</p>
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
                                                                                
                                                                                {pkg.deliveryStatus !== 'CONSOLIDATED' && (
                                                                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAddToConsolidation(pkg.trackingNumber)} className="relative z-10 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                                                                        <FiLayers className="w-4 h-4" /> <span>Add to Consolidation</span>
                                                                                    </motion.button>
                                                                                )}

                                                                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedPackageDetails(pkg)} className="relative z-10 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                                                                    <FiInfo className="w-4 h-4" /> <span>View Full Details</span>
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

            {/* --- ✅ NEW: DEEP DETAILS MODAL --- */}
            <AnimatePresence>
                {selectedPackageDetails && (
                    <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110] p-4">
                        <motion.div variants={modalContent} initial="hidden" animate="show" exit="exit" className="bg-gradient-to-b from-[#111827] to-[#0B1121] border border-white/10 rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden relative">
                            
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-appBanner/10 blur-[80px] rounded-full pointer-events-none" />
                            
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-appBanner/20 border border-appBanner/30 rounded-xl flex items-center justify-center text-appBanner">
                                        <FiPackage className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-white tracking-tight">Booking Specification</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-mono text-appBanner font-bold bg-appBanner/10 px-2 py-0.5 rounded border border-appBanner/20">{selectedPackageDetails.trackingNumber}</span>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(selectedPackageDetails.deliveryStatus!)}`}>
                                                {selectedPackageDetails.deliveryStatus!.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedPackageDetails(null)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><FiX size={24} /></button>
                            </div>
                            
                            {/* Scrollable Body */}
                            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6 relative z-10">
                                
                                {/* Core Info & Logistics */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest"><FiTruck className="inline mr-1 text-appBanner"/> Shipment Type</p>
                                        <p className="text-sm font-bold text-white mt-1">{selectedPackageDetails.shipment_type || 'N/A'}</p>
                                    </div>
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest"><FiMapPin className="inline mr-1 text-emerald-400"/> Service Type</p>
                                        <p className="text-sm font-bold text-white mt-1">{selectedPackageDetails.pickupType || 'N/A'}</p>
                                    </div>
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest"><FiPackage className="inline mr-1 text-amber-400"/> Total Weight</p>
                                        <p className="text-sm font-bold text-white mt-1">{selectedPackageDetails.weight} kg</p>
                                    </div>
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest"><FiCalendar className="inline mr-1 text-blue-400"/> Amount Paid</p>
                                        <p className="text-sm font-bold text-emerald-400 mt-1">₦{selectedPackageDetails.shipping_amount?.toLocaleString() || '0'}</p>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 h-full">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Sender Details</h4>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-gray-200">{selectedPackageDetails.sender_lastname}</p>
                                            <p className="text-xs font-medium text-gray-400 flex items-center gap-2"><FiPhone className="text-gray-500"/> {selectedPackageDetails.sender_phoneNumber}</p>
                                            <p className="text-xs font-medium text-gray-400 flex items-start gap-2"><FiMapPin className="text-gray-500 mt-0.5 shrink-0"/> <span>{selectedPackageDetails.address}</span></p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 h-full">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Receiver Details</h4>
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-gray-400 flex items-center gap-2"><FiMail className="text-gray-500"/> {selectedPackageDetails.receiver_email}</p>
                                            <p className="text-xs font-medium text-gray-400 flex items-center gap-2"><FiPhone className="text-gray-500"/> {selectedPackageDetails.receiver_phoneNumber}</p>
                                            <p className="text-xs font-medium text-gray-400 flex items-start gap-2"><FiMapPin className="text-gray-500 mt-0.5 shrink-0"/> <span>{selectedPackageDetails.receiver_address}, {selectedPackageDetails.city}, {selectedPackageDetails.lga}, {selectedPackageDetails.country}</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Packages Included Section (Mapped from Array) */}
                                <div className="space-y-3 mt-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10 pb-2">
                                        Packages Included ({selectedPackageDetails.packages?.length || 0})
                                    </h4>
                                    
                                    {selectedPackageDetails.packages && selectedPackageDetails.packages.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedPackageDetails.packages.map((pkg: any, idx: number) => (
                                                <div key={idx} className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-start gap-4">
                                                    <div className="w-10 h-10 bg-appBanner/20 text-appBanner rounded-lg flex items-center justify-center shrink-0 border border-appBanner/30">
                                                        <FiPackage size={18} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <h5 className="text-sm font-bold text-white">{pkg.packageName || 'Unnamed Item'}</h5>
                                                            <span className="text-[10px] font-black text-gray-400 bg-white/10 px-2 py-0.5 rounded uppercase">
                                                                {pkg.productCategory || 'General'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{pkg.packageDescription || 'No description provided.'}</p>
                                                        
                                                        <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
                                                            <div className="text-[10px] font-bold text-gray-500">
                                                                WT: <span className="text-gray-300">{pkg.weight || 0} kg</span>
                                                            </div>
                                                            <div className="text-[10px] font-bold text-gray-500">
                                                                DIMS: <span className="text-gray-300">{pkg.length || 0} x {pkg.width || 0} x {pkg.height || 0} cm</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-black/30 p-6 rounded-xl border border-white/5 text-center text-sm font-medium text-gray-500">
                                            No explicit package list available for this booking.
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Footer Actions */}
                            <div className="p-6 border-t border-white/10 bg-black/40 relative z-10 flex items-center justify-end gap-3">
                                <button onClick={() => setSelectedPackageDetails(null)} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10">
                                    Close Window
                                </button>
                                {selectedPackageDetails.deliveryStatus !== 'CONSOLIDATED' && (
                                    <button onClick={() => {
                                        const trackingId = selectedPackageDetails.trackingNumber;
                                        setSelectedPackageDetails(null);
                                        handleAddToConsolidation(trackingId);
                                    }} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
                                        Consolidate
                                    </button>
                                )}
                                <button onClick={() => {
                                    const trackingId = selectedPackageDetails.trackingNumber;
                                    setSelectedPackageDetails(null);
                                    handleShipNow(trackingId);
                                }} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-appBanner to-appNav text-white shadow-lg hover:shadow-appBanner/30 transition-all">
                                    Ship Immediately
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
//     FiCalendar, FiHash, FiInbox, FiEye, FiX, FiInfo, FiTag, FiClock
// } from 'react-icons/fi';
// import { PackageStatus, TimeFilter } from '@/types/user/index';
// import Image from 'next/image';
// import { BookingFilterParams, FilterBookingViewDTO, BookingResponseDTO } from '@/types/booking';
// import { getAllBookings, updateBookingStatus } from '@/lib/user/booking.actions';
// import { motion, AnimatePresence, Variants } from 'framer-motion';

// // ✅ Imports for Payment & Profile integration
// import BookingPaymentModal from '@/app/components/payment/BookingPaymentModal';

// import { getMyProfile } from '@/lib/user/actions';
// import { UserResponseDTO } from '@/types/admin';

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

// const modalBackdrop: Variants = {
//     hidden: { opacity: 0 },
//     show: { opacity: 1 }
// };

// const modalContent: Variants = {
//     hidden: { scale: 0.95, opacity: 0, y: 20 },
//     show: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
//     exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } }
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

//     // ✅ State for Payment Modal & Profile
//     const [profile, setProfile] = useState<UserResponseDTO | null>(null);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);
//     const [consolidationTarget, setConsolidationTarget] = useState<string | null>(null);

//     // ✅ State for Deep Details Modal
//     const [selectedPackageDetails, setSelectedPackageDetails] = useState<FilterBookingViewDTO | null>(null);

//     // Fetch user profile for the payment modal payload
//     useEffect(() => {
//         getMyProfile().then((data) => setProfile(data as unknown as UserResponseDTO)).catch(console.error);
//     }, []);

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

//     const filteredPackages = realPackages.filter((pkg) => {
//         const now = new Date();
//         now.setHours(0, 0, 0, 0);
        
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
//         const searchMatch = !searchString || 
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

//     const handleShipNow = async (trackingNumber: string) => {
//         try {
//             const result = await updateBookingStatus(trackingNumber, 'SHIP_NOW');
//             alert(result.message);
//         } catch (error: any) {
//             alert(error.message || "Failed to update shipment status");
//         }
//     };

//     const handleAddToConsolidation = (trackingNumber: string) => {
//         setConsolidationTarget(trackingNumber);
//         setShowPaymentModal(true);
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
//             case 'CONSOLIDATED': return 'bg-slate-500/20 text-slate-300 border-slate-500/30 shadow-[0_0_10px_rgba(100,116,139,0.2)]';
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

//                         <motion.tbody variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-white/5 bg-transparent">
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
//                                                             <div className="flex items-center gap-2 mt-1">
//                                                                 <p className="text-xs font-medium text-gray-500 font-mono">{pkg.trackingNumber}</p>
//                                                                 <button onClick={() => copyTrackingNumber(pkg.trackingNumber)} className="text-gray-600 hover:text-appBanner transition-colors"><FiCopy size={12} /></button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{pkg.package_description}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{pkg.vendor || '-'}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{pkg.receiver_address}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(pkg.deliveryStatus!)}`}>
//                                                         {pkg.deliveryStatus!.replace(/_/g, ' ')}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">{pkg.pick_up_date.split(' ')[0]}</td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{pkg.weight}</td>
                                                
//                                                 <td className="px-6 py-4 whitespace-nowrap text-right">
//                                                     <div className="flex items-center justify-end space-x-2">
//                                                         {/* ✅ NEW: Icon View Button */}
//                                                         <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedPackageDetails(pkg)} className="bg-white/5 hover:bg-appBanner text-gray-400 hover:text-white border border-white/10 p-2 rounded-lg transition-colors" title="View Full Details">
//                                                             <FiEye className="w-4 h-4" />
//                                                         </motion.button>
                                                        
//                                                         {pkg.deliveryStatus! === 'UNCLAIMED_ITEMS' ? (
//                                                             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleClaimItem(pkg.trackingNumber)} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20">Claim Item</motion.button>
//                                                         ) : (
//                                                             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleShipNow(pkg.trackingNumber)} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20">Ship Now</motion.button>
//                                                         )}

//                                                         {/* ✅ ONLY SHOW CONSOLIDATE IF NOT ALREADY CONSOLIDATED */}
//                                                         {pkg.deliveryStatus !== 'CONSOLIDATED' && (
//                                                             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleAddToConsolidation(pkg.trackingNumber)} className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3 py-2 rounded-lg text-xs font-bold transition-colors">Consolidate</motion.button>
//                                                         )}
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
//                                                             <span className="text-xs font-bold uppercase tracking-wider">Quick View</span>
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
//                                                                                         <p className="text-sm font-bold text-white mt-1">{pkg.vendor || 'N/A'}</p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                                 <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-start space-x-4">
//                                                                                     <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
//                                                                                         <FiMapPin className="text-emerald-400 w-5 h-5" />
//                                                                                     </div>
//                                                                                     <div>
//                                                                                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Final Destination</p>
//                                                                                         <p className="text-sm font-bold text-white mt-1 truncate max-w-[200px]">{pkg.receiver_address}</p>
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
                                                                                
//                                                                                 {/* ✅ ONLY SHOW CONSOLIDATE IF NOT ALREADY CONSOLIDATED */}
//                                                                                 {pkg.deliveryStatus !== 'CONSOLIDATED' && (
//                                                                                     <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAddToConsolidation(pkg.trackingNumber)} className="relative z-10 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
//                                                                                         <FiLayers className="w-4 h-4" /> <span>Add to Consolidation</span>
//                                                                                     </motion.button>
//                                                                                 )}

//                                                                                 {/* ✅ NEW: Full Details Modal Trigger */}
//                                                                                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedPackageDetails(pkg)} className="relative z-10 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
//                                                                                     <FiInfo className="w-4 h-4" /> <span>View Full Details</span>
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

//             {/* --- ✅ NEW: DEEP DETAILS MODAL --- */}
//             <AnimatePresence>
//                 {selectedPackageDetails && (
//                     <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110] p-4">
//                         <motion.div variants={modalContent} initial="hidden" animate="show" exit="exit" className="bg-gradient-to-b from-[#111827] to-[#0B1121] border border-white/10 rounded-[2rem] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden relative">
                            
//                             {/* Decorative Background Elements */}
//                             <div className="absolute top-0 right-0 w-64 h-64 bg-appBanner/10 blur-[80px] rounded-full pointer-events-none" />
                            
//                             {/* Header */}
//                             <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 relative z-10">
//                                 <div className="flex items-center gap-4">
//                                     <div className="w-12 h-12 bg-appBanner/20 border border-appBanner/30 rounded-xl flex items-center justify-center text-appBanner">
//                                         <FiPackage className="w-6 h-6" />
//                                     </div>
//                                     <div>
//                                         <h3 className="text-xl font-extrabold text-white tracking-tight">Package Specification</h3>
//                                         <div className="flex items-center gap-2 mt-1">
//                                             <span className="text-xs font-mono text-appBanner font-bold bg-appBanner/10 px-2 py-0.5 rounded border border-appBanner/20">{selectedPackageDetails.trackingNumber}</span>
//                                             <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getStatusStyle(selectedPackageDetails.deliveryStatus!)}`}>
//                                                 {selectedPackageDetails.deliveryStatus!.replace(/_/g, ' ')}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <button onClick={() => setSelectedPackageDetails(null)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><FiX size={24} /></button>
//                             </div>
                            
//                             {/* Scrollable Body */}
//                             <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-8 relative z-10">
                                
//                                 {/* Image & Core Info */}
//                                 <div className="flex flex-col md:flex-row gap-6">
//                                     <div className="w-full md:w-1/3 aspect-square rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden relative group">
//                                         {selectedPackageDetails.packageImage ? (
//                                             <Image src={selectedPackageDetails.packageImage} alt="Package" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
//                                         ) : (
//                                             <FiInbox className="w-16 h-16 text-gray-600" />
//                                         )}
//                                     </div>
//                                     <div className="flex-1 space-y-4">
//                                         <div>
//                                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Item Name</p>
//                                             <p className="text-lg font-bold text-white mt-1">{selectedPackageDetails.package_name || 'N/A'}</p>
//                                         </div>
//                                         <div>
//                                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</p>
//                                             <p className="text-sm font-medium text-gray-300 mt-1 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">{selectedPackageDetails.package_description || 'No description provided.'}</p>
//                                         </div>
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div className="bg-white/5 p-3 rounded-xl border border-white/5">
//                                                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest"><FiTag className="inline mr-1"/> Category / Vendor</p>
//                                                 <p className="text-sm font-bold text-white mt-1">{selectedPackageDetails.vendor || 'General'}</p>
//                                             </div>
//                                             <div className="bg-white/5 p-3 rounded-xl border border-white/5">
//                                                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest"><FiClock className="inline mr-1"/> Logged Date</p>
//                                                 <p className="text-sm font-bold text-white mt-1">{selectedPackageDetails.pick_up_date?.split(' ')[0]}</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Logistics Grid */}
//                                 <div>
//                                     <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
//                                         <FiTruck className="text-appBanner" /> Logistics Details
//                                     </h4>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                                         <div className="bg-black/30 p-4 rounded-xl border border-white/5">
//                                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Shipment Method</p>
//                                             <p className="text-sm font-bold text-white mt-1">{selectedPackageDetails.shipment_type || 'N/A'}</p>
//                                         </div>
//                                         <div className="bg-black/30 p-4 rounded-xl border border-white/5">
//                                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Billed Weight</p>
//                                             <p className="text-sm font-bold text-white mt-1">{selectedPackageDetails.weight}</p>
//                                         </div>
//                                         <div className="bg-black/30 p-4 rounded-xl border border-white/5">
//                                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base Amount</p>
//                                             <p className="text-lg font-black text-emerald-400 mt-1">${selectedPackageDetails.shipping_amount || '0.00'}</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Route Info */}
//                                 <div>
//                                     <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
//                                         <FiMapPin className="text-rose-400" /> Route Information
//                                     </h4>
//                                     <div className="bg-black/30 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
//                                         <div className="flex-1 w-full text-center md:text-left">
//                                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current City</p>
//                                             <p className="text-base font-bold text-white mt-1">{selectedPackageDetails.city || 'Processing Hub'}</p>
//                                         </div>
//                                         <div className="hidden md:flex items-center justify-center flex-1">
//                                             <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent relative">
//                                                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-gray-400 p-1 rounded-full"><FiTruck size={12}/></div>
//                                             </div>
//                                         </div>
//                                         <div className="flex-1 w-full text-center md:text-right">
//                                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Destination Address</p>
//                                             <p className="text-sm font-bold text-white mt-1 max-w-xs ml-auto leading-relaxed">{selectedPackageDetails.receiver_address || 'Pending Validation'}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             {/* Footer Actions */}
//                             <div className="p-6 border-t border-white/10 bg-black/40 relative z-10 flex items-center justify-end gap-3">
//                                 <button onClick={() => setSelectedPackageDetails(null)} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10">
//                                     Close Window
//                                 </button>
//                                 <button onClick={() => {
//                                     setSelectedPackageDetails(null);
//                                     handleShipNow(selectedPackageDetails.trackingNumber);
//                                 }} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-appBanner to-appNav text-white shadow-lg hover:shadow-appBanner/30 transition-all">
//                                     Ship Immediately
//                                 </button>
//                             </div>
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* --- PAYMENT MODAL FOR CONSOLIDATION --- */}
//             {showPaymentModal && consolidationTarget && (
//                 <BookingPaymentModal 
//                     bookingData={{
//                         trackingNumber: consolidationTarget,
//                         totalCost: 30, // Fixed $30 fee for now
//                         currency: 'USD',
//                     } as unknown as BookingResponseDTO} 
//                     customerEmail={profile?.email || 'customer@example.com'} 
//                     customerName={`${profile?.firstName || 'Customer'} ${profile?.lastName || ''}`.trim()} 
//                     onClose={() => {
//                         setShowPaymentModal(false);
//                         setConsolidationTarget(null);
//                     }} 
//                 />
//             )}
//         </div>
//     );
// };

// export default PackagesPage;