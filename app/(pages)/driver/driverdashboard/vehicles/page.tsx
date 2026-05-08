"use client";
import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";
import { Search, Filter, Eye, MoreVertical, Car, MapPin, FileText, AlertCircle, Clock, CheckCircle, X, Calendar, User, Navigation, BarChart3, Fuel, Gauge, Wrench, Package, Scale } from 'lucide-react';
import { useState } from 'react';

interface Vehicle {
    id: string;
    type: string;
    model: string;
    status: 'active' | 'maintenance' | 'inactive';
    mileage: number;
    fuel: number;
    utilization: number;
    plateNumber: string;
    year: number;
    color: string;
    lastService: string;
    nextService: string;
    assignedDriver?: string;
    currentLocation?: string;
    insuranceExpiry?: string;
    registrationExpiry?: string;
    vin?: string;
    capacity?: string;
    currentLoad?: string;
}

// Vehicle Details Modal Component
const VehicleDetailsModal = ({
    isOpen,
    onClose,
    vehicle
}: {
    isOpen: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
}) => {
    if (!isOpen || !vehicle) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[94vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Car className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Vehicle Details</h2>
                            <p className="text-sm text-gray-500">
                                Comprehensive information about {vehicle.model}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column - Vehicle Information */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Vehicle Information Table */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <Car className="w-5 h-5 text-blue-600" />
                                        Vehicle Information
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Vehicle ID</div>
                                        <div className="px-4 py-3 text-sm text-gray-900">{vehicle.id}</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Type</div>
                                        <div className="px-4 py-3 text-sm text-gray-900 capitalize">{vehicle.type}</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Model</div>
                                        <div className="px-4 py-3 text-sm text-gray-900">{vehicle.model}</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Year</div>
                                        <div className="px-4 py-3 text-sm text-gray-900">{vehicle.year}</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">VIN</div>
                                        <div className="px-4 py-3 text-sm text-gray-900 font-mono">{vehicle.vin || '1FUJGHDV8NLAA1234'}</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">License Plate</div>
                                        <div className="px-4 py-3">
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                                                {vehicle.plateNumber}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Status</div>
                                        <div className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                                                vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {vehicle.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Operational Status Table */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <Gauge className="w-5 h-5 text-green-600" />
                                        Operational Status
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Mileage</div>
                                        <div className="px-4 py-3 text-sm text-gray-900">{vehicle.mileage.toLocaleString()} mi</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Fuel Level</div>
                                        <div className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${vehicle.fuel}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{vehicle.fuel}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Utilization</div>
                                        <div className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: `${vehicle.utilization}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{vehicle.utilization}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Last Maintenance</div>
                                        <div className="px-4 py-3 text-sm text-gray-900">
                                            {vehicle.lastService ? new Date(vehicle.lastService).toLocaleDateString() : '1/15/2024'}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Next Maintenance</div>
                                        <div className="px-4 py-3 text-sm text-gray-900">
                                            {vehicle.nextService ? new Date(vehicle.nextService).toLocaleDateString() : '4/15/2024'}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Insurance Expiry</div>
                                        <div className="px-4 py-3 text-sm text-gray-900">
                                            {vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toLocaleDateString() : '12/31/2024'}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Registration Expiry</div>
                                        <div className="px-4 py-3 text-sm text-gray-900">
                                            {vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toLocaleDateString() : '11/30/2024'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Assignment & Location Table */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-red-600" />
                                        Assignment & Location
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Driver</div>
                                        <div className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                                    JD
                                                </div>
                                                <span className="text-sm text-gray-900">John Doe</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Current Location</div>
                                        <div className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-gray-900">Ontario, CA</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Last updated: 2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Capacity</div>
                                        <div className="px-4 py-3 text-sm text-gray-900">26,000 lbs</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Current Load</div>
                                        <div className="px-4 py-3 text-sm text-gray-900">18,500 lbs</div>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700">Load Utilization</div>
                                        <div className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-purple-500 h-2 rounded-full"
                                                        style={{ width: `60%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">60%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Alerts, Documents, Notes */}
                        <div className="space-y-6">

                            {/* Alerts */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                                        Alerts
                                    </h3>
                                </div>
                                <div className="p-6 text-center">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium">No active alerts</p>
                                    <p className="text-sm text-gray-500 mt-1">All systems are operating normally</p>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                        Documents
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {[
                                        { id: 1, name: 'Registration', type: 'PDF', size: '1.2 MB', status: 'valid' },
                                        { id: 2, name: 'Insurance', type: 'PDF', size: '2.4 MB', status: 'valid' },
                                        { id: 3, name: 'Inspection', type: 'PDF', size: '0.8 MB', status: 'valid' }
                                    ].map((doc) => (
                                        <div key={doc.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-4 h-4 text-red-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                                                        <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Valid
                                                    </span>
                                                    <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        Notes
                                    </h3>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Regular maintenance completed. Good condition.
                                    </p>
                                    <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

                                    <div className="mt-4">
                                        <textarea
                                            placeholder="Add a new note..."
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                                        />
                                        <button className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-appTitleBgColor rounded-lg hover:bg-appBanner transition-colors">
                                            Add Note
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Image/Icon */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                                <Car className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg font-semibold text-gray-800">{vehicle.model}</p>
                                <p className="text-sm text-gray-500 capitalize">{vehicle.type}</p>
                                <p className="text-xs text-gray-400 mt-2">Vehicle #{vehicle.id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-appTitleBgColor rounded-lg hover:bg-appBanner transition-colors">
                        Edit Vehicle
                    </button>
                </div>
            </div>
        </div>
    );
};



const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([
        {
            id: 'CAR-001',
            type: 'toyota',
            model: 'Camry',
            status: 'active',
            mileage: 45892,
            fuel: 78,
            utilization: 60,
            plateNumber: 'TRK-001-NY',
            year: 2024,
            color: 'white',
            lastService: '2024-01-15',
            nextService: '2024-04-15',
            assignedDriver: 'John Doe',
            currentLocation: 'Ontario, CA',
            insuranceExpiry: '2024-12-31',
            registrationExpiry: '2024-11-30',
            vin: '1FUJGHDV8NLAA1234',
            capacity: '26,000 lbs',
            currentLoad: '18,500 lbs'
        },
        {
            id: 'VH-002',
            type: 'truck',
            model: 'Ford F-150',
            status: 'active',
            mileage: 89210,
            fuel: 45,
            utilization: 75,
            plateNumber: 'TRK-002-CA',
            year: 2023,
            color: 'blue',
            lastService: '2024-02-01',
            nextService: '2024-05-01',
            assignedDriver: 'Sarah Wilson',
            currentLocation: 'Los Angeles, CA',
            insuranceExpiry: '2024-11-30',
            registrationExpiry: '2024-10-31'
        },
        {
            id: 'VH-003',
            type: 'van',
            model: 'Mercedes Sprinter',
            status: 'maintenance',
            mileage: 123450,
            fuel: 20,
            utilization: 35,
            plateNumber: 'VAN-003-TX',
            year: 2022,
            color: 'black',
            lastService: '2024-01-20',
            nextService: '2024-02-20',
            assignedDriver: 'Mike Johnson',
            currentLocation: 'Houston, TX',
            insuranceExpiry: '2024-10-31',
            registrationExpiry: '2024-09-30'
        }
    ]);

    const [isVehicleDetailsModalOpen, setIsVehicleDetailsModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Open vehicle details modal
    const openVehicleDetails = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsVehicleDetailsModalOpen(true);
    };

    // Close vehicle details modal
    const closeVehicleDetails = () => {
        setIsVehicleDetailsModalOpen(false);
        setSelectedVehicle(null);
    };

    // Filter vehicles based on search and filters
    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch =
            vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusIcon = (status: Vehicle['status']) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'maintenance':
                return <Wrench className="w-4 h-4 text-yellow-500" />;
            case 'inactive':
                return <Clock className="w-4 h-4 text-gray-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: Vehicle['status']) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium capitalize";
        switch (status) {
            case 'active':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'maintenance':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'inactive':
                return `${baseClasses} bg-gray-100 text-gray-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getFuelBadge = (fuel: number) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (fuel > 70) return `${baseClasses} bg-green-100 text-green-800`;
        if (fuel > 30) return `${baseClasses} bg-yellow-100 text-yellow-800`;
        return `${baseClasses} bg-red-100 text-red-800`;
    };

    const getUtilizationBadge = (utilization: number) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (utilization > 80) return `${baseClasses} bg-green-100 text-green-800`;
        if (utilization > 50) return `${baseClasses} bg-blue-100 text-blue-800`;
        return `${baseClasses} bg-gray-100 text-gray-800`;
    };

    // Calculate statistics
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(vehicle => vehicle.status === 'active').length;
    const maintenanceVehicles = vehicles.filter(vehicle => vehicle.status === 'maintenance').length;
    const inactiveVehicles = vehicles.filter(vehicle => vehicle.status === 'inactive').length;

    return (
        <DriverDashboardLayout>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Fleet Vehicles</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Last updated: Today</span>
                        {/* <button className="flex items-center gap-2 px-4 py-2 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-colors">
                            <Car className="w-4 h-4" />
                            Add Vehicle
                        </button> */}
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Vehicles Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">Total Vehicles</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">{totalVehicles}</p>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Car className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-xs text-blue-500 mt-4 flex items-center">
                            <span className="bg-blue-200 rounded-full px-2 py-1 flex items-center">
                                Entire fleet
                            </span>
                        </p>
                    </div>

                    {/* Active Vehicles Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-green-600 uppercase tracking-wider">Active</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">{activeVehicles}</p>
                            </div>
                            <div className="bg-green-100 p-2 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-xs text-green-500 mt-4 flex items-center">
                            <span className="bg-green-200 rounded-full px-2 py-1 flex items-center">
                                In operation
                            </span>
                        </p>
                    </div>

                    {/* Maintenance Card */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-yellow-600 uppercase tracking-wider">Maintenance</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">{maintenanceVehicles}</p>
                            </div>
                            <div className="bg-yellow-100 p-2 rounded-lg">
                                <Wrench className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-xs text-yellow-500 mt-4">
                            <span className="bg-yellow-200 rounded-full px-2 py-1">Under maintenance</span>
                        </p>
                    </div>

                    {/* Inactive Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Inactive</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">{inactiveVehicles}</p>
                            </div>
                            <div className="bg-gray-100 p-2 rounded-lg">
                                <Clock className="h-6 w-6 text-gray-600" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            <span className="bg-gray-200 rounded-full px-2 py-1">Not in service</span>
                        </p>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-xs p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* Search Input */}
                        <div className="flex-1 w-full lg:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search vehicles by ID, model, or plate number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <div className="relative">
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appBanner focus:border-appBanner bg-appTitleBgColor text-white [&>option:hover]:bg-appBanner"
                                >
                                    <option value="all">All Types</option>
                                    <option value="toyota">Toyota</option>
                                    <option value="truck">Truck</option>
                                    <option value="van">Van</option>
                                    <option value="motorcycle">Motorcycle</option>
                                </select>
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
                            </div>

                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-appBanner focus:border-appBanner bg-appTitleBgColor text-white [&>option:hover]:bg-appBanner"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
                            </div>
                        </div>


                    </div>
                </div>

                {/* Vehicles Table - Full Width */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 bg-appTitleBgColor px-6 py-4">
                        <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">ID</div>
                        <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">TYPE</div>
                        <div className="col-span-2 font-medium text-xs text-white uppercase tracking-wider text-center">MODEL</div>
                        <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">STATUS</div>
                        <div className="col-span-2 font-medium text-xs text-white uppercase tracking-wider text-center">MILEAGE</div>
                        <div className="col-span-2 font-medium text-xs text-white uppercase tracking-wider text-center">FUEL</div>
                        <div className="col-span-2 font-medium text-xs text-white uppercase tracking-wider text-center">UTILIZATION</div>
                        <div className="col-span-1 font-medium text-xs text-white uppercase tracking-wider text-center">ACTIONS</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {filteredVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-colors duration-150 items-center">
                                {/* ID */}
                                <div className="col-span-1 flex items-center justify-center">
                                    <span className="font-medium text-gray-900 text-sm">{vehicle.id}</span>
                                </div>

                                {/* Type */}
                                <div className="col-span-1 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <Car className="text-gray-400 w-4 h-4" />
                                        <span className="text-xs text-gray-600 capitalize">{vehicle.type}</span>
                                    </div>
                                </div>

                                {/* Model */}
                                <div className="col-span-2 flex items-center justify-center">
                                    <span className="text-sm text-gray-600 text-center">{vehicle.model}</span>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-1">
                                        {getStatusIcon(vehicle.status)}
                                        <span className={getStatusBadge(vehicle.status)}>
                                            {vehicle.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Mileage */}
                                <div className="col-span-2 flex items-center justify-center">
                                    <span className="text-sm text-gray-600 text-center">{vehicle.mileage.toLocaleString()} mi</span>
                                </div>

                                {/* Fuel */}
                                <div className="col-span-2 flex items-center justify-center">
                                    <span className={getFuelBadge(vehicle.fuel)}>
                                        {vehicle.fuel}%
                                    </span>
                                </div>

                                {/* Utilization */}
                                <div className="col-span-2 flex items-center justify-center">
                                    <span className={getUtilizationBadge(vehicle.utilization)}>
                                        {vehicle.utilization}%
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => openVehicleDetails(vehicle)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>

                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredVehicles.length}</span> of{' '}
                            <span className="font-medium">{filteredVehicles.length}</span> vehicles
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Previous
                            </button>
                            <button className="px-3 py-1 rounded-md bg-appTitleBgColor text-white text-sm font-medium hover:bg-appBanner">
                                1
                            </button>
                            <button className="px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vehicle Details Modal */}
                <VehicleDetailsModal
                    isOpen={isVehicleDetailsModalOpen}
                    onClose={closeVehicleDetails}
                    vehicle={selectedVehicle}
                />
            </div>
        </DriverDashboardLayout>
    );
};

export default VehiclesPage;