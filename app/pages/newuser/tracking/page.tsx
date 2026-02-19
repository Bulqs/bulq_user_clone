'use client';

import React, { useEffect, useState } from 'react';
import {
    Truck,
    Package,
    MapPin,
    Calendar,
    Clock,
    CheckCircle,
    Home,
    Building,
    Search,
    Copy,
    ChevronDown,
    Sparkles,
    Zap,
    ArrowRight,
    Plus,
    Layers,
    Box,
    FileText,
    Download,
    Share2,
    Phone,
    Mail
} from 'lucide-react';
import Image from 'next/image';
import { getAllTrackingHistory, getRecentTracking, getUserBookingSummary } from '@/lib/user/booking.actions';
import { DisplayTracking, FullTrackingResponseDTO, TrackingEvent } from '@/types/driver';
import { getFullTracking } from '@/lib/driver/trackpackage.actions';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import TrackingPdfTemplate from '@/app/components/tracking/TrackingPdfTemplate';
import { RecentTrackingDTO } from '@/types/user';

const TrackingPage = () => {
    const [trackingNumber, setTrackingNumber] = useState('')
    const [copied, setCopied] = useState(false)
    const [activeTab, setActiveTab] = useState('current')
    const [selectedShipping, setSelectedShipping] = useState('standard')
    const [loading, setLoading] = useState<boolean>(true);
    const [statusSummary, setStatusSummary] = useState<Record<string, number>>({});
    const [error, setError] = useState<string | null>(null);
    const [currentPkg, setCurrentPkg] = useState<DisplayTracking | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const printRef = useRef<HTMLDivElement>(null); // Ref for the PDF template
    const [isSharing, setIsSharing] = useState(false);
    const [recentTrackingList, setRecentTrackingList] = useState<RecentTrackingDTO[]>([]);
    const [isLoadingRecent, setIsLoadingRecent] = useState(true);
    const [recentTracking, setRecentTracking] = useState<RecentTrackingDTO[]>([]);
    const [historyTracking, setHistoryTracking] = useState<RecentTrackingDTO[]>([]);
    
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                setLoading(true);

                // Call both APIs
                const summaryData = await getUserBookingSummary(); // Use await here

                if (Array.isArray(summaryData)) {
                    const dictionary = summaryData.reduce((acc, item) => {
                        acc[item.status] = item.totalItems;
                        return acc;
                    }, {} as Record<string, number>);

                    setStatusSummary(dictionary);
                    console.log(statusSummary);
                    // console.log(profile);

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

    // In TrackingPage.tsx

const handleShareTracking = async () => {
    if (!currentPkg || !printRef.current) return;
    setIsSharing(true);

    try {
        // 1. Capture the component high-resolution canvas
        const canvas = await html2canvas(printRef.current, {
            scale: 2, // Keeps text crisp
            useCORS: true,
            backgroundColor: '#ffffff',
            // Ensure it captures full height even if off-screen
            windowHeight: printRef.current.scrollHeight 
        });

        const imgData = canvas.toDataURL('image/png');
        
        // 2. Initialize PDF (A4 Portrait in millimeters)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 800; // A4 height in mm
        
        // Calculate the dimensions of the captured image when scaled to fit A4 width
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        // 3. Add First Page
        // addImage(data, format, x, y, width, height)
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // 4. Add subsequent pages if content overflows
        while (heightLeft > 0) {
            position -= pageHeight; // Shift the image upwards for the next page slice
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // 5. Save
        pdf.save(`BulQ-Tracking-${currentPkg.trackingNumber}.pdf`);
    } catch (err) {
        console.error("PDF Generation failed", err);
        // Optionally set an error state here to show a toast message
    } finally {
        setIsSharing(false);
    }
};

    const handleTrackPkg = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);

        try {
            const data = await getFullTracking(trackingNumber);

            // Log this to your BROWSER console
            console.log("Data received in frontend:", data);

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
            setError("Something went wrong");
        } finally {
            setIsSearching(false);
        }
    };

    // // 2. Load Data (No "any" mapping needed anymore)
    // useEffect(() => {
    //     const fetchRecent = async () => {
    //         try {
    //             setIsLoadingRecent(true);
    //             const data = await getRecentTracking();
    //             setRecentTrackingList(data); // TypeScript is happy here
    //             console.log(data)
    //         } catch (err) {
    //             console.error(err);
    //         } finally {
    //             setIsLoadingRecent(false);
    //         }
    //     };

    //     fetchRecent();
    // }, []);
    // Initial Load (Current)
    useEffect(() => {
        loadData('current');
    }, []);

    // 2. unified Data Loader
    const loadData = async (type: string) => {
        setIsLoading(true);
        try {
            if (type === 'current') {
                // We avoid re-fetching if we already have data (optional optimization)
                if (recentTracking.length === 0) {
                    const data = await getRecentTracking();
                    setRecentTracking(data);
                }
            } else {
                // Fetch History
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

    // 3. Tab Handler
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        loadData(tab);
    };

    // Helper to determine which list to show
    const displayList = activeTab === 'current' ? recentTracking : historyTracking;

    // Helper for status colors using strict DTO types
    const getStatusStyle = (status: RecentTrackingDTO['deliveryStatus']) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };



    // const [recentTracking] = useState([
    //     {
    //         number: 'BULQ-123456789',
    //         status: 'Delivered',
    //         date: 'May 10, 2023',
    //         statusColor: 'text-green-300',
    //         addressType: 'home',
    //         cost: 21.50,
    //         items: 2,
    //         weight: '2.5 kg'
    //     },
    //     {
    //         number: 'BULQ-987654321',
    //         status: 'In Transit',
    //         date: 'Expected May 15, 2023',
    //         statusColor: 'text-blue-300',
    //         addressType: 'office',
    //         cost: 15.75,
    //         items: 1,
    //         weight: '1.2 kg'
    //     },
    //     {
    //         number: 'BULQ-456789123',
    //         status: 'Delivered',
    //         date: 'April 28, 2023',
    //         statusColor: 'text-green-300',
    //         addressType: 'home',
    //         cost: 32.25,
    //         items: 3,
    //         weight: '4.1 kg'
    //     }
    // ])

    const [currentPackage] = useState({
        trackingNumber: 'BULQ-123456789',
        status: 'Delivered',
        customer: 'John Doe',
        address: '123 Main St, New York, NY 10001',
        addressType: 'home',
        cost: 21.50,
        items: 2,
        weight: '2.5 kg',
        dimensions: '30x20x15 cm',
        stages: [
            {
                stage: 'Order Processed',
                date: 'May 5, 2023',
                time: '10:30 AM',
                completed: true,
                description: 'Your order has been confirmed and is being prepared for shipment.'
            },
            {
                stage: 'Shipped',
                date: 'May 6, 2023',
                time: '02:15 PM',
                completed: true,
                description: 'Package has left our facility and is on its way to the carrier.'
            },
            {
                stage: 'In Transit',
                date: 'May 7, 2023',
                time: '09:45 AM',
                completed: true,
                description: 'Your package is moving through our network.'
            },
            {
                stage: 'In Warehouse',
                date: 'May 9, 2023',
                time: '11:20 AM',
                completed: true,
                description: 'Package arrived at local distribution center.'
            },
            {
                stage: 'Out for Delivery',
                date: 'May 10, 2023',
                time: '08:00 AM',
                completed: true,
                description: 'Your package is out for delivery today.'
            },
            {
                stage: 'Delivered',
                date: 'May 10, 2023',
                time: '02:30 PM',
                completed: true,
                description: 'Package has been delivered successfully.'
            }
        ]
    })

    const shippingMethods = [
        {
            id: 'standard',
            label: 'Standard Shipping',
            days: '5-7 days',
            icon: Truck,
            color: 'from-blue-500 to-cyan-500',
            cost: 15.99
        },
        {
            id: 'express',
            label: 'Express Delivery',
            days: '2-3 days',
            icon: Zap,
            color: 'from-emerald-500 to-green-500',
            cost: 24.99
        },
        {
            id: 'priority',
            label: 'Priority Express',
            days: '1-2 days',
            icon: Sparkles,
            color: 'from-purple-500 to-pink-500',
            cost: 34.99
        }
    ]

    const handleTrackPackage = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Tracking package:', trackingNumber)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    const getAddressTypeIcon = (type: string) => {
        return type === 'home' ? <Home size={16} className="text-blue-400" /> : <Building size={16} className="text-purple-400" />;
    };

    const getAddressTypeText = (type: string) => {
        return type === 'home' ? 'Home Address' : 'Office Address';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-appBanner/5 p-4 lg:p-6 relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-appBanner/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-appNav/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-appTitleBgColor/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-appTitleBgColor to-appNav p-6 md:p-8 mb-8 rounded-2xl shadow-xl min-h-[8rem]">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                        <div className='flex-shrink-0'>
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-appBanner to-appNav rounded-xl flex items-center justify-center shadow-lg">
                                <Truck className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className='font-bold text-xl md:text-2xl text-white'>
                                Package Tracking
                            </h1>
                            <p className='font-medium text-sm md:text-base text-white/90 mt-1'>
                                Real-time updates for your BulQ shipments
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between xs:justify-end gap-3 w-full md:w-auto">
                        <div className='flex flex-col p-2 text-white text-center'>
                            <p className='text-sm font-semibold text-white'>
                                ACTIVE TRACKING
                            </p>
                            <p className='font-bold text-2xl md:text-3xl text-white'>
                                {(statusSummary['RECEIVED'] || 0) + (statusSummary['IN_TRANSIT'] || 0) + (statusSummary['AWAITING_SHIPMENT'] || 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: 'Active Tracking',
                            value: (statusSummary['RECEIVED'] || 0) + (statusSummary['IN_TRANSIT'] || 0) + (statusSummary['AWAITING_SHIPMENT'] || 0),
                            icon: <Search className="w-5 h-5 text-white" />,
                            bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
                            trend: '+5.2%'
                        },
                        {
                            title: 'In Transit',
                            value: statusSummary['IN_TRANSIT'] || 0,
                            icon: <Truck className="w-5 h-5 text-white" />,
                            bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
                            trend: '+12.7%'
                        },
                        {
                            title: 'Delivered Today',
                            value: statusSummary['DELIVERED'] || 0,
                            icon: <CheckCircle className="w-5 h-5 text-white" />,
                            bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
                            trend: '+8.3%'
                        },
                        {
                            title: 'Pending Updates',
                            value: statusSummary['PENDING'] || 0,
                            icon: <Clock className="w-5 h-5 text-white" />,
                            bg: 'bg-gradient-to-br from-purple-500 to-pink-600',
                            trend: '-2.1%'
                        },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className={`${stat.bg} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium opacity-90">{stat.title}</span>
                                    <span className="mt-2 text-2xl font-bold">{stat.value}</span>
                                    <span className="text-xs opacity-80 mt-1">{stat.trend} from yesterday</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="mt-4 h-1 bg-white/30 rounded-full">
                                <div
                                    className="h-full bg-white/80 rounded-full"
                                    style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* Left Column - Input & Recent */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-appTitleBgColor to-appNav bg-clip-text text-transparent mb-3">
                                    Track Your Package
                                </h2>
                                <p className="text-gray-600">Enter your BulQ tracking number</p>
                            </div>

                            <form onSubmit={handleTrackPkg} className="relative">

                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="e.g., BULQ-123456789"
                                    className="w-full px-6 py-4 pl-14 text-lg border border-gray-300 rounded-xl focus:ring-3 focus:ring-appBanner/20 focus:border-appBanner transition-all"
                                />
                                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-appBanner to-appNav rounded-lg flex items-center justify-center">
                                        <Search className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                                <button
                                    disabled={isSearching}
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-appBanner to-appNav text-white font-semibold rounded-lg hover:shadow-xl transition-all"
                                >
                                    {isSearching ? '...' : 'Track'}
                                </button>
                            </form>
                            {/* Quick Actions - Restored */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-appBanner hover:bg-appBanner/5 transition-all duration-200 group">
                                    <div className="w-10 h-10 bg-gradient-to-br from-appBanner to-appNav rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-appTitleBgColor">
                                        Shipping Label
                                    </span>
                                </button>
                                <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-appBanner hover:bg-appBanner/5 transition-all duration-200 group">
                                    <div className="w-10 h-10 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center">
                                        <Download className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-appTitleBgColor">
                                        Export Data
                                    </span>
                                </button>
                                <button
                                    onClick={handleShareTracking} // <--- CHANGE THIS: Calls the PDF generator
                                    disabled={isSharing || !currentPkg} // <--- ADD THIS: Prevents double-clicks or clicking when empty
                                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-appBanner hover:bg-appBanner/5 transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center">
                                        {/* ADD THIS: Loading spinner logic */}
                                        {isSharing ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Share2 className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-appTitleBgColor">
                                        {isSharing ? 'Generating...' : 'Share PDF'}
                                    </span>
                                </button>
                                {/* <button className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-appBanner hover:bg-appBanner/5 transition-all duration-200 group"
                                    onClick={() => copyToClipboard(`https://yourdomain.com/track/${currentPackage?.trackingNumber}`)}
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center">
                                        <Share2 className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-appTitleBgColor">
                                        Share Tracking
                                    </span>
                                </button> */}
                            </div>
                            {error && <p className="mt-2 text-red-500 text-sm font-medium">{error}</p>}
                        </div>
                        {/* ... Recent Tracking (Unchanged) ... */}
                    </div>

                    {/* Recent Tracking Section - Restored */}
                    <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-appTitleBgColor to-appNav bg-clip-text text-transparent">
                    {activeTab === 'current' ? 'Recent Tracking' : 'Tracking History'}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleTabChange('current')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'current'
                            ? 'bg-appBanner text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Current
                    </button>
                    <button
                        onClick={() => handleTabChange('history')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'history'
                            ? 'bg-appBanner text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        History
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading && (
                    <div className="text-center py-8 text-gray-400 text-sm animate-pulse">
                        Loading records...
                    </div>
                )}

                {!isLoading && displayList.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm italic">
                        No {activeTab} records found.
                    </div>
                )}

                {/* 4. Unified List Rendering */}
                {!isLoading && displayList.map((item) => (
                    <div
                        key={item.trackingNumber}
                        onClick={() => setTrackingNumber(item.trackingNumber)}
                        className="group bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-appBanner/50 p-5 transition-all duration-200 hover:shadow-lg cursor-pointer hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-110 ${
                                    activeTab === 'history' 
                                    ? 'bg-gray-100 border-gray-200' 
                                    : 'bg-gradient-to-br from-appBanner/20 to-appNav/20 border-appBanner/30'
                                }`}>
                                    <Package className={`w-6 h-6 ${activeTab === 'history' ? 'text-gray-400' : 'text-appBanner'}`} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-lg">{item.trackingNumber}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${
                                            item.deliveryStatus === 'DELIVERED'
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-blue-100 text-blue-800 border-blue-200'
                                        }`}>
                                            {item.deliveryStatus}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                            {getAddressTypeIcon('home')}
                                            <span>{item.destinationCity}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span>{item.numberOfItems} items</span>
                                        <span>•</span>
                                        <span>{item.weight}kg</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-sm">
                                    {new Date(item.lastUpdated).toLocaleDateString()}
                                </p>
                                <p className="text-appBanner font-bold text-lg">${item.amount.toFixed(2)}</p>
                                <button className="text-appBanner hover:text-appNav font-medium text-sm mt-1 flex items-center gap-1">
                                    View Details
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
                    {/* <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-appTitleBgColor to-appNav bg-clip-text text-transparent">
                    Recent Tracking
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('current')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'current' ? 'bg-appBanner text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        Current
                    </button>
                    <button onClick={() => console.log("History clicked")} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600">
                        History
                    </button>
                </div>
            </div> */}

            <div className="space-y-4">
                {/* 3. Render List using DTO properties directly */}
                {activeTab === 'current' && recentTrackingList.map((item) => (
                    <div
                        key={item.trackingNumber} // API field: trackingNumber
                        onClick={() => setTrackingNumber(item.trackingNumber)}
                        className="group bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-appBanner/50 p-5 transition-all duration-200 hover:shadow-lg cursor-pointer hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-appBanner/20 to-appNav/20 rounded-xl flex items-center justify-center border border-appBanner/30 group-hover:scale-110 transition-transform duration-200">
                                    <Package className="w-6 h-6 text-appBanner" />
                                </div>
                                <div>
                                    {/* API field: trackingNumber */}
                                    <p className="font-bold text-gray-900 text-lg">{item.trackingNumber}</p>
                                    
                                    <div className="flex items-center gap-3 mt-1">
                                        {/* API field: deliveryStatus */}
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusStyle(item.deliveryStatus)}`}>
                                            {item.deliveryStatus}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                            {/* We hardcode 'home' icon for now since API doesn't have addressType yet */}
                                            {getAddressTypeIcon('home')}
                                            {/* API field: destinationCity */}
                                            <span>{item.destinationCity}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        {/* API field: numberOfItems */}
                                        <span>{item.numberOfItems} items</span>
                                        <span>•</span>
                                        {/* API field: weight */}
                                        <span>{item.weight}kg</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                {/* API field: lastUpdated (Formatted) */}
                                <p className="text-gray-500 text-sm">
                                    {new Date(item.lastUpdated).toLocaleDateString()}
                                </p>
                                {/* API field: amount */}
                                <p className="text-appBanner font-bold text-lg">
                                    ${item.amount.toFixed(2)}
                                </p>
                                <button className="text-appBanner hover:text-appNav font-medium text-sm mt-1 flex items-center gap-1">
                                    View Details
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

                    {/* Right Column - Dynamic Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit sticky top-8 min-h-[500px]">
                        {!currentPkg && !isSearching ? (
                            <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-gray-200">
                                    <Search className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 text-appNav">No Package Tracked</h3>
                                <p className="text-gray-500 text-sm">Enter a number to see live updates</p>
                            </div>
                        ) : (
                            <div className={isSearching ? "animate-pulse opacity-50" : ""}>
                                {/* Header with real tracking number */}
                                <div className="bg-gradient-to-r from-appTitleBgColor to-appNav p-8 text-white">
                                    <h2 className="text-2xl font-bold mb-4">Package Details</h2>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-white/70 uppercase">Tracking Number</p>
                                            <p className="text-xl font-bold">{currentPkg?.trackingNumber}</p>
                                        </div>
                                        <button onClick={() => {/* copy */ }} className="p-2 bg-white/20 rounded-lg hover:bg-white/30"><Copy size={16} /></button>
                                    </div>
                                </div>

                                {/* Package Info using API response */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="grid gap-4">
                                        {/* Destination Section */}
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div className="w-12 h-12 bg-gradient-to-br from-appBanner to-appNav rounded-lg flex items-center justify-center text-white">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wider">Currently Located In</h3>
                                                <p className="text-gray-900 font-bold">{currentPkg?.currentLocation}</p>
                                                <p className="text-gray-500 text-xs">Last Scan: {new Date(currentPkg?.lastUpdated || '').toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {/* Status and Estimated Time */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                                                    <Truck className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-bold text-gray-500 uppercase">Status</h3>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-appBanner rounded-full animate-pulse"></div>
                                                        <span className="text-appBanner font-bold text-sm uppercase">
                                                            {currentPkg?.currentStatus.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xs font-bold text-gray-500 uppercase">Est. Arrival</h3>
                                                    <p className="text-appBanner font-bold text-sm">
                                                        {currentPkg?.estimatedDaysRemaining ? `${currentPkg.estimatedDaysRemaining} Days` : 'Calculated'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Physical Attributes Row (Restored) */}
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Items</p>
                                                <p className="font-bold text-gray-900">1</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Total Weight</p>
                                                <p className="font-bold text-gray-900">{currentPkg?.totalWeight ? `${currentPkg.totalWeight} kg` : ' kg'}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Service</p>
                                                <p className="font-bold text-gray-900 text-xs">Standard</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Timeline */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-gradient-to-b from-appBanner to-appNav rounded-full"></div>
                                        Tracking History
                                    </h3>
                                    <div className="relative space-y-6">
                                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                                        {currentPkg?.stages.map((stage, idx) => (
                                            <div key={idx} className="relative flex items-start group">
                                                <div className="absolute left-[1.35rem] w-3 h-3 rounded-full bg-appBanner border-2 border-white z-10" />
                                                <div className="ml-10 flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h4 className="font-bold text-sm text-gray-900">{stage.stage}</h4>
                                                        <span className="text-[10px] text-gray-400 font-medium">{stage.date}</span>
                                                    </div>
                                                    <p className="text-gray-600 text-xs">{stage.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom CSS for animation delays */}
            <style jsx>{`
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>

            {/* HIDDEN TEMPLATE - Add this at the bottom of your JSX */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <TrackingPdfTemplate ref={printRef} data={currentPkg} />
            </div>
        </div>
    )
}

export default TrackingPage