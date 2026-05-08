'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
    FiX, FiMapPin, FiLayers, FiBox, FiChevronDown, 
    FiTruck, FiZap, FiDollarSign, FiPackage, FiArrowRight, 
    FiMessageCircle, FiGrid, FiCpu, FiStar, FiCheckCircle
} from 'react-icons/fi';

import { CountryDTO } from '@/types/user';
import { ShippingRateRequest } from '@/types/booking';
import { getSupportedCountries, getMyProfile } from '@/lib/user/actions';
import { calculateShippingRate } from '@/lib/user/booking.actions';
import { getCustomsDuties } from '@/lib/admin/admin.actions';

// ✅ Import your createComplaint API here (adjust the path if needed)
// import { createComplaint } from '@/lib/user/actions'; 

// --- MOCK API FOR COMPILATION (Replace with your actual import above) ---
const createComplaint = async (payload: CreateComplaintRequest): Promise<CreateComplaintResponseDTO> => {
    return new Promise((resolve) => setTimeout(() => resolve({
        ticketId: `TKT-${Math.floor(Math.random() * 10000)}`,
        message: "Your complaint has been logged successfully."
    }), 1500));
};

// --- TYPES ---
export interface CustomsDuty {
    id: number;
    hsCode: string;
    productCategory: string;
    productDescription: string;
    originCountry: string;
    destinationCountry: string;
    dutyRate: number;
    dutyFreeThreshold: number;
    isActive: boolean;
}

export interface CreateComplaintRequest {
    email: string;
    complaint: string;
    trackinNumber: string; // Matches backend typo
}

export interface CreateComplaintResponseDTO {
    ticketId: string; 
    message: string;  
}

// --- ANIMATION VARIANTS ---
const modalBackdrop: Variants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    show: { opacity: 1, backdropFilter: "blur(8px)", transition: { duration: 0.3 } }
};

const modalContent: Variants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    show: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } }
};

const floatingMenuVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    exit: { opacity: 0, y: 20, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
};

const floatingBtnVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 15 } },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
};

// ==========================================
// 1. SHIPPING CALCULATOR MODAL 
// ==========================================
const ShippingCalculatorModal = ({ onClose }: { onClose: () => void }) => {
    const [calculatorPayload, setCalculatorPayload] = useState<ShippingRateRequest>({
        originCountry: '', originState: '', destinationCountry: '', destinationState: '',
        weight: 0, length: 0, width: 0, height: 0, shippingMethodCode: 'STANDARD', declaredValue: 0,
        includeInsurance: true, pickupRequired: false, productCategory: '', itemDescription: '', promoCode: '', hsCode: ''
    });

    const [country, setCountry] = useState<CountryDTO[]>([]);
    const [customsDuties, setCustomsDuties] = useState<CustomsDuty[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<string[]>(["GENERAL", "ELECTRONICS", "FASHION", "DOCUMENTS", "HEALTHCARE"]);
    
    const [calculating, setCalculating] = useState(false);
    const [estimatedCostValue, setEstimatedCostValue] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { getSupportedCountries().then(data => { if (data) setCountry(data); }).catch(console.error); }, []);

    useEffect(() => {
        getCustomsDuties().then(data => {
            if (data && data.length > 0) {
                setCustomsDuties(data);
                const uniqueCategories = Array.from(new Set(data.map((duty: CustomsDuty) => duty.productCategory).filter(Boolean)));
                if (!uniqueCategories.includes("EXPRESS") && !uniqueCategories.includes("STANDARD") && uniqueCategories.length > 0) {
                    setCategoryOptions(uniqueCategories as string[]);
                }
            }
        }).catch(console.error);
    }, []);

    useEffect(() => {
        const getRate = async () => {
            if (!calculatorPayload.originCountry || !calculatorPayload.destinationCountry || calculatorPayload.weight <= 0) return;
            try {
                setCalculating(true);
                const response = await calculateShippingRate(calculatorPayload, "USD");
                setEstimatedCostValue(response?.totalWithCustoms || 0);
                setError(null);
            } catch (err: any) {
                setError("Service unavailable");
                setEstimatedCostValue(0);
            } finally {
                setCalculating(false);
            }
        };
        const timeoutId = setTimeout(() => getRate(), 500); 
        return () => clearTimeout(timeoutId);
    }, [calculatorPayload.shippingMethodCode, calculatorPayload.weight, calculatorPayload.destinationCountry, calculatorPayload.originCountry]); 

    const handleShippingRateChange = (field: keyof ShippingRateRequest, value: string | number | boolean) => {
        setCalculatorPayload(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'productCategory') {
                const matchingDuty = customsDuties.find(duty => duty.productCategory === value);
                updated.hsCode = matchingDuty?.hsCode || '';
            }
            return updated;
        });
    };

    const handleProceedToBooking = () => { window.location.href = '/dashboard/book'; };

    return (
        <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
            <motion.div variants={modalContent} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative border border-white/50 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-white p-6 border-b border-gray-200 flex justify-between items-center shrink-0 relative z-10">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="w-10 h-10 bg-appBanner/10 text-appBanner rounded-xl flex items-center justify-center border border-appBanner/20">
                                <FiBox />
                            </span>
                            Shipping Calculator
                        </h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">Get instant quotes and accurate pricing</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-500 rounded-full flex items-center justify-center transition-colors">
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar relative z-10">
                    <div className="space-y-6">
                        {/* Route */}
                        <div>
                            <label className="flex items-center text-sm font-bold text-slate-800 mb-3 uppercase tracking-widest">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3 shadow-sm"><FiMapPin className="text-white" /></div>
                                Route Info <span className="text-rose-500 ml-1">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="relative">
                                        <select value={calculatorPayload.originCountry} onChange={(e) => handleShippingRateChange('originCountry', e.target.value)} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all shadow-sm">
                                            <option value="">Origin Country</option>
                                            {country.map((c) => <option key={c.id} value={c.countryCode}>{c.countryName}</option>)}
                                        </select>
                                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    <input type="text" placeholder="Origin State/Province" value={calculatorPayload.originState} onChange={(e) => handleShippingRateChange('originState', e.target.value)} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all shadow-sm" />
                                </div>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <select value={calculatorPayload.destinationCountry} onChange={(e) => handleShippingRateChange('destinationCountry', e.target.value)} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all shadow-sm">
                                            <option value="">Destination Country</option>
                                            {country.map((c) => <option key={c.id} value={c.countryCode}>{c.countryName}</option>)}
                                        </select>
                                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    <input type="text" placeholder="Destination State/Province" value={calculatorPayload.destinationState} onChange={(e) => handleShippingRateChange('destinationState', e.target.value)} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all shadow-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Weight & Dimensions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center text-sm font-bold text-slate-800 mb-3 uppercase tracking-widest">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3 shadow-sm"><FiLayers className="text-white" /></div>
                                    Weight (kg) <span className="text-rose-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input type="number" value={calculatorPayload.weight || ''} onChange={(e) => handleShippingRateChange('weight', parseFloat(e.target.value))} placeholder="0.0" className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all shadow-sm" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-black uppercase tracking-wider">kg</span>
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center text-sm font-bold text-slate-800 mb-3 uppercase tracking-widest">
                                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-sm"><FiBox className="text-white" /></div>
                                    Dims (cm)
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <input type="number" value={calculatorPayload.length || ''} onChange={(e) => handleShippingRateChange('length', parseFloat(e.target.value))} placeholder="L" className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-center text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
                                    <input type="number" value={calculatorPayload.width || ''} onChange={(e) => handleShippingRateChange('width', parseFloat(e.target.value))} placeholder="W" className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-center text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
                                    <input type="number" value={calculatorPayload.height || ''} onChange={(e) => handleShippingRateChange('height', parseFloat(e.target.value))} placeholder="H" className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-center text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Items & Category */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Item Description <span className="text-rose-500">*</span></label>
                                <input type="text" value={calculatorPayload.itemDescription} onChange={(e) => handleShippingRateChange('itemDescription', e.target.value)} placeholder="e.g. 2 pairs of leather shoes" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Category <span className="text-rose-500">*</span></label>
                                    <select value={calculatorPayload.productCategory} onChange={(e) => handleShippingRateChange('productCategory', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm">
                                        <option value="">Select Category</option>
                                        {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <FiChevronDown className="absolute right-4 bottom-4 text-gray-400 pointer-events-none" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Value (USD) <span className="text-rose-500">*</span></label>
                                    <input type="number" value={calculatorPayload.declaredValue || ''} onChange={(e) => handleShippingRateChange('declaredValue', parseFloat(e.target.value))} placeholder="$ 0.00" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Promo Code */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Promo Code</label>
                                <input type="text" value={calculatorPayload.promoCode} onChange={(e) => handleShippingRateChange('promoCode', e.target.value)} placeholder="Enter Code" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex flex-wrap items-center gap-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={calculatorPayload.includeInsurance} onChange={(e) => handleShippingRateChange('includeInsurance', e.target.checked)} className="w-4 h-4 text-appBanner rounded focus:ring-appBanner cursor-pointer" />
                                <span className="text-sm font-bold text-slate-600 group-hover:text-appBanner transition-colors">Include Insurance</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={calculatorPayload.pickupRequired} onChange={(e) => handleShippingRateChange('pickupRequired', e.target.checked)} className="w-4 h-4 text-appBanner rounded focus:ring-appBanner cursor-pointer" />
                                <span className="text-sm font-bold text-slate-600 group-hover:text-appBanner transition-colors">Request Pickup</span>
                            </label>
                        </div>

                        {/* Shipping Method Grid */}
                        <div>
                            <label className="flex items-center text-sm font-bold text-slate-800 mb-3 uppercase tracking-widest">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-sm"><FiTruck className="text-white" /></div>
                                Shipping Method
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { value: 'STANDARD', label: 'STANDARD', days: '5-7 days', icon: FiTruck, gradient: 'from-blue-500 to-cyan-500' },
                                    { value: 'EXPRESS', label: 'EXPRESS', days: '2-3 days', icon: FiZap, gradient: 'from-emerald-500 to-green-500' },
                                    { value: 'ECONOMY', label: 'ECONOMY', days: '10-14 days', icon: FiDollarSign, gradient: 'bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-500' },
                                    { value: 'CONSOLIDATE', label: 'CONSOLIDATE', days: 'Next shipment', icon: FiPackage, gradient: 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500' }
                                ].map((method) => {
                                    const Icon = method.icon;
                                    const isSelected = calculatorPayload.shippingMethodCode === method.value;
                                    return (
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={method.value} onClick={() => handleShippingRateChange('shippingMethodCode', method.value)} className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected ? `bg-gradient-to-br ${method.gradient} border-transparent text-white shadow-lg` : 'bg-white border-gray-200 text-slate-700 hover:border-appBanner hover:shadow-md'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <Icon className="w-4 h-4" />
                                                <div className={`w-3 h-3 rounded-full border-2 ${isSelected ? 'bg-white border-white' : 'bg-white border-slate-300'}`} />
                                            </div>
                                            <div className="font-extrabold text-[11px] uppercase tracking-wider">{method.label}</div>
                                            <div className={`text-[9px] font-bold mt-1 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{method.days}</div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Results & Submission */}
                <div className="bg-gradient-to-br from-slate-900 to-appTitleBgColor p-6 shrink-0 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-appBanner/20 rounded-full blur-2xl -translate-y-10 translate-x-10" />
                    <div className="relative z-10 w-full md:w-auto flex justify-between md:flex-col items-center md:items-start">
                        <div>
                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-0.5">Estimated Total</p>
                            <p className="text-white/80 text-[10px] font-medium hidden md:block">📦 Includes all fees</p>
                        </div>
                        <div className="text-3xl font-black text-white drop-shadow-md">
                            {calculating ? <span className="animate-pulse">...</span> : `$${estimatedCostValue || '0.00'}`}
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        onClick={handleProceedToBooking} 
                        disabled={!calculatorPayload.destinationCountry || !calculatorPayload.weight} 
                        className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-appBanner to-appNav text-white rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg hover:shadow-appBanner/30 flex items-center justify-center gap-2 relative z-10"
                    >
                        Proceed to Book <FiArrowRight />
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ==========================================
// 2. CONTACT SUPPORT MODAL 
// ==========================================
const SupportModal = ({ onClose }: { onClose: () => void }) => {
    const [payload, setPayload] = useState<CreateComplaintRequest>({
        email: '',
        complaint: '',
        trackinNumber: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<CreateComplaintResponseDTO | null>(null);

    // Pre-fill email if user is logged in
    useEffect(() => {
        getMyProfile()
            .then(profile => {
                if (profile && (profile as any).email) {
                    setPayload(prev => ({ ...prev, email: (profile as any).email }));
                }
            })
            .catch(() => { /* Silent fail if not logged in */ });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({ ...payload, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async () => {
        if (!payload.email || !payload.complaint) {
            setError("Email and message are required fields.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await createComplaint(payload);
            setSuccessData(response);
        } catch (err: any) {
            setError(err.message || "Failed to log complaint. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div variants={modalContent} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 bg-gray-100 rounded-full transition-colors z-10">
                    <FiX size={20} />
                </button>

                {successData ? (
                    // SUCCESS STATE
                    <div className="flex flex-col items-center text-center py-6 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                            <FiCheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Complaint Logged</h3>
                        <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl mb-4">
                            <span className="text-sm font-medium text-gray-500">Ticket Ref: </span>
                            <span className="text-sm font-black text-appBanner">{successData.ticketId}</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
                            {successData.message} Please keep the ticket reference for your records. Our team will contact you shortly.
                        </p>
                        <button onClick={onClose} className="w-full bg-appTitleBgColor hover:bg-appNav text-white font-bold py-3.5 rounded-xl shadow-md transition-colors">
                            Done
                        </button>
                    </div>
                ) : (
                    // INPUT FORM STATE
                    <>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                            <FiMessageCircle size={24} />
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Contact Support</h3>
                        <p className="text-sm text-gray-500 font-medium mb-6">Need help with your shipment? Send us a message and we'll get back to you shortly.</p>
                        
                        {error && (
                            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg mb-4 border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 relative z-10">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Email Address *</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={payload.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-appBanner focus:ring-1 focus:ring-appBanner transition-all" 
                                    placeholder="your@email.com" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block flex justify-between">
                                    <span>Tracking Number</span>
                                    <span className="text-gray-400 font-medium lowercase">(Optional)</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="trackinNumber"
                                    value={payload.trackinNumber}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-appBanner focus:ring-1 focus:ring-appBanner transition-all font-mono" 
                                    placeholder="e.g. PKG-123456" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Message *</label>
                                <textarea 
                                    name="complaint"
                                    value={payload.complaint}
                                    onChange={handleChange}
                                    rows={4} 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-appBanner focus:ring-1 focus:ring-appBanner resize-none transition-all" 
                                    placeholder="Describe your issue..."
                                ></textarea>
                            </div>
                            
                            <button 
                                onClick={handleSubmit} 
                                disabled={isSubmitting}
                                className="w-full bg-appTitleBgColor hover:bg-appNav text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</>
                                ) : 'Submit Ticket'}
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

// ==========================================
// 3. BOOK WITH AI MODAL (Coming Soon)
// ==========================================
const AIComingSoonModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div variants={modalContent} className="bg-gradient-to-br from-[#0B1121] to-[#111827] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)] w-full max-w-sm p-8 relative text-center overflow-hidden">
                
                {/* Magical Background Glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors z-10">
                    <FiX size={20} />
                </button>
                
                <div className="relative z-10 flex flex-col items-center">
                    <motion.div 
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/30 border border-white/20"
                    >
                        <FiStar size={32} className="fill-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">AI Booking Agent</h3>
                    <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-black text-blue-300 uppercase tracking-widest mb-4">
                        Coming Soon
                    </div>
                    <p className="text-sm text-gray-400 font-medium mb-8 leading-relaxed">
                        We are training our AI to handle your bookings automatically. Soon, you'll be able to just type or speak what you need to ship!
                    </p>
                    
                    <button onClick={onClose} className="w-full bg-white text-appTitleBgColor hover:bg-gray-100 font-bold py-3.5 rounded-xl shadow-lg transition-colors">
                        Got it, I'll wait!
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ==========================================
// 4. MAIN FLOATING MENU COMPONENT
// ==========================================
type ActiveModalType = 'calculator' | 'support' | 'ai' | null;

export default function FloatingActionMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
    const [showGuideTooltip, setShowGuideTooltip] = useState(true);

    // Hide tooltip automatically after 8 seconds, or immediately if menu is opened
    useEffect(() => {
        if (isMenuOpen) setShowGuideTooltip(false);
        const timer = setTimeout(() => setShowGuideTooltip(false), 8000);
        return () => clearTimeout(timer);
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    
    const openModal = (type: ActiveModalType) => {
        setActiveModal(type);
        setIsMenuOpen(false); 
    };

    return (
        <>
            {/* The Floating Menu Area */}
            <div className="fixed bottom-10 right-8 z-50 flex flex-col items-end gap-4">
                
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            variants={floatingMenuVariants} 
                            initial="hidden" 
                            animate="show" 
                            exit="exit" 
                            className="flex flex-col items-end gap-4 mb-2"
                        >
                            {/* Action 1: Calculator */}
                            <motion.button 
                                variants={floatingBtnVariants}
                                whileHover={{ scale: 1.1, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal('calculator')}
                                className="flex items-center gap-3 group"
                            >
                                <span className="bg-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-700 shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Calculate Rate
                                </span>
                                <div className="w-14 h-14 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-appBanner">
                                    <FiPackage size={24} />
                                </div>
                            </motion.button>

                            {/* Action 2: Book with AI */}
                            <motion.button 
                                variants={floatingBtnVariants}
                                whileHover={{ scale: 1.1, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal('ai')}
                                className="flex items-center gap-3 group"
                            >
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    <FiStar className="fill-white" /> Book with AI
                                </span>
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg border border-white/20 flex items-center justify-center text-white">
                                    <FiCpu size={24} />
                                </div>
                            </motion.button>
                            
                            {/* Action 3: Support */}
                            <motion.button 
                                variants={floatingBtnVariants}
                                whileHover={{ scale: 1.1, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal('support')}
                                className="flex items-center gap-3 group"
                            >
                                <span className="bg-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-700 shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Support
                                </span>
                                <div className="w-14 h-14 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-blue-500">
                                    <FiMessageCircle size={24} />
                                </div>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Primary Toggle Button & Tooltip Wrapper */}
                <div className="relative flex items-center">
                    
                    {/* Onboarding Tooltip Guide */}
                    <AnimatePresence>
                        {showGuideTooltip && !isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                className="absolute right-20 bg-white text-gray-800 px-4 py-2.5 rounded-2xl shadow-xl border border-gray-200 text-sm font-extrabold whitespace-nowrap flex items-center gap-3 origin-right"
                            >
                                <motion.span 
                                    animate={{ rotate: [0, 20, -20, 0] }} 
                                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
                                    className="text-lg inline-block origin-bottom-right"
                                >
                                    👋
                                </motion.span>
                                Explore Quick Tools!
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowGuideTooltip(false); }}
                                    className="ml-1 text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-full p-1 transition-colors"
                                >
                                    <FiX size={14} />
                                </button>
                                {/* Little triangle arrow pointing right */}
                                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-white border-b-[6px] border-b-transparent"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main FAB */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ 
                            boxShadow: isMenuOpen 
                                ? "0px 0px 0px rgba(0,0,0,0)" 
                                : ["0px 0px 0px 0px rgba(13, 27, 42, 0.4)", "0px 0px 0px 15px rgba(13, 27, 42, 0)"] 
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        onClick={toggleMenu}
                        className="w-16 h-16 bg-gradient-to-br from-appTitleBgColor to-appNav rounded-full shadow-2xl flex items-center justify-center text-white border border-white/20 z-50 relative overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {isMenuOpen ? (
                                <motion.div 
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FiX size={28} />
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="grid"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FiGrid size={26} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* Render Active Modals */}
            <AnimatePresence>
                {activeModal === 'calculator' && <ShippingCalculatorModal onClose={() => setActiveModal(null)} />}
                {activeModal === 'support' && <SupportModal onClose={() => setActiveModal(null)} />}
                {activeModal === 'ai' && <AIComingSoonModal onClose={() => setActiveModal(null)} />}
            </AnimatePresence>
        </>
    );
}

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence, Variants } from 'framer-motion';
// import { 
//     FiX, FiMapPin, FiLayers, FiBox, FiChevronDown, 
//     FiTruck, FiZap, FiDollarSign, FiPackage, FiArrowRight, 
//     FiMessageCircle, FiGrid, FiCpu, FiStar
// } from 'react-icons/fi';

// import { CountryDTO } from '@/types/user';
// import { ShippingRateRequest } from '@/types/booking';
// import { getSupportedCountries } from '@/lib/user/actions';
// import { calculateShippingRate } from '@/lib/user/booking.actions';
// import { getCustomsDuties } from '@/lib/admin/admin.actions';

// // --- TYPES ---
// export interface CustomsDuty {
//     id: number;
//     hsCode: string;
//     productCategory: string;
//     productDescription: string;
//     originCountry: string;
//     destinationCountry: string;
//     dutyRate: number;
//     dutyFreeThreshold: number;
//     isActive: boolean;
// }

// // --- ANIMATION VARIANTS ---
// const modalBackdrop: Variants = {
//     hidden: { opacity: 0, backdropFilter: "blur(0px)" },
//     show: { opacity: 1, backdropFilter: "blur(8px)", transition: { duration: 0.3 } }
// };

// const modalContent: Variants = {
//     hidden: { scale: 0.95, opacity: 0, y: 20 },
//     show: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
//     exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } }
// };

// const floatingMenuVariants: Variants = {
//     hidden: { opacity: 0, y: 50 },
//     show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
//     exit: { opacity: 0, y: 20, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
// };

// const floatingBtnVariants: Variants = {
//     hidden: { opacity: 0, scale: 0.5, y: 20 },
//     show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 15 } },
//     exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
// };

// // ==========================================
// // 1. SHIPPING CALCULATOR MODAL (Unchanged functionality)
// // ==========================================
// const ShippingCalculatorModal = ({ onClose }: { onClose: () => void }) => {
//     const [calculatorPayload, setCalculatorPayload] = useState<ShippingRateRequest>({
//         originCountry: '', originState: '', destinationCountry: '', destinationState: '',
//         weight: 0, length: 0, width: 0, height: 0, shippingMethodCode: 'STANDARD', declaredValue: 0,
//         includeInsurance: true, pickupRequired: false, productCategory: '', itemDescription: '', promoCode: '', hsCode: ''
//     });

//     const [country, setCountry] = useState<CountryDTO[]>([]);
//     const [customsDuties, setCustomsDuties] = useState<CustomsDuty[]>([]);
//     const [categoryOptions, setCategoryOptions] = useState<string[]>(["GENERAL", "ELECTRONICS", "FASHION", "DOCUMENTS", "HEALTHCARE"]);
    
//     const [calculating, setCalculating] = useState(false);
//     const [estimatedCostValue, setEstimatedCostValue] = useState(0);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => { getSupportedCountries().then(data => { if (data) setCountry(data); }).catch(console.error); }, []);

//     useEffect(() => {
//         getCustomsDuties().then(data => {
//             if (data && data.length > 0) {
//                 setCustomsDuties(data);
//                 const uniqueCategories = Array.from(new Set(data.map((duty: CustomsDuty) => duty.productCategory).filter(Boolean)));
//                 if (!uniqueCategories.includes("EXPRESS") && !uniqueCategories.includes("STANDARD") && uniqueCategories.length > 0) {
//                     setCategoryOptions(uniqueCategories as string[]);
//                 }
//             }
//         }).catch(console.error);
//     }, []);

//     useEffect(() => {
//         const getRate = async () => {
//             if (!calculatorPayload.originCountry || !calculatorPayload.destinationCountry || calculatorPayload.weight <= 0) return;
//             try {
//                 setCalculating(true);
//                 const response = await calculateShippingRate(calculatorPayload, "USD");
//                 setEstimatedCostValue(response?.totalWithCustoms || 0);
//                 setError(null);
//             } catch (err: any) {
//                 setError("Service unavailable");
//                 setEstimatedCostValue(0);
//             } finally {
//                 setCalculating(false);
//             }
//         };
//         const timeoutId = setTimeout(() => getRate(), 500); 
//         return () => clearTimeout(timeoutId);
//     }, [calculatorPayload.shippingMethodCode, calculatorPayload.weight, calculatorPayload.destinationCountry, calculatorPayload.originCountry]); 

//     const handleShippingRateChange = (field: keyof ShippingRateRequest, value: string | number | boolean) => {
//         setCalculatorPayload(prev => {
//             const updated = { ...prev, [field]: value };
//             if (field === 'productCategory') {
//                 const matchingDuty = customsDuties.find(duty => duty.productCategory === value);
//                 updated.hsCode = matchingDuty?.hsCode || '';
//             }
//             return updated;
//         });
//     };

//     const handleProceedToBooking = () => { window.location.href = '/dashboard/book'; };

//     return (
//         <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
//             <motion.div variants={modalContent} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative border border-white/50 flex flex-col max-h-[90vh]">
                
//                 {/* Header */}
//                 <div className="bg-white p-6 border-b border-gray-200 flex justify-between items-center shrink-0 relative z-10">
//                     <div>
//                         <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
//                             <span className="w-10 h-10 bg-appBanner/10 text-appBanner rounded-xl flex items-center justify-center border border-appBanner/20">
//                                 <FiBox />
//                             </span>
//                             Shipping Calculator
//                         </h2>
//                         <p className="text-sm font-medium text-gray-500 mt-1">Get instant quotes and accurate pricing</p>
//                     </div>
//                     <button onClick={onClose} className="w-10 h-10 bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-500 rounded-full flex items-center justify-center transition-colors">
//                         <FiX size={20} />
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar relative z-10">
//                     <div className="space-y-6">
//                         {/* Route */}
//                         <div>
//                             <label className="flex items-center text-sm font-bold text-slate-800 mb-3 uppercase tracking-widest">
//                                 <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3 shadow-sm"><FiMapPin className="text-white" /></div>
//                                 Route Info <span className="text-rose-500 ml-1">*</span>
//                             </label>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="space-y-3">
//                                     <div className="relative">
//                                         <select value={calculatorPayload.originCountry} onChange={(e) => handleShippingRateChange('originCountry', e.target.value)} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all shadow-sm">
//                                             <option value="">Origin Country</option>
//                                             {country.map((c) => <option key={c.id} value={c.countryCode}>{c.countryName}</option>)}
//                                         </select>
//                                         <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                                     </div>
//                                     <input type="text" placeholder="Origin State/Province" value={calculatorPayload.originState} onChange={(e) => handleShippingRateChange('originState', e.target.value)} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all shadow-sm" />
//                                 </div>
//                                 <div className="space-y-3">
//                                     <div className="relative">
//                                         <select value={calculatorPayload.destinationCountry} onChange={(e) => handleShippingRateChange('destinationCountry', e.target.value)} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all shadow-sm">
//                                             <option value="">Destination Country</option>
//                                             {country.map((c) => <option key={c.id} value={c.countryCode}>{c.countryName}</option>)}
//                                         </select>
//                                         <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//                                     </div>
//                                     <input type="text" placeholder="Destination State/Province" value={calculatorPayload.destinationState} onChange={(e) => handleShippingRateChange('destinationState', e.target.value)} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all shadow-sm" />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Weight & Dimensions */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="flex items-center text-sm font-bold text-slate-800 mb-3 uppercase tracking-widest">
//                                     <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3 shadow-sm"><FiLayers className="text-white" /></div>
//                                     Weight (kg) <span className="text-rose-500 ml-1">*</span>
//                                 </label>
//                                 <div className="relative">
//                                     <input type="number" value={calculatorPayload.weight || ''} onChange={(e) => handleShippingRateChange('weight', parseFloat(e.target.value))} placeholder="0.0" className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner transition-all shadow-sm" />
//                                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-black uppercase tracking-wider">kg</span>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className="flex items-center text-sm font-bold text-slate-800 mb-3 uppercase tracking-widest">
//                                     <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-sm"><FiBox className="text-white" /></div>
//                                     Dims (cm)
//                                 </label>
//                                 <div className="grid grid-cols-3 gap-2">
//                                     <input type="number" value={calculatorPayload.length || ''} onChange={(e) => handleShippingRateChange('length', parseFloat(e.target.value))} placeholder="L" className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-center text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
//                                     <input type="number" value={calculatorPayload.width || ''} onChange={(e) => handleShippingRateChange('width', parseFloat(e.target.value))} placeholder="W" className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-center text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
//                                     <input type="number" value={calculatorPayload.height || ''} onChange={(e) => handleShippingRateChange('height', parseFloat(e.target.value))} placeholder="H" className="w-full px-3 py-3.5 bg-white border border-gray-200 rounded-xl text-center text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Items & Category */}
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Item Description <span className="text-rose-500">*</span></label>
//                                 <input type="text" value={calculatorPayload.itemDescription} onChange={(e) => handleShippingRateChange('itemDescription', e.target.value)} placeholder="e.g. 2 pairs of leather shoes" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="relative">
//                                     <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Category <span className="text-rose-500">*</span></label>
//                                     <select value={calculatorPayload.productCategory} onChange={(e) => handleShippingRateChange('productCategory', e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm">
//                                         <option value="">Select Category</option>
//                                         {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//                                     </select>
//                                     <FiChevronDown className="absolute right-4 bottom-4 text-gray-400 pointer-events-none" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Value (USD) <span className="text-rose-500">*</span></label>
//                                     <input type="number" value={calculatorPayload.declaredValue || ''} onChange={(e) => handleShippingRateChange('declaredValue', parseFloat(e.target.value))} placeholder="$ 0.00" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Promo Code */}
//                         <div className="grid grid-cols-1 gap-4">
//                             <div>
//                                 <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase tracking-widest">Promo Code</label>
//                                 <input type="text" value={calculatorPayload.promoCode} onChange={(e) => handleShippingRateChange('promoCode', e.target.value)} placeholder="Enter Code" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm" />
//                             </div>
//                         </div>

//                         {/* Toggles */}
//                         <div className="flex flex-wrap items-center gap-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
//                             <label className="flex items-center gap-2 cursor-pointer group">
//                                 <input type="checkbox" checked={calculatorPayload.includeInsurance} onChange={(e) => handleShippingRateChange('includeInsurance', e.target.checked)} className="w-4 h-4 text-appBanner rounded focus:ring-appBanner cursor-pointer" />
//                                 <span className="text-sm font-bold text-slate-600 group-hover:text-appBanner transition-colors">Include Insurance</span>
//                             </label>
//                             <label className="flex items-center gap-2 cursor-pointer group">
//                                 <input type="checkbox" checked={calculatorPayload.pickupRequired} onChange={(e) => handleShippingRateChange('pickupRequired', e.target.checked)} className="w-4 h-4 text-appBanner rounded focus:ring-appBanner cursor-pointer" />
//                                 <span className="text-sm font-bold text-slate-600 group-hover:text-appBanner transition-colors">Request Pickup</span>
//                             </label>
//                         </div>

//                         {/* Shipping Method Grid */}
//                         <div>
//                             <label className="flex items-center text-sm font-bold text-slate-800 mb-3 uppercase tracking-widest">
//                                 <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-sm"><FiTruck className="text-white" /></div>
//                                 Shipping Method
//                             </label>
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                                 {[
//                                     { value: 'STANDARD', label: 'STANDARD', days: '5-7 days', icon: FiTruck, gradient: 'from-blue-500 to-cyan-500' },
//                                     { value: 'EXPRESS', label: 'EXPRESS', days: '2-3 days', icon: FiZap, gradient: 'from-emerald-500 to-green-500' },
//                                     { value: 'ECONOMY', label: 'ECONOMY', days: '10-14 days', icon: FiDollarSign, gradient: 'bg-gradient-to-br from-teal-600 via-cyan-500 to-blue-500' },
//                                     { value: 'CONSOLIDATE', label: 'CONSOLIDATE', days: 'Next shipment', icon: FiPackage, gradient: 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500' }
//                                 ].map((method) => {
//                                     const Icon = method.icon;
//                                     const isSelected = calculatorPayload.shippingMethodCode === method.value;
//                                     return (
//                                         <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={method.value} onClick={() => handleShippingRateChange('shippingMethodCode', method.value)} className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected ? `bg-gradient-to-br ${method.gradient} border-transparent text-white shadow-lg` : 'bg-white border-gray-200 text-slate-700 hover:border-appBanner hover:shadow-md'}`}>
//                                             <div className="flex items-center justify-between mb-2">
//                                                 <Icon className="w-4 h-4" />
//                                                 <div className={`w-3 h-3 rounded-full border-2 ${isSelected ? 'bg-white border-white' : 'bg-white border-slate-300'}`} />
//                                             </div>
//                                             <div className="font-extrabold text-[11px] uppercase tracking-wider">{method.label}</div>
//                                             <div className={`text-[9px] font-bold mt-1 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{method.days}</div>
//                                         </motion.div>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer Results & Submission */}
//                 <div className="bg-gradient-to-br from-slate-900 to-appTitleBgColor p-6 shrink-0 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-appBanner/20 rounded-full blur-2xl -translate-y-10 translate-x-10" />
//                     <div className="relative z-10 w-full md:w-auto flex justify-between md:flex-col items-center md:items-start">
//                         <div>
//                             <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-0.5">Estimated Total</p>
//                             <p className="text-white/80 text-[10px] font-medium hidden md:block">📦 Includes all fees</p>
//                         </div>
//                         <div className="text-3xl font-black text-white drop-shadow-md">
//                             {calculating ? <span className="animate-pulse">...</span> : `$${estimatedCostValue || '0.00'}`}
//                         </div>
//                     </div>

//                     <motion.button 
//                         whileHover={{ scale: 1.02 }} 
//                         whileTap={{ scale: 0.98 }} 
//                         onClick={handleProceedToBooking} 
//                         disabled={!calculatorPayload.destinationCountry || !calculatorPayload.weight} 
//                         className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-appBanner to-appNav text-white rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg hover:shadow-appBanner/30 flex items-center justify-center gap-2 relative z-10"
//                     >
//                         Proceed to Book <FiArrowRight />
//                     </motion.button>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// };

// // ==========================================
// // 2. CONTACT SUPPORT MODAL
// // ==========================================
// const SupportModal = ({ onClose }: { onClose: () => void }) => {
//     return (
//         <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//             <motion.div variants={modalContent} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
//                 <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 bg-gray-100 rounded-full transition-colors">
//                     <FiX size={20} />
//                 </button>
//                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
//                     <FiMessageCircle size={24} />
//                 </div>
//                 <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Contact Support</h3>
//                 <p className="text-sm text-gray-500 font-medium mb-6">Need help with your shipment? Send us a message and we'll get back to you shortly.</p>
                
//                 <div className="space-y-4">
//                     <div>
//                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Subject</label>
//                         <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-appBanner focus:ring-1 focus:ring-appBanner" placeholder="What is this regarding?" />
//                     </div>
//                     <div>
//                         <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Message</label>
//                         <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-appBanner focus:ring-1 focus:ring-appBanner resize-none" placeholder="Describe your issue..."></textarea>
//                     </div>
//                     <button onClick={onClose} className="w-full bg-appTitleBgColor hover:bg-appNav text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2">
//                         Send Message
//                     </button>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// };

// // ==========================================
// // 3. BOOK WITH AI MODAL (Coming Soon)
// // ==========================================
// const AIComingSoonModal = ({ onClose }: { onClose: () => void }) => {
//     return (
//         <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//             <motion.div variants={modalContent} className="bg-gradient-to-br from-[#0B1121] to-[#111827] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)] w-full max-w-sm p-8 relative text-center overflow-hidden">
                
//                 {/* Magical Background Glow */}
//                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
//                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

//                 <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors z-10">
//                     <FiX size={20} />
//                 </button>
                
//                 <div className="relative z-10 flex flex-col items-center">
//                     <motion.div 
//                         animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
//                         transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//                         className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/30 border border-white/20"
//                     >
//                         <FiStar size={32} className="fill-white" />
//                     </motion.div>
                    
//                     <h3 className="text-2xl font-black text-white mb-2 tracking-tight">AI Booking Agent</h3>
//                     <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-black text-blue-300 uppercase tracking-widest mb-4">
//                         Coming Soon
//                     </div>
//                     <p className="text-sm text-gray-400 font-medium mb-8 leading-relaxed">
//                         We are training our AI to handle your bookings automatically. Soon, you'll be able to just type or speak what you need to ship!
//                     </p>
                    
//                     <button onClick={onClose} className="w-full bg-white text-appTitleBgColor hover:bg-gray-100 font-bold py-3.5 rounded-xl shadow-lg transition-colors">
//                         Got it, I'll wait!
//                     </button>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// };

// // ==========================================
// // 4. MAIN FLOATING MENU COMPONENT
// // ==========================================
// type ActiveModalType = 'calculator' | 'support' | 'ai' | null;

// export default function FloatingActionMenu() {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
//     const [showGuideTooltip, setShowGuideTooltip] = useState(true);

//     // Hide tooltip automatically after 8 seconds, or immediately if menu is opened
//     useEffect(() => {
//         if (isMenuOpen) setShowGuideTooltip(false);
//         const timer = setTimeout(() => setShowGuideTooltip(false), 8000);
//         return () => clearTimeout(timer);
//     }, [isMenuOpen]);

//     const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    
//     const openModal = (type: ActiveModalType) => {
//         setActiveModal(type);
//         setIsMenuOpen(false); 
//     };

//     return (
//         <>
//             {/* The Floating Menu Area */}
//             <div className="fixed bottom-10 right-8 z-50 flex flex-col items-end gap-4">
                
//                 <AnimatePresence>
//                     {isMenuOpen && (
//                         <motion.div 
//                             variants={floatingMenuVariants} 
//                             initial="hidden" 
//                             animate="show" 
//                             exit="exit" 
//                             className="flex flex-col items-end gap-4 mb-2"
//                         >
//                             {/* Action 1: Calculator */}
//                             <motion.button 
//                                 variants={floatingBtnVariants}
//                                 whileHover={{ scale: 1.1, x: -5 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => openModal('calculator')}
//                                 className="flex items-center gap-3 group"
//                             >
//                                 <span className="bg-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-700 shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     Calculate Rate
//                                 </span>
//                                 <div className="w-14 h-14 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-appBanner">
//                                     <FiPackage size={24} />
//                                 </div>
//                             </motion.button>

//                             {/* Action 2: Book with AI */}
//                             <motion.button 
//                                 variants={floatingBtnVariants}
//                                 whileHover={{ scale: 1.1, x: -5 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => openModal('ai')}
//                                 className="flex items-center gap-3 group"
//                             >
//                                 <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
//                                     <FiStar className="fill-white" /> Book with AI
//                                 </span>
//                                 <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg border border-white/20 flex items-center justify-center text-white">
//                                     <FiCpu size={24} />
//                                 </div>
//                             </motion.button>
                            
//                             {/* Action 3: Support */}
//                             <motion.button 
//                                 variants={floatingBtnVariants}
//                                 whileHover={{ scale: 1.1, x: -5 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => openModal('support')}
//                                 className="flex items-center gap-3 group"
//                             >
//                                 <span className="bg-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-700 shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
//                                     Support
//                                 </span>
//                                 <div className="w-14 h-14 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-blue-500">
//                                     <FiMessageCircle size={24} />
//                                 </div>
//                             </motion.button>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* Primary Toggle Button & Tooltip Wrapper */}
//                 <div className="relative flex items-center">
                    
//                     {/* Onboarding Tooltip Guide */}
//                     <AnimatePresence>
//                         {showGuideTooltip && !isMenuOpen && (
//                             <motion.div
//                                 initial={{ opacity: 0, x: 20, scale: 0.8 }}
//                                 animate={{ opacity: 1, x: 0, scale: 1 }}
//                                 exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
//                                 className="absolute right-20 bg-white text-gray-800 px-4 py-2.5 rounded-2xl shadow-xl border border-gray-200 text-sm font-extrabold whitespace-nowrap flex items-center gap-3 origin-right"
//                             >
//                                 <motion.span 
//                                     animate={{ rotate: [0, 20, -20, 0] }} 
//                                     transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
//                                     className="text-lg inline-block origin-bottom-right"
//                                 >
//                                     👋
//                                 </motion.span>
//                                 Explore Quick Tools!
//                                 <button 
//                                     onClick={(e) => { e.stopPropagation(); setShowGuideTooltip(false); }}
//                                     className="ml-1 text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-full p-1 transition-colors"
//                                 >
//                                     <FiX size={14} />
//                                 </button>
//                                 {/* Little triangle arrow pointing right */}
//                                 <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-white border-b-[6px] border-b-transparent"></div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     {/* Main FAB */}
//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         animate={{ 
//                             boxShadow: isMenuOpen 
//                                 ? "0px 0px 0px rgba(0,0,0,0)" 
//                                 : ["0px 0px 0px 0px rgba(13, 27, 42, 0.4)", "0px 0px 0px 15px rgba(13, 27, 42, 0)"] 
//                         }}
//                         transition={{ duration: 1.5, repeat: Infinity }}
//                         onClick={toggleMenu}
//                         className="w-16 h-16 bg-gradient-to-br from-appTitleBgColor to-appNav rounded-full shadow-2xl flex items-center justify-center text-white border border-white/20 z-50 relative overflow-hidden"
//                     >
//                         <AnimatePresence mode="wait">
//                             {isMenuOpen ? (
//                                 <motion.div 
//                                     key="close"
//                                     initial={{ rotate: -90, opacity: 0 }}
//                                     animate={{ rotate: 0, opacity: 1 }}
//                                     exit={{ rotate: 90, opacity: 0 }}
//                                     transition={{ duration: 0.2 }}
//                                 >
//                                     <FiX size={28} />
//                                 </motion.div>
//                             ) : (
//                                 <motion.div 
//                                     key="grid"
//                                     initial={{ rotate: 90, opacity: 0 }}
//                                     animate={{ rotate: 0, opacity: 1 }}
//                                     exit={{ rotate: -90, opacity: 0 }}
//                                     transition={{ duration: 0.2 }}
//                                 >
//                                     <FiGrid size={26} />
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </motion.button>
//                 </div>
//             </div>

//             {/* Render Active Modals */}
//             <AnimatePresence>
//                 {activeModal === 'calculator' && <ShippingCalculatorModal onClose={() => setActiveModal(null)} />}
//                 {activeModal === 'support' && <SupportModal onClose={() => setActiveModal(null)} />}
//                 {activeModal === 'ai' && <AIComingSoonModal onClose={() => setActiveModal(null)} />}
//             </AnimatePresence>
//         </>
//     );
// }