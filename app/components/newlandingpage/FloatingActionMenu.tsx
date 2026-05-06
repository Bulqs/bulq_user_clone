'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
    FiX, FiMapPin, FiLayers, FiBox, FiChevronDown, 
    FiTruck, FiZap, FiDollarSign, FiPackage, FiArrowRight, 
    FiMessageCircle, FiPlus 
} from 'react-icons/fi';

import { CountryDTO } from '@/types/user';
import { ShippingRateRequest } from '@/types/booking';
import { getSupportedCountries } from '@/lib/user/actions';
import { calculateShippingRate } from '@/lib/user/booking.actions';
import { getCustomsDuties } from '@/lib/admin/admin.actions';

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

// --- ANIMATION VARIANTS ---
const modalBackdrop: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
};

const modalContent: Variants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    show: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2 } }
};

const floatingMenuVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const floatingBtnVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 15 } }
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

    // Fetch Countries
    useEffect(() => {
        getSupportedCountries().then(data => {
            if (data) setCountry(data);
        }).catch(console.error);
    }, []);

    // Fetch Customs Duties & Categories
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

    // Calculate Rate Effect
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
        
        const timeoutId = setTimeout(() => getRate(), 500); // Debounce
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

    const handleProceedToBooking = () => {
        // You can redirect to the booking page here, optionally passing parameters via URL
        window.location.href = '/dashboard/book';
    };

    return (
        <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
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
                                    <select 
                                        value={calculatorPayload.productCategory} 
                                        onChange={(e) => handleShippingRateChange('productCategory', e.target.value)} 
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-appBanner/50 focus:border-appBanner shadow-sm"
                                    >
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
// 2. CONTACT SUPPORT MODAL (Placeholder)
// ==========================================
const SupportModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <motion.div variants={modalBackdrop} initial="hidden" animate="show" exit="hidden" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div variants={modalContent} className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 bg-gray-100 rounded-full transition-colors">
                    <FiX size={20} />
                </button>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                    <FiMessageCircle size={24} />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Contact Support</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">Need help with your shipment? Send us a message and we'll get back to you shortly.</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Subject</label>
                        <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-appBanner focus:ring-1 focus:ring-appBanner" placeholder="What is this regarding?" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Message</label>
                        <textarea rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-appBanner focus:ring-1 focus:ring-appBanner resize-none" placeholder="Describe your issue..."></textarea>
                    </div>
                    <button onClick={onClose} className="w-full bg-appTitleBgColor hover:bg-appNav text-white font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2">
                        Send Message
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ==========================================
// 3. MAIN FLOATING MENU COMPONENT
// ==========================================
type ActiveModalType = 'calculator' | 'support' | null;

export default function FloatingActionMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<ActiveModalType>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    
    const openModal = (type: ActiveModalType) => {
        setActiveModal(type);
        setIsMenuOpen(false); // Close the floating menu when a modal opens
    };

    return (
        <>
            {/* The Floating Menu */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            variants={floatingMenuVariants} 
                            initial="hidden" 
                            animate="show" 
                            exit="hidden" 
                            className="flex flex-col items-end gap-3 mb-2"
                        >
                            <motion.button 
                                variants={floatingBtnVariants}
                                onClick={() => openModal('calculator')}
                                className="flex items-center gap-3 group"
                            >
                                <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                                    Calculate Rate
                                </span>
                                <div className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-appBanner hover:scale-110 transition-transform">
                                    <FiPackage size={22} />
                                </div>
                            </motion.button>
                            
                            <motion.button 
                                variants={floatingBtnVariants}
                                onClick={() => openModal('support')}
                                className="flex items-center gap-3 group"
                            >
                                <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                                    Support
                                </span>
                                <div className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-blue-500 hover:scale-110 transition-transform">
                                    <FiMessageCircle size={22} />
                                </div>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Primary Toggle Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMenu}
                    className="w-14 h-14 bg-gradient-to-r from-appBanner to-appNav rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center text-white border-2 border-white/20 z-50 relative overflow-hidden"
                >
                    <motion.div animate={{ rotate: isMenuOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
                        {isMenuOpen ? <FiX size={26} /> : <FiPlus size={28} />}
                    </motion.div>
                </motion.button>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {activeModal === 'calculator' && <ShippingCalculatorModal onClose={() => setActiveModal(null)} />}
                {activeModal === 'support' && <SupportModal onClose={() => setActiveModal(null)} />}
            </AnimatePresence>
        </>
    );
}