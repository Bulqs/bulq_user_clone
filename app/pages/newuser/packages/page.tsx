
'use client'
import Heading from '@/app/components/generalheading/Heading';
import React, { useEffect, useState } from 'react';
import { FiPlus, FiFilter, FiChevronDown, FiSearch, FiCopy, FiChevronRight, FiTruck, FiPackage, FiMapPin, FiShoppingBag, FiLayers, FiCalendar, FiHash } from 'react-icons/fi';
import { Package, PackageStatus, TimeFilter } from '@/types/user/index';
import Image from 'next/image';
import { BookingFilterParams, FilterBookingViewDTO } from '@/types/booking';
import { getAllBookings, updateBookingStatus } from '@/lib/user/booking.actions';

// Mock data - replace with your actual data fetching
const mockPackages: Package[] = [
    {
        id: 'PKG-001',
        description: 'Electronics',
        vendor: 'Amazon',
        destination: 'New York',
        status: 'Received',
        receivedDate: new Date('2023-05-15'),
        weight: '2.5 kg',
        trackingNumber: 'TRK123456789',
        image: '/images/package1.jpg',
        name: 'Smartphone & Accessories'
    },
    {
        id: 'PKG-002',
        description: 'Clothing',
        vendor: 'Zara',
        destination: 'Los Angeles',
        status: 'In Transit',
        receivedDate: new Date('2023-06-20'),
        weight: '1.8 kg',
        trackingNumber: 'TRK987654321',
        image: '/images/package2.jpg',
        name: 'Summer Collection'
    },
    {
        id: 'PKG-003',
        description: 'Books',
        vendor: 'Barnes & Noble',
        destination: 'Chicago',
        status: 'Awaiting Shipment',
        receivedDate: new Date('2023-07-10'),
        weight: '3.2 kg',
        trackingNumber: 'TRK456789123',
        image: '/images/package3.jpg',
        name: 'Educational Materials'
    },
    {
        id: 'PKG-004',
        description: 'Unclaimed Electronics',
        vendor: 'Best Buy',
        destination: 'Miami',
        status: 'Unclaimed Item',
        receivedDate: new Date('2023-08-01'),
        weight: '5.1 kg',
        trackingNumber: 'TRK789123456',
        image: '/images/package4.jpg',
        name: 'Gaming Console'
    },
    {
        id: 'PKG-005',
        description: 'Consolidated Shipment',
        vendor: 'Multiple',
        destination: 'Seattle',
        status: 'Consolidated Packages',
        receivedDate: new Date('2023-08-15'),
        weight: '12.8 kg',
        trackingNumber: 'TRK321654987',
        image: '/images/package5.jpg',
        name: 'Consolidated Items'
    },
    {
        id: 'PKG-006',
        description: 'Unclaimed Clothing',
        vendor: 'H&M',
        destination: 'Boston',
        status: 'Unclaimed Item',
        receivedDate: new Date('2023-09-01'),
        weight: '2.3 kg',
        trackingNumber: 'TRK555444333',
        image: '/images/package6.jpg',
        name: 'Winter Apparel'
    },
    {
        id: 'PKG-007',
        description: 'Consolidated Electronics',
        vendor: 'Multiple',
        destination: 'Austin',
        status: 'Consolidated Packages',
        receivedDate: new Date('2023-09-10'),
        weight: '8.7 kg',
        trackingNumber: 'TRK777888999',
        image: '/images/package7.jpg',
        name: 'Tech Bundle'
    }
];

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
        'All': '' // Empty string typically returns all in Spring Boot
    };

    const [realPackages, setRealPackages] = useState<FilterBookingViewDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [perPage, setPerPage] = useState(10); // Default to 10 items
    const [currentPage, setCurrentPage] = useState(1); // Default to page 1

    const calculateDateRange = (filter: TimeFilter): string => {
        const now = new Date();
        const formatDate = (d: Date) => d.toISOString().split('T')[0];

        let startDate = new Date();
        switch (filter) {
            case 'Today': startDate = now; break;
            case '7 Days': startDate.setDate(now.getDate() - 7); break;
            case '30 Days': startDate.setDate(now.getDate() - 30); break;
            case '12 Months': startDate.setFullYear(now.getFullYear() - 1); break;
        }

        return `${formatDate(startDate)} to ${formatDate(now)}`;
    };

    useEffect(() => {
    const fetchFilteredPackages = async () => {
        try {
            setLoading(true);
            const params: BookingFilterParams = {
                // Fix: Spring is 0-indexed. UI Page 1 = API Page 0
                page: currentPage - 1, 
                per_page: perPage,
                status: statusMapping[statusFilter],
                // Only send deliveryId if there is actually a search string
                deliveryId: searchQuery.trim() || undefined,
            };

            const response = await getAllBookings(params);
            // Ensure we extract the content correctly
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
}, [statusFilter, searchQuery, perPage, currentPage]); // Remove timeFilter if backend doesn't handle it yet

    // useEffect(() => {
    //     const fetchFilteredPackages = async () => {
    //         try {
    //             setLoading(true);

    //             // 1. Build the API params based on UI state
    //             const params: BookingFilterParams = {
    //                 page: currentPage+1,
    //                 per_page: perPage, // Adjust as needed for the table
    //                 status: statusMapping[statusFilter],
    //                 // We map the search query to a field the backend supports (e.g. deliveryId or email)
    //                 deliveryId: searchQuery,
    //                 // Note: For TimeFilter, you might need to send a dateRange string to your API
    //                 // dateRange: calculateDateRange(timeFilter)
    //             };

    //             // 2. Fire the API call
    //             const response = await getAllBookings(params);

    //             // 3. Extract content (Double-safety check)
    //             const dataToSet = response?.content || (Array.isArray(response) ? response : []);
    //             console.log(`Requesting: page=${currentPage}, size=${perPage}`)
    //             setRealPackages(dataToSet);

    //         } catch (err) {
    //             console.error("Package Filter Sync Error:", err);
    //             setRealPackages([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchFilteredPackages();
    // }, [statusFilter, timeFilter, searchQuery, perPage, currentPage]); // Fires every time a filter changes

    // Check if current status should show table view
    const shouldShowTableView = statusFilter === 'Unclaimed Item' || statusFilter === 'Consolidated Packages';

    // Filter packages based on selected filters
    const filteredPackages = realPackages.filter((pkg) => {
        const statusMatch = statusFilter === 'All' || pkg.deliveryStatus === statusFilter;

        // --- DATE LOGIC ---
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to start of today

        // Convert backend string "YYYY-MM-DD" to JS Date Object
        const pkgDate = new Date(pkg.pick_up_date.split(' ')[0]);
        pkgDate.setHours(0, 0, 0, 0);

        let dateMatch = true;

        switch (timeFilter) {
            case 'Today':
                dateMatch = pkgDate.getTime() === now.getTime();
                break;
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

        // --- SEARCH LOGIC ---
        const searchMatch =
            pkg.delivery_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.package_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.package_name?.toLowerCase().includes(searchQuery.toLowerCase());

        return statusMatch && dateMatch && searchMatch;
    });

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const togglePackageExpand = (packageId: string) => {
        setExpandedPackage(expandedPackage === packageId ? null : packageId);
    };

    const copyTrackingNumber = (trackingNumber: string) => {
        navigator.clipboard.writeText(trackingNumber)
            .then(() => {
                setCopiedTracking(trackingNumber);
                setTimeout(() => setCopiedTracking(null), 2000);
            })
            .catch(err => {
                console.error('Failed to copy tracking number: ', err);
            });
    };

    const handleShipNow = async (trackingNumber: string) => {
    try {
        // Optional: Set a loading state here if you have one
        // setIsProcessing(true);

        console.log('Requesting Ship Now for package: ', trackingNumber);

        // 1. Call the API Endpoint
        // Make sure 'IN_TRANSIT' matches exactly one of the values in your BookingStatus enum
        const result = await updateBookingStatus(trackingNumber, 'SHIP_NOW');

        // 2. Success Feedback
        alert(result.message);
        
        // 3. Optional: Refresh the list so the item moves/updates in the UI
        // fetchRecentBookings(); 

    } catch (error: any) {
        console.error('Shipment Failed:', error);
        alert(error.message || "Failed to update shipment status");
    } finally {
        // setIsProcessing(false);
    }
};

    const handleAddToConsolidation = async (trackingNumber: string) => {
        try {
        // Optional: Set a loading state here if you have one
        // setIsProcessing(true);

        console.log('Consolidate Shipping package: ', trackingNumber);

        // 1. Call the API Endpoint
        // Make sure 'IN_TRANSIT' matches exactly one of the values in your BookingStatus enum
        const result = await updateBookingStatus(trackingNumber, 'CONSOLIDATED');

        // 2. Success Feedback
        alert(result.message);
        
        // 3. Optional: Refresh the list so the item moves/updates in the UI
        // fetchRecentBookings(); 

    } catch (error: any) {
        console.error('Shipment Failed:', error);
        alert(error.message || "Failed to update shipment status");
    } finally {
        // setIsProcessing(false);
    }
    };

    const handleClaimItem = (packageId: string) => {
        console.log('Claiming item:', packageId);
        // Add your claim item logic here
        alert(`Claiming item: ${packageId}`);
    };

    return (
        <div className="pb-12">
            <div className="flex items-center mb-4">
                <Heading level="h4" align="left" className="font-bold" color='light'>
                    All Packages
                </Heading>
            </div>

            {/* Filters Section */}
            <div className="rounded-t-lg overflow-hidden p-4 mb-0 bg-gradient-to-b from-appTitleBgColor to-appNav shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Status Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-white flex items-center gap-1">
                            <FiFilter /> Status:
                        </span>
                        {(['All', 'Received', 'In Transit', 'Awaiting Shipment', 'Unclaimed Item', 'Consolidated Packages'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${statusFilter === status
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Time Filters */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">Time:</span>
                        <div className="relative">
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                                className="appearance-none bg-white/20 border border-white/30 rounded-lg px-3 py-1 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                            >
                                {(['12 Months', '30 Days', '7 Days', 'Today'] as const).map((time) => (
                                    <option key={time} value={time} className="text-gray-800">
                                        {time}
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white" />
                        </div>
                    </div>
                </div>

                {/* Time and Per Page Filters */}
                <div className="flex flex-wrap items-center gap-4">


                    {/* NEW: Per Page Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">Show:</span>
                        <div className="relative">
                            <select
                                value={perPage}
                                onChange={(e) => {
                                    setPerPage(Number(e.target.value));
                                    setCurrentPage(1); // Reset to page 1 when limit changes
                                }}
                                className="appearance-none bg-white/20 border border-white/30 rounded-lg px-3 py-1 pr-8 text-sm text-white focus:outline-none backdrop-blur-sm"
                            >
                                {[5, 6, 7, 8, 9, 10].map((per_page) => (
                                    <option key={per_page} value={per_page} className="text-gray-800">
                                        {per_page} per page
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-white" />
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-4 relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                    <input
                        type="text"
                        placeholder="Search packages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/70 backdrop-blur-sm"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-b-lg overflow-hidden bg-gradient-to-b from-appNav to-appTitleBgColor shadow-xl mt-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/20">
                        <thead className="bg-appTitleBgColor">
                            <tr>
                                {shouldShowTableView ? (
                                    // Full table headers for Unclaimed Item and Consolidated Packages
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Package
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Vendor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Destination
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Weight
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Tracking Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </>
                                ) : (
                                    // Compact headers for other statuses
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Package
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Vendor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Destination
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Received Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Weight
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {/* filteredPackages.length > 0 */}
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="py-20 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mx-auto"></div>
                                    </td>
                                </tr>
                            ) : realPackages.length > 0 ? (
                                realPackages.map((pkg) => (
                                    <React.Fragment key={pkg.trackingNumber}>
                                        {shouldShowTableView ? (
                                            // Full table view for Unclaimed Item and Consolidated Packages
                                            <tr className="hover:bg-white/5 transition-all duration-300 border-b border-white/10">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10">
                                                            {pkg.packageImage ? (
                                                                <Image
                                                                    src={pkg.packageImage}
                                                                    alt={pkg.package_name}
                                                                    width={40}
                                                                    height={40}
                                                                    className="rounded-lg object-cover"
                                                                />
                                                            ) : (
                                                                <FiPackage className="w-5 h-5 text-blue-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-white">
                                                                {pkg.package_name || pkg.package_description}
                                                            </p>
                                                            <p className="text-sm text-white/60 mt-1">
                                                                {pkg.trackingNumber}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                                    {pkg.package_description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                    {pkg.package_name} {/**vendor */}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                                    {pkg.receiver_address}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${pkg.deliveryStatus === 'UNCLAIMED_ITEMS'
                                                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                                            }`}
                                                    >
                                                        {pkg.deliveryStatus} {/**status */}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                                    {pkg.pick_up_date.split(' ')[0]} {/**pkg.pick_up_date */}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 font-medium">
                                                    {pkg.weight}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                                    <div className="flex items-center space-x-2">
                                                        <span>{pkg.trackingNumber}</span>
                                                        <button
                                                            onClick={() => copyTrackingNumber(pkg.trackingNumber)}
                                                            className="text-white/50 hover:text-blue-300 transition-colors p-1 hover:bg-white/10 rounded-lg"
                                                            title="Copy tracking number"
                                                        >
                                                            <FiCopy className="w-4 h-4" />
                                                        </button>
                                                        {copiedTracking === pkg.trackingNumber && (
                                                            <span className="text-green-300 text-xs">Copied!</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                    <div className="flex items-center space-x-2">
                                                        {pkg.deliveryStatus === 'UNCLAIMED_ITEMS' ? (
                                                            <button
                                                                onClick={() => handleClaimItem(pkg.trackingNumber)}
                                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                                            >
                                                                Claim Item
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleShipNow(pkg.trackingNumber)}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                                            >
                                                                Ship Now
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleAddToConsolidation(pkg.trackingNumber)}
                                                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            Consolidate
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            // Detailed dropdown view for other statuses
                                            <>
                                                {/* Main Table Row */}
                                                <tr
                                                    className="hover:bg-white/5 cursor-pointer transition-all duration-300 group border-b border-white/10"
                                                    onClick={() => togglePackageExpand(pkg.trackingNumber)}
                                                >
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                                                                {pkg.packageImage ? (
                                                                    <Image
                                                                        src={pkg.packageImage}
                                                                        alt={pkg.package_name!}
                                                                        width={48}
                                                                        height={48}
                                                                        className="rounded-xl object-cover"
                                                                    />
                                                                ) : (
                                                                    <FiPackage className="w-6 h-6 text-blue-300" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors">
                                                                    {pkg.package_name || pkg.package_description}
                                                                </p>
                                                                <p className="text-sm text-white/60 mt-1">
                                                                    {pkg.trackingNumber}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="text-sm text-white font-medium">
                                                            {pkg.vendor}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="text-sm text-white/80">
                                                            {pkg.receiver_address}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${pkg.deliveryStatus === 'RECEIVED'
                                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                                : pkg.deliveryStatus === 'IN_TRANSIT'
                                                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                                    : pkg.deliveryStatus === 'AWAITING_SHIPMENT'
                                                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                                        : pkg.deliveryStatus === 'UNCLAIMED_ITEMS'
                                                                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                                                }`}
                                                        >
                                                            {pkg.deliveryStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-sm text-white/80">
                                                        {pkg.pick_up_date.split(' ')[0]} {/** pkg.pick_up_date */}
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap text-sm text-white/80 font-medium">
                                                        {pkg.weight}
                                                    </td>
                                                    <td className="px-6 py-5 whitespace-nowrap">
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                className="text-white/70 hover:text-blue-300 transition-all duration-200 hover:scale-105 font-medium text-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    togglePackageExpand(pkg.trackingNumber);
                                                                }}
                                                            >
                                                                View Details
                                                            </button>
                                                            <FiChevronRight
                                                                className={`w-4 h-4 text-white/50 transition-all duration-300 ${expandedPackage === pkg.trackingNumber ? 'rotate-90 text-blue-300' : 'group-hover:text-white/70'}`}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expanded Details Row */}
                                                {expandedPackage === pkg.trackingNumber && (
                                                    <tr className="bg-gradient-to-r from-white/5 to-white/3 border-b border-white/10">
                                                        <td colSpan={7} className="px-6 py-8">
                                                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                                                                {/* Package Overview Card */}
                                                                <div className="xl:col-span-4">
                                                                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                                                                        <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                                                                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                                                            Package Overview
                                                                        </h4>
                                                                        <div className="flex items-start space-x-5">
                                                                            <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/10">
                                                                                {pkg.packageImage! ? (
                                                                                    <Image
                                                                                        src={pkg.packageImage!}
                                                                                        alt={pkg.package_name!}
                                                                                        width={80}
                                                                                        height={80}
                                                                                        className="rounded-2xl object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <FiPackage className="w-8 h-8 text-blue-300" />
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <h5 className="text-white font-bold text-lg leading-tight">
                                                                                    {pkg.package_name || pkg.package_description}
                                                                                </h5>
                                                                                <div className="space-y-2 mt-3">
                                                                                    <div className="flex items-center text-sm">
                                                                                        <span className="text-white/60 font-medium w-24">Package ID:</span>
                                                                                        <span className="text-white font-semibold">{pkg.trackingNumber}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center text-sm">
                                                                                        <span className="text-white/60 font-medium w-24">Received:</span>
                                                                                        <span className="text-white font-semibold">{pkg.pick_up_date.split(' ')[0]}</span> {/**pkg.pick_up_date */}
                                                                                    </div>
                                                                                    <div className="flex items-center text-sm">
                                                                                        <span className="text-white/60 font-medium w-24">Status:</span>
                                                                                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${pkg.deliveryStatus === 'RECEIVED'
                                                                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                                                            : pkg.deliveryStatus === 'IN_TRANSIT'
                                                                                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                                                                : pkg.deliveryStatus === 'AWAITING_SHIPMENT'
                                                                                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                                                                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                                                                            }`}>
                                                                                            {pkg.deliveryStatus}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Package Details Card */}
                                                                <div className="xl:col-span-5">
                                                                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                                                                        <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                                                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                                                                            Package Details
                                                                        </h4>
                                                                        <div className="space-y-4">
                                                                            {[
                                                                                {
                                                                                    label: 'Vendor',
                                                                                    value: pkg.vendor,
                                                                                    icon: <FiShoppingBag className="w-4 h-4 text-blue-400" />
                                                                                },
                                                                                {
                                                                                    label: 'Destination',
                                                                                    value: pkg.receiver_address,
                                                                                    icon: <FiMapPin className="w-4 h-4 text-emerald-400" />
                                                                                },
                                                                                {
                                                                                    label: 'Received Date',
                                                                                    value: pkg.pick_up_date.split(' ')[0],
                                                                                    icon: <FiCalendar className="w-4 h-4 text-amber-400" />
                                                                                },
                                                                                {
                                                                                    label: 'Weight',
                                                                                    value: pkg.weight,
                                                                                    icon: <FiLayers className="w-4 h-4 text-purple-400" />
                                                                                },
                                                                                {
                                                                                    label: 'Tracking Number',
                                                                                    value: pkg.trackingNumber,
                                                                                    icon: <FiHash className="w-4 h-4 text-cyan-400" />,
                                                                                    copyable: true
                                                                                },
                                                                            ].map((item, index) => (
                                                                                <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                                                                                    <div className="flex items-center space-x-3">
                                                                                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                                                                            {item.icon}
                                                                                        </div>
                                                                                        <span className="text-white/70 font-medium text-sm">{item.label}</span>
                                                                                    </div>
                                                                                    <div className="flex items-center space-x-2">
                                                                                        <span className="text-white font-semibold text-sm">{item.value}</span>
                                                                                        {item.copyable && (
                                                                                            <button
                                                                                                onClick={() => copyTrackingNumber(pkg.trackingNumber)}
                                                                                                className="text-white/50 hover:text-blue-300 transition-colors p-1 hover:bg-white/10 rounded-lg"
                                                                                                title="Copy tracking number"
                                                                                            >
                                                                                                <FiCopy className="w-4 h-4" />
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                            {copiedTracking === pkg.trackingNumber && (
                                                                                <div className="flex items-center justify-center py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                                                                                    <span className="text-green-300 text-sm font-medium flex items-center">
                                                                                        <FiCopy className="w-3 h-3 mr-2" />
                                                                                        Tracking number copied!
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Action Buttons Card */}
                                                                <div className="xl:col-span-3">
                                                                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                                                                        <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                                                                            <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                                                                            Quick Actions
                                                                        </h4>
                                                                        <div className="space-y-4">
                                                                            <button
                                                                                onClick={() => handleShipNow(pkg.trackingNumber)}
                                                                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 group"
                                                                            >
                                                                                <FiTruck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                                <span>Ship Now</span>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleAddToConsolidation(pkg.trackingNumber)}
                                                                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 group"
                                                                            >
                                                                                <FiPackage className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                                <span>Add to Consolidation</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={shouldShowTableView ? 9 : 7} className="px-6 py-8 text-center">
                                        <div className="text-white/70 text-sm">
                                            <FiPackage className="w-12 h-12 mx-auto mb-3 text-white/30" />
                                            No packages found matching your criteria
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="px-6 py-4 bg-appTitleBgColor/50 border-t border-white/10 flex items-center justify-between">
                        <p className="text-sm text-white/60">
                            Showing page <span className="text-white font-medium">{currentPage}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="px-3 py-1 text-sm bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="px-3 py-1 text-sm bg-white/10 text-white rounded hover:bg-white/20"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackagesPage;