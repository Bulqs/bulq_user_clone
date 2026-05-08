'use client';

import React, { useState } from 'react';
import {
    X,
    Home,
    Building,
    MapPin,
    User,
    Phone,
    Mail,
    Check
} from 'lucide-react';

interface AddressFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    addressType: 'home' | 'office' | 'other';
    streetAddress: string;
    city: string;
    zipCode: string;
    isDefault: boolean;
}

interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: AddressFormData) => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState<AddressFormData>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        addressType: 'home',
        streetAddress: '',
        city: '',
        zipCode: '',
        isDefault: false
    });

    const [errors, setErrors] = useState<Partial<AddressFormData>>({});

    const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field as keyof Partial<AddressFormData>]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<AddressFormData> = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation (basic)
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSave(formData);
            // Reset form after successful save
            setFormData({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                addressType: 'home',
                streetAddress: '',
                city: '',
                zipCode: '',
                isDefault: false
            });
        }
    };

    const handleClose = () => {
        setFormData({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            addressType: 'home',
            streetAddress: '',
            city: '',
            zipCode: '',
            isDefault: false
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Add New Address</h2>
                                <p className="text-sm text-gray-600">Fill in the address details below</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter first name"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter last name"
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="+1 (555) 123-4567"
                                />
                                {errors.phoneNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
                                )}
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Type Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            Address Type
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { value: 'home' as const, label: 'Home', icon: Home, description: 'Residential address' },
                                { value: 'office' as const, label: 'Office', icon: Building, description: 'Work address' },
                                { value: 'other' as const, label: 'Other', icon: MapPin, description: 'Other location' }
                            ].map((type) => {
                                const IconComponent = type.icon;
                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleInputChange('addressType', type.value)}
                                        className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${formData.addressType === type.value
                                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.addressType === type.value
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className={`font-semibold ${formData.addressType === type.value ? 'text-blue-700' : 'text-gray-900'
                                                    }`}>
                                                    {type.label}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {type.description}
                                                </div>
                                            </div>
                                            {formData.addressType === type.value && (
                                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Address Details Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Address Details</h3>

                        {/* Street Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                value={formData.streetAddress}
                                onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.streetAddress ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="123 Main Street, Apt 4B"
                            />
                            {errors.streetAddress && (
                                <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.city ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="New York"
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                )}
                            </div>

                            {/* ZIP/Postal Code */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ZIP/Postal Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="10001"
                                />
                                {errors.zipCode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Set as Default Checkbox */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                            type="checkbox"
                            id="defaultAddress"
                            checked={formData.isDefault}
                            onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor="defaultAddress" className="text-sm font-medium text-gray-900 cursor-pointer">
                            Set as default shipping address
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
                        >
                            Save Address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Example usage component
const AddressPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveAddress = (address: AddressFormData) => {
        console.log('Saved address:', address);
        // Here you would typically send the data to your backend
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Address Management</h1>
                    <p className="text-gray-600">Manage your shipping addresses</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
                >
                    Add New Address
                </button>

                <AddAddressModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveAddress}
                />
            </div>
        </div>
    );
};

export default AddressPage;