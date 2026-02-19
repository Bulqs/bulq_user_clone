'use client';

import React, { useEffect, useState } from 'react';
import {
  Truck,
  Package,
  History,
  CheckSquare,
  MapPin,
  Scale,
  DollarSign,
  Shield,
  ChevronDown,
  Sparkles,
  Copy,
  Box,
  Zap,
  Calendar,
  Layers,
  Clock,
  CheckCircle,
  Home,
  Building,
  Plus,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';
import Image from 'next/image';
import logo from '../../../../public/images/location.png';
import { UserResponseDTO } from '@/types/admin';
import { CountryDTO, PackageStatus } from '@/types/user';
import { getAllBookings, getAllBookingsForShippingPage, getUserBookingSummary } from '@/lib/user/booking.actions';
import { getMyProfile } from '@/lib/user/actions';
import { BookingFilterParams, FilterBookingViewDTO } from '@/types/booking';
import { FiChevronDown } from 'react-icons/fi';

const ShippingPage = () => {
  const [activeTab, setActiveTab] = useState('shipNow');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [shippingMethod, setShippingMethod] = useState('');
  const [applyInsurance, setApplyInsurance] = useState(false);
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState<UserResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<CountryDTO[]>([]);
  const [statusSummary, setStatusSummary] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Consolidation states
  const [consolidationSchedule, setConsolidationSchedule] = useState('');
  const [nextShipmentDate, setNextShipmentDate] = useState('');
  const [repackItems, setRepackItems] = useState(false);

  const statusMapping: Record<string, string> = {
    'Received': 'RECEIVED',
    'In Transit': 'IN_TRANSIT',
    'Awaiting Shipment': 'AWAITING_SHIPMENT',
    'Unclaimed Item': 'UNCLAIMED_ITEMS',
    'Consolidated Packages': 'CONSOLIDATED',
    'All': '' // Empty string typically returns all in Spring Boot
  };

  const [realPackages, setRealPackages] = useState<FilterBookingViewDTO[]>([]);
  const [perPage, setPerPage] = useState(10); // Default to 10 items
  const [currentPage, setCurrentPage] = useState(1); // Default to page 1
  const [statusFilter, setStatusFilter] = useState<PackageStatus | 'All'>('All');

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

  useEffect(() => {
    const fetchFilteredPackages = async () => {
      try {
        setLoading(true);

        // 1. Build the API params based on UI state
        const params: BookingFilterParams = {
          page: currentPage,
          per_page: perPage, // Adjust as needed for the table
          // status: statusMapping[statusFilter],
          // We map the search query to a field the backend supports (e.g. deliveryId or email)
          // deliveryId: searchQuery,
          // Note: For TimeFilter, you might need to send a dateRange string to your API
          // dateRange: calculateDateRange(timeFilter)
        };

        // 2. Fire the API call
        const response = await getAllBookingsForShippingPage(params);

        // 3. Extract content (Double-safety check)
        const dataToSet = response?.content || (Array.isArray(response) ? response : []);
        console.log(`Requesting: page=${currentPage}, size=${perPage}`)
        setRealPackages(dataToSet);

      } catch (err) {
        console.error("Package Filter Sync Error:", err);
        setRealPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPackages();
  }, [statusFilter, searchQuery, perPage, currentPage]); // Fires every time a filter changes

  

  const handleCheckboxChange = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleShippingMethod = (method: string) => {
    setShippingMethod(method);
  };

  const handleConsolidationSchedule = (schedule: string) => {
    setConsolidationSchedule(schedule);
    // Set default next shipment date based on schedule
    const today = new Date();
    const nextDate = new Date(today);

    switch (schedule) {
      case 'weekly':
        nextDate.setDate(today.getDate() + 7);
        break;
      case 'bi-weekly':
        nextDate.setDate(today.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(today.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(today.getMonth() + 3);
        break;
      default:
        return;
    }

    setNextShipmentDate(nextDate.toISOString().split('T')[0]);
  };

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
    return type === 'home' ? <Home size={16} className="text-appBanner" /> : <Building size={16} className="text-appBanner" />;
  };

  const getAddressTypeText = (type: string) => {
    return type === 'home' ? 'home address' : 'office address';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-blue-100 text-blue-800';
      case 'in transit':
        return 'bg-amber-100 text-amber-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'shipNow', label: 'Ship Now', icon: Truck, color: 'from-blue-500 to-cyan-500' },
    { id: 'consolidate', label: 'Consolidate Shipment', icon: Package, color: 'from-emerald-500 to-green-500' },
    // { id: 'history', label: 'Shipment History', icon: History, color: 'from-purple-500 to-pink-500' }
  ];

  const shippingMethods = [
    {
      id: 'standard',
      label: 'Standard (5 - 7 days)',
      icon: Truck,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-400'
    },
    {
      id: 'express',
      label: 'Express (2 - 3 days)',
      icon: Zap,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-gradient-to-br from-emerald-500/20 to-green-500/20',
      borderColor: 'border-emerald-400'
    },
    {
      id: 'priority',
      label: 'Priority (1 - 2 days)',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-400'
    }
  ];

  const consolidationSchedules = [
    { id: 'weekly', label: 'Weekly', description: 'Every 7 days' },
    { id: 'bi-weekly', label: 'Bi-Weekly', description: 'Every 14 days' },
    { id: 'monthly', label: 'Monthly', description: 'Every 30 days' },
    { id: 'quarterly', label: 'Quarterly', description: 'Every 90 days' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-appWhite to-appBanner/10 pb-8 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-appBanner/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-appNav/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-appTitleBgColor/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header Section - Matching UserDashboard Design */}
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-b from-appTitleBgColor to-appNav p-6 md:p-8 mb-8 rounded-2xl shadow-xl min-h-[8rem] md:h-32">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
            <div className='flex-shrink-0'>
              <div className="w-12 h-12 bg-appWhite rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="text-appNav text-xl" />
              </div>
            </div>
            <div className="flex flex-col">
              <p className='font-sans font-bold text-xl md:text-2xl text-white'>
                Shipping Center
              </p>
              <p className='font-san font-medium text-sm md:text-base text-white/90'>
                Manage your shipments and delivery preferences
              </p>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between xs:justify-end gap-3 w-full md:w-auto">
            <div className='flex flex-col p-2 text-white'>
              <div className="flex items-center gap-1">
                <p className='text-xs font-semibold'>
                  SHIPPING REF:
                </p>
                <button
                  onClick={() => copyToClipboard('SHIP-REF-12345')}
                  className="text-white hover:text-gray-200 transition-colors flex items-center justify-center gap-1"
                  aria-label="Copy to clipboard"
                >
                  <Copy className="w-3 h-3" />
                  <span className="text-xs">copy</span>
                </button>
                {copied && (
                  <span className="text-xs text-green-300 ml-1">Copied!</span>
                )}
              </div>
              <p className='font-semibold text-sm md:text-base'>
                SHIP-REF-12345
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards Section - Matching UserDashboard */}
        <div className="flex flex-col w-full p-6 bg-gradient-to-b from-appTitleBgColor to-appNav rounded-2xl shadow-xl mb-8">
          <p className='font-sans font-medium text-lg text-white/90 mb-6'>
            Quick Shipping Overview
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Ready to Ship',
                value: (statusSummary['RECEIVED'] || 0).toString(),
                icon: <Package className="text-white" size={20} />,
                bg: 'bg-gradient-to-br from-blue-500 to-cyan-400'
              },
              {
                title: 'In Transit',
                value: (statusSummary['IN_TRANSIT'] || 0).toString(),
                icon: <Truck className="text-white" size={20} />,
                bg: 'bg-gradient-to-br from-amber-500 to-orange-400'
              },
              {
                title: 'Consolidated',
                value: (statusSummary['CONSOLIDATED'] || 0).toString(),
                icon: <Box className="text-white" size={20} />,
                bg: 'bg-gradient-to-br from-purple-500 to-pink-400'
              },
              {
                title: 'Delivered',
                value: (statusSummary['DELIVERED'] || 0).toString(),
                icon: <CheckCircle className="text-white" size={20} />,
                bg: 'bg-gradient-to-br from-emerald-500 to-green-400'
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`${stat.bg} p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-white`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium opacity-80">{stat.title}</span>
                    <span className="mt-2 text-3xl font-bold">{stat.value}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 h-1 bg-white/20 rounded-full">
                  <div
                    className="h-full bg-white/70 rounded-full"
                    style={{ width: `${Math.min(100, parseInt(stat.value)) / 2}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Navigation - Enhanced with Better Color Blending */}
        <div className="bg-gradient-to-r from-appTitleBgColor/5 via-appNav/5 to-appBanner/5 backdrop-blur-lg rounded-2xl shadow-lg mb-8 border border-appBanner/20">
          <div className="border-b border-appBanner/20">
            <nav className="flex space-x-1 px-6">
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 py-4 px-6 border-b-2 font-semibold text-sm transition-all duration-300 rounded-t-xl relative overflow-hidden group ${isActive
                      ? 'border-appBanner text-appTitleBgColor bg-gradient-to-r from-white to-appBanner/10 shadow-sm'
                      : 'border-transparent text-appTitleBgColor/70 hover:text-appTitleBgColor hover:bg-appBanner/5'
                      }`}
                  >
                    {/* Background gradient for active state */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-appBanner/5 to-appNav/5 rounded-t-xl"></div>
                    )}
                    <IconComponent
                      size={20}
                      className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-appBanner' : 'text-appTitleBgColor/60 group-hover:text-appBanner'
                        }`}
                    />
                    <span className="relative z-10">{tab.label}</span>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-appBanner/0 via-appBanner/5 to-appBanner/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl"></div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content with Seamless Color Transition */}
        <div className="bg-gradient-to-br from-white via-appBanner/5 to-appNav/5 backdrop-blur-lg rounded-2xl shadow-lg border border-appBanner/20 overflow-hidden">
          <div className="p-8">
            {activeTab === 'shipNow' && (
              <div className="space-y-8">
                {/* Main Heading with Gradient Text */}
                <div className="text-center">
                  <div className="inline-flex flex-col items-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-appTitleBgColor via-appNav to-appBanner bg-clip-text text-transparent mb-3">
                      Ship Items Now
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-appTitleBgColor via-appNav to-appBanner rounded-full mb-3"></div>
                  </div>
                  <p className="text-appTitleBgColor/80 text-lg max-w-2xl mx-auto">
                    Select items from your warehouse to ship immediately to your address
                  </p>
                </div>

                {/* Search and Filter Bar with Color Blend */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-gradient-to-r from-appBanner/5 via-appNav/5 to-appTitleBgColor/5 rounded-xl border border-appBanner/20">
                  <div className="flex items-center gap-3 flex-1 max-w-md">
                    <Search className="text-appBanner" size={20} />
                    <input
                      type="text"
                      placeholder="Search packages, products, vendors..."
                      className="flex-1 bg-transparent border-none focus:outline-none text-appTitleBgColor placeholder-appTitleBgColor/60"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-appBanner/30 rounded-lg text-appTitleBgColor hover:border-appBanner hover:bg-appBanner/5 transition-colors">
                      <Filter size={16} className="text-appBanner" />
                      Filter
                    </button>
                    <div className="text-sm text-appTitleBgColor/70 bg-appBanner/10 px-3 py-1 rounded-full border border-appBanner/20">
                      {selectedItems.length} items selected
                    </div>
                  </div>
                  {/**per page filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-appTitleBgColor">Show:</span>
                  <div className="relative">
                    <select
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setCurrentPage(1); // Reset to page 1 when limit changes
                      }}
                      className="appearance-none bg-white/20 border border-white/30 rounded-lg px-3 py-1 pr-8 text-sm text-appTitleBgColor focus:outline-none backdrop-blur-sm"
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
                
                

                {/* Two Column Layout with Better Color Integration */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Table Section */}
                  <div className="lg:col-span-2">
                    <h2 className="text-xl font-semibold text-appTitleBgColor mb-6 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-appBanner/20 to-appNav/20 rounded-lg border border-appBanner/30">
                        <CheckSquare size={20} className="text-appBanner" />
                      </div>
                      Select Items to Ship
                    </h2>

                    {/* Enhanced Table with Color Blending */}
                    <div className="bg-white rounded-xl border border-appBanner/20 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-appBanner/20">
                          <thead className="bg-gradient-to-r from-appBanner/5 to-appNav/5">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-appTitleBgColor uppercase tracking-wider">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    className="rounded border-appBanner/30 bg-white text-appBanner focus:ring-appBanner"
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedItems(realPackages.map(item => item.id));
                                      } else {
                                        setSelectedItems([]);
                                      }
                                    }}
                                    checked={selectedItems.length === realPackages.length && realPackages.length > 0}
                                  />                                </div>
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-appTitleBgColor uppercase tracking-wider">
                                Product
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-appTitleBgColor uppercase tracking-wider">
                                Vendor
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-appTitleBgColor uppercase tracking-wider">
                                Package ID
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-appTitleBgColor uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-appTitleBgColor uppercase tracking-wider">
                                Weight
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-semibold text-appTitleBgColor uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-appBanner/10">
                            {realPackages.map((item) => (
                              <tr
                                key={item.id}
                                className="hover:bg-gradient-to-r from-appBanner/5 to-appNav/5 transition-all duration-200 group"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleCheckboxChange(item.id)}
                                    className="rounded border-appBanner/30 bg-white text-appBanner focus:ring-appBanner group-hover:border-appBanner"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-appBanner/20 to-appNav/20 rounded-lg flex items-center justify-center border border-appBanner/30 group-hover:border-appBanner transition-colors">
                                      <Package size={16} className="text-appBanner" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-semibold text-appTitleBgColor group-hover:text-appNav transition-colors">
                                        {item.package_name}
                                      </div>
                                      <div className="text-xs text-appTitleBgColor/60">{item.trackingNumber}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-appTitleBgColor group-hover:text-appNav transition-colors">
                                  {item.vendor}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-appTitleBgColor bg-appBanner/5 rounded group-hover:bg-appBanner/10 transition-colors">
                                  {item.trackingNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-appTitleBgColor/70 group-hover:text-appTitleBgColor transition-colors">
                                  {item.pick_up_date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-appTitleBgColor group-hover:text-appNav transition-colors">
                                  {item.weight}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full border transition-all duration-300 group-hover:scale-105 ${item.status === 'received'
                                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                                    : item.status === 'in transit'
                                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                                      : 'bg-green-100 text-green-800 border-green-200'
                                    }`}>
                                    {item?.status!}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="px-6 py-4 bg-appTitleBgColor/50 border-t border-white/10 flex items-center justify-between">
                          <p className="text-sm text-white/60">
                            Showing page <span className="text-white font-medium">{currentPage}</span>
                          </p>
                          <div className="flex gap-2">
                            <button
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage(prev => prev + 1)}
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

                    {/* Shipping Method with Enhanced Color Integration */}
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-appTitleBgColor mb-6 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-appBanner/20 to-appNav/20 rounded-lg border border-appBanner/30">
                          <Truck size={20} className="text-appBanner" />
                        </div>
                        Shipping Method
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {shippingMethods.map((method) => {
                          const IconComponent = method.icon;
                          const isSelected = shippingMethod === method.id;
                          return (
                            <button
                              key={method.id}
                              onClick={() => handleShippingMethod(method.id)}
                              className={`p-3 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group ${isSelected
                                ? 'border-appBanner bg-gradient-to-br from-appBanner/10 to-appNav/10 shadow-lg'
                                : 'border-appBanner/20 bg-white hover:border-appBanner hover:bg-gradient-to-br from-appBanner/5 to-appNav/5'
                                }`}
                            >
                              {/* Background gradient for selected state */}
                              {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-br from-appBanner/5 to-appNav/5 rounded-xl"></div>
                              )}
                              <div className="flex items-center gap-3 relative z-10">
                                <div className={`p-3 rounded-lg transition-colors ${isSelected
                                  ? 'bg-white shadow-sm'
                                  : 'bg-appBanner/5 group-hover:bg-appBanner/10'
                                  }`}>
                                  <IconComponent
                                    size={20}
                                    className={isSelected ? 'text-appBanner' : 'text-appTitleBgColor/60 group-hover:text-appBanner'}
                                  />
                                </div>
                                <div className="text-left">
                                  <div className={`font-semibold transition-colors ${isSelected ? 'text-appTitleBgColor' : 'text-appTitleBgColor/80 group-hover:text-appTitleBgColor'
                                    }`}>
                                    {method.label}
                                  </div>
                                  <div className={`text-sm mt-1 transition-colors ${isSelected ? 'text-appTitleBgColor/70' : 'text-appTitleBgColor/50 group-hover:text-appTitleBgColor/70'
                                    }`}>
                                    {method.label.includes('Standard') ? 'Most economical' : method.label.includes('Express') ? 'Fast delivery' : 'Premium service'}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Shipping Details with Enhanced Gradient */}
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-appTitleBgColor via-appNav to-appBanner rounded-2xl p-6 border border-appBanner/30 shadow-xl relative overflow-hidden">
                      {/* Subtle background pattern */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                      <div className="relative z-10">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg border border-white/30">
                            <Truck size={20} className="text-white" />
                          </div>
                          Shipping Details
                        </h3>

                        {/* Delivery Address */}
                        <div className="mb-3">
                          <label className="block text-sm font-semibold text-white/90 mb-3 flex items-center gap-1">
                            <MapPin size={18} className="text-white" />
                            Delivery Address
                          </label>
                          <div className="relative">
                            <select className="w-full bg-appTitleBgColor/50 border border-white/30 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white appearance-none text-sm backdrop-blur-sm">
                              <option className="bg-appNav">123 Main St, New York, NY 10001</option>
                              <option className="bg-appNav">456 Oak Ave, Los Angeles, CA 90210</option>
                              <option className="bg-appNav">789 Pine Rd, Chicago, IL 60601</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
                          </div>
                        </div>

                        {/* Package Weight */}
                        <div className="mb-3">
                          <label className="block text-sm font-semibold text-white/90 mb-3 flex items-center gap-1">
                            <Scale size={18} className="text-white" />
                            Package Weight
                          </label>
                          <div className="text-2xl font-bold text-white bg-appTitleBgColor/50 rounded-xl px-3 py-2 text-center border border-white/20 backdrop-blur-sm">
                            {selectedItems.length > 0
                              ? `${(selectedItems.length * 0.5).toFixed(1)} kg`
                              : '0.0 kg'}
                          </div>
                        </div>

                        {/* Shipping Cost Estimate */}
                        <div className="mb-3">
                          <label className="block text-sm font-semibold text-white/90 mb-3 flex items-center gap-1">
                            <DollarSign size={18} className="text-white" />
                            Shipping Cost Estimate
                          </label>
                          <div className="text-2xl font-bold text-white bg-appTitleBgColor/50 rounded-xl  px-3 py-2 text-center border border-white/20 backdrop-blur-sm">
                            ${selectedItems.length > 0 ? (selectedItems.length * 15.99).toFixed(2) : '0.00'}
                          </div>
                        </div>

                        {/* Insurance Checkbox */}
                        <div className="mb-3">
                          <label className="flex items-center gap-3 p-4 bg-appTitleBgColor/50 rounded-xl hover:bg-appTitleBgColor/70 transition-colors cursor-pointer border border-white/20 backdrop-blur-sm group">
                            <input
                              type="checkbox"
                              checked={applyInsurance}
                              onChange={(e) => setApplyInsurance(e.target.checked)}
                              className="rounded border-white/30 bg-appNav text-appBanner focus:ring-appBanner"
                            />
                            <Shield size={18} className="text-white group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-semibold text-white">
                              Apply insurance to shipment
                            </span>
                          </label>
                        </div>

                        {/* Confirm Shipping Button */}
                        <button
                          disabled={selectedItems.length === 0 || !shippingMethod}
                          className="w-full bg-gradient-to-r from-white to-appBanner text-appTitleBgColor mt-8 py-4 px-6 rounded-xl font-semibold hover:from-white/90 hover:to-appBanner/90 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                          {/* Button background animation */}
                          <div className="absolute inset-0 bg-gradient-to-r from-appBanner to-appNav opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="w-6 h-6 bg-appTitleBgColor/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors relative z-10">
                            <Plus size={14} className="text-appTitleBgColor group-hover:text-white transition-colors" />
                          </div>
                          <span className="relative z-10 group-hover:text-white transition-colors">
                            Create Shipment
                          </span>
                          <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform group-hover:text-white transition-colors" />
                        </button>
                      </div>
                    </div>
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
    </div>
  );
};

export default ShippingPage;