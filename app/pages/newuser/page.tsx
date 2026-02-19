// src/app/user/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
    FiTrendingUp,
    FiTrendingDown,
    FiCopy,
    FiX,
    FiPlus,
    FiTrash2,
    FiMapPin,
    FiBox,
    FiTruck,
    FiZap,
    FiDollarSign,
    FiPackage,
    FiArrowRight,
    FiChevronDown,
    FiCalendar,
    FiLayers
} from 'react-icons/fi';
import {
    FaInbox,
    FaBoxOpen,
    FaQuestionCircle
} from "react-icons/fa";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import Image from 'next/image';
import logo from '../../../public/images/location.png';
import packageImage from '../../../public/images/location.png';
import Heading from '@/app/components/generalheading/Heading';
import { UserResponseDTO } from '@/types/admin';
import { getMyProfile, getSupportedCountries } from '@/lib/user/actions';
import { calculateShippingRate, getAllBookings, getAllBookingsA, getUserBookingSummary } from '@/lib/user/booking.actions';
import { CountryDTO } from '@/types/user';
import { BookingFilterParams, FilterBookingViewDTO, ShippingRateRequest } from '@/types/booking';
import { MapPin, Package } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

type TimeRange = '12 Months' | '30 Days' | '7 Days' | 'Today';
type PackageStatus = 'received' | 'in transit' | 'delivered';
type ShippingMethod = 'Standard' | 'Express' | 'Economy' | 'Consolidate';

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string | string[];
        borderColor: string | string[];
        borderWidth: number;
    }[];
}

interface StatusData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
    }[];
}

interface Package {
    id: string;
    name: string;
    status: PackageStatus;
    dateReceived: string;
    vendor: string;
    trackingNumber: string;
}

interface IncomingPackage {
    id: string;
    packageNumber: string;
    shippingLocation: string;
    status: 'Processing' | 'In Transit' | 'Delivered';
    estimatedDelivery: string;
    weight: number;
    dimensions: string;
    shippingMethod: ShippingMethod;
    cost: number;
    createdAt: string;
}

interface ShippingCalculatorState {
    originCountry: string;
    destinationCountry: string;
    weight: string;
    dimensions: string;
    shippingMethod: ShippingMethod;
}

const UserDashboard = () => {




    const [timeRange, setTimeRange] = useState<TimeRange>('30 Days');
    const [copied, setCopied] = useState(false);
    const [trackingCopied, setTrackingCopied] = useState<string | null>(null);
    const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
    const [consolidatedPackages, setConsolidatedPackages] = useState<string[]>([]);
    const [showShippingInstructions, setShowShippingInstructions] = useState(false);
    const [incomingPackages, setIncomingPackages] = useState<IncomingPackage[]>([]);
    const [uniqueId, setuniqueId] = useState<string | null>(null);
    // Represents a dictionary like: { "RECEIVED": 24, "IN_TRANSIT": 8 }
    const [statusSummary, setStatusSummary] = useState<Record<string, number>>({});

    // const uniqueId = 'BQ-JD-12345-US';

    // Shipping Calculator State
    const [calculator, setCalculator] = useState<ShippingCalculatorState>({
        originCountry: '',
        destinationCountry: '',
        weight: '',
        dimensions: '',
        shippingMethod: 'Standard'
    });

    const [calculatorPayload, setCalculatorPayload] = useState<ShippingRateRequest>({
        originCountry: '',
        originState: '',
        destinationCountry: '',
        destinationState: '',
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        shippingMethodCode: 'STANDARD',
        declaredValue: 0,
        includeInsurance: true,
        pickupRequired: false,
        productCategory: '',
        itemDescription: '',
        promoCode: '',
        hsCode: ''
    });

    // Helper for dimensions (kept for UI compatibility)
    const [uiDimensions, setUiDimensions] = useState('');

    // 1. New States for Real Data
    const [profile, setProfile] = useState<UserResponseDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [country, setCountry] = useState<CountryDTO[]>([]);
    // New state for API feedback
    const [calculating, setCalculating] = useState(false);
    const [estimatedCostValue, setEstimatedCostValue] = useState(0);
    const [realPackages, setRealPackages] = useState<FilterBookingViewDTO[]>([]);
    const [realIncomingPackages, setRealIncomingPackages] = useState<FilterBookingViewDTO[]>([]);

    const [perPage, setPerPage] = useState(10); // Default to 10 items
    const [currentPage, setCurrentPage] = useState(1); // Default to page 1
    const [statusFilter, setStatusFilter] = useState<PackageStatus | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const statusMapping: Record<string, string> = {
        'Received': 'RECEIVED',
        'In Transit': 'IN_TRANSIT',
        'Awaiting Shipment': 'AWAITING_SHIPMENT',
        'Unclaimed Item': 'UNCLAIMED_ITEMS',
        'Consolidated Packages': 'CONSOLIDATED',
        'All': '' // Empty string typically returns all in Spring Boot
    };


    // 2. The Complete useEffect Implementation
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);

                // Call both APIs
                const profileData = await getMyProfile();
                const summaryData = await getUserBookingSummary(); // Use await here

                console.log(statusSummary);

                // 1. Handle Profile
                setuniqueId(profileData.uniqueId);
                setProfile(profileData as unknown as UserResponseDTO);

                // 2. Handle Summary using Reduce
                // We turn the Array into a Dictionary for the Stat Cards
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

        fetchProfileData();
    }, []);


    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data = await getSupportedCountries();
                setCountry(data);
                console.log(data)
                // Optional: If you want to automatically set the first country 
                // as the default in your calculator
                if (data.length > 0 && !calculator.destinationCountry) {
                    setCalculator(prev => ({
                        ...prev,
                        destinationCountry: data[0].countryName,
                        originCountry: data[0].countryName
                    }));
                }
            } catch (error) {
                console.error("Dashboard Country Sync Error:", error);
            }
        };

        fetchCountries();
    }, []);



    useEffect(() => {
        const getRate = async () => {
            // 1. Validation: Only fire if we have the basics
            if (!calculatorPayload.originCountry ||
                !calculatorPayload.destinationCountry ||
                calculatorPayload.weight <= 0) {
                return;
            }

            try {
                setCalculating(true);

                // 2. Plain API call (Removed the controller.signal)
                const response = await calculateShippingRate(calculatorPayload, "USD");

                setEstimatedCostValue(response?.totalWithCustoms);
                console.log(response)
                setError(null);
            } catch (err: any) {
                console.error("Shipping Rate Error:", err.message);
                setError("Service unavailable");
            } finally {
                setCalculating(false);
            }
        };

        // 3. Fire immediately on click
        getRate();

    }, [calculatorPayload.shippingMethodCode]); // Only runs when method changes

    useEffect(() => {
        const fetchRecentBookings = async () => {
            try {
                const response = await getAllBookingsA({
                    page: 1,
                    per_page: 3
                });

                console.log("Full API Response:", response);

                // 1. Spring Boot Paged responses put data in .content
                // 2. We use optional chaining and a fallback to an empty array []
                const dataToSet = response?.content || (Array.isArray(response) ? response : []);

                setRealPackages(dataToSet);

            } catch (err) {
                console.error("Fetch failed:", err);
                setRealPackages([]); // Ensure it's never undefined
            }
        };

        fetchRecentBookings();
    }, []);

    useEffect(() => {
        const fetchRecentBookings = async () => {
            try {
                const response = await getAllBookingsA({
                    page: 1,
                    per_page: 5,
                    status: 'IN_TRANSIT'
                });

                console.log("Full API Response:", response);

                // 1. Spring Boot Paged responses put data in .content
                // 2. We use optional chaining and a fallback to an empty array []
                const dataToSet = response?.content || (Array.isArray(response) ? response : []);

                setRealIncomingPackages(dataToSet);

            } catch (err) {
                console.error("Fetch failed:", err);
                setRealPackages([]); // Ensure it's never undefined
            }
        };

        fetchRecentBookings();
    }, []);



    {/* 1. Define a helper to map UI Titles to your API Keys */ }
    const statMapping: Record<string, string> = {
        'Received': 'RECEIVED',
        'In Transit': 'IN_TRANSIT',
        'Awaiting Shipment': 'AWAITING_SHIPMENT',
        'Unclaimed Items': 'UNCLAIMED_ITEMS'
    };

    // ... (your existing state: timeRange, calculator, incomingPackages, etc.)

    // 3. Loading State UI (Optional but recommended)
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-appTitleBgColor">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    // Mock packages data
    const packages: Package[] = [
        {
            id: 'PKG-1001',
            name: 'Summer Collection Bundle',
            status: 'received',
            dateReceived: '2023-06-15',
            vendor: 'Nike.com',
            trackingNumber: 'TRK123456789'
        },
        {
            id: 'PKG-1002',
            name: 'Electronics Package',
            status: 'in transit',
            dateReceived: '2023-06-18',
            vendor: 'Amazon.com',
            trackingNumber: 'TRK987654321'
        },
        {
            id: 'PKG-1003',
            name: 'Office Supplies',
            status: 'delivered',
            dateReceived: '2023-06-20',
            vendor: 'Staples.com',
            trackingNumber: 'TRK456123789'
        }
    ];

    // Country options
    const countries = [
        'United States',
        'Canada',
        'United Kingdom',
        'Germany',
        'France',
        'Australia',
        'Japan',
        'Brazil',
        'Nigeria',
        'South Africa'
    ];

    // Calculate estimated cost based on inputs
    const calculateEstimatedCost = () => {
        if (!calculator.weight || !calculator.destinationCountry) return 0;

        const weight = parseFloat(calculator.weight);
        const baseRate = 10;

        // Calculate volumetric weight if dimensions are provided
        let volumetricWeight = 0;
        if (calculator.dimensions) {
            const dimensions = calculator.dimensions.split(/[×x]/).filter(Boolean);
            if (dimensions.length === 3) {
                const [length, width, height] = dimensions.map(d => parseFloat(d) || 0);
                const volume = (length * width * height) / 5000;
                volumetricWeight = volume;
            }
        }

        const chargeableWeight = Math.max(weight, volumetricWeight);

        // Shipping method multipliers
        const methodMultipliers = {
            'Standard': 1,
            'Express': 1.8,
            'Economy': 0.7,
            'Consolidate': 0.6
        };

        // Destination surcharge
        const destinationSurcharge = calculator.destinationCountry === 'Australia' ||
            calculator.destinationCountry === 'Japan' ? 15 : 0;

        const cost = (baseRate * chargeableWeight * methodMultipliers[calculator.shippingMethod]) + destinationSurcharge;

        return Math.round(cost * 100) / 100;
    };

    const estimatedCost = calculateEstimatedCost();

    const handleCalculatorChange = (field: keyof ShippingCalculatorState, value: string) => {
        setCalculator(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleShippingRateChange = (field: keyof ShippingRateRequest, value: string | number | boolean) => {

        setCalculatorPayload(prev => ({
            ...prev,
            [field]: value
        }));
        console.log(calculatorPayload);
    };

    const createShipment = () => {
        if (!calculator.destinationCountry || !calculator.weight) {
            alert('Please fill in required fields: Destination Country and Weight');
            return;
        }

        const newPackage: IncomingPackage = {
            id: Date.now().toString(),
            packageNumber: `PKG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            shippingLocation: `From ${calculator.destinationCountry}`,
            status: 'Processing',
            estimatedDelivery: getEstimatedDeliveryDate(calculator.shippingMethod),
            weight: parseFloat(calculator.weight),
            dimensions: calculator.dimensions ? `${calculator.dimensions}cm` : 'Not specified',
            shippingMethod: calculator.shippingMethod,
            cost: estimatedCost,
            createdAt: new Date().toISOString()
        };

        setIncomingPackages(prev => [newPackage, ...prev]);

        // Reset calculator
        setCalculator({
            originCountry: '',
            destinationCountry: '',
            weight: '',
            dimensions: '',
            shippingMethod: 'Standard'
        });
    };

    const getEstimatedDeliveryDate = (method: ShippingMethod): string => {
        const today = new Date();
        const deliveryDays = {
            'Standard': 7,
            'Express': 3,
            'Economy': 12,
            'Consolidate': 14
        };

        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + deliveryDays[method]);
        return deliveryDate.toLocaleDateString();
    };

    const deleteIncomingPackage = (id: string) => {
        setIncomingPackages(prev => prev.filter(pkg => pkg.id !== id));
    };

    const copyToClipboard = (text: string, type: 'id' | 'tracking') => {
        navigator.clipboard.writeText(text)
            .then(() => {
                if (type === 'id') {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } else {
                    setTrackingCopied(text);
                    setTimeout(() => setTrackingCopied(null), 2000);
                }
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    };

    const togglePackageExpand = (packageId: string) => {
        setExpandedPackage(expandedPackage === packageId ? null : packageId);
    };

    const toggleConsolidation = (packageId: string) => {
        setConsolidatedPackages(prev =>
            prev.includes(packageId)
                ? prev.filter(id => id !== packageId)
                : [...prev, packageId]
        );
    };

    const toggleShippingInstructions = () => {
        setShowShippingInstructions(!showShippingInstructions);
    };

    // Data generator function
    const generateData = (range: TimeRange) => {
        let mainLabels: string[] = [];
        let mainData: number[] = [];

        switch (range) {
            case '12 Months':
                mainLabels = Array.from({ length: 12 }, (_, i) =>
                    new Date(0, i).toLocaleString('default', { month: 'short' })
                );
                mainData = mainLabels.map(() => Math.floor(Math.random() * 1000) + 200);
                break;
            case '30 Days':
                mainLabels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
                mainData = mainLabels.map(() => Math.floor(Math.random() * 200) + 50);
                break;
            case '7 Days':
                mainLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                mainData = mainLabels.map(() => Math.floor(Math.random() * 300) + 100);
                break;
            case 'Today':
                mainLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
                mainData = mainLabels.map((_, i) =>
                    Math.floor(Math.random() * 50 * (i > 8 && i < 18 ? 2 : 1)) + 20
                );
                break;
        }

        const backgroundColors = mainLabels.map((_, index) => {
            const hue = (index * 30) % 360;
            return `hsla(${hue}, 80%, 60%, 0.7)`;
        });

        const borderColors = mainLabels.map((_, index) => {
            const hue = (index * 30) % 360;
            return `hsla(${hue}, 80%, 60%, 1)`;
        });

        const mainChartData: ChartData = {
            labels: mainLabels,
            datasets: [{
                label: 'Shipments',
                data: mainData,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
            }]
        };

        const statusData: StatusData = {
            labels: ['Received', 'In Transit', 'Awaiting Shipping', 'Unclaimed'],
            datasets: [{
                data: [
                    Math.floor(Math.random() * 100) + 50,
                    Math.floor(Math.random() * 80) + 30,
                    Math.floor(Math.random() * 60) + 20,
                    Math.floor(Math.random() * 40) + 10
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(244, 63, 94, 0.7)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(244, 63, 94, 1)'
                ],
                borderWidth: 1
            }]
        };

        return { mainChartData, statusData };
    };

    const { mainChartData, statusData } = generateData(timeRange);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label}: ${context.raw}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 0.6)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 0.6)'
                }
            }
        },
        animation: {
            duration: 1000
        }
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        cutout: '70%',
    };

    const getStatusColor = (status: PackageStatus | 'Processing' | 'In Transit' | 'Delivered') => {
        switch (status) {
            case 'received':
            case 'Processing':
                return 'bg-blue-100 text-blue-800';
            case 'in transit':
            case 'In Transit':
                return 'bg-amber-100 text-amber-800';
            case 'delivered':
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Shipping instructions content
    const shippingInstructions = [
        {
            title: '1.1 Package Acceptance Policy',
            items: [
                'Permitted Items:',
                '• Clothing, books, electronics, gadgets, accessories, household goods',
                '• Items below $5000 declared value (higher value items require prior approval)',
                'Restricted/Prohibited Items (Phase 1):',
                '• Perishables (strict no in MVP)',
                '• Gold, cash, and other valuables',
                '• Liquids, explosives, flammable or radioactive materials',
                '• Food (under review for later release, permitted only with mandatory monthly shipment cycle)'
            ]
        },
        {
            title: '1.2 Intake Checks & Tagging',
            items: [
                'Each received item is:',
                '• Inspected for external damage',
                '• Weighed and photographed',
                '• Scanned and assigned a barcode label',
                '• Logged with user ID and timestamp in the inventory system'
            ]
        },
        {
            title: '1.3 Unshippable or Unclaimed Items',
            items: [
                '• Items that violate policy will be held for 14 days and returned to sender or discarded',
                '• Users are notified immediately via dashboard and email',
                '• Unclaimed items (60+ days) will attract a warehousing penalty or auction policy (TBD)'
            ]
        },
        {
            title: '1.4 Theft & Damage Mitigation',
            items: [
                '• 24/7 warehouse surveillance',
                '• Staff background checks and access monitoring',
                '• Barcode-based internal package movement tracking',
                '• Random internal audits'
            ]
        },
        {
            title: '1.5 Repacking & Consolidation',
            items: [
                '• Repacking is done to reduce bulk and save shipping costs',
                '• Fragile items are double-wrapped',
                '• Each consolidation is video-recorded and linked to user dashboard for verification'
            ]
        },
        {
            title: '1.6 Delivery Scheduling',
            items: [
                '• Currently capped at Monthly Deliveries per user in MVP phase',
                '• Additional plans (weekly, bi-weekly, quarterly) to be unlocked per tier in future releases',
                '• Max orders per delivery: 10 packages or 30kg (Phase 1)'
            ]
        },
        {
            title: '1.7 Insurance & Liability',
            items: [
                '• Goods-in-Transit Insurance included in shipping fee up to $500 per shipment',
                '• Additional coverage can be purchased at checkout',
                '• Liability waivers and terms accepted on sign-up and at each payment transaction'
            ]
        },
        {
            title: '1.8 Operational Tools & Tech',
            items: [
                '• Use of handheld barcode scanners at intake and repack stations',
                '• Integrated inventory tracking software',
                '• Alerts for weight mismatches and unusual items'
            ]
        },
        {
            title: '1.9 Terms & Conditions Enforcement',
            items: [
                '• Clear terms presented at sign-up and checkout',
                '• Users must acknowledge shipping liability, declaration accuracy, and compliance with customs and regulatory policies',
                '• Penalties for policy violation: fines, package confiscation, or account suspension'
            ]
        }
    ];

    return (
        <div className="relative pb-8">
            {/* Shipping Instructions Modal */}
            {showShippingInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-appTitleBgColor rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-appNav p-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Shipping Instructions & Operations Manual</h3>
                            <button
                                onClick={toggleShippingInstructions}
                                className="text-white hover:text-white"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            {shippingInstructions.map((section, index) => (
                                <div key={index} className="mb-8">
                                    <h4 className="text-lg font-semibold text-white mb-3">{section.title}</h4>
                                    <ul className="space-y-2 text-white">
                                        {section.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className={item.startsWith('•') ? 'pl-4' : ''}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="sticky bottom-0 bg-appNav p-4 border-t flex justify-end">
                            <button
                                onClick={toggleShippingInstructions}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-appTitleBgColor transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Heading level="h4" color="light" className="font-bold mb-6 ">
                Your BulQ Warehouse
            </Heading>

            {/* Warehouse and shipping instructions section */}
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-appTitleBgColor p-4 md:p-6 mb-8 rounded-lg min-h-[8rem] md:h-32">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                    <div className='flex-shrink-0'>
                        <Image
                            src={logo}
                            alt="Warehouse location"
                            width={48}
                            height={48}
                            className="w-10 h-10 md:w-12 md:h-12"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className='font-sans font-bold text-lg md:text-xl text-white'>
                            {profile?.hubName}
                        </p>
                        <p className='font-san font-medium text-xs md:text-sm text-white/90'>
                            <span className="block md:inline">{profile?.hubAddress}</span>
                            {/* <span className="block md:inline">Suite 456,</span>
                            <span className="block md:inline">Newark, NJ 07101,</span>
                            <span className="block md:inline">United States</span> */}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between xs:justify-end gap-3 w-full md:w-auto">
                    <div className='flex flex-col p-2 text-white'>
                        <div className="flex items-center gap-1">
                            <p className='text-xs font-semibold'>
                                YOUR UNIQUE ID:
                            </p>
                            <button
                                onClick={() => copyToClipboard(uniqueId!, 'id')}
                                className="text-white hover:text-gray-200 transition-colors flex items-center justify-center gap-1"
                                aria-label="Copy to clipboard"
                            >
                                <FiCopy className="w-3 h-3" />
                                <span className="text-xs">copy</span>
                            </button>
                            {copied && (
                                <span className="text-xs text-green-300 ml-1">Copied!</span>
                            )}
                        </div>
                        <p className='font-semibold text-sm md:text-base'>
                            {uniqueId}
                        </p>
                    </div>

                    <div className='flex p-2'>
                        <button
                            onClick={toggleShippingInstructions}
                            className='flex flex-row items-center justify-center border-2 border-appNav text-xs px-3 py-1.5 rounded-md text-white bg-appNav hover:bg-appTitleBgColor whitespace-nowrap'
                        >
                            <span>View Shipping Instructions</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards Section */}
            <div className="flex flex-col w-full p-6 bg-gradient-to-b from-appTitleBgColor to-appNav rounded-2xl shadow-xl mb-6">
                <p className='font-sans font-medium text-lg text-white/90 mb-6'>
                    Here's what's happening with your packages today.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* {[
                        {
                            title: 'Received',
                            value: '24',
                            icon: <FaInbox className="text-white" size={20} />,
                            bg: 'bg-gradient-to-br from-blue-500 to-cyan-400'
                        },
                        {
                            title: 'In Transit',
                            value: '8',
                            icon: <FiTruck className="text-white" size={20} />,
                            bg: 'bg-gradient-to-br from-amber-500 to-orange-400'
                        },
                        {
                            title: 'Awaiting Shipment',
                            value: '42',
                            icon: <FaBoxOpen className="text-white" size={20} />,
                            bg: 'bg-gradient-to-br from-purple-500 to-pink-400'
                        },
                        {
                            title: 'Unclaimed Items',
                            value: '156',
                            icon: <FaQuestionCircle className="text-white" size={20} />,
                            bg: 'bg-gradient-to-br from-rose-500 to-red-400'
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
                    ))} */}
                    {[
                        {
                            title: 'Received',
                            value: (statusSummary[statMapping['Received']] || 0).toString(),
                            icon: <FaInbox className="text-white" size={20} />,
                            bg: 'bg-gradient-to-br from-blue-500 to-cyan-400'
                        },
                        {
                            title: 'In Transit',
                            value: (statusSummary[statMapping['In Transit']] || 0).toString(),
                            icon: <FiTruck className="text-white" size={20} />,
                            bg: 'bg-gradient-to-br from-amber-500 to-orange-400'
                        },
                        {
                            title: 'Awaiting Shipment',
                            value: (statusSummary[statMapping['Awaiting Shipment']] || 0).toString(),
                            icon: <FaBoxOpen className="text-white" size={20} />,
                            bg: 'bg-gradient-to-br from-purple-500 to-pink-400'
                        },
                        {
                            title: 'Unclaimed Items',
                            value: (statusSummary[statMapping['Unclaimed Items']] || 0).toString(),
                            icon: <FaQuestionCircle className="text-white" size={20} />,
                            bg: 'bg-gradient-to-br from-rose-500 to-red-400'
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
                                    style={{ width: `${Math.min(100, parseInt(stat.value))}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Overview Charts Section */}
            <div className="bg-gradient-to-t from-appTitleBgColor to-appNav p-6 rounded-lg shadow-xl mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h5 className="text-lg font-bold text-white">Shipping Overview</h5>
                    <div className="flex space-x-2 mt-3 md:mt-0">
                        {(['12 Months', '30 Days', '7 Days', 'Today'] as TimeRange[]).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === range
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Main Chart with multi-colored bars */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h5 className="text-md font-medium text-gray-700 mb-4">
                            Shipments {timeRange.toLowerCase()}
                        </h5>
                        <div className="h-64">
                            <Bar data={mainChartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Breakdown Chart */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h5 className="text-md font-medium text-gray-700 mb-4">
                            Delivery Status Breakdown
                        </h5>
                        <div className="flex flex-col lg:flex-row items-center">
                            <div className="h-64 w-64 mx-auto">
                                <Doughnut data={statusData} options={doughnutOptions} />
                            </div>
                            <div className="mt-4 lg:mt-0 lg:ml-8">
                                <ul className="space-y-3">
                                    {statusData.labels.map((label, index) => (
                                        <li key={index} className="flex items-center">
                                            <span
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{
                                                    backgroundColor: statusData.datasets[0].backgroundColor[index]
                                                }}
                                            ></span>
                                            <span className="text-sm text-gray-600">
                                                {label}: {statusData.datasets[0].data[index]}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Rate Calculator Section */}
            {/* Shipping Rate Calculator Section - RESTORED INITIAL DESIGN */}
            <div className="bg-gradient-to-b from-appTitleBgColor to-appNav p-8 rounded-2xl shadow-2xl mb-8 relative overflow-hidden">
                {/* Enhanced Background Elements (RESTORED) */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full -translate-y-40 translate-x-40"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-400/10 to-cyan-500/10 rounded-full translate-y-36 -translate-x-36"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-violet-400/5 to-fuchsia-400/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h5 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-white mb-2">
                                Shipping Rate Calculator
                            </h5>
                            <p className="text-white text-sm font-medium">Get instant shipping quotes and manage your packages</p>
                        </div>
                        <div className="hidden lg:block">
                            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <FiPackage className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-800">{incomingPackages.length}</div>
                                    <div className="text-xs text-slate-500">Packages</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Split (RESTORED) */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                        {/* Calculator Form - USING INITIAL WHITE CARD DESIGN */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="space-y-6">

                                {/* 1. Route Information (Origin & Destination + States) */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                                            <FiMapPin className="w-4 h-4 text-white" />
                                        </div>
                                        Route Information <span className="text-rose-500 ml-1">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Origin Group */}
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <select
                                                    value={calculatorPayload.originCountry}
                                                    onChange={(e) => handleShippingRateChange('originCountry', e.target.value)}
                                                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 appearance-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                                                >
                                                    <option value="">Origin Country</option>
                                                    {country.map((c) => (
                                                        <option key={c.id} value={c.countryCode}>{c.countryName}</option>
                                                    ))}
                                                </select>
                                                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Origin State/Province"
                                                value={calculatorPayload.originState}
                                                onChange={(e) => handleShippingRateChange('originState', e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                                            />
                                        </div>
                                        {/* Destination Group */}
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <select
                                                    value={calculatorPayload.destinationCountry}
                                                    onChange={(e) => handleShippingRateChange('destinationCountry', e.target.value)}
                                                    className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 appearance-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                                                >
                                                    <option value="">Destination Country</option>
                                                    {country.map((c) => (
                                                        <option key={c.id} value={c.countryCode}>{c.countryName}</option>
                                                    ))}
                                                </select>
                                                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Destination State/Province"
                                                value={calculatorPayload.destinationState}
                                                onChange={(e) => handleShippingRateChange('destinationState', e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Weight and Dimensions */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                                                <FiLayers className="w-4 h-4 text-white" />
                                            </div>
                                            Weight (kg) <span className="text-rose-500 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={calculatorPayload.weight || ''}
                                                onChange={(e) => handleShippingRateChange('weight', parseFloat(e.target.value))}
                                                placeholder="0.0"
                                                className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">kg</span>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                                                <FiBox className="w-4 h-4 text-white" />
                                            </div>
                                            Dimensions (cm)
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <input
                                                type="number"
                                                value={calculatorPayload.length || ''}
                                                onChange={(e) => handleShippingRateChange('length', parseFloat(e.target.value))}
                                                placeholder="L"
                                                className="w-full px-2 py-3.5 bg-white border border-slate-300 rounded-xl text-center text-slate-800 focus:ring-2 focus:ring-amber-500/50 shadow-sm"
                                            />
                                            <input
                                                type="number"
                                                value={calculatorPayload.width || ''}
                                                onChange={(e) => handleShippingRateChange('width', parseFloat(e.target.value))}
                                                placeholder="W"
                                                className="w-full px-2 py-3.5 bg-white border border-slate-300 rounded-xl text-center text-slate-800 focus:ring-2 focus:ring-amber-500/50 shadow-sm"
                                            />
                                            <input
                                                type="number"
                                                value={calculatorPayload.height || ''}
                                                onChange={(e) => handleShippingRateChange('height', parseFloat(e.target.value))}
                                                placeholder="H"
                                                className="w-full px-2 py-3.5 bg-white border border-slate-300 rounded-xl text-center text-slate-800 focus:ring-2 focus:ring-amber-500/50 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Description & Category */}
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Item Description <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            value={calculatorPayload.itemDescription}
                                            onChange={(e) => handleShippingRateChange('itemDescription', e.target.value)}
                                            placeholder="e.g. 2 pairs of leather shoes"
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Category <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                value={calculatorPayload.productCategory}
                                                onChange={(e) => handleShippingRateChange('productCategory', e.target.value)}
                                                placeholder="Electronics, Apparel..."
                                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Declared Value (USD) <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                value={calculatorPayload.declaredValue || ''}
                                                onChange={(e) => handleShippingRateChange('declaredValue', parseFloat(e.target.value))}
                                                placeholder="Value in USD"
                                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Codes & Options (HS Code, Promo Code) */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">HS Code (Optional)</label>
                                        <input
                                            type="text"
                                            value={calculatorPayload.hsCode}
                                            onChange={(e) => handleShippingRateChange('hsCode', e.target.value)}
                                            placeholder="Customs Code"
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Promo Code</label>
                                        <input
                                            type="text"
                                            value={calculatorPayload.promoCode}
                                            onChange={(e) => handleShippingRateChange('promoCode', e.target.value)}
                                            placeholder="Enter Code"
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* 5. Toggles (Insurance & Pickup) */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={calculatorPayload.includeInsurance}
                                                onChange={(e) => handleShippingRateChange('includeInsurance', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">Include Insurance</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={calculatorPayload.pickupRequired}
                                                onChange={(e) => handleShippingRateChange('pickupRequired', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">Request Pickup</span>
                                        </label>
                                    </div>
                                </div>

                                {/* 6. Shipping Method Selection (EXISTING DESIGN) */}
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                            <FiTruck className="w-4 h-4 text-white" />
                                        </div>
                                        Shipping Method
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { value: 'STANDARD', label: 'STANDARD', days: '5-7 days', icon: FiTruck, gradient: 'from-blue-500 to-cyan-500' },
                                            { value: 'EXPRESS', label: 'EXPRESS', days: '2-3 days', icon: FiZap, gradient: 'from-emerald-500 to-green-500' },
                                            { value: 'ECONOMY', label: 'ECONOMY', days: '10-14 days', icon: FiDollarSign, gradient: 'bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-500' },
                                            { value: 'CONSOLIDATE', label: 'CONSOLIDATE', days: 'Next shipment', icon: FiPackage, gradient: 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500' },
                                        ].map((method) => {
                                            const Icon = method.icon;
                                            const isSelected = calculatorPayload.shippingMethodCode === method.value;
                                            return (
                                                <div
                                                    key={method.value}
                                                    onClick={() => handleShippingRateChange('shippingMethodCode', method.value as ShippingMethod)}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${isSelected
                                                        ? `bg-gradient-to-br ${method.gradient} border-transparent text-white shadow-lg`
                                                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:shadow-md'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Icon className="w-4 h-4" />
                                                        <div className={`w-3 h-3 rounded-full border-2 ${isSelected ? 'bg-white border-white' : 'bg-white border-slate-400'}`} />
                                                    </div>
                                                    <div className="font-semibold text-sm">{method.label}</div>
                                                    <div className={`text-xs mt-1 ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>{method.days}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 7. Estimated Cost Display (EXISTING DESIGN) */}
                                <div className="bg-gradient-to-b from-appTitleBgColor to-appNav p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <label className="block text-sm font-semibold text-white/90 mb-1">Estimated Cost</label>
                                            <p className="text-white/80 text-sm">📦 Bulk discounts available</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-white drop-shadow-sm">${estimatedCostValue}</div>
                                            <div className="text-white/80 text-sm mt-1 font-medium">All fees included</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 8. Action Button (EXISTING DESIGN) */}
                                <button
                                    onClick={createShipment}
                                    disabled={!calculatorPayload.destinationCountry || !calculatorPayload.weight}
                                    className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3 group"
                                >
                                    <FiPlus className="w-3 h-3 text-white" />
                                    Create Shipment
                                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Incoming Packages Section (RESTORED INITIAL DESIGN) */}
                        {/* Incoming Packages Section */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/80 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h5 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                                        Incoming Packages
                                    </h5>
                                    <p className="text-slate-600 text-sm mt-1">Track your shipment progress</p>
                                </div>
                                <span className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                    {realIncomingPackages.length}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* 1. Empty State Check */}
                                {realIncomingPackages.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                                        No incoming packages at the moment.
                                    </div>
                                ) : (
                                    /* 2. Map the Data */
                                    realIncomingPackages.map((pkg, index) => (
                                        <div
                                            key={pkg.trackingNumber || index}
                                            className="group bg-white rounded-xl p-4 border border-slate-100 hover:border-blue-500/30 hover:shadow-md transition-all duration-300 cursor-pointer"
                                        // Optional: Add click handler to view details
                                        // onClick={() => router.push(`/tracking/${pkg.trackingNumber}`)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {/* Icon Box */}
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                                        <Package className="w-5 h-5" />
                                                    </div>

                                                    {/* Details */}
                                                    <div>
                                                        <h6 className="font-bold text-slate-800 text-sm">
                                                            {pkg.trackingNumber}
                                                        </h6>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {pkg.address || 'Origin'}
                                                                <span className="text-slate-300">→</span>
                                                                {pkg.receiver_address || 'Dest'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <div className="text-right">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${pkg.deliveryStatus === 'IN_TRANSIT'
                                                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                        }`}>
                                                        {pkg.deliveryStatus?.replace('_', ' ')}
                                                    </span>
                                                    <p className="text-[10px] text-slate-400 mt-1">
                                                        {pkg.dropoff_date ? new Date(pkg.dropoff_date).toLocaleDateString() : 'Just now'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Packages Section */}
            <div className="bg-appTitleBgColor p-6 rounded-lg shadow-sm mb-6 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h2 className="text-lg font-medium text-white">My Packages</h2>
                    <button className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors mt-3 md:mt-0">
                        View All Packages
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {realPackages?.map((pkg) => (
                        <div key={pkg.id} className="relative">
                            <div
                                className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer h-28 flex flex-col ${expandedPackage === pkg.id.toString() ? 'shadow-md' : ''}`}
                                onClick={() => togglePackageExpand(pkg.id.toString())}
                            >
                                <div className="flex items-start gap-4 flex-grow">
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={pkg.packageImage!}
                                            alt="Package"
                                            width={80}
                                            height={80}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        {/* Use real DTO fields */}
                                        <h5 className="font-medium text-gray-900 line-clamp-1">{pkg.package_name || 'Unnamed Package'}</h5>
                                        <div className="flex items-center gap-0 mt-1 text-sm text-gray-500">
                                            <span>ID: {pkg.trackingNumber}</span>
                                            <span>•</span>
                                            {/* Assuming pick_up_date is string "YYYY-MM-DD" */}
                                            <span>{pkg.pick_up_date.split(' ')[0]}</span>
                                        </div>
                                        <div className="mt-auto">
                                            {/* Assuming status is not in DTO, defaulting to Received or mapping logic */}
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800`}>
                                                {pkg.shipment_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {expandedPackage === pkg.id.toString() && (
                                <div className="relative z-10 w-full mt-1 border rounded-lg bg-white shadow-lg">
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700">Destination</h4>
                                                <p className="text-sm text-gray-900">{pkg.city}, {pkg.country}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-700">Tracking Number</h4>
                                                <div className="flex items-center gap-1">
                                                    <p className="text-sm text-gray-900">{pkg.trackingNumber || 'N/A'}</p>
                                                    {pkg.trackingNumber && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copyToClipboard(pkg.trackingNumber, 'tracking');
                                                            }}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            <FiCopy className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex-1 px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                            >
                                                Track Package
                                            </button>
                                            <div className="flex-1 text-right self-center text-sm font-bold text-slate-800">
                                                ${pkg.shipping_amount}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;