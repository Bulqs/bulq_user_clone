'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
    Truck, Package, MapPin, Calendar, Clock, CheckCircle,
    Home, Building, Search, Copy, ChevronDown, Sparkles,
    Zap, ArrowRight, Plus, Layers, Box, FileText, Download,
    Share2, Phone, Mail
} from 'lucide-react';
import Image from 'next/image';
import { getAllTrackingHistory, getRecentTracking, getUserBookingSummary } from '@/lib/user/booking.actions';
import { DisplayTracking, FullTrackingResponseDTO, TrackingEvent } from '@/types/driver';
import { getFullTracking } from '@/lib/driver/trackpackage.actions';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TrackingPdfTemplate from '@/app/components/tracking/TrackingPdfTemplate';
import { RecentTrackingDTO } from '@/types/user';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- FRAMER MOTION VARIANTS ---
const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const fadeScaleItem: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

const TrackingPage = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('current');
    const [selectedShipping, setSelectedShipping] = useState('standard');
    
    // API State
    const [loading, setLoading] = useState<boolean>(true);
    const [statusSummary, setStatusSummary] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);
    const [currentPkg, setCurrentPkg] = useState<DisplayTracking | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);
    
    // History Lists
    const [recentTracking, setRecentTracking] = useState<RecentTrackingDTO[]>([]);
    const [historyTracking, setHistoryTracking] = useState<RecentTrackingDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Initial Dashboard Summary
    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                setLoading(true);
                const summaryData = await getUserBookingSummary();

                if (Array.isArray(summaryData)) {
                    const dictionary = summaryData.reduce((acc, item) => {
                        acc[item.status] = item.totalItems;
                        return acc;
                    }, {} as Record<string, number>);
                    setStatusSummary(dictionary);
                }
                setError(null);
            } catch (err: any) {
                setError(err.message || "Failed to sync dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchSummaryData();
    }, []);

    // Initial List Load (Current)
    useEffect(() => {
        loadData('current');
    }, []);

    // Unified Data Loader for Tabs
    const loadData = async (type: string) => {
        setIsLoading(true);
        try {
            if (type === 'current') {
                if (recentTracking.length === 0) {
                    const data = await getRecentTracking();
                    setRecentTracking(data);
                }
            } else {
                if (historyTracking.length === 0) {
                    const data = await getAllTrackingHistory();
                    setHistoryTracking(data);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        loadData(tab);
    };

    const handleShareTracking = async () => {
        if (!currentPkg || !printRef.current) return;
        setIsSharing(true);

        try {
            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                windowHeight: printRef.current.scrollHeight 
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; 
            const pageHeight = 800; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position -= pageHeight; 
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`BulQ-Tracking-${currentPkg.trackingNumber}.pdf`);
        } catch (err) {
            console.error("PDF Generation failed", err);
        } finally {
            setIsSharing(false);
        }
    };

    const handleTrackPkg = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber.trim()) return;
        setIsSearching(true);

        try {
            const data = await getFullTracking(trackingNumber);

            if (data.error) {
                setError(data.message);
                setCurrentPkg(null);
                return;
            }

            const mappedData: DisplayTracking = {
                ...data,
                stages: data.events.map((event: any) => ({
                    stage: event.eventType.replace(/_/g, ' '),
                    date: new Date(event.eventTime).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                    }),
                    time: new Date(event.eventTime).toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit'
                    }),
                    description: event.description,
                    completed: true
                }))
            };

            setCurrentPkg(mappedData);
            setError(null);
        } catch (err) {
            setError("Tracking details could not be retrieved at this time.");
        } finally {
            setIsSearching(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const getStatusStyle = (status: RecentTrackingDTO['deliveryStatus']) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getAddressTypeIcon = (type: string) => {
        return type.toLowerCase() === 'home' ? <Home size={16} className="text-blue-400" /> : <Building size={16} className="text-purple-400" />;
    };

    const displayList = activeTab === 'current' ? recentTracking : historyTracking;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-appBanner/5 p-4 lg:p-6 relative overflow-hidden">
            
            {/* --- ANIMATED BACKGROUND ORBS --- */}
            <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 left-0 w-96 h-96 bg-appBanner/20 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-1/2 right-0 w-80 h-80 bg-appNav/20 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />
            <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-0 left-1/2 w-96 h-96 bg-appTitleBgColor/20 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto">
                {/* --- HEADER SECTION --- */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-appTitleBgColor to-appNav p-6 md:p-8 mb-8 rounded-2xl shadow-xl min-h-[8rem]">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                        <div className='flex-shrink-0'>
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-appBanner to-appNav rounded-xl flex items-center justify-center shadow-lg">
                                <Truck className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className='font-bold text-xl md:text-2xl text-white'>Package Tracking</h1>
                            <p className='font-medium text-sm md:text-base text-white/90 mt-1'>Real-time updates for your BulQ shipments</p>
                        </div>
                    </div>

                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between xs:justify-end gap-3 w-full md:w-auto">
                        <div className='flex flex-col p-2 text-white text-center md:text-right'>
                            <p className='text-sm font-semibold text-white/80 uppercase tracking-wider'>ACTIVE TRACKING</p>
                            <p className='font-black text-3xl md:text-4xl text-white drop-shadow-md'>
                                {(statusSummary['RECEIVED'] || 0) + (statusSummary['IN_TRANSIT'] || 0) + (statusSummary['AWAITING_SHIPMENT'] || 0)}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* --- STATS CARDS SECTION --- */}
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: 'Active Tracking', value: (statusSummary['RECEIVED'] || 0) + (statusSummary['IN_TRANSIT'] || 0) + (statusSummary['AWAITING_SHIPMENT'] || 0), icon: <Search className="w-5 h-5 text-white" />, bg: 'bg-gradient-to-br from-blue-500 to-cyan-600', trend: '+5.2%' },
                        { title: 'In Transit', value: statusSummary['IN_TRANSIT'] || 0, icon: <Truck className="w-5 h-5 text-white" />, bg: 'bg-gradient-to-br from-amber-500 to-orange-600', trend: '+12.7%' },
                        { title: 'Delivered Today', value: statusSummary['DELIVERED'] || 0, icon: <CheckCircle className="w-5 h-5 text-white" />, bg: 'bg-gradient-to-br from-emerald-500 to-green-600', trend: '+8.3%' },
                        { title: 'Pending Updates', value: statusSummary['PENDING'] || 0, icon: <Clock className="w-5 h-5 text-white" />, bg: 'bg-gradient-to-br from-purple-500 to-pink-600', trend: '-2.1%' },
                    ].map((stat, index) => (
                        <motion.div key={index} variants={fadeUpItem} whileHover={{ y: -5 }} className={`${stat.bg} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-white relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-8 translate-x-8 pointer-events-none"></div>
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold opacity-90 tracking-wider uppercase">{stat.title}</span>
                                    <span className="mt-2 text-3xl font-black drop-shadow-sm">{stat.value}</span>
                                    <span className="text-xs font-medium opacity-80 mt-1">{stat.trend} from yesterday</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">{stat.icon}</div>
                            </div>
                            <div className="mt-5 h-1.5 bg-black/20 rounded-full overflow-hidden relative z-10">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (index + 1) * 25)}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-white/90 rounded-full" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* --- MAIN CONTENT GRID --- */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: Input & List */}
                    <div className="space-y-8">
                        {/* Tracker Input Box */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-appTitleBgColor to-appNav bg-clip-text text-transparent mb-2">
                                    Track Your Package
                                </h2>
                                <p className="text-gray-500 font-medium">Enter your BulQ tracking number for live updates</p>
                            </div>

                            <form onSubmit={handleTrackPkg} className="relative group">
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="e.g., BULQ-123456789"
                                    className="w-full px-6 py-4 pl-14 text-lg font-medium border border-gray-300 rounded-xl focus:ring-4 focus:ring-appBanner/20 focus:border-appBanner transition-all shadow-inner uppercase bg-white/50"
                                />
                                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-appBanner to-appNav rounded-md flex items-center justify-center shadow-sm">
                                        <Search className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isSearching || !trackingNumber.trim()}
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-appBanner to-appNav text-white font-bold rounded-lg shadow-md disabled:opacity-70"
                                >
                                    {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Track'}
                                </motion.button>
                            </form>

                            {error && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100">
                                    {error}
                                </motion.p>
                            )}

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <motion.button whileHover={{ y: -2 }} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200 hover:border-appBanner hover:bg-appBanner/5 transition-colors group">
                                    <div className="w-9 h-9 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center shadow-sm">
                                        <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-appNav">Label</span>
                                </motion.button>
                                <motion.button whileHover={{ y: -2 }} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200 hover:border-appBanner hover:bg-appBanner/5 transition-colors group">
                                    <div className="w-9 h-9 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center shadow-sm">
                                        <Download className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-appNav">Export</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    onClick={handleShareTracking} 
                                    disabled={isSharing || !currentPkg}
                                    className={`flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200 transition-colors group ${!currentPkg ? 'opacity-50 cursor-not-allowed' : 'hover:border-appBanner hover:bg-appBanner/5'}`}
                                >
                                    <div className="w-9 h-9 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center shadow-sm">
                                        {isSharing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Share2 className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-appNav">{isSharing ? 'PDF...' : 'Share'}</span>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Recent / History Tabs & List */}
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                                <h2 className="text-xl font-extrabold bg-gradient-to-r from-appTitleBgColor to-appNav bg-clip-text text-transparent">
                                    Shipment Records
                                </h2>
                                <div className="flex bg-gray-100 p-1 rounded-xl relative">
                                    {/* Animated Pill Background for Tabs */}
                                    <div className="flex gap-1 relative z-10">
                                        <button onClick={() => handleTabChange('current')} className={`relative px-5 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'current' ? 'text-appNav' : 'text-gray-500 hover:text-gray-700'}`}>
                                            {activeTab === 'current' && <motion.div layoutId="tabPill" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-200" style={{ zIndex: -1 }} />}
                                            Current
                                        </button>
                                        <button onClick={() => handleTabChange('history')} className={`relative px-5 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'history' ? 'text-appNav' : 'text-gray-500 hover:text-gray-700'}`}>
                                            {activeTab === 'history' && <motion.div layoutId="tabPill" className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-200" style={{ zIndex: -1 }} />}
                                            History
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 min-h-[300px]">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                                        <div className="w-8 h-8 border-4 border-gray-200 border-t-appBanner rounded-full animate-spin" />
                                        <p className="text-gray-400 font-medium text-sm">Loading records...</p>
                                    </div>
                                ) : displayList.length === 0 ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
                                            <Package className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No {activeTab} records found.</p>
                                    </motion.div>
                                ) : (
                                    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4 pr-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                        <AnimatePresence mode="wait">
                                            {displayList.map((item) => (
                                                <motion.div
                                                    layout
                                                    variants={fadeUpItem}
                                                    key={item.trackingNumber}
                                                    onClick={() => setTrackingNumber(item.trackingNumber)}
                                                    className="group bg-white rounded-xl border border-gray-200 hover:border-appBanner/50 p-4 transition-all duration-200 hover:shadow-md cursor-pointer relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-appBanner transition-colors" />
                                                    <div className="flex justify-between items-center ml-2">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${activeTab === 'history' ? 'bg-gray-50 border-gray-200' : 'bg-blue-50/50 border-blue-100'}`}>
                                                                <Package className={`w-6 h-6 ${activeTab === 'history' ? 'text-gray-400' : 'text-appBanner'}`} />
                                                            </div>
                                                            <div>
                                                                <p className="font-extrabold text-gray-900">{item.trackingNumber}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md border ${getStatusStyle(item.deliveryStatus)}`}>
                                                                        {item.deliveryStatus}
                                                                    </span>
                                                                    <span className="text-gray-400 text-xs font-medium">•</span>
                                                                    <span className="text-gray-500 text-xs font-medium truncate max-w-[100px]">{item.destinationCity}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-appBanner font-black text-lg">${item.amount.toFixed(2)}</p>
                                                            <p className="text-gray-400 text-xs font-medium mt-0.5">{new Date(item.lastUpdated).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Live Package Details */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit sticky top-8 min-h-[600px]">
                        {!currentPkg && !isSearching ? (
                            <div className="flex flex-col items-center justify-center h-[600px] text-center p-8 bg-gradient-to-b from-gray-50 to-white">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-gray-200 shadow-sm">
                                    <MapPin className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-extrabold text-gray-800 mb-2">Live Tracking Center</h3>
                                <p className="text-gray-500 text-sm font-medium max-w-xs mx-auto">Select a shipment from the left or enter a tracking number to see live GPS updates.</p>
                            </div>
                        ) : (
                            <div className={`transition-opacity duration-300 ${isSearching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                                {/* Detailed Header */}
                                <div className="bg-gradient-to-r from-appTitleBgColor to-appNav p-8 text-white relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10" />
                                    <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
                                        <Package className="w-5 h-5 opacity-80" />
                                        Shipment Details
                                    </h2>
                                    <div className="bg-black/20 backdrop-blur-md rounded-xl px-5 py-4 border border-white/10 flex justify-between items-center shadow-inner">
                                        <div>
                                            <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">Waybill Number</p>
                                            <p className="text-2xl font-black tracking-wider">{currentPkg?.trackingNumber}</p>
                                        </div>
                                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(currentPkg?.trackingNumber || '')} className="p-2.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/10">
                                            {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Core Info Specs */}
                                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                    <div className="grid gap-5">
                                        {/* Destination Banner */}
                                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                                                <MapPin className="w-6 h-6 text-appBanner" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Last Known Location</h3>
                                                <p className="text-gray-900 font-black text-lg">{currentPkg?.currentLocation}</p>
                                                <p className="text-gray-500 text-xs font-medium mt-0.5">Scanned: {new Date(currentPkg?.lastUpdated || '').toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Status & ETA */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                                                    <Truck className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">Status</h3>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                        <span className="text-emerald-700 font-bold text-sm uppercase tracking-tight">
                                                            {currentPkg?.currentStatus.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100">
                                                    <Clock className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">ETA</h3>
                                                    <p className="text-amber-700 font-bold text-sm">
                                                        {currentPkg?.estimatedDaysRemaining ? `${currentPkg.estimatedDaysRemaining} Days` : 'Calculating...'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Animated Timeline */}
                                <div className="p-8">
                                    <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest mb-6">Delivery Journey</h3>
                                    
                                    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="relative space-y-6">
                                        {/* The vertical tracking line */}
                                        <div className="absolute left-[17px] top-2 bottom-4 w-[2px] bg-gray-100 rounded-full" />
                                        
                                        {currentPkg?.stages.map((stage, idx) => (
                                            <motion.div variants={fadeScaleItem} key={idx} className="relative flex items-start group">
                                                {/* Node Dot */}
                                                <div className={`absolute left-0 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white z-10 shadow-sm transition-colors ${idx === 0 ? 'bg-appBanner' : 'bg-gray-200'}`}>
                                                    {idx === 0 ? <CheckCircle className="w-4 h-4 text-white" /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                                                </div>
                                                
                                                <div className={`ml-14 flex-1 p-4 rounded-xl border transition-all duration-300 ${idx === 0 ? 'bg-blue-50/50 border-blue-100 shadow-sm' : 'bg-white border-gray-100 group-hover:border-gray-200'}`}>
                                                    <div className="flex justify-between items-start mb-1.5">
                                                        <h4 className={`font-bold text-sm ${idx === 0 ? 'text-appNav' : 'text-gray-800'}`}>{stage.stage}</h4>
                                                        <div className="text-right flex flex-col items-end">
                                                            <span className="text-[11px] font-bold text-gray-500">{stage.date}</span>
                                                            <span className="text-[10px] font-medium text-gray-400">{stage.time}</span>
                                                        </div>
                                                    </div>
                                                    <p className={`text-xs font-medium leading-relaxed ${idx === 0 ? 'text-gray-700' : 'text-gray-500'}`}>{stage.description}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* HIDDEN TEMPLATE FOR PDF GENERATION */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <TrackingPdfTemplate ref={printRef} data={currentPkg} />
            </div>
        </div>
    );
}

export default TrackingPage;

// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//     Truck,
//     Package,
//     MapPin,
//     Calendar,
//     Clock,
//     CheckCircle,
//     Home,
//     Building,
//     Search,
//     Copy,
//     ChevronDown,
//     Sparkles,
//     Zap,
//     ArrowRight,
//     Plus,
//     Layers,
//     Box,
//     FileText,
//     Download,
//     Share2,
//     Phone,
//     Mail
// } from 'lucide-react';
// import Image from 'next/image';
// import { getAllTrackingHistory, getRecentTracking, getUserBookingSummary } from '@/lib/user/booking.actions';
// import { DisplayTracking, FullTrackingResponseDTO, TrackingEvent } from '@/types/driver';
// import { getFullTracking } from '@/lib/driver/trackpackage.actions';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { useRef } from 'react';
// import TrackingPdfTemplate from '@/app/components/tracking/TrackingPdfTemplate';
// import { RecentTrackingDTO } from '@/types/user';

// const TrackingPage = () => {
//     const [trackingNumber, setTrackingNumber] = useState('')
//     const [copied, setCopied] = useState(false)
//     const [activeTab, setActiveTab] = useState('current')
//     const [selectedShipping, setSelectedShipping] = useState('standard')
//     const [loading, setLoading] = useState<boolean>(true);
//     const [statusSummary, setStatusSummary] = useState<Record<string, number>>({});
//     const [error, setError] = useState<string | null>(null);
//     const [currentPkg, setCurrentPkg] = useState<DisplayTracking | null>(null);
//     const [isSearching, setIsSearching] = useState(false);
//     const printRef = useRef<HTMLDivElement>(null); // Ref for the PDF template
//     const [isSharing, setIsSharing] = useState(false);
//     const [recentTrackingList, setRecentTrackingList] = useState<RecentTrackingDTO[]>([]);
//     const [isLoadingRecent, setIsLoadingRecent] = useState(true);
//     const [recentTracking, setRecentTracking] = useState<RecentTrackingDTO[]>([]);
//     const [historyTracking, setHistoryTracking] = useState<RecentTrackingDTO[]>([]);
    
//     const [isLoading, setIsLoading] = useState(false);



//     useEffect(() => {
//         const fetchSummaryData = async () => {
//             try {
//                 setLoading(true);

//                 // Call both APIs
//                 const summaryData = await getUserBookingSummary(); // Use await here

//                 if (Array.isArray(summaryData)) {
//                     const dictionary = summaryData.reduce((acc, item) => {
//                         acc[item.status] = item.totalItems;
//                         return acc;
//                     }, {} as Record<string, number>);

//                     setStatusSummary(dictionary);
//                     console.log(statusSummary);
//                     // console.log(profile);

//                 }


//                 setError(null);
//             } catch (err: any) {
//                 setError(err.message || "Failed to sync dashboard");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSummaryData();
//     }, []);

//     // In TrackingPage.tsx

// const handleShareTracking = async () => {
//     if (!currentPkg || !printRef.current) return;
//     setIsSharing(true);

//     try {
//         // 1. Capture the component high-resolution canvas
//         const canvas = await html2canvas(printRef.current, {
//             scale: 2, // Keeps text crisp
//             useCORS: true,
//             backgroundColor: '#ffffff',
//             // Ensure it captures full height even if off-screen
//             windowHeight: printRef.current.scrollHeight 
//         });

//         const imgData = canvas.toDataURL('image/png');
        
//         // 2. Initialize PDF (A4 Portrait in millimeters)
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const imgWidth = 210; // A4 width in mm
//         const pageHeight = 800; // A4 height in mm
        
//         // Calculate the dimensions of the captured image when scaled to fit A4 width
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
//         let heightLeft = imgHeight;
//         let position = 0;

//         // 3. Add First Page
//         // addImage(data, format, x, y, width, height)
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;

//         // 4. Add subsequent pages if content overflows
//         while (heightLeft > 0) {
//             position -= pageHeight; // Shift the image upwards for the next page slice
//             pdf.addPage();
//             pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;
//         }

//         // 5. Save
//         pdf.save(`BulQ-Tracking-${currentPkg.trackingNumber}.pdf`);
//     } catch (err) {
//         console.error("PDF Generation failed", err);
//         // Optionally set an error state here to show a toast message
//     } finally {
//         setIsSharing(false);
//     }
// };

//     const handleTrackPkg = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSearching(true);

//         try {
//             const data = await getFullTracking(trackingNumber);

//             // Log this to your BROWSER console
//             console.log("Data received in frontend:", data);

//             if (data.error) {
//                 setError(data.message);
//                 setCurrentPkg(null);
//                 return;
//             }

//             const mappedData: DisplayTracking = {
//                 ...data,
//                 stages: data.events.map((event: any) => ({
//                     stage: event.eventType.replace(/_/g, ' '),
//                     date: new Date(event.eventTime).toLocaleDateString('en-US', {
//                         month: 'short', day: 'numeric', year: 'numeric'
//                     }),
//                     time: new Date(event.eventTime).toLocaleTimeString([], {
//                         hour: '2-digit', minute: '2-digit'
//                     }),
//                     description: event.description,
//                     completed: true
//                 }))
//             };

//             setCurrentPkg(mappedData);
//             setError(null);
//         } catch (err) {
//             setError("Something went wrong");
//         } finally {
//             setIsSearching(false);
//         }
//     };

//     // // 2. Load Data (No "any" mapping needed anymore)
//     // useEffect(() => {
//     //     const fetchRecent = async () => {
//     //         try {
//     //             setIsLoadingRecent(true);
//     //             const data = await getRecentTracking();
//     //             setRecentTrackingList(data); // TypeScript is happy here
//     //             console.log(data)
//     //         } catch (err) {
//     //             console.error(err);
//     //         } finally {
//     //             setIsLoadingRecent(false);
//     //         }
//     //     };

//     //     fetchRecent();
//     // }, []);
//     // Initial Load (Current)
//     useEffect(() => {
//         loadData('current');
//     }, []);

//     // 2. unified Data Loader
//     const loadData = async (type: string) => {
//         setIsLoading(true);
//         try {
//             if (type === 'current') {
//                 // We avoid re-fetching if we already have data (optional optimization)
//                 if (recentTracking.length === 0) {
//                     const data = await getRecentTracking();
//                     setRecentTracking(data);
//                 }
//             } else {
//                 // Fetch History
//                 if (historyTracking.length === 0) {
//                     const data = await getAllTrackingHistory();
//                     setHistoryTracking(data);
//                 }
//             }
//         } catch (err) {
//             console.error(err);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // 3. Tab Handler
//     const handleTabChange = (tab: string) => {
//         setActiveTab(tab);
//         loadData(tab);
//     };

//     // Helper to determine which list to show
//     const displayList = activeTab === 'current' ? recentTracking : historyTracking;

//     // Helper for status colors using strict DTO types
//     const getStatusStyle = (status: RecentTrackingDTO['deliveryStatus']) => {
//         switch (status) {
//             case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
//             case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
//             default: return 'bg-blue-100 text-blue-800 border-blue-200';
//         }
//     };



//     // const [recentTracking] = useState([
//     //     {
//     //         number: 'BULQ-123456789',
//     //         status: 'Delivered',
//     //         date: 'May 10, 2023',
//     //         statusColor: 'text-green-300',
//     //         addressType: 'home',
//     //         cost: 21.50,
//     //         items: 2,
//     //         weight: '2.5 kg'
//     //     },
//     //     {
//     //         number: 'BULQ-987654321',
//     //         status: 'In Transit',
//     //         date: 'Expected May 15, 2023',
//     //         statusColor: 'text-blue-300',
//     //         addressType: 'office',
//     //         cost: 15.75,
//     //         items: 1,
//     //         weight: '1.2 kg'
//     //     },
//     //     {
//     //         number: 'BULQ-456789123',
//     //         status: 'Delivered',
//     //         date: 'April 28, 2023',
//     //         statusColor: 'text-green-300',
//     //         addressType: 'home',
//     //         cost: 32.25,
//     //         items: 3,
//     //         weight: '4.1 kg'
//     //     }
//     // ])

//     const [currentPackage] = useState({
//         trackingNumber: 'BULQ-123456789',
//         status: 'Delivered',
//         customer: 'John Doe',
//         address: '123 Main St, New York, NY 10001',
//         addressType: 'home',
//         cost: 21.50,
//         items: 2,
//         weight: '2.5 kg',
//         dimensions: '30x20x15 cm',
//         stages: [
//             {
//                 stage: 'Order Processed',
//                 date: 'May 5, 2023',
//                 time: '10:30 AM',
//                 completed: true,
//                 description: 'Your order has been confirmed and is being prepared for shipment.'
//             },
//             {
//                 stage: 'Shipped',
//                 date: 'May 6, 2023',
//                 time: '02:15 PM',
//                 completed: true,
//                 description: 'Package has left our facility and is on its way to the carrier.'
//             },
//             {
//                 stage: 'In Transit',
//                 date: 'May 7, 2023',
//                 time: '09:45 AM',
//                 completed: true,
//                 description: 'Your package is moving through our network.'
//             },
//             {
//                 stage: 'In Warehouse',
//                 date: 'May 9, 2023',
//                 time: '11:20 AM',
//                 completed: true,
//                 description: 'Package arrived at local distribution center.'
//             },
//             {
//                 stage: 'Out for Delivery',
//                 date: 'May 10, 2023',
//                 time: '08:00 AM',
//                 completed: true,
//                 description: 'Your package is out for delivery today.'
//             },
//             {
//                 stage: 'Delivered',
//                 date: 'May 10, 2023',
//                 time: '02:30 PM',
//                 completed: true,
//                 description: 'Package has been delivered successfully.'
//             }
//         ]
//     })

//     const shippingMethods = [
//         {
//             id: 'standard',
//             label: 'Standard Shipping',
//             days: '5-7 days',
//             icon: Truck,
//             color: 'from-blue-500 to-cyan-500',
//             cost: 15.99
//         },
//         {
//             id: 'express',
//             label: 'Express Delivery',
//             days: '2-3 days',
//             icon: Zap,
//             color: 'from-emerald-500 to-green-500',
//             cost: 24.99
//         },
//         {
//             id: 'priority',
//             label: 'Priority Express',
//             days: '1-2 days',
//             icon: Sparkles,
//             color: 'from-purple-500 to-pink-500',
//             cost: 34.99
//         }
//     ]

//     const handleTrackPackage = (e: React.FormEvent) => {
//         e.preventDefault()
//         console.log('Tracking package:', trackingNumber)
//     }

//     const copyToClipboard = (text: string) => {
//         navigator.clipboard.writeText(text)
//             .then(() => {
//                 setCopied(true);
//                 setTimeout(() => setCopied(false), 2000);
//             })
//             .catch(err => {
//                 console.error('Failed to copy text: ', err);
//             });
//     };

//     const getAddressTypeIcon = (type: string) => {
//         return type === 'home' ? <Home size={16} className="text-blue-400" /> : <Building size={16} className="text-purple-400" />;
//     };

//     const getAddressTypeText = (type: string) => {
//         return type === 'home' ? 'Home Address' : 'Office Address';
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-appBanner/5 p-4 lg:p-6 relative overflow-hidden">
//             {/* Enhanced Background Elements */}
//             <div className="absolute top-0 left-0 w-96 h-96 bg-appBanner/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//             <div className="absolute top-1/2 right-0 w-80 h-80 bg-appNav/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
//             <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-appTitleBgColor/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

//             <div className="relative z-10 w-full max-w-7xl mx-auto">
//                 {/* Header Section */}
//                 <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-appTitleBgColor to-appNav p-6 md:p-8 mb-8 rounded-2xl shadow-xl min-h-[8rem]">
//                     <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
//                         <div className='flex-shrink-0'>
//                             <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-appBanner to-appNav rounded-xl flex items-center justify-center shadow-lg">
//                                 <Truck className="w-6 h-6 md:w-7 md:h-7 text-white" />
//                             </div>
//                         </div>
//                         <div className="flex flex-col">
//                             <h1 className='font-bold text-xl md:text-2xl text-white'>
//                                 Package Tracking
//                             </h1>
//                             <p className='font-medium text-sm md:text-base text-white/90 mt-1'>
//                                 Real-time updates for your BulQ shipments
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between xs:justify-end gap-3 w-full md:w-auto">
//                         <div className='flex flex-col p-2 text-white text-center'>
//                             <p className='text-sm font-semibold text-white'>
//                                 ACTIVE TRACKING
//                             </p>
//                             <p className='font-bold text-2xl md:text-3xl text-white'>
//                                 {(statusSummary['RECEIVED'] || 0) + (statusSummary['IN_TRANSIT'] || 0) + (statusSummary['AWAITING_SHIPMENT'] || 0)}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Stats Cards Section */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     {[
//                         {
//                             title: 'Active Tracking',
//                             value: (statusSummary['RECEIVED'] || 0) + (statusSummary['IN_TRANSIT'] || 0) + (statusSummary['AWAITING_SHIPMENT'] || 0),
//                             icon: <Search className="w-5 h-5 text-white" />,
//                             bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
//                             trend: '+5.2%'
//                         },
//                         {
//                             title: 'In Transit',
//                             value: statusSummary['IN_TRANSIT'] || 0,
//                             icon: <Truck className="w-5 h-5 text-white" />,
//                             bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
//                             trend: '+12.7%'
//                         },
//                         {
//                             title: 'Delivered Today',
//                             value: statusSummary['DELIVERED'] || 0,
//                             icon: <CheckCircle className="w-5 h-5 text-white" />,
//                             bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
//                             trend: '+8.3%'
//                         },
//                         {
//                             title: 'Pending Updates',
//                             value: statusSummary['PENDING'] || 0,
//                             icon: <Clock className="w-5 h-5 text-white" />,
//                             bg: 'bg-gradient-to-br from-purple-500 to-pink-600',
//                             trend: '-2.1%'
//                         },
//                     ].map((stat, index) => (
//                         <div
//                             key={index}
//                             className={`${stat.bg} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white`}
//                         >
//                             <div className="flex items-start justify-between">
//                                 <div className="flex flex-col">
//                                     <span className="text-sm font-medium opacity-90">{stat.title}</span>
//                                     <span className="mt-2 text-2xl font-bold">{stat.value}</span>
//                                     <span className="text-xs opacity-80 mt-1">{stat.trend} from yesterday</span>
//                                 </div>
//                                 <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
//                                     {stat.icon}
//                                 </div>
//                             </div>
//                             <div className="mt-4 h-1 bg-white/30 rounded-full">
//                                 <div
//                                     className="h-full bg-white/80 rounded-full"
//                                     style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
//                                 ></div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Main Content */}
//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

//                     {/* Left Column - Input & Recent */}
//                     <div className="space-y-8">
//                         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
//                             <div className="text-center mb-6">
//                                 <h2 className="text-2xl font-bold bg-gradient-to-r from-appTitleBgColor to-appNav bg-clip-text text-transparent mb-3">
//                                     Track Your Package
//                                 </h2>
//                                 <p className="text-gray-600">Enter your BulQ tracking number</p>
//                             </div>

//                             <form onSubmit={handleTrackPkg} className="relative">

//                                 <input
//                                     type="text"
//                                     value={trackingNumber}
//                                     onChange={(e) => setTrackingNumber(e.target.value)}
//                                     placeholder="e.g., BULQ-123456789"
//                                     className="w-full px-6 py-4 pl-14 text-lg border border-gray-300 rounded-xl focus:ring-3 focus:ring-appBanner/20 focus:border-appBanner transition-all"
//                                 />
//                                 <div className="absolute left-5 top-1/2 -translate-y-1/2">
//                                     <div className="w-6 h-6 bg-gradient-to-r from-appBanner to-appNav rounded-lg flex items-center justify-center">
//                                         <Search className="w-3 h-3 text-white" />
//                                     </div>
//                                 </div>
//                                 <button
//                                     disabled={isSearching}
//                                     type="submit"
//                                     className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-appBanner to-appNav text-white font-semibold rounded-lg hover:shadow-xl transition-all"
//                                 >
//                                     {isSearching ? '...' : 'Track'}
//                                 </button>
//                             </form>
//                             {/* Quick Actions - Restored */}
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//                                 <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-appBanner hover:bg-appBanner/5 transition-all duration-200 group">
//                                     <div className="w-10 h-10 bg-gradient-to-br from-appBanner to-appNav rounded-xl flex items-center justify-center">
//                                         <FileText className="w-5 h-5 text-white" />
//                                     </div>
//                                     <span className="text-sm font-medium text-gray-700 group-hover:text-appTitleBgColor">
//                                         Shipping Label
//                                     </span>
//                                 </button>
//                                 <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-appBanner hover:bg-appBanner/5 transition-all duration-200 group">
//                                     <div className="w-10 h-10 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center">
//                                         <Download className="w-5 h-5 text-white" />
//                                     </div>
//                                     <span className="text-sm font-medium text-gray-700 group-hover:text-appTitleBgColor">
//                                         Export Data
//                                     </span>
//                                 </button>
//                                 <button
//                                     onClick={handleShareTracking} // <--- CHANGE THIS: Calls the PDF generator
//                                     disabled={isSharing || !currentPkg} // <--- ADD THIS: Prevents double-clicks or clicking when empty
//                                     className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-appBanner hover:bg-appBanner/5 transition-all duration-200 group"
//                                 >
//                                     <div className="w-10 h-10 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center">
//                                         {/* ADD THIS: Loading spinner logic */}
//                                         {isSharing ? (
//                                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                                         ) : (
//                                             <Share2 className="w-5 h-5 text-white" />
//                                         )}
//                                     </div>
//                                     <span className="text-sm font-medium text-gray-700 group-hover:text-appTitleBgColor">
//                                         {isSharing ? 'Generating...' : 'Share PDF'}
//                                     </span>
//                                 </button>
//                                 {/* <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-appBanner hover:bg-appBanner/5 transition-all duration-200 group"
//                                     onClick={() => copyToClipboard(`https://yourdomain.com/track/${currentPackage?.trackingNumber}`)}
//                                 >
//                                     <div className="w-10 h-10 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center">
//                                         <Share2 className="w-5 h-5 text-white" />
//                                     </div>
//                                     <span className="text-sm font-medium text-gray-700 group-hover:text-appTitleBgColor">
//                                         Share Tracking
//                                     </span>
//                                 </button> */}
//                             </div>
//                             {error && <p className="mt-2 text-red-500 text-sm font-medium">{error}</p>}
//                         </div>
//                         {/* ... Recent Tracking (Unchanged) ... */}
//                     </div>

//                     {/* Recent Tracking Section - Restored */}
//                     <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold bg-gradient-to-r from-appTitleBgColor to-appNav bg-clip-text text-transparent">
//                     {activeTab === 'current' ? 'Recent Tracking' : 'Tracking History'}
//                 </h2>
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => handleTabChange('current')}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'current'
//                             ? 'bg-appBanner text-white shadow-lg'
//                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                         }`}
//                     >
//                         Current
//                     </button>
//                     <button
//                         onClick={() => handleTabChange('history')}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'history'
//                             ? 'bg-appBanner text-white shadow-lg'
//                             : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                         }`}
//                     >
//                         History
//                     </button>
//                 </div>
//             </div>

//             <div className="space-y-4">
//                 {isLoading && (
//                     <div className="text-center py-8 text-gray-400 text-sm animate-pulse">
//                         Loading records...
//                     </div>
//                 )}

//                 {!isLoading && displayList.length === 0 && (
//                     <div className="text-center py-8 text-gray-400 text-sm italic">
//                         No {activeTab} records found.
//                     </div>
//                 )}

//                 {/* 4. Unified List Rendering */}
//                 {!isLoading && displayList.map((item) => (
//                     <div
//                         key={item.trackingNumber}
//                         onClick={() => setTrackingNumber(item.trackingNumber)}
//                         className="group bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-appBanner/50 p-5 transition-all duration-200 hover:shadow-lg cursor-pointer hover:-translate-y-1"
//                     >
//                         <div className="flex justify-between items-center">
//                             <div className="flex items-center gap-4">
//                                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-110 ${
//                                     activeTab === 'history' 
//                                     ? 'bg-gray-100 border-gray-200' 
//                                     : 'bg-gradient-to-br from-appBanner/20 to-appNav/20 border-appBanner/30'
//                                 }`}>
//                                     <Package className={`w-6 h-6 ${activeTab === 'history' ? 'text-gray-400' : 'text-appBanner'}`} />
//                                 </div>
//                                 <div>
//                                     <p className="font-bold text-gray-900 text-lg">{item.trackingNumber}</p>
//                                     <div className="flex items-center gap-3 mt-1">
//                                         <span className={`px-2 py-1 text-xs font-bold rounded-full border ${
//                                             item.deliveryStatus === 'DELIVERED'
//                                                 ? 'bg-green-100 text-green-800 border-green-200'
//                                                 : 'bg-blue-100 text-blue-800 border-blue-200'
//                                         }`}>
//                                             {item.deliveryStatus}
//                                         </span>
//                                         <div className="flex items-center gap-1 text-gray-500 text-sm">
//                                             {getAddressTypeIcon('home')}
//                                             <span>{item.destinationCity}</span>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//                                         <span>{item.numberOfItems} items</span>
//                                         <span>•</span>
//                                         <span>{item.weight}kg</span>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="text-right">
//                                 <p className="text-gray-500 text-sm">
//                                     {new Date(item.lastUpdated).toLocaleDateString()}
//                                 </p>
//                                 <p className="text-appBanner font-bold text-lg">${item.amount.toFixed(2)}</p>
//                                 <button className="text-appBanner hover:text-appNav font-medium text-sm mt-1 flex items-center gap-1">
//                                     View Details
//                                     <ArrowRight className="w-3 h-3" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//                     {/* <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold bg-gradient-to-r from-appTitleBgColor to-appNav bg-clip-text text-transparent">
//                     Recent Tracking
//                 </h2>
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => setActiveTab('current')}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'current' ? 'bg-appBanner text-white' : 'bg-gray-100 text-gray-600'}`}
//                     >
//                         Current
//                     </button>
//                     <button onClick={() => console.log("History clicked")} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600">
//                         History
//                     </button>
//                 </div>
//             </div> */}

//             <div className="space-y-4">
//                 {/* 3. Render List using DTO properties directly */}
//                 {activeTab === 'current' && recentTrackingList.map((item) => (
//                     <div
//                         key={item.trackingNumber} // API field: trackingNumber
//                         onClick={() => setTrackingNumber(item.trackingNumber)}
//                         className="group bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-appBanner/50 p-5 transition-all duration-200 hover:shadow-lg cursor-pointer hover:-translate-y-1"
//                     >
//                         <div className="flex justify-between items-center">
//                             <div className="flex items-center gap-4">
//                                 <div className="w-12 h-12 bg-gradient-to-br from-appBanner/20 to-appNav/20 rounded-xl flex items-center justify-center border border-appBanner/30 group-hover:scale-110 transition-transform duration-200">
//                                     <Package className="w-6 h-6 text-appBanner" />
//                                 </div>
//                                 <div>
//                                     {/* API field: trackingNumber */}
//                                     <p className="font-bold text-gray-900 text-lg">{item.trackingNumber}</p>
                                    
//                                     <div className="flex items-center gap-3 mt-1">
//                                         {/* API field: deliveryStatus */}
//                                         <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusStyle(item.deliveryStatus)}`}>
//                                             {item.deliveryStatus}
//                                         </span>
//                                         <div className="flex items-center gap-1 text-gray-500 text-sm">
//                                             {/* We hardcode 'home' icon for now since API doesn't have addressType yet */}
//                                             {getAddressTypeIcon('home')}
//                                             {/* API field: destinationCity */}
//                                             <span>{item.destinationCity}</span>
//                                         </div>
//                                     </div>
                                    
//                                     <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//                                         {/* API field: numberOfItems */}
//                                         <span>{item.numberOfItems} items</span>
//                                         <span>•</span>
//                                         {/* API field: weight */}
//                                         <span>{item.weight}kg</span>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="text-right">
//                                 {/* API field: lastUpdated (Formatted) */}
//                                 <p className="text-gray-500 text-sm">
//                                     {new Date(item.lastUpdated).toLocaleDateString()}
//                                 </p>
//                                 {/* API field: amount */}
//                                 <p className="text-appBanner font-bold text-lg">
//                                     ${item.amount.toFixed(2)}
//                                 </p>
//                                 <button className="text-appBanner hover:text-appNav font-medium text-sm mt-1 flex items-center gap-1">
//                                     View Details
//                                     <ArrowRight className="w-3 h-3" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//                     {/* Right Column - Dynamic Details */}
//                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit sticky top-8 min-h-[500px]">
//                         {!currentPkg && !isSearching ? (
//                             <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
//                                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200">
//                                     <Search className="w-8 h-8 text-gray-300" />
//                                 </div>
//                                 <h3 className="text-lg font-bold text-gray-900 text-appNav">No Package Tracked</h3>
//                                 <p className="text-gray-500 text-sm">Enter a number to see live updates</p>
//                             </div>
//                         ) : (
//                             <div className={isSearching ? "animate-pulse opacity-50" : ""}>
//                                 {/* Header with real tracking number */}
//                                 <div className="bg-gradient-to-r from-appTitleBgColor to-appNav p-8 text-white">
//                                     <h2 className="text-2xl font-bold mb-4">Package Details</h2>
//                                     <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 flex justify-between items-center">
//                                         <div>
//                                             <p className="text-xs text-white/70 uppercase">Tracking Number</p>
//                                             <p className="text-xl font-bold">{currentPkg?.trackingNumber}</p>
//                                         </div>
//                                         <button onClick={() => {/* copy */ }} className="p-2 bg-white/20 rounded-lg hover:bg-white/30"><Copy size={16} /></button>
//                                     </div>
//                                 </div>

//                                 {/* Package Info using API response */}
//                                 <div className="p-6 border-b border-gray-200">
//                                     <div className="grid gap-4">
//                                         {/* Destination Section */}
//                                         <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                             <div className="w-12 h-12 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center text-white">
//                                                 <MapPin className="w-6 h-6" />
//                                             </div>
//                                             <div className="flex-1">
//                                                 <h3 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wider">Currently Located In</h3>
//                                                 <p className="text-gray-900 font-bold">{currentPkg?.currentLocation}</p>
//                                                 <p className="text-gray-500 text-xs">Last Scan: {new Date(currentPkg?.lastUpdated || '').toLocaleString()}</p>
//                                             </div>
//                                         </div>

//                                         {/* Status and Estimated Time */}
//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                                 <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
//                                                     <Truck className="w-5 h-5 text-white" />
//                                                 </div>
//                                                 <div>
//                                                     <h3 className="text-xs font-bold text-gray-500 uppercase">Status</h3>
//                                                     <div className="flex items-center gap-2">
//                                                         <div className="w-2 h-2 bg-appBanner rounded-full animate-pulse"></div>
//                                                         <span className="text-appBanner font-bold text-sm uppercase">
//                                                             {currentPkg?.currentStatus.replace(/_/g, ' ')}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                                 <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
//                                                     <Clock className="w-5 h-5 text-white" />
//                                                 </div>
//                                                 <div>
//                                                     <h3 className="text-xs font-bold text-gray-500 uppercase">Est. Arrival</h3>
//                                                     <p className="text-appBanner font-bold text-sm">
//                                                         {currentPkg?.estimatedDaysRemaining ? `${currentPkg.estimatedDaysRemaining} Days` : 'Calculated'}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Physical Attributes Row (Restored) */}
//                                         <div className="grid grid-cols-3 gap-4 text-center">
//                                             <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                                                 <p className="text-[10px] text-gray-500 uppercase font-bold">Items</p>
//                                                 <p className="font-bold text-gray-900">1</p>
//                                             </div>
//                                             <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                                                 <p className="text-[10px] text-gray-500 uppercase font-bold">Total Weight</p>
//                                                 <p className="font-bold text-gray-900">{currentPkg?.totalWeight ? `${currentPkg.totalWeight} kg` : ' kg'}</p>
//                                             </div>
//                                             <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                                                 <p className="text-[10px] text-gray-500 uppercase font-bold">Service</p>
//                                                 <p className="font-bold text-gray-900 text-xs">Standard</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Dynamic Timeline */}
//                                 <div className="p-6">
//                                     <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
//                                         <div className="w-2 h-6 bg-gradient-to-b from-appBanner to-appNav rounded-full"></div>
//                                         Tracking History
//                                     </h3>
//                                     <div className="relative space-y-6">
//                                         <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100"></div>
//                                         {currentPkg?.stages.map((stage, idx) => (
//                                             <div key={idx} className="relative flex items-start group">
//                                                 <div className="absolute left-[1.35rem] w-3 h-3 rounded-full bg-appBanner border-2 border-white z-10" />
//                                                 <div className="ml-10 flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
//                                                     <div className="flex justify-between items-center mb-1">
//                                                         <h4 className="font-bold text-sm text-gray-900">{stage.stage}</h4>
//                                                         <span className="text-[10px] text-gray-400 font-medium">{stage.date}</span>
//                                                     </div>
//                                                     <p className="text-gray-600 text-xs">{stage.description}</p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Custom CSS for animation delays */}
//             <style jsx>{`
//                 .animation-delay-2000 {
//                     animation-delay: 2s;
//                 }
//                 .animation-delay-4000 {
//                     animation-delay: 4s;
//                 }
//             `}</style>

//             {/* HIDDEN TEMPLATE - Add this at the bottom of your JSX */}
//             <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
//                 <TrackingPdfTemplate ref={printRef} data={currentPkg} />
//             </div>
//         </div>
//     )
// }

// export default TrackingPage