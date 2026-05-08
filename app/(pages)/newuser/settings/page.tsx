'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    User, Lock, Bell, Trash2, Shield, Mail, Camera, Eye, EyeOff,
    CheckCircle, Download, Copy, Settings, Key, Upload, MapPin,
    Volume2, VolumeX, ChevronDown, FileText, Save, X, Loader2,
    CreditCard, Calendar, Briefcase, Building, Home, Check,
    Plus, Edit, Star, Package, Phone, Clock, AlertCircle, CheckCircle2, Circle
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

import { UserResponseDTO } from '@/types/admin';
import { 
    getMyProfile, updateProfile, getSupportedCountries, 
    addUserAddress, deleteAddress, getAddressCount, getAllUserAddresses, updateAddress,
    updatePassword // <--- Added updatePassword
} from '@/lib/user/actions';
import { CountryDTO, UpdateProfileRequest, AddressCountResponseDTO, AddressRequest } from '@/types/user';
import { submitKYC, getKYCStatus } from '@/lib/user/kyc.actions'; 
import { KYCPersonalInfoRequest, KYCResponseDTO } from '@/types/kyc';
import Heading from '@/app/components/generalheading/Heading';

// --- TYPES ---
type SettingsPage = 'profile' | 'address' | 'security' | 'notifications' | 'kyc' | 'delete';

interface SavedAddress extends AddressRequest {
    id: string;
}

interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: AddressRequest) => void;
    formData: AddressRequest;
    setFormData: React.Dispatch<React.SetStateAction<AddressRequest>>;
    isEditing: boolean;
}

// --- HELPER FUNCTIONS ---
const getInitials = (firstName: string, lastName: string) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}` || 'U'; 
};

// --- FRAMER MOTION VARIANTS ---
const staggerContainer: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUpItem: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };
const modalBackdrop: Variants = { hidden: { opacity: 0 }, show: { opacity: 1 } };
const modalContent: Variants = { hidden: { scale: 0.95, opacity: 0, y: 20 }, show: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }, exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } } };


// ==========================================
// ADDRESS TAB HELPER COMPONENTS
// ==========================================

const AddAddressModal: React.FC<AddAddressModalProps> = ({ isOpen, onClose, onSave, formData, setFormData, isEditing }) => {
    const [errors, setErrors] = useState<Partial<AddressRequest>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const handleInputChange = (field: keyof AddressRequest, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof Partial<AddressRequest>]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<AddressRequest> = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.emailAddress.trim()) newErrors.emailAddress = 'Email is required';
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'ZIP/Postal code is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.emailAddress && !emailRegex.test(formData.emailAddress)) {
            newErrors.emailAddress = 'Please enter a valid email address';
        }

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
        }
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div variants={modalContent} initial="hidden" animate="show" exit="exit" className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-appBanner to-appNav rounded-xl flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
                                        <p className="text-sm text-gray-600">{isEditing ? 'Update your address details below' : 'Fill in the address details below'}</p>
                                    </div>
                                </div>
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></motion.button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><User className="w-4 h-4 text-appBanner" /> Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                        <input type="text" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-appBanner transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter first name" />
                                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                        <input type="text" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-appBanner transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter last name" />
                                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> Phone Number *</label>
                                        <input type="tel" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-appBanner transition-all ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`} placeholder="+1 (555) 123-4567" />
                                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> Email Address *</label>
                                        <input type="email" value={formData.emailAddress} onChange={(e) => handleInputChange('emailAddress', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-appBanner transition-all ${errors.emailAddress ? 'border-red-500' : 'border-gray-300'}`} placeholder="your.email@example.com" />
                                        {errors.emailAddress && <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Address Type */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-appBanner" /> Address Type</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {[
                                        { value: 'HOME' as const, label: 'HOME', icon: Home, description: 'Residential address' },
                                        { value: 'OFFICE' as const, label: 'Office', icon: Building, description: 'Work address' },
                                        { value: 'OTHER' as const, label: 'Other', icon: MapPin, description: 'Other location' }
                                    ].map((type) => {
                                        const IconComponent = type.icon;
                                        return (
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={type.value} type="button" onClick={() => handleInputChange('addressType', type.value)} className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${formData.addressType === type.value ? 'border-appBanner bg-blue-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${formData.addressType === type.value ? 'bg-appBanner text-white' : 'bg-gray-100 text-gray-600'}`}><IconComponent className="w-5 h-5" /></div>
                                                    <div className="flex-1">
                                                        <div className={`font-semibold ${formData.addressType === type.value ? 'text-appBanner' : 'text-gray-900'}`}>{type.label}</div>
                                                        <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                                                    </div>
                                                    {formData.addressType === type.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 bg-appBanner rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></motion.div>}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Address Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                                    <input type="text" value={formData.streetAddress} onChange={(e) => handleInputChange('streetAddress', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-appBanner transition-all ${errors.streetAddress ? 'border-red-500' : 'border-gray-300'}`} placeholder="123 Main Street, Apt 4B" />
                                    {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                        <input type="text" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-appBanner transition-all ${errors.city ? 'border-red-500' : 'border-gray-300'}`} placeholder="New York" />
                                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code *</label>
                                        <input type="text" value={formData.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-appBanner transition-all ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`} placeholder="10001" />
                                        {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Default Checkbox */}
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <input type="checkbox" id="defaultAddress" checked={formData.defaultShippingAddress} onChange={(e) => handleInputChange('defaultShippingAddress', e.target.checked)} className="w-5 h-5 text-appBanner bg-white border-gray-300 rounded focus:ring-appBanner focus:ring-2 cursor-pointer" />
                                <label htmlFor="defaultAddress" className="text-sm font-medium text-gray-900 cursor-pointer">Set as default shipping address</label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button type="button" onClick={handleClose} className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                                <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all shadow-md bg-gradient-to-r from-appBanner to-appNav text-white hover:shadow-lg`}>
                                    {loading ? 'Saving...' : 'Save Address'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const LimitReachedModal = ({ isOpen, onClose, max }: { isOpen: boolean, onClose: () => void, max: number }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-appTitleBgColor/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                <motion.div variants={modalContent} initial="hidden" animate="show" exit="exit" className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"><Package className="w-10 h-10 text-amber-600" /></div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Address Limit Reached</h3>
                        <p className="text-gray-600 mb-8">You've reached the maximum of <span className="font-bold text-appNav">{max} addresses</span>. Please delete an unused address to make room.</p>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="w-full bg-gradient-to-r from-appBanner to-appNav text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">Got it, I'll manage my addresses</motion.button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const AddressCard: React.FC<{ address: SavedAddress; onEdit: (address: SavedAddress) => void; onDelete: (id: string) => void; onSetDefault: (id: string) => void; }> = ({ address, onEdit, onDelete, onSetDefault }) => {
    const getAddressTypeIcon = (type: 'HOME' | 'OFFICE' | 'OTHER') => {
        switch (type) { case 'HOME': return <Home className="w-4 h-4" />; case 'OFFICE': return <Building className="w-4 h-4" />; default: return <MapPin className="w-4 h-4" />; }
    };
    const getAddressTypeColor = (type: 'HOME' | 'OFFICE' | 'OTHER') => {
        switch (type) { case 'HOME': return 'text-blue-400'; case 'OFFICE': return 'text-emerald-400'; default: return 'text-purple-400'; }
    };

    return (
        <motion.div layout variants={fadeUpItem} initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-colors shadow-lg">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 ${getAddressTypeColor(address.addressType)} shadow-inner`}>
                        {getAddressTypeIcon(address.addressType)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white capitalize">{address.addressType} Address</h3>
                        {address.defaultShippingAddress && (
                            <div className="flex items-center gap-1.5 mt-1 bg-yellow-400/10 px-2 py-0.5 rounded-full w-fit border border-yellow-400/20">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-[10px] uppercase tracking-wider text-yellow-400 font-bold">Default</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onEdit(address)} className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-md transition-colors"><Edit className="w-4 h-4" /></motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onDelete(address.id)} className="p-2 text-white/70 hover:text-red-400 hover:bg-white/20 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></motion.button>
                </div>
            </div>

            <div className="space-y-2.5 text-white/80 text-sm mt-6">
                <p className="font-extrabold text-white text-base flex items-center gap-2"><User className="w-4 h-4 opacity-50"/> {address.firstName} {address.lastName}</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 opacity-50"/> {address.streetAddress}, {address.city}, {address.postalCode}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 opacity-50"/> {address.phoneNumber}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 opacity-50"/> {address.emailAddress}</p>
            </div>

            {!address.defaultShippingAddress && (
                <div className="mt-5 pt-4 border-t border-white/10">
                    <button onClick={() => onSetDefault(address.id)} className="text-sm text-blue-300 hover:text-white font-bold transition-colors flex items-center gap-1 w-full justify-center py-2 rounded-lg hover:bg-white/5">
                        Set as Default Shipping
                    </button>
                </div>
            )}
        </motion.div>
    );
};

const StatsCards = ({ statsData }: { statsData: AddressCountResponseDTO | null }) => {
    if (!statsData) return <div className="h-32 w-full animate-pulse bg-white/5 rounded-2xl mb-6" />;
    const statsList = [
        { title: 'Total Addresses', value: statsData.totalAddresses, icon: <MapPin className="text-white" size={24} />, bg: 'bg-gradient-to-br from-blue-600 to-cyan-500', progress: (statsData.totalAddresses / (statsData.maxAllowed || 5)) * 100 },
        { title: 'Default Address', value: statsData.defaultAddresses, icon: <Star className="text-white" size={24} />, bg: 'bg-gradient-to-br from-amber-500 to-orange-500', progress: 100 },
        { title: 'HOME Addresses', value: statsData.homeAddresses, icon: <Home className="text-white" size={24} />, bg: 'bg-gradient-to-br from-purple-600 to-pink-500', progress: (statsData.homeAddresses / (statsData.totalAddresses || 1)) * 100 },
        { title: 'Office Addresses', value: statsData.officeAddresses, icon: <Building className="text-white" size={24} />, bg: 'bg-gradient-to-br from-emerald-600 to-teal-500', progress: (statsData.officeAddresses / (statsData.totalAddresses || 1)) * 100 },
    ];
    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statsList.map((stat, index) => (
                <motion.div key={index} variants={fadeUpItem} className={`${stat.bg} p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-white border border-white/10 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex flex-col"><span className="text-sm font-bold uppercase tracking-wider opacity-80">{stat.title}</span><span className="mt-2 text-4xl font-black">{stat.value}</span></div>
                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-md shadow-inner">{stat.icon}</div>
                    </div>
                    <div className="mt-5 h-1.5 bg-black/20 rounded-full overflow-hidden relative z-10">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${stat.progress}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-white rounded-full"></motion.div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};


// ==========================================
// MAIN SETTINGS PAGE
// ==========================================

const SettingsPage = () => {
    // --- GLOBAL STATE ---
    const [activePage, setActivePage] = useState<SettingsPage>('profile');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserResponseDTO | null>(null);
    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [error, setError] = useState<string | null>(null);

    // --- PROFILE TAB STATE ---
    const [isSaving, setIsSaving] = useState(false);
    const [profileImage, setProfileImage] = useState('');
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        firstName: '', lastName: '', email: '', phoneNumber: '',
        country: '', city: '', state: '', defaultAddress: '', username: ''
    });

    // --- ADDRESS TAB STATE ---
    const [addressStats, setAddressStats] = useState<AddressCountResponseDTO | null>(null);
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [currentAddressId, setCurrentAddressId] = useState<string | null>(null);
    const [addressLoading, setAddressLoading] = useState<boolean>(false);
    const [addressFormData, setAddressFormData] = useState<AddressRequest>({
        firstName: '', lastName: '', phoneNumber: '', emailAddress: '', addressType: 'HOME',
        streetAddress: '', city: '', postalCode: '', defaultShippingAddress: false
    });

    const isLimitReached = addressStats ? addressStats.totalAddresses >= addressStats.maxAllowed : false;

    // --- SECURITY TAB STATE ---
    const [currentPassword, setCurrentPassword] = useState(''); // Optional, for UI consistency
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // --- NOTIFICATION TAB STATE ---
    const [desktopNotifications, setDesktopNotifications] = useState(true);
    const [communicationEmail, setCommunicationEmail] = useState(true);

    // --- KYC TAB STATE ---
    const [kycData, setKycData] = useState<KYCResponseDTO | null>(null); 
    const [kycLoading, setKycLoading] = useState(false);
    const [showKycSuccess, setShowKycSuccess] = useState(false);
    const idFrontRef = useRef<HTMLInputElement>(null);
    const idBackRef = useRef<HTMLInputElement>(null);
    const selfieRef = useRef<HTMLInputElement>(null);
    const proofRef = useRef<HTMLInputElement>(null);

    const [kycFormData, setKycFormData] = useState({
        firstName: '', lastName: '', phoneNumber: '', email: '',
        dateOfBirth: '', nationality: '', occupation: '',
        address: '', city: '', state: '', postalCode: '', country: '',
        idType: '', idNumber: '', idExpiryDate: '',
        bankName: '', accountNumber: '', bvn: ''
    });

    const [kycFiles, setKycFiles] = useState<{ idFront: File | null; idBack: File | null; selfie: File | null; proof: File | null; }>({ idFront: null, idBack: null, selfie: null, proof: null });
    const [kycPreviews, setKycPreviews] = useState<{ idFront: string | null; idBack: string | null; selfie: string | null; proof: string | null; }>({ idFront: null, idBack: null, selfie: null, proof: null });


    // --- 1. INITIAL DATA FETCH ---
    useEffect(() => {
        const initData = async () => {
            try {
                setLoading(true);
                const [userData, countryData] = await Promise.all([
                    getMyProfile(),
                    getSupportedCountries()
                ]);

                setProfile(userData);
                setCountries(countryData || []);
                setProfileImage(userData.profileImage || '');

                setFormData({
                    firstName: userData.firstName || '', lastName: userData.lastName || '', email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '', country: userData.country || '', city: userData.city || '',
                    state: userData.state || '', defaultAddress: userData.defaultAddress || '', username: userData.username || '',
                });

                setKycFormData(prev => ({
                    ...prev, firstName: userData.firstName || '', lastName: userData.lastName || '', email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '', country: userData.country || '', nationality: userData.country || '', 
                    address: userData.defaultAddress || '', city: userData.city || '', state: userData.state || ''
                }));

                fetchCountsAndAddresses();

                try {
                    const fetchedKyc = await getKYCStatus();
                    setKycData(fetchedKyc);
                    if (fetchedKyc && fetchedKyc.personalInfo) {
                        setKycFormData(prev => ({
                            ...prev,
                            firstName: fetchedKyc.personalInfo.firstName || prev.firstName,
                            lastName: fetchedKyc.personalInfo.lastName || prev.lastName,
                            phoneNumber: fetchedKyc.personalInfo.phoneNumber || prev.phoneNumber,
                            address: fetchedKyc.personalInfo.address || prev.address,
                            city: fetchedKyc.personalInfo.city || prev.city,
                            state: fetchedKyc.personalInfo.state || prev.state,
                            nationality: fetchedKyc.personalInfo.nationality || prev.nationality,
                            dateOfBirth: fetchedKyc.personalInfo.dateOfBirth 
                                ? new Date(fetchedKyc.personalInfo.dateOfBirth).toISOString().split('T')[0] 
                                : prev.dateOfBirth,
                            idType: fetchedKyc.documents?.idType || prev.idType,
                            idNumber: fetchedKyc.documents?.idNumber || prev.idNumber,
                        }));
                        
                        setKycPreviews(prev => ({
                            ...prev,
                            idFront: fetchedKyc.documents?.idFrontImage || null,
                            idBack: fetchedKyc.documents?.idBackImage || null,
                            selfie: fetchedKyc.documents?.selfieImage || null,
                        }));
                    }
                } catch (kycErr) {
                    console.log("No existing KYC found or error fetching:", kycErr);
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    // --- 2. HANDLERS ---

    // Profile Handlers
    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveProfile = async () => {
        if (!profile?.id) return;
        setIsSaving(true);
        try {
            let finalImageUrl = profileImage; 

            if (profileImageFile) {
                const cloudName = "dhydpleqs"; 
                const uploadPreset = "abokina"; 
                const fd = new FormData();
                fd.append("file", profileImageFile); 
                fd.append("upload_preset", uploadPreset);
                
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
                if (!response.ok) throw new Error("Image upload failed");
                const data = await response.json();
                finalImageUrl = data.secure_url;
            }

            const payloadToSave = {
                ...formData,
                profileImage: finalImageUrl 
            } as any; 

            await updateProfile(profile.id, payloadToSave);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfileImageFile(file); 
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Address Handlers
    // (Unchanged fetchCountsAndAddresses, handleEditAddress, handleAddNewAddressClick, handleDeleteAddress, handleSetDefault, handleSaveAddress...)
    const fetchCountsAndAddresses = async () => {
        try {
            const [counts, data] = await Promise.all([getAddressCount(), getAllUserAddresses()]);
            setAddressStats(counts);
            const mappedAddresses: SavedAddress[] = data.addresses.map(addr => ({
                ...addr, isDefault: addr.defaultShippingAddress === "true", defaultShippingAddress: addr.defaultShippingAddress === "true"
            }));
            setAddresses(mappedAddresses);
        } catch (err) {
            console.error("Failed to fetch address data:", err);
        }
    };

    const handleEditAddress = (address: SavedAddress) => {
        setIsEditingAddress(true);
        setCurrentAddressId(address.id);
        setAddressFormData({ ...address });
        setIsAddressModalOpen(true);
    };

    const handleAddNewAddressClick = () => {
        setIsEditingAddress(false);
        setCurrentAddressId(null);
        setAddressFormData({ firstName: '', lastName: '', phoneNumber: '', emailAddress: '', addressType: 'HOME', streetAddress: '', city: '', postalCode: '', defaultShippingAddress: false });
        setIsAddressModalOpen(true);
    };

    const handleDeleteAddress = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            setAddressLoading(true);
            await deleteAddress(id);
            setAddresses(prev => prev.filter(addr => addr.id !== id));
            const newCounts = await getAddressCount();
            setAddressStats(newCounts);
        } catch (err) { alert("Failed to delete address."); } finally { setAddressLoading(false); }
    };

    const handleSetDefault = async (id: string) => {
        const addressToUpdate = addresses.find(addr => addr.id === id);
        if (!addressToUpdate) return;
        try {
            setAddressLoading(true);
            await updateAddress(id, { ...addressToUpdate, defaultShippingAddress: true });
            await fetchCountsAndAddresses();
        } catch (err) { alert("Failed to update default address."); } finally { setAddressLoading(false); }
    };

    const handleSaveAddress = async (addressData: AddressRequest) => {
        if (!isEditingAddress && isLimitReached) { setIsLimitModalOpen(true); return; }
        try {
            setAddressLoading(true);
            if (isEditingAddress && currentAddressId) {
                const updateResponse = await updateAddress(currentAddressId, addressData);
                const updatedAddr = updateResponse.address;
                setAddresses(prev => prev.map(addr => addr.id === currentAddressId ? { ...updatedAddr, id: updatedAddr.id, defaultShippingAddress: updatedAddr.defaultShippingAddress === "true" } : addr));
            } else {
                const savedResponse = await addUserAddress(addressData);
                setAddresses(prev => [...prev, { ...addressData, ...savedResponse, id: savedResponse.id, defaultShippingAddress: savedResponse.defaultShippingAddress === "true" }]);
            }
            const newCounts = await getAddressCount();
            setAddressStats(newCounts);
            setIsAddressModalOpen(false);
        } catch (err: any) { err.message.includes("limit") ? setIsLimitModalOpen(true) : alert("Failed to save."); } finally { setAddressLoading(false); }
    };

    // KYC Handlers
    // (Unchanged handleKycChange, handleKycFileUpload, uploadImageToCloudKyc, handleKycSubmit...)
    const handleKycChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setKycFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleKycFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof kycFiles) => {
        const file = e.target.files?.[0];
        if (file) {
            setKycFiles(prev => ({ ...prev, [field]: file }));
            const reader = new FileReader();
            reader.onload = (ev) => setKycPreviews(prev => ({ ...prev, [field]: ev.target?.result as string }));
            reader.readAsDataURL(file);
        }
    };

    const uploadImageToCloudKyc = async (file: File): Promise<string> => {
        const cloudName = "dhydpleqs"; 
        const uploadPreset = "abokina"; 
        const fd = new FormData();
        fd.append("file", file); fd.append("upload_preset", uploadPreset);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
        if (!response.ok) throw new Error("Image upload failed");
        const data = await response.json();
        return data.secure_url;
    };

    const handleKycSubmit = async () => {
        const hasFront = kycFiles.idFront || kycPreviews.idFront;
        const hasBack = kycFiles.idBack || kycPreviews.idBack;
        const hasSelfie = kycFiles.selfie || kycPreviews.selfie;
        const hasProof = kycFiles.proof || kycPreviews.proof;

        if (!hasFront || !hasBack || !hasSelfie || !hasProof) { 
            alert("Please ensure all required documents are provided."); return; 
        }
        if (!kycFormData.bvn || !kycFormData.idNumber || !kycFormData.dateOfBirth) { 
            alert("Please fill in all required text fields."); return; 
        }

        setKycLoading(true);
        try {
            const frontUrl = kycFiles.idFront ? await uploadImageToCloudKyc(kycFiles.idFront) : kycPreviews.idFront;
            const backUrl = kycFiles.idBack ? await uploadImageToCloudKyc(kycFiles.idBack) : kycPreviews.idBack;
            const selfieUrl = kycFiles.selfie ? await uploadImageToCloudKyc(kycFiles.selfie) : kycPreviews.selfie;
            const proofUrl = kycFiles.proof ? await uploadImageToCloudKyc(kycFiles.proof) : kycPreviews.proof;

            const payload: KYCPersonalInfoRequest = {
                ...kycFormData,
                dateOfBirth: new Date(kycFormData.dateOfBirth).toISOString(),
                idExpiryDate: new Date(kycFormData.idExpiryDate).toISOString(),
                profilePhoto: selfieUrl as string, 
                idFrontPhoto: frontUrl as string, 
                idBackPhoto: backUrl as string, 
                proofOfAddress: proofUrl as string
            };

            await submitKYC(payload);
            setShowKycSuccess(true);
            const updatedKyc = await getKYCStatus();
            setKycData(updatedKyc);
        } catch (error: any) { alert(error.message || "KYC Submission Failed"); } finally { setKycLoading(false); }
    };


    // --- SECURITY HANDLERS ---
    const getPasswordStrength = (pass: string) => {
        const rules = [
            { id: 'length', label: 'At least 8 characters', passed: pass.length >= 8 },
            { id: 'upper', label: 'At least 1 uppercase letter', passed: /[A-Z]/.test(pass) },
            { id: 'numbers', label: 'At least 2 numbers', passed: (pass.match(/\d/g) || []).length >= 2 },
            { id: 'special', label: 'At least 1 special character', passed: /[^A-Za-z0-9]/.test(pass) }
        ];
        
        const passedCount = rules.filter(r => r.passed).length;
        const score = (passedCount / rules.length) * 100;
        
        let colorClass = 'bg-gray-200';
        if (score === 25) colorClass = 'bg-red-500';
        if (score === 50) colorClass = 'bg-orange-500';
        if (score === 75) colorClass = 'bg-blue-500';
        if (score === 100) colorClass = 'bg-green-500';

        return { rules, score, colorClass, isReady: score === 100 };
    };

    const { rules: pwdRules, score: pwdScore, colorClass: pwdColorClass, isReady: isPwdReady } = getPasswordStrength(newPassword);

    const handlePasswordSubmit = async () => {
        if (!isPwdReady) return;
        setIsUpdatingPassword(true);
        try {
            // API only requires the new password according to UpdatePasswordRequest
            await updatePassword({ password: newPassword });
            alert("Password updated successfully!");
            setNewPassword('');
            setCurrentPassword(''); // Clear out form fields
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to update password.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };


    const menuItems = [
        { id: 'profile' as SettingsPage, label: 'Profile Settings', icon: User, color: 'text-appBanner', bg: 'from-appBanner/20 to-appNav/20' },
        { id: 'address' as SettingsPage, label: 'Address Book', icon: MapPin, color: 'text-amber-500', bg: 'from-amber-500/20 to-orange-500/20' },
        { id: 'security' as SettingsPage, label: 'Security', icon: Lock, color: 'text-blue-400', bg: 'from-blue-500/20 to-cyan-500/20' },
        { id: 'notifications' as SettingsPage, label: 'Notifications', icon: Bell, color: 'text-green-400', bg: 'from-green-500/20 to-emerald-500/20' },
        { id: 'kyc' as SettingsPage, label: 'Identity Verification', icon: Shield, color: 'text-purple-500', bg: 'from-purple-500/20 to-violet-500/20' },
        { id: 'delete' as SettingsPage, label: 'Delete Account', icon: Trash2, color: 'text-red-400', bg: 'from-red-500/20 to-pink-500/20' },
    ];

    if (loading) return <div className="flex h-screen items-center justify-center text-appBanner"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    if (error) return <div className="p-8 text-red-500">Error loading settings: {error}</div>;

    // --- RENDER CONTENT ---
    const renderContent = () => {
        switch (activePage) {
            case 'profile':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                            <p className="text-gray-600">Manage your personal information</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-appBanner" /> Personal Information</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-sm font-medium text-gray-700">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                        <div><label className="text-sm font-medium text-gray-700">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                    </div>
                                    <div><label className="text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={formData.email} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                    <div><label className="text-sm font-medium text-gray-700">Username</label><input type="text" name="username" value={formData.username} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                    <div><label className="text-sm font-medium text-gray-700">Phone</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            {profileImage ? (
                                                <Image width={150} height={150} src={profileImage} alt="Profile" className="w-20 h-20 rounded-xl object-cover border-2 border-appBanner/30" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-appBanner to-appNav text-white flex items-center justify-center text-3xl font-bold border-2 border-appBanner/30">
                                                    {getInitials(formData.firstName, formData.lastName)}
                                                </div>
                                            )}
                                            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-appBanner rounded-full p-2 text-white"><Camera className="w-3 h-3" /></button>
                                            <input type="file" ref={fileInputRef} onChange={handleProfileImageUpload} className="hidden" accept="image/*" />
                                        </div>
                                        <div className="flex-1">
                                            <button onClick={() => fileInputRef.current?.click()} className="bg-appBanner text-white py-2 px-3 rounded-lg text-sm">Upload New</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4"><MapPin className="w-5 h-5 inline mr-2 text-green-500" /> Location</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-sm font-medium text-gray-700">Country</label><input type="text" name="country" value={formData.country} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                        <div><label className="text-sm font-medium text-gray-700">City</label><input type="text" name="city" value={formData.city} onChange={handleProfileInputChange} className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-appBanner" /></div>
                                    </div>
                                    <div className="mt-4"><label className="text-sm font-medium text-gray-700">Default Address Type</label>
                                        <div className="relative mt-2">
                                            <select name="defaultAddress" value={formData.defaultAddress} onChange={handleProfileInputChange} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-appBanner appearance-none">
                                                <option value="">Select Type</option><option value="HOME">HOME</option><option value="OFFICE">OFFICE</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button onClick={handleSaveProfile} disabled={isSaving} className="bg-appBanner text-white py-3 px-6 rounded-xl font-semibold flex items-center gap-2 hover:bg-appNav transition-colors disabled:opacity-50">
                                {isSaving ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                );

            case 'address':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {/* Header Section */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-appTitleBgColor p-6 rounded-2xl border border-white/5 shadow-lg">
                            <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
                                <div className="w-14 h-14 bg-gradient-to-br from-appBanner to-appNav rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                                    <Package className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <Heading level="h4" color="light" className="font-extrabold text-white">Address Management</Heading>
                                    <p className='font-medium text-sm text-gray-400 mt-1'>Manage your shipping addresses</p>
                                </div>
                            </div>
                            <motion.button whileHover={{ scale: isLimitReached ? 1 : 1.02 }} whileTap={{ scale: isLimitReached ? 1 : 0.95 }} onClick={handleAddNewAddressClick} disabled={isLimitReached} className={`flex items-center gap-2 py-3.5 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg ${isLimitReached ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-appBanner to-appNav text-white hover:shadow-appBanner/25 border border-white/10'}`}>
                                <Plus className="w-5 h-5" /> {isLimitReached ? 'Limit Reached' : 'Add New Address'}
                            </motion.button>
                        </motion.div>

                        <StatsCards statsData={addressStats} />

                        {/* Content Area */}
                        <div className="bg-gradient-to-b from-appTitleBgColor to-[#0B1121] p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-white/5">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -top-40 -right-40 w-96 h-96 bg-appBanner/10 blur-[100px] rounded-full pointer-events-none"></motion.div>
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -bottom-40 -left-40 w-96 h-96 bg-appNav/10 blur-[100px] rounded-full pointer-events-none"></motion.div>

                            <div className="relative z-10 min-h-[400px]">
                                <AnimatePresence mode="wait">
                                    {addresses.length === 0 ? (
                                        <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
                                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-28 h-28 bg-gradient-to-br from-appBanner/20 to-appNav/20 rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-lg"><MapPin className="w-12 h-12 text-appBanner" /></motion.div>
                                            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No addresses yet</h3>
                                            <p className="text-gray-400 mb-8 font-medium">Add your first shipping address to get started</p>
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsAddressModalOpen(true)} className="bg-gradient-to-r from-appBanner to-appNav text-white py-3 px-8 rounded-xl font-bold shadow-lg shadow-appBanner/20">Add Your First Address</motion.button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="grid" variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            <AnimatePresence>
                                                {addresses.map((address) => (
                                                    <AddressCard key={address.id} address={address} onEdit={handleEditAddress} onDelete={handleDeleteAddress} onSetDefault={handleSetDefault} />
                                                ))}
                                            </AnimatePresence>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <AddAddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} onSave={handleSaveAddress} formData={addressFormData} setFormData={setAddressFormData} isEditing={isEditingAddress} />
                        <LimitReachedModal isOpen={isLimitModalOpen} onClose={() => setIsLimitModalOpen(false)} max={addressStats?.maxAllowed || 5} />
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div><h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2><p className="text-gray-600">Manage password and security</p></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* --- PASSWORD UPDATE MODULE --- */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-blue-500" /> Change Password</h3>
                                
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Current Password</label>
                                        <div className="relative mt-2">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" 
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700">New Password</label>
                                        <div className="relative mt-2">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow pr-12" 
                                                placeholder="Create new password"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)} 
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Gamified Password Tracker */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password Strength</span>
                                            <span className={`text-xs font-bold ${pwdScore === 100 ? 'text-green-500' : 'text-gray-400'}`}>
                                                {pwdScore}%
                                            </span>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pwdScore}%` }}
                                                className={`h-full transition-colors duration-300 ${pwdColorClass}`}
                                            />
                                        </div>

                                        {/* Dynamic Rules Checklist */}
                                        <div className="space-y-2">
                                            {pwdRules.map((rule) => (
                                                <div key={rule.id} className="flex items-center gap-2 text-sm transition-colors duration-300">
                                                    {rule.passed ? (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-4 h-4 text-green-500" /></motion.div>
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-gray-300" />
                                                    )}
                                                    <span className={rule.passed ? "text-gray-700 font-medium" : "text-gray-400"}>
                                                        {rule.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handlePasswordSubmit}
                                    disabled={!isPwdReady || isUpdatingPassword}
                                    className={`w-full py-3.5 rounded-xl font-bold mt-6 flex items-center justify-center gap-2 transition-all duration-300
                                        ${isPwdReady 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg' 
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {isUpdatingPassword ? <><Loader2 className="w-5 h-5 animate-spin"/> Updating...</> : "Update Password"}
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-500" /> 2FA</h3>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border"><div className="text-sm font-medium">Two-Factor Authentication</div><input type="checkbox" className="toggle" /></div>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div><h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h2><p className="text-gray-600">Configure alerts</p></div>
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div><h4 className="font-medium">Desktop Notifications</h4><p className="text-xs text-gray-500">Get updates on your screen</p></div>
                                <input type="checkbox" checked={desktopNotifications} onChange={(e) => setDesktopNotifications(e.target.checked)} />
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div><h4 className="font-medium">Email Updates</h4><p className="text-xs text-gray-500">Receive order updates via email</p></div>
                                <input type="checkbox" checked={communicationEmail} onChange={(e) => setCommunicationEmail(e.target.checked)} />
                            </div>
                        </div>
                    </div>
                );

            case 'kyc':
                const isApproved = kycData?.kycStatus === 'APPROVED';
                const isPending = kycData?.kycStatus === 'PENDING';
                const isRejected = kycData?.kycStatus === 'REJECTED';

                // --- READ-ONLY UI FOR APPROVED OR PENDING ---
                if (isApproved || isPending) {
                    return (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
                                <p className="text-gray-600">Your verification status and details.</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ${isApproved ? 'bg-green-100 shadow-green-100' : 'bg-blue-100 shadow-blue-100'}`}>
                                    {isApproved 
                                        ? <CheckCircle className="w-12 h-12 text-green-600" /> 
                                        : <Clock className="w-12 h-12 text-blue-600" />
                                    }
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                    {isApproved ? 'Verification Approved' : 'Verification Pending'}
                                </h3>
                                <p className="text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
                                    {isApproved 
                                        ? 'Congratulations! Your identity has been successfully verified. You now have full access to all platform features.'
                                        : 'We are currently reviewing your submitted documents. This usually takes about 1 to 24 hours. We will notify you once the review is complete.'}
                                </p>

                                <div className="bg-gray-50 rounded-xl p-6 text-left max-w-2xl mx-auto border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Submitted Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Full Name</p>
                                            <p className="font-semibold text-gray-900 capitalize">
                                                {kycData?.personalInfo?.firstName} {kycData?.personalInfo?.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Nationality</p>
                                            <p className="font-semibold text-gray-900 capitalize">{kycData?.personalInfo?.nationality}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">ID Type</p>
                                            <p className="font-semibold text-gray-900">{kycData?.documents?.idType?.replace('_', ' ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Submitted On</p>
                                            <p className="font-semibold text-gray-900">
                                                {kycData?.submittedAt ? new Date(kycData.submittedAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                // --- FORM UI FOR UNVERIFIED OR REJECTED ---
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
                            <p className="text-gray-600">Complete all fields to verify your identity.</p>
                        </div>

                        {/* REJECTION BANNER */}
                        {isRejected && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-red-800">Verification Rejected</h3>
                                    <p className="text-red-700 text-sm mt-1">
                                        {kycData?.rejectionReason || 'Your previous submission was not accepted. Please review your details and resubmit valid documents.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 space-y-8">
                            
                            {/* 1. PERSONAL DETAILS */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-purple-600"/> Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="text-sm font-bold block mb-2">First Name</label><input type="text" name="firstName" value={kycFormData.firstName} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Last Name</label><input type="text" name="lastName" value={kycFormData.lastName} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Email</label><input type="email" name="email" value={kycFormData.email} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Phone</label><input type="tel" name="phoneNumber" value={kycFormData.phoneNumber} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Date of Birth</label><input type="date" name="dateOfBirth" value={kycFormData.dateOfBirth} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Occupation</label><input type="text" name="occupation" value={kycFormData.occupation} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500" /></div>
                                </div>
                            </div>

                            {/* 2. ADDRESS & LOCATION */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-green-600"/> Address & Location</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2"><label className="text-sm font-bold block mb-2">Residential Address</label><input type="text" name="address" value={kycFormData.address} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></div>
                                    
                                    {/* Country Dropdown */}
                                    <div className="relative">
                                        <label className="text-sm font-bold block mb-2">Country</label>
                                        <select name="country" value={kycFormData.country} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                                            <option value="">Select Country</option>
                                            {countries.map(c => <option key={c.countryCode} value={c.countryName}>{c.countryName}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 bottom-4 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>

                                    {/* Nationality Dropdown */}
                                    <div className="relative">
                                        <label className="text-sm font-bold block mb-2">Nationality</label>
                                        <select name="nationality" value={kycFormData.nationality} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                                            <option value="">Select Nationality</option>
                                            {countries.map(c => <option key={c.countryCode} value={c.countryName}>{c.countryName}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 bottom-4 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>

                                    <div><label className="text-sm font-bold block mb-2">State/Region</label><input type="text" name="state" value={kycFormData.state} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">City</label><input type="text" name="city" value={kycFormData.city} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Postal Code</label><input type="text" name="postalCode" value={kycFormData.postalCode} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" /></div>
                                </div>
                            </div>

                            {/* 3. IDENTIFICATION */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600"/> Identification</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="relative">
                                        <label className="text-sm font-bold block mb-2">ID Type</label>
                                        <select name="idType" value={kycFormData.idType} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                            <option value="">Select ID Type</option>
                                            {/* ENUM VALUES MUST MATCH BACKEND EXACTLY */}
                                            <option value="NIN">NIN (National Identity Number)</option>
                                            <option value="PASSPORT">International Passport</option>
                                            <option value="DRIVERS_LICENSE">Driver's License</option>
                                            <option value="VOTERS_CARD">Voter's Card</option>
                                            <option value="BUSINESS_LICENSE">Business License</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 bottom-4 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                    <div><label className="text-sm font-bold block mb-2">ID Number</label><input type="text" name="idNumber" value={kycFormData.idNumber} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Expiry Date</label><input type="date" name="idExpiryDate" value={kycFormData.idExpiryDate} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" /></div>
                                </div>
                            </div>

                            {/* 4. FINANCIALS */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-600"/> Financial Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div><label className="text-sm font-bold block mb-2">BVN</label><input type="text" name="bvn" value={kycFormData.bvn} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Bank Name</label><input type="text" name="bankName" value={kycFormData.bankName} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" /></div>
                                    <div><label className="text-sm font-bold block mb-2">Account Number</label><input type="text" name="accountNumber" value={kycFormData.accountNumber} onChange={handleKycChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500" /></div>
                                </div>
                            </div>

                            {/* 5. DOCUMENTS */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600"/> Documents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { key: 'idFront', label: "ID Front", ref: idFrontRef },
                                        { key: 'idBack', label: "ID Back", ref: idBackRef },
                                        { key: 'selfie', label: "Selfie", ref: selfieRef },
                                        { key: 'proof', label: "Proof of Address", ref: proofRef },
                                    ].map((doc) => (
                                        <div key={doc.key} onClick={() => doc.ref.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative group">
                                            {kycPreviews[doc.key as keyof typeof kycPreviews] ? (
                                                <Image width={150} height={150} src={kycPreviews[doc.key as keyof typeof kycPreviews]!} alt={doc.label} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-indigo-500" />
                                                    <span className="text-xs font-bold text-gray-600">{doc.label}</span>
                                                </>
                                            )}
                                            <input type="file" ref={doc.ref} onChange={(e) => handleKycFileUpload(e, doc.key as any)} className="hidden" accept="image/*" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button onClick={handleKycSubmit} disabled={kycLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-8 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                    {kycLoading ? <><Loader2 className="w-5 h-5 animate-spin"/> Submitting...</> : "Submit Verification"}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'delete':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div><h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2><p className="text-gray-600">Danger Zone</p></div>
                        <div className="max-w-2xl bg-red-50 border border-red-200 p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold text-red-700 mb-2">Delete Account</h3>
                            <p className="text-red-600 mb-4 text-sm">Once deleted, your data is gone forever.</p>
                            <button className="bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700">Delete My Account</button>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-appBanner/5 p-4 lg:p-6 relative">
            <div className="relative z-10 w-full max-w-7xl mx-auto">
                {/* Header */}
                <div className="w-full flex flex-col md:flex-row justify-between bg-gradient-to-r from-appTitleBgColor to-appNav p-6 md:p-8 mb-8 rounded-2xl shadow-xl min-h-[8rem]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-appBanner to-appNav rounded-xl flex items-center justify-center shadow-lg"><Settings className="w-6 h-6 text-white" /></div>
                        <div><h1 className='font-bold text-xl md:text-2xl text-white'>Account Settings</h1><p className='text-white/90'>Manage your account</p></div>
                    </div>
                    <div className="text-white text-right"><p className="text-sm font-semibold">STATUS</p><p className="text-2xl font-bold">{profile?.verified || 'UNVERIFIED'}</p></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <nav className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button key={item.id} onClick={() => setActivePage(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activePage === item.id ? `bg-gradient-to-r ${item.bg} border-l-4 border-${item.color.split('-')[1]}-500 shadow-sm` : 'hover:bg-gray-50'}`}>
                                            <Icon className={`w-4 h-4 ${item.color}`} />
                                            <span className={`text-sm font-medium ${activePage === item.id ? 'text-gray-900' : 'text-gray-600'}`}>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">{renderContent()}</div>
                </div>
            </div>

            {/* Success Modal */}
            {showKycSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl relative flex flex-col items-center text-center">
                        <button onClick={() => setShowKycSuccess(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-pulse"><CheckCircle className="w-10 h-10 text-green-600" /></div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Submission Successful</h3>
                        <p className="text-gray-600 font-medium leading-relaxed">You have completed your identity verification. We will review it as soon as possible and notify you of the results. The review is expected to be completed in 1 hour.</p>
                        <button onClick={() => setShowKycSuccess(false)} className="mt-8 bg-gray-900 text-white py-3 px-10 rounded-xl font-bold hover:bg-gray-800 transition-all w-full">Got it</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;