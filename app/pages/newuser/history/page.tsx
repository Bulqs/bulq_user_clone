'use client';

import React, { useEffect, useState } from 'react';
import {
    Truck,
    Package,
    MapPin,
    Calendar,
    CheckCircle,
    Home,
    Building,
    Copy,
    Filter,
    Download,
    Eye,
    Search,
    ChevronDown,
    FileText,
    Printer,
    Share2
} from 'lucide-react';
import { RecentTrackingDTO } from '@/types/user';
import { TrackingStatisticsDTO } from '@/types/driver';
import { getAllTrackingHistory, getTrackingStatistics } from '@/lib/user/booking.actions';

const ShippingHistoryPage = () => {
    const [copied, setCopied] = useState(false)
    const [filterStatus, setFilterStatus] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedShipments, setSelectedShipments] = useState<number[]>([])

    // 2. State Management for API Data
    const [shipmentHistori, setShipmentHistori] = useState<RecentTrackingDTO[]>([]);
    const [stats, setStats] = useState<TrackingStatisticsDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 3. Fetch Data on Mount
    useEffect(() => {
        const loadPageData = async () => {
            setIsLoading(true);
            try {
                // Fetch both concurrently for speed
                const [historyData, statsData] = await Promise.all([
                    getAllTrackingHistory(),
                    getTrackingStatistics()
                ]);
                setShipmentHistori(historyData);
                setStats(statsData);
                console.log(statsData)
                console.log(historyData)
            } catch (err) {
                console.error("Failed to load history page", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadPageData();
    }, []);



    // const [shipmentHistory] = useState([
    //     {
    //         id: 1,
    //         packageId: 'BULQ-236677',
    //         trackingNumber: 'BULQ-123456789',
    //         date: 'May 10, 2023 - 10:30 AM',
    //         itemsCount: 2,
    //         addressType: 'home',
    //         address: '123 Main St, New York, NY 10001',
    //         customer: 'John Doe',
    //         vendor: 'Amazon',
    //         cost: 21.50,
    //         status: 'delivered',
    //         weight: '2.5 kg',
    //         dimensions: '30x20x15 cm',
    //         deliveryTime: '2-3 days'
    //     },
    //     {
    //         id: 2,
    //         packageId: 'BULQ-236678',
    //         trackingNumber: 'BULQ-987654321',
    //         date: 'May 8, 2023 - 2:15 PM',
    //         itemsCount: 1,
    //         addressType: 'office',
    //         address: '456 Business Ave, Suite 100, Chicago, IL 60601',
    //         customer: 'Sarah Wilson',
    //         vendor: 'Best Buy',
    //         cost: 15.75,
    //         status: 'delivered',
    //         weight: '1.2 kg',
    //         dimensions: '25x15x10 cm',
    //         deliveryTime: '1-2 days'
    //     },
    //     {
    //         id: 3,
    //         packageId: 'BULQ-236679',
    //         trackingNumber: 'BULQ-456789123',
    //         date: 'May 5, 2023 - 9:45 AM',
    //         itemsCount: 3,
    //         addressType: 'home',
    //         address: '789 Park Road, Los Angeles, CA 90210',
    //         customer: 'Mike Johnson',
    //         vendor: 'Walmart',
    //         cost: 32.25,
    //         status: 'delivered',
    //         weight: '4.1 kg',
    //         dimensions: '40x30x25 cm',
    //         deliveryTime: '3-4 days'
    //     },
    //     {
    //         id: 4,
    //         packageId: 'BULQ-236680',
    //         trackingNumber: 'BULQ-789123456',
    //         date: 'May 2, 2023 - 4:30 PM',
    //         itemsCount: 1,
    //         addressType: 'home',
    //         address: '321 Oak Street, Miami, FL 33101',
    //         customer: 'Emily Davis',
    //         vendor: 'Target',
    //         cost: 12.99,
    //         status: 'delivered',
    //         weight: '0.8 kg',
    //         dimensions: '20x15x8 cm',
    //         deliveryTime: '2-3 days'
    //     },
    //     {
    //         id: 5,
    //         packageId: 'BULQ-236681',
    //         trackingNumber: 'BULQ-159753486',
    //         date: 'April 28, 2023 - 11:20 AM',
    //         itemsCount: 4,
    //         addressType: 'office',
    //         address: '654 Corporate Blvd, Boston, MA 02101',
    //         customer: 'David Brown',
    //         vendor: 'Apple',
    //         cost: 45.80,
    //         status: 'delivered',
    //         weight: '3.7 kg',
    //         dimensions: '35x25x20 cm',
    //         deliveryTime: '1-2 days'
    //     },
    //     {
    //         id: 6,
    //         packageId: 'BULQ-236682',
    //         trackingNumber: 'BULQ-357159486',
    //         date: 'April 25, 2023 - 3:45 PM',
    //         itemsCount: 2,
    //         addressType: 'home',
    //         address: '987 Pine Lane, Seattle, WA 98101',
    //         customer: 'Lisa Garcia',
    //         vendor: 'Amazon',
    //         cost: 28.90,
    //         status: 'delivered',
    //         weight: '2.8 kg',
    //         dimensions: '32x22x18 cm',
    //         deliveryTime: '4-5 days'
    //     }
    // ])

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

    const getAddressTypeIcon = (type?: string) => {
        // Safety: If type is missing, return a generic MapPin icon
        if (!type) return <MapPin size={16} className="text-gray-400" />;

        // Check for 'OFFICE' (case-insensitive just to be safe)
        return type.toUpperCase() === 'OFFICE'
            ? <Building size={16} className="text-purple-400" />
            : <Home size={16} className="text-blue-400" />;
    };

    const getAddressTypeText = (type?: string) => {
        if (!type) return 'Standard Delivery'; // Default text
        return type.toUpperCase() === 'OFFICE' ? 'Office Address' : 'Home Address';
    };

    // const filteredHistory = shipmentHistory.filter(shipment => {
    //     const matchesStatus = filterStatus === 'all' || shipment.addressType === filterStatus;
    //     const matchesSearch = searchTerm === '' ||
    //         shipment.packageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         shipment.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    //     return matchesStatus && matchesSearch;
    // });

    // 4. Update Filter Logic for API Fields
    const filteredHistory = shipmentHistori.filter(shipment => {
        // Note: API doesn't have addressType on list items yet, so we skip status filter or assume 'home' for now
        const matchesStatus = filterStatus === 'all' || shipment.addressType === filterStatus;

        const matchesSearch = searchTerm === '' ||
            (shipment.deliveryId && shipment.deliveryId.toLowerCase().includes(searchTerm.toLowerCase())) || //deliveryId
            shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) || //receiverName
            shipment.senderName.toLowerCase().includes(searchTerm.toLowerCase()); //senderName
        // shipment.addressType.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const toggleShipmentSelection = (id: number) => {
        setSelectedShipments(prev =>
            prev.includes(id)
                ? prev.filter(shipmentId => shipmentId !== id)
                : [...prev, id]
        );
    };

    const selectAllShipments = () => {
        if (selectedShipments.length === filteredHistory.length) {
            setSelectedShipments([]);
        } else {
            setSelectedShipments(filteredHistory.map(shipment => shipment.id));
        }
    };

    const totalValue = filteredHistory.reduce((sum, item) => sum + item.amount, 0);
    const homeDeliveries = filteredHistory.filter(item => item.addressType === 'HOME').length;
    const officeDeliveries = filteredHistory.filter(item => item.addressType === 'OFFICE').length;
    const totalItems = filteredHistory.reduce((sum, item) => sum + item.numberOfItems, 0);

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
                                <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className='font-bold text-xl md:text-2xl text-white'>
                                Shipping History
                            </h1>
                            <p className='font-medium text-sm md:text-base text-white/90 mt-1'>
                                Complete history of all your successfully delivered packages
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between xs:justify-end gap-3 w-full md:w-auto">
                        <div className='flex flex-col p-2 text-white text-center'>
                            <p className='text-sm font-semibold text-white'>
                                TOTAL DELIVERED
                            </p>
                            <p className='font-bold text-2xl md:text-3xl text-wite'>
                                {(stats?.overallStats?.totalDelivered || 0).toString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: 'Total Value',
                            value: `$${(stats?.overallStats?.totalRevenue || 0).toLocaleString()}`,
                            icon: <FileText className="w-5 h-5 text-green-400" />,
                            bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
                            trend: '+12.5%'
                        },
                        {
                            title: 'Home Deliveries',
                            value: (stats?.homeDeliveries?.totalDeliveries || 0).toString(),
                            icon: <Home className="w-5 h-5 text-blue-400" />,
                            bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
                            trend: '+8.2%'
                        },
                        {
                            title: 'Office Deliveries',
                            value: (stats?.officeDeliveries?.totalDeliveries || 0).toString(),
                            icon: <Building className="w-5 h-5 text-purple-400" />,
                            bg: 'bg-gradient-to-br from-purple-500 to-pink-600',
                            trend: '+15.7%'
                        },
                        {
                            title: 'Total Items',
                            value: shipmentHistori.length,
                            icon: <Package className="w-5 h-5 text-amber-400" />,
                            bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
                            trend: '+23.1%'
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
                                    <span className="text-xs opacity-80 mt-1">{stat.trend} from last month</span>
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

                {/* Filters and Search Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1 w-full lg:max-w-md">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search tracking, receiver name, vendor..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-appBanner focus:border-appBanner transition-all duration-200 cursor-pointer"
                                >
                                    <option value="all">All Deliveries</option>
                                    {/* These filters can be re-enabled once API returns addressType in list */}
                                    <option value="HOME">Home Address</option>
                                    <option value="OFFICE">Office Address</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>

                            <button className="flex items-center gap-2 bg-gradient-to-r from-appBanner to-appNav text-white py-3 px-4 rounded-xl font-semibold hover:from-appBanner/90 hover:to-appNav/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                                <Download size={18} />
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* 6. Dynamic Shipping History List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedShipments.length === filteredHistory.length && filteredHistory.length > 0}
                                        onChange={selectAllShipments}
                                        className="w-4 h-4 text-appBanner bg-gray-100 border-gray-300 rounded focus:ring-appBanner focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Select All ({selectedShipments.length})
                                    </span>
                                </label>
                            </div>
                            <div className="text-sm text-gray-500">
                                Showing {filteredHistory.length} shipments
                            </div>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="text-center py-10 text-gray-400">Loading history...</div>
                            ) : filteredHistory.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">No shipments found.</div>
                            ) : (
                                filteredHistory.map((shipment) => (
                                    <div
                                        key={shipment.trackingNumber}
                                        className={`bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 hover:border-appBanner/50 transition-all duration-300 group ${selectedShipments.includes(shipment.id) ? 'border-appBanner bg-appBanner/5' : 'border-gray-100'
                                            }`}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <label className="flex items-start mt-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedShipments.includes(shipment.id)}
                                                            onChange={() => toggleShipmentSelection(shipment.id)}
                                                            className="w-4 h-4 text-appBanner bg-gray-100 border-gray-300 rounded focus:ring-appBanner focus:ring-2"
                                                        />
                                                    </label>

                                                    <div className="w-12 h-12 bg-gradient-to-br from-appBanner/20 to-appNav/20 rounded-lg flex items-center justify-center border border-appBanner/30">
                                                        <Package className="w-6 h-6 text-appBanner" />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-4 mb-2">
                                                            <h3 className="text-lg font-bold text-gray-900">
                                                                {shipment.deliveryId}
                                                            </h3>
                                                            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${shipment.deliveryStatus === 'DELIVERED'
                                                                    ? 'bg-green-100 text-green-800 border-green-200'
                                                                    : 'bg-blue-100 text-blue-800 border-blue-200'
                                                                }`}>
                                                                {shipment.deliveryStatus}
                                                            </span>
                                                            <span className="text-gray-500 text-sm">
                                                                {new Date(shipment.lastUpdated).toLocaleDateString()}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                            {/* Delivery Information */}
                                                            <div className="flex items-center gap-2">
                                                                {/* 1. Pass the variable directly, no backticks */}
                                                                {getAddressTypeIcon(shipment.addressType)}

                                                                {/* 2. Make the text dynamic too (it was hardcoded to 'HOME') */}
                                                                <span className="text-gray-500 text-sm">
                                                                    {getAddressTypeText(shipment.addressType)}
                                                                </span>
                                                            </div>

                                                            {/* Package Details */}
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                                    <Truck size={16} className="text-appNav" />
                                                                    Package Details
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                                    <div>
                                                                        <span className="text-gray-500">Items:</span>
                                                                        <p className="text-gray-900 font-medium">{shipment.numberOfItems}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-gray-500">Weight:</span>
                                                                        <p className="text-gray-900 font-medium">{shipment.weight} kg</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Vendor & Actions */}
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Sender & Tracking</h4>
                                                                    <p className="text-gray-900 text-sm font-medium">{shipment.senderName}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <code className="text-appNav text-sm font-mono bg-appNav/10 px-2 py-1 rounded border border-appNav/20">
                                                                            {shipment.trackingNumber}
                                                                        </code>
                                                                        <button
                                                                            onClick={() => copyToClipboard(shipment.trackingNumber)}
                                                                            className="text-gray-400 hover:text-appBanner transition-colors"
                                                                            title="Copy tracking number"
                                                                        >
                                                                            <Copy size={14} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right ml-4">
                                                    <div className="text-2xl font-bold text-appBanner">
                                                        ${shipment.amount.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">Shipping Cost</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Load More Button */}
                        <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
                            {/* Only show if we strictly needed pagination, for now it loads 'All' */}
                            <button className="bg-gray-100 text-gray-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center gap-2">
                                End of History
                            </button>
                        </div>
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
        </div>
    )
}

export default ShippingHistoryPage