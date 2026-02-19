
import { useState } from 'react';
import Modal from './Modal';
import DriverRegSuccess from './DriverRegSuccess';

interface Vehicle {
    vehicleType: string;
    make: string;
    model: string;
    year: string;
    color: string;
    vehicleIdentificationNumber: string;
    licensePlate: string;
    registrationDate: string;
    registrationExpiryDate: string;
    vehicleCapacity: number;
}

interface VehicleFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    driverLicenseNumber: number;
    licenseExpiryDate: string;
    vehicles: Vehicle[];
    driverLicenseFront: File | null;
    driverLicenseBack: File | null;
    VehicleInsuranceCertificate: File | null;
    RecentVehicleInspectionReport: File | null;
    NationalIdentityNumber: File | null;
    agreedToTerms: boolean;
}

interface VehicleInformationProps {
    onSubmit: (data: VehicleFormData) => void;
    onSuccess: () => void;
}

const VehicleInformation = ({ onSubmit, onSuccess }: VehicleInformationProps) => {
    const [formData, setFormData] = useState<VehicleFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        driverLicenseNumber: 0,
        licenseExpiryDate: '',
        vehicles: [{
            vehicleType: '',
            make: '',
            model: '',
            year: '',
            color: '',
            vehicleIdentificationNumber: '',
            licensePlate: '',
            registrationDate: '',
            registrationExpiryDate: '',
            vehicleCapacity: 0,
        }],
        driverLicenseFront: null,
        driverLicenseBack: null,
        VehicleInsuranceCertificate: null,
        RecentVehicleInspectionReport: null,
        NationalIdentityNumber: null,
        agreedToTerms: false,
    });

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, vehicleIndex?: number) => {
        const { name, value } = e.target;

        if (vehicleIndex !== undefined && name in formData.vehicles[vehicleIndex]) {
            const updatedVehicles = [...formData.vehicles];
            updatedVehicles[vehicleIndex] = {
                ...updatedVehicles[vehicleIndex],
                [name]: value
            };
            setFormData(prev => ({
                ...prev,
                vehicles: updatedVehicles
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.files![0]
            }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const addVehicle = () => {
        setFormData(prev => ({
            ...prev,
            vehicles: [
                ...prev.vehicles,
                {
                    vehicleType: '',
                    make: '',
                    model: '',
                    year: '',
                    color: '',
                    vehicleIdentificationNumber: '',
                    licensePlate: '',
                    registrationDate: '',
                    registrationExpiryDate: '',
                    vehicleCapacity: 0,
                }
            ]
        }));
    };

    const removeVehicle = (index: number) => {
        if (formData.vehicles.length <= 1) return;
        const updatedVehicles = [...formData.vehicles];
        updatedVehicles.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            vehicles: updatedVehicles
        }));
    };

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     onSubmit(formData);
    //     setIsSuccessModalOpen(true);
    // };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onSuccess(); // Call this to trigger the success modal
    };


    return (
        <div className="max-w-4xl mx-auto p-6 bg-appTitleBgColor rounded-lg shadow-md shadow-appNav">
            <div className="w-full flex items-center justify-center">
                <h1 className="text-2xl font-bold text-white mb-6">Driver Registration - Vehicle Information</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <section className="border-b pb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">First Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">Last Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">Phone Number</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2 relative">
                            <label className="block text-sm font-bold text-white mb-1">Driver's Address</label>
                            <div className="relative">
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    rows={3}
                                />
                                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Driver's License Number */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">Driver's License Number</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="driverLicenseNumber"
                                    value={formData.driverLicenseNumber}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* License Expiry Date */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-white mb-1">License Expiry Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="licenseExpiryDate"
                                    value={formData.licenseExpiryDate}
                                    onChange={handleChange}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {formData.vehicles.map((vehicle, index) => (
                    <section key={index} className="">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Vehicle Information {formData.vehicles.length > 1 ? `#${index + 1}` : ''}</h2>
                            {formData.vehicles.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeVehicle(index)}
                                    className="text-white hover:text-white text-sm font-medium bg-green-500 px-3 py-2 rounded-2xl hover:bg-black"
                                >
                                    Remove Vehicle
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Vehicle Type - Dropdown */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-white mb-1">Vehicle Type</label>
                                <div className="relative">
                                    <select
                                        name="vehicleType"
                                        value={vehicle.vehicleType}
                                        onChange={(e) => handleChange(e, index)}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                        required
                                    >
                                        <option value="">Select Vehicle Type</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Van">Van</option>
                                        <option value="Hatchback">Hatchback</option>
                                        <option value="Coupe">Coupe</option>
                                        <option value="Convertible">Convertible</option>
                                        <option value="Minivan">Minivan</option>
                                        <option value="Pickup">Pickup</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Make - Input */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-white mb-1">Make</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="make"
                                        value={vehicle.make}
                                        onChange={(e) => handleChange(e, index)}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Model */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-white mb-1">Model</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="model"
                                        value={vehicle.model}
                                        onChange={(e) => handleChange(e, index)}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Year */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-white mb-1">Year</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="year"
                                        value={vehicle.year}
                                        onChange={(e) => handleChange(e, index)}
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Color */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-white mb-1">Color</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="color"
                                        value={vehicle.color}
                                        onChange={(e) => handleChange(e, index)}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Identification Number */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-white mb-1">Vehicle Identification Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="vehicleIdentificationNumber"
                                        value={vehicle.vehicleIdentificationNumber}
                                        onChange={(e) => handleChange(e, index)}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* License Plate Number */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-white mb-1">License Plate Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="licensePlate"
                                        value={vehicle.licensePlate}
                                        onChange={(e) => handleChange(e, index)}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Date */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-white mb-1">Registration Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="registrationDate"
                                        value={vehicle.registrationDate}
                                        onChange={(e) => handleChange(e, index)}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Expiry Date */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-white mb-1">Registration Expiry Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="registrationExpiryDate"
                                        value={vehicle.registrationExpiryDate}
                                        onChange={(e) => handleChange(e, index)}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Capacity (kg) */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-white mb-1">Vehicle Capacity (kg)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="vehicleCapacity"
                                        value={vehicle.vehicleCapacity}
                                        onChange={(e) => handleChange(e, index)}
                                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Driver's license images upload */}
                            <div>
                                <label className="block text-sm font-bold text-white mb-1">Driver's License Front Page</label>
                                <input
                                    type="file"
                                    name="driverLicenseFront"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-white mb-1">Driver's License Back Page</label>
                                <input
                                    type="file"
                                    name="driverLicenseBack"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required
                                />
                            </div>
                        </div>
                    </section>
                ))}

                <div className="flex justify-between border-b pb-4">
                    <button
                        type="button"
                        onClick={addVehicle}
                        className="px-4 py-2 bg-appNav text-white font-medium rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add Another Vehicle
                    </button>
                </div>

                <section className="border-b pb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Additional Documents</h2>
                    <div className="flex items-center justify-between">

                        <div className='pr-2'>
                            <label className="block text-sm font-bold text-white mb-1">Upload Vehicle Insurance Certificate (for each Vehicle)</label>
                            <input
                                type="file"
                                name="VehicleInsuranceCertificate"
                                onChange={handleFileChange}
                                className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                        </div>
                        <div className='pr-2'>
                            <label className="block text-sm font-bold text-white mb-1">Recent Vehicle Inspection Report</label>
                            <input
                                type="file"
                                name="RecentVehicleInspectionReport"
                                onChange={handleFileChange}
                                className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                        </div>
                        <div className='pr-2'>
                            <label className="block text-sm font-bold text-white mb-1">National Identity Number (NIN) (Front and Back)</label>
                            <input
                                type="file"
                                name="NationalIdentityNumber"
                                onChange={handleFileChange}
                                className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">Terms and Conditions</h2>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                name="agreedToTerms"
                                type="checkbox"
                                checked={formData.agreedToTerms}
                                onChange={handleCheckboxChange}
                                className="focus:ring-blue-500 h-4 w-4 text-text-white border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-white">
                                I agree to the terms and conditions
                            </label>
                            <p className="text-white">
                                By checking this box, you confirm that all information provided is accurate.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-appNav/80 text-white font-medium rounded-md hover:bg-appNav/40 focus:outline-none focus:ring-2 focus:ring-bg-appNav/20 focus:ring-offset-2"
                    >
                        Submit Registration
                    </button>
                </div>
                
            </form>
        </div>
    );
};

export default VehicleInformation;