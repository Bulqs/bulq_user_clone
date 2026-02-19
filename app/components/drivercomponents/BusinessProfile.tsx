import { useState } from 'react';
import Image from 'next/image';

interface BusinessProfileFormData {
    businessLogo: File | null;
    logoPreview: string;
    location: string;
    address: string;
    additionalAddress: string;
    vehicleTypes: string[];
    vehicleModels: string[];
    vehicleLicensePlates: string[];
    agreedToTerms: boolean;
}

interface BusinessProfileProps {
    onSubmit: (data: BusinessProfileFormData) => void;
    onSuccess: () => void;
}

const BusinessProfile = ({ onSubmit, onSuccess }: BusinessProfileProps) => {
    const [formData, setFormData] = useState<BusinessProfileFormData>({
        businessLogo: null,
        logoPreview: '',
        location: '',
        address: '',
        additionalAddress: '',
        vehicleTypes: [],
        vehicleModels: [],
        vehicleLicensePlates: [],
        agreedToTerms: false,
    });

    const username = "umaribrahimayobami";
    const email = "stopbegging@gmail.com";
    const availableVehicleTypes = [
        "Box Truck",
        "Trailer Truck",
        "Freight Truck",
        "Container Truck",
        "Pick Up Truck",
        "Car",
        "Van",
        "Motorcycle",
        "Tricycle",
        "Bike"
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    businessLogo: file,
                    logoPreview: reader.result as string
                }));
            };

            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVehicleModelChange = (index: number, value: string) => {
        setFormData(prev => {
            const newModels = [...prev.vehicleModels];
            newModels[index] = value;
            return {
                ...prev,
                vehicleModels: newModels
            };
        });
    };

    const handleLicensePlateChange = (index: number, value: string) => {
        setFormData(prev => {
            const newPlates = [...prev.vehicleLicensePlates];
            newPlates[index] = value;
            return {
                ...prev,
                vehicleLicensePlates: newPlates
            };
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleVehicleSelect = (vehicle: string) => {
        setFormData(prev => {
            if (prev.vehicleTypes.includes(vehicle)) {
                return {
                    ...prev,
                    vehicleTypes: prev.vehicleTypes.filter(v => v !== vehicle),
                    vehicleModels: prev.vehicleModels.filter((_, i) => prev.vehicleTypes[i] !== vehicle),
                    vehicleLicensePlates: prev.vehicleLicensePlates.filter((_, i) => prev.vehicleTypes[i] !== vehicle)
                };
            } else {
                return {
                    ...prev,
                    vehicleTypes: [...prev.vehicleTypes, vehicle],
                    vehicleModels: [...prev.vehicleModels, ''],
                    vehicleLicensePlates: [...prev.vehicleLicensePlates, '']
                };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onSuccess();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-appTitleBgColor rounded-lg shadow-md shadow-appNav">
            <div className="w-full flex items-center justify-center">
                <h1 className="text-2xl font-bold text-white mb-6">Welcome! Let's Create Your Business Profile</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="border-b pb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Business Profile</h2>

                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Business Logo Upload/Preview */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {formData.logoPreview ? (
                                    <Image
                                        src={formData.logoPreview}
                                        alt="Business Logo Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        className="h-16 w-16 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <label className="mt-2 px-4 py-2 bg-appNav/80 text-white text-sm font-medium rounded-md hover:bg-appNav/40 cursor-pointer">
                                Upload Logo
                                <input
                                    type="file"
                                    name="businessLogo"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png"
                                />
                            </label>
                        </div>

                        {/* Username and Email Display */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-white mb-1">Username</label>
                                <div className="w-full px-3 py-2 rounded-md bg-white/10 text-white">
                                    {username}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-white mb-1">Email</label>
                                <div className="w-full px-3 py-2 rounded-md bg-white/10 text-white">
                                    {email}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Business Location Section */}
                <section className="border-b pb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Business Location</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-white mb-1">Enter Your Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white"
                                required
                                placeholder="e.g. Lagos, Nigeria"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white mb-1">Enter Your Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white"
                                required
                                placeholder="Street address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-white mb-1">Enter Additional Address</label>
                            <textarea
                                name="additionalAddress"
                                value={formData.additionalAddress}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white"
                                rows={2}
                                placeholder="Additional address information (optional)"
                            />
                        </div>
                    </div>
                </section>

                {/* Vehicle Information Section */}
                <section className="border-b pb-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Vehicle Information</h2>
                    <p className="text-white text-sm mb-4">Select all vehicle types you operate:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                        {availableVehicleTypes.map((vehicle) => (
                            <div
                                key={vehicle}
                                onClick={() => handleVehicleSelect(vehicle)}
                                className={`p-3 border rounded-md cursor-pointer text-center transition-colors flex items-center justify-center ${formData.vehicleTypes.includes(vehicle)
                                        ? 'bg-appNav text-white border-appNav'
                                        : 'bg-white/10 text-white border-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                {vehicle}
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.vehicleTypes.includes(vehicle)}
                                    readOnly
                                />
                            </div>
                        ))}
                    </div>

                    {/* Vehicle Details for Selected Vehicles */}
                    {formData.vehicleTypes.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Vehicle Details</h3>
                            {formData.vehicleTypes.map((vehicle, index) => (
                                <div key={`${vehicle}-${index}`} className="bg-white/5 p-4 rounded-md">
                                    <h4 className="text-white font-medium mb-3">{vehicle} Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-white mb-1">Model of Vehicle</label>
                                            <input
                                                type="text"
                                                value={formData.vehicleModels[index] || ''}
                                                onChange={(e) => handleVehicleModelChange(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white"
                                                placeholder={`e.g. Toyota ${vehicle.includes('Truck') ? 'Hiace' : 'Corolla'}`}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-white mb-1">Vehicle License Plate</label>
                                            <input
                                                type="text"
                                                value={formData.vehicleLicensePlates[index] || ''}
                                                onChange={(e) => handleLicensePlateChange(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 text-white"
                                                placeholder="e.g. ABC123XY"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-white mb-4">Terms and Conditions</h2>
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
                        disabled={formData.vehicleTypes.length === 0}
                    >
                        Continue Registration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BusinessProfile;