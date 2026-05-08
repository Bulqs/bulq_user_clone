'use client';

import React, { useEffect, useState } from 'react';
import {
    X, Home, Building, MapPin, User, Phone, Mail,
    Check, Plus, Edit, Trash2, Star, Package
} from 'lucide-react';
import Heading from '@/app/components/generalheading/Heading';
import { addUserAddress, deleteAddress, getAddressCount, getAllUserAddresses, updateAddress } from '@/lib/user/actions';
import { AddressCountResponseDTO, AddressRequest } from '@/types/user';
import { motion, AnimatePresence, Variants } from 'framer-motion';

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

// --- FRAMER MOTION VARIANTS ---
const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const fadeUpItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const modalBackdrop: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
};

const modalContent: Variants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    show: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } }
};

// ==========================================
// ADD/EDIT ADDRESS MODAL
// ==========================================
const AddAddressModal: React.FC<AddAddressModalProps> = ({ isOpen, onClose, onSave, formData, setFormData, isEditing }) => {
    const [errors, setErrors] = useState<Partial<AddressRequest>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [addressStats, setAddressStats] = useState<AddressCountResponseDTO | null>(null);

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

    const isLimitReached = addressStats ? addressStats.totalAddresses >= addressStats.maxAllowed : false;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    variants={modalBackdrop} initial="hidden" animate="show" exit="hidden"
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                    <motion.div 
                        variants={modalContent} initial="hidden" animate="show" exit="exit"
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
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
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <User className="w-4 h-4 text-appBanner" /> Personal Information
                                </h3>
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
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-appBanner" /> Address Type
                                </h3>
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
                                <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={(!isEditing && isLimitReached) || !!loading} className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all shadow-md ${isLimitReached ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-gradient-to-r from-appBanner to-appNav text-white hover:shadow-lg'}`}>
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

// ==========================================
// LIMIT REACHED MODAL
// ==========================================
const LimitReachedModal = ({ isOpen, onClose, max }: { isOpen: boolean, onClose: () => void, max: number }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-appTitleBgColor/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                <motion.div variants={modalContent} initial="hidden" animate="show" exit="exit" className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-10 h-10 text-amber-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Address Limit Reached</h3>
                        <p className="text-gray-600 mb-8">You've reached the maximum of <span className="font-bold text-appNav">{max} addresses</span>. Please delete an unused address to make room.</p>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="w-full bg-gradient-to-r from-appBanner to-appNav text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                            Got it, I'll manage my addresses
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

// ==========================================
// ADDRESS CARD COMPONENT
// ==========================================
const AddressCard: React.FC<{ address: SavedAddress; onEdit: (address: SavedAddress) => void; onDelete: (id: string) => void; onSetDefault: (id: string) => void; }> = ({ address, onEdit, onDelete, onSetDefault }) => {
    const getAddressTypeIcon = (type: 'HOME' | 'OFFICE' | 'OTHER') => {
        switch (type) { case 'HOME': return <Home className="w-4 h-4" />; case 'OFFICE': return <Building className="w-4 h-4" />; default: return <MapPin className="w-4 h-4" />; }
    };
    const getAddressTypeColor = (type: 'HOME' | 'OFFICE' | 'OTHER') => {
        switch (type) { case 'HOME': return 'text-blue-400'; case 'OFFICE': return 'text-emerald-400'; default: return 'text-purple-400'; }
    };

    return (
        <motion.div 
            layout 
            variants={fadeUpItem}
            initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-colors shadow-lg"
        >
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

// ==========================================
// STATS CARDS COMPONENT
// ==========================================
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
                        <div className="flex flex-col">
                            <span className="text-sm font-bold uppercase tracking-wider opacity-80">{stat.title}</span>
                            <span className="mt-2 text-4xl font-black">{stat.value}</span>
                        </div>
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
// MAIN PAGE COMPONENT
// ==========================================
const AddressPage: React.FC = () => {
    const [addressStats, setAddressStats] = useState<AddressCountResponseDTO | null>(null);
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAddressId, setCurrentAddressId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<AddressRequest>({
        firstName: '', lastName: '', phoneNumber: '', emailAddress: '', addressType: 'HOME',
        streetAddress: '', city: '', postalCode: '', defaultShippingAddress: false
    });

    const isLimitReached = addressStats ? addressStats.totalAddresses >= addressStats.maxAllowed : false;

    const fetchCountsAndAddresses = async () => {
        try {
            const [counts, data] = await Promise.all([getAddressCount(), getAllUserAddresses()]);
            setAddressStats(counts);
            const mappedAddresses: SavedAddress[] = data.addresses.map(addr => ({
                ...addr,
                isDefault: addr.defaultShippingAddress === "true",
                defaultShippingAddress: addr.defaultShippingAddress === "true"
            }));
            setAddresses(mappedAddresses);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        }
    };

    useEffect(() => { fetchCountsAndAddresses(); }, []);

    const handleEditAddress = (address: SavedAddress) => {
        setIsEditing(true);
        setCurrentAddressId(address.id);
        setFormData({ ...address });
        setIsModalOpen(true);
    };

    const handleAddNewAddressClick = () => {
        setIsEditing(false);
        setCurrentAddressId(null);
        setFormData({ firstName: '', lastName: '', phoneNumber: '', emailAddress: '', addressType: 'HOME', streetAddress: '', city: '', postalCode: '', defaultShippingAddress: false });
        setIsModalOpen(true);
    };

    const handleDeleteAddress = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            setLoading(true);
            await deleteAddress(id);
            setAddresses(prev => prev.filter(addr => addr.id !== id));
            const newCounts = await getAddressCount();
            setAddressStats(newCounts);
        } catch (err) { alert("Failed to delete address."); } finally { setLoading(false); }
    };

    const handleSetDefault = async (id: string) => {
        const addressToUpdate = addresses.find(addr => addr.id === id);
        if (!addressToUpdate) return;
        try {
            setLoading(true);
            await updateAddress(id, { ...addressToUpdate, defaultShippingAddress: true });
            await fetchCountsAndAddresses();
        } catch (err) { alert("Failed to update default address."); } finally { setLoading(false); }
    };

    const handleSaveAddress = async (addressData: AddressRequest) => {
        if (!isEditing && isLimitReached) { setIsLimitModalOpen(true); return; }
        try {
            setLoading(true);
            if (isEditing && currentAddressId) {
                const updateResponse = await updateAddress(currentAddressId, addressData);
                const updatedAddr = updateResponse.address;
                setAddresses(prev => prev.map(addr => addr.id === currentAddressId ? { ...updatedAddr, id: updatedAddr.id, defaultShippingAddress: updatedAddr.defaultShippingAddress === "true" } : addr));
            } else {
                const savedResponse = await addUserAddress(addressData);
                setAddresses(prev => [...prev, { ...addressData, ...savedResponse, id: savedResponse.id, defaultShippingAddress: savedResponse.defaultShippingAddress === "true" }]);
            }
            const newCounts = await getAddressCount();
            setAddressStats(newCounts);
            setIsModalOpen(false);
        } catch (err: any) { err.message.includes("limit") ? setIsLimitModalOpen(true) : alert("Failed to save."); } finally { setLoading(false); }
    };

    return (
        <div className="relative pb-8 min-h-screen">
            {/* Header Section */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-appTitleBgColor p-6 mb-8 rounded-2xl border border-white/5 shadow-lg">
                <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-appBanner to-appNav rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                        <Package className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <Heading level="h4" color="light" className="font-extrabold text-white">Address Management</Heading>
                        <p className='font-medium text-sm text-gray-400 mt-1'>Manage your shipping addresses and delivery preferences</p>
                    </div>
                </div>

                <motion.button whileHover={{ scale: isLimitReached ? 1 : 1.02 }} whileTap={{ scale: isLimitReached ? 1 : 0.95 }} onClick={handleAddNewAddressClick} disabled={isLimitReached} className={`flex items-center gap-2 py-3.5 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg ${isLimitReached ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-appBanner to-appNav text-white hover:shadow-appBanner/25 border border-white/10'}`}>
                    <Plus className="w-5 h-5" />
                    {isLimitReached ? 'Address Limit Reached' : 'Add New Address'}
                </motion.button>
            </motion.div>

            <StatsCards statsData={addressStats} />

            {/* Content Area */}
            <div className="bg-gradient-to-b from-appTitleBgColor to-[#0B1121] p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-white/5">
                {/* Animated Background Orbs */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute -top-40 -right-40 w-96 h-96 bg-appBanner/10 blur-[100px] rounded-full pointer-events-none"></motion.div>
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -bottom-40 -left-40 w-96 h-96 bg-appNav/10 blur-[100px] rounded-full pointer-events-none"></motion.div>

                <div className="relative z-10 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {addresses.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-28 h-28 bg-gradient-to-br from-appBanner/20 to-appNav/20 rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-lg">
                                    <MapPin className="w-12 h-12 text-appBanner" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No addresses yet</h3>
                                <p className="text-gray-400 mb-8 font-medium">Add your first shipping address to get started</p>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-appBanner to-appNav text-white py-3 px-8 rounded-xl font-bold shadow-lg shadow-appBanner/20">
                                    Add Your First Address
                                </motion.button>
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

            <AddAddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveAddress} formData={formData} setFormData={setFormData} isEditing={isEditing} />
            <LimitReachedModal isOpen={isLimitModalOpen} onClose={() => setIsLimitModalOpen(false)} max={addressStats?.maxAllowed || 5} />
        </div>
    );
};

export default AddressPage;