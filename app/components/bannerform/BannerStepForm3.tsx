"use client";
import React, { useState, useEffect } from 'react';
import InputField from '../inputs/InputField';
import ReusableTextarea from '../inputs/ReusableTextarea';
import Button from '../inputs/Button';
import LocationCard from '../locationcard/LocationCard';
import BookingPaymentModal from '../payment/BookingPaymentModal';
import { BADOBookingPayload, BookingResponseDTO, PackageItem } from '@/types/booking';
import { CountryDTO } from '@/types/user';
import { getSupportedCities, getSupportedCountries } from '@/lib/user/actions';
import { createDropOffBooking } from '@/lib/user/booking.actions';
import { getAllHubs } from '@/lib/admin/warehouse.actions';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- CLOUDINARY LOGIC ---
const uploadImageToCloud = async (file: File): Promise<string> => {
    const cloudName = "dhydpleqs"; 
    const uploadPreset = "abokina"; 

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { 
            method: "POST", 
            body: formData 
        });
        if (!response.ok) throw new Error("Image upload failed");
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};

// --- TYPES ---
interface HubTelephone { hubId: number; telephone: string; }
interface HubWorkHour { id: number; day: string; time: string; }
interface HubSummaryDTO {
    id: number; state: string; city: string; country: string; address: string; hubName: string;
    telephones: HubTelephone[]; workHours: HubWorkHour[];
}

const stepImages = {
    1: "/videos/backgroundvideo.mp4",
    2: "/videos/backgroundvideo.mp4",
    3: "/videos/backgroundvideo.mp4"
};

// --- FRAMER MOTION VARIANTS ---
const stepVariants: Variants = {
    hidden: { opacity: 0, x: 30, scale: 0.98 },
    show: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 250, damping: 25, staggerChildren: 0.05 } },
    exit: { opacity: 0, x: -30, scale: 0.98, transition: { duration: 0.2, ease: "easeInOut" } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

// --- DEFAULT PACKAGE TEMPLATE ---
const emptyPackage: PackageItem = {
    packageName: '',
    packageDescription: '',
    packageImage: 'placeholder',
    vendor: '',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    declaredValue: 0,
    productCategory: 'GENERAL',
    hsCode: '',
    itemDescription: ''
};

const BannerStepForm3: React.FC = () => {
    
    // --- 1. STATE ---
    const [formData, setFormData] = useState<BADOBookingPayload>({
        // Sender
        senderFirstName: '', senderLastName: '', senderPhoneNumber: '', senderEmail: '',
        senderAddress: '', senderCity: '', senderCountry: '', senderState: '', 
        senderLga: '', senderPostCode: '',
        
        // Receiver
        receiverFirstname: '', receiverLastname: '', receiverPhoneNumber: '', receiverEmail: '',
        receiverAddress: '', receiverCity: '', receiverCountry: '', receiverState: '', 
        receiverLga: '', receiverPostCode: '',

        // Hub Details
        hubId: '', email: 'support@bulq.com', phoneNumber: '', 
        city: '', country: '', address: '', state: '', lga: '',
        
        // Appointment & Config
        appointmentDate: '', pickUpDate: '', pickUpTime: '', 
        shipmentType: 'EXPRESS', pickupType: 'BADO', includeInsurance: false, promoCode: '', 
        
        // Packages Array
        packages: [{ ...emptyPackage }]
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // NEW: Track which package is currently uploading an image
    const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [senderCities, setSenderCities] = useState<string[]>([]);
    const [receiverCities, setReceiverCities] = useState<string[]>([]);
    const [hubs, setHubs] = useState<HubSummaryDTO[]>([]); 
    const [selectedHubIndex, setSelectedHubIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [bookingResponse, setBookingResponse] = useState<BookingResponseDTO | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // --- 2. EFFECTS ---
    useEffect(() => {
        const initData = async () => {
            try { setCountries(await getSupportedCountries() || []); } catch (e) { console.error(e); }
            try { setHubs(await getAllHubs() || []); } catch (e) { console.error(e); }
        };
        initData();
    }, []);
    
    useEffect(() => { 
        if(formData.senderCountry) { 
            const c = countries.find(x => x.countryCode === formData.senderCountry); 
            if(c) getSupportedCities(c.countryName).then(setSenderCities); 
        }
    }, [formData.senderCountry, countries]);

    useEffect(() => { 
        if(formData.receiverCountry) { 
            const c = countries.find(x => x.countryCode === formData.receiverCountry); 
            if(c) getSupportedCities(c.countryName).then(setReceiverCities); 
        }
    }, [formData.receiverCountry, countries]);

    // --- 3. HANDLERS ---
    const handleHubSelect = (index: number) => {
        setSelectedHubIndex(index);
        const hub = filteredHubs[index];
        setFormData({ 
            ...formData, 
            hubId: hub.id.toString(), 
            city: hub.city, country: hub.country, address: hub.address, 
            state: hub.state, lga: hub.city,    
            phoneNumber: hub.telephones?.[0]?.telephone || "0000000000" 
        });
    };

    const handleAddPackage = () => {
        setFormData(prev => ({ ...prev, packages: [...prev.packages, { ...emptyPackage }] }));
    };

    const handleRemovePackage = (indexToRemove: number) => {
        setFormData(prev => ({ 
            ...prev, 
            packages: prev.packages.filter((_, idx) => idx !== indexToRemove) 
        }));
    };

    const handlePackageChange = (index: number, field: keyof PackageItem, value: any) => {
        const updatedPackages = [...formData.packages];
        updatedPackages[index] = { ...updatedPackages[index], [field]: value };
        
        if (field === 'packageDescription') {
            updatedPackages[index].itemDescription = value;
        }
        
        setFormData(prev => ({ ...prev, packages: updatedPackages }));
    };

    // NEW: Cloudinary Image Upload Handler
    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImageIndex(index); // Show loading state for this specific package
            const imageUrl = await uploadImageToCloud(file);
            handlePackageChange(index, 'packageImage', imageUrl); // Update the specific package
        } catch (error) {
            alert("Failed to upload image. Please check your connection and try again.");
        } finally {
            setUploadingImageIndex(null); // Clear loading state
            // Reset input so the same file can be selected again if needed
            e.target.value = '';
        }
    };

    const handleBookingSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (!formData.appointmentDate) throw new Error("Please select an appointment date.");
            if (!formData.hubId) throw new Error("Please select a Drop-off Hub.");
            if (formData.packages.length === 0) throw new Error("Please add at least one package.");

            const isoDate = new Date(formData.appointmentDate).toISOString().replace('Z', '');

            const finalPayload: BADOBookingPayload = {
                ...formData,
                appointmentDate: isoDate,
                pickUpDate: isoDate.split('T')[0],
                pickUpTime: isoDate.split('T')[1].substring(0, 5)
            };

            const response = await createDropOffBooking(finalPayload);
            setBookingResponse(response);
            setShowPaymentModal(true);
        } catch (error: any) { alert(error.message || "Booking failed."); } 
        finally { setIsSubmitting(false); }
    };

    const handleNext = () => { if (currentStep < 3) setCurrentStep(prev => prev + 1); };
    const handlePrevious = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };
    const filteredHubs = hubs.filter(h => h.hubName.toLowerCase().includes(searchQuery.toLowerCase()) || h.city.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const customInputClasses = "w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm outline-none text-black font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all";
    const labelClasses = "block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1";

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col relative overflow-hidden">
            {/* BACKGROUND ANIMATION */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {Object.keys(stepImages).map((step) => (
                    <div key={step} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${currentStep === Number(step) ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url(${stepImages[Number(step) as keyof typeof stepImages]})` }} />
                ))}
                <div className="absolute inset-0 bg-white/90 backdrop-blur-[3px]"></div>
            </div>

            {/* HEADER & ANIMATED PROGRESS BAR */}
            <div className="bg-white/95 pt-4 pb-0 border-b border-gray-200 shrink-0 shadow-sm z-10 relative">
                <div className="px-4 flex justify-between items-end pb-2">
                    <h2 className="text-xl font-extrabold text-appBlack tracking-tight">Drop Off Appointment</h2>
                    <div className="flex gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Step {currentStep} of 3</div>
                </div>
                <div className="w-full h-1 bg-gray-200">
                    <motion.div initial={{ width: "33%" }} animate={{ width: `${(currentStep / 3) * 100}%` }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="h-full bg-appNav" />
                </div>
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 z-10 relative custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        
                        {/* STEP 1: SENDER & RECEIVER DETAILS */}
                        {currentStep === 1 && (
                            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="show" exit="exit" className="space-y-10 pb-8">
                                <div>
                                    <motion.h3 variants={itemVariants} className="mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Sender Details (You)</motion.h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="senderFirstName" value={formData.senderFirstName} placeholder="First name" onChange={(e) => setFormData({...formData, senderFirstName: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="senderLastName" value={formData.senderLastName} placeholder="Last name" onChange={(e) => setFormData({...formData, senderLastName: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="senderEmail" value={formData.senderEmail} placeholder="Email address" onChange={(e) => setFormData({...formData, senderEmail: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Address</label><InputField className={customInputClasses} name="senderAddress" value={formData.senderAddress} placeholder="Street Address" onChange={(e) => setFormData({...formData, senderAddress: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1">
                                            <label className={labelClasses}>Country</label>
                                            <InputField className={customInputClasses} name="senderCountry" value={formData.senderCountry} dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} onChange={(e) => setFormData({...formData, senderCountry: e.target.value, senderCity: ''})} />
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="senderCity" value={formData.senderCity} dropdownOptions={senderCities} onChange={(e) => setFormData({...formData, senderCity: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>State/Province</label><InputField className={customInputClasses} name="senderState" value={formData.senderState} placeholder="State" onChange={(e) => setFormData({...formData, senderState: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="senderPhoneNumber" value={formData.senderPhoneNumber} placeholder="Phone number" onChange={(e) => setFormData({...formData, senderPhoneNumber: e.target.value})} /></motion.div>
                                    </div>
                                </div>
                                
                                <div>
                                    <motion.h3 variants={itemVariants} className="mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Receiver Details (Destination)</motion.h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="receiverFirstname" value={formData.receiverFirstname} placeholder="First name" onChange={(e) => setFormData({...formData, receiverFirstname: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="receiverLastname" value={formData.receiverLastname} placeholder="Last name" onChange={(e) => setFormData({...formData, receiverLastname: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="receiverEmail" value={formData.receiverEmail} placeholder="Email address" onChange={(e) => setFormData({...formData, receiverEmail: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Address</label><InputField className={customInputClasses} name="receiverAddress" value={formData.receiverAddress} placeholder="Street Address" onChange={(e) => setFormData({...formData, receiverAddress: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1">
                                            <label className={labelClasses}>Country</label>
                                            <InputField className={customInputClasses} name="receiverCountry" value={formData.receiverCountry} dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} onChange={(e) => setFormData({...formData, receiverCountry: e.target.value, receiverCity: ''})} />
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="receiverCity" value={formData.receiverCity} dropdownOptions={receiverCities} onChange={(e) => setFormData({...formData, receiverCity: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>State/Province</label><InputField className={customInputClasses} name="receiverState" value={formData.receiverState} placeholder="State" onChange={(e) => setFormData({...formData, receiverState: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="receiverPhoneNumber" value={formData.receiverPhoneNumber} placeholder="Phone number" onChange={(e) => setFormData({...formData, receiverPhoneNumber: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>LGA / County</label><InputField className={customInputClasses} name="receiverLga" value={formData.receiverLga} placeholder="Local Govt Area" onChange={(e) => setFormData({...formData, receiverLga: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Post Code</label><InputField className={customInputClasses} name="receiverPostCode" value={formData.receiverPostCode} placeholder="Post Code" onChange={(e) => setFormData({...formData, receiverPostCode: e.target.value})} /></motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: SELECT HUB */}
                        {currentStep === 2 && (
                            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="show" exit="exit" className="pb-8 flex flex-col items-center">
                                <motion.h3 variants={itemVariants} className="w-full text-left mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Select Drop-off Location</motion.h3>
                                <motion.input variants={itemVariants} className="w-full pl-4 py-4 bg-white/90 border border-gray-300 rounded-xl mb-6 text-base font-medium shadow-sm backdrop-blur-sm focus:ring-2 focus:ring-appNav transition-all outline-none" placeholder="Search hubs by name, city or state..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredHubs.map((hub, index) => (
                                        <motion.div variants={itemVariants} key={hub.id} onClick={() => handleHubSelect(index)} className={`cursor-pointer rounded-xl border-2 p-1 transition-all ${selectedHubIndex === index ? 'border-appNav bg-blue-50/60 scale-[1.02] shadow-md' : 'border-transparent bg-white/80 hover:border-gray-300'}`}>
                                            <LocationCard title={hub.hubName} location={hub.city} address={hub.address} workingHours={hub.workHours.map(wh => ({ day: wh.day, hours: wh.time }))} phoneNumbers={hub.telephones.map(t => t.telephone)} />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: PACKAGE DETAILS & CONFIGURATION */}
                        {currentStep === 3 && (
                            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="show" exit="exit" className="pb-8 space-y-8">
                                
                                {/* GLOBAL APPOINTMENT & SHIPMENT CONFIG */}
                                <div>
                                    <motion.h3 variants={itemVariants} className="mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Appointment & Shipping Options</motion.h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm">
                                            <label className="block text-xs font-bold text-appNav uppercase mb-2 tracking-wider">Drop-off Appointment Time</label>
                                            <InputField type="datetime-local" className={customInputClasses} name="appointmentDate" value={formData.appointmentDate} required onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} />
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Shipment Type</label><InputField className={customInputClasses} name="shipmentType" value={formData.shipmentType} dropdownOptions={["EXPRESS", "STANDARD"]} onChange={(e) => setFormData({...formData, shipmentType: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Promo Code</label><InputField className={customInputClasses} name="promoCode" value={formData.promoCode} placeholder="Optional" onChange={(e) => setFormData({...formData, promoCode: e.target.value})} /></motion.div>
                                        <motion.div variants={itemVariants} className="col-span-1 flex items-center pt-2"><input type="checkbox" id="ins3" className="w-5 h-5 text-appBanner rounded focus:ring-blue-500" checked={formData.includeInsurance} onChange={(e) => setFormData({...formData, includeInsurance: e.target.checked})} /><label htmlFor="ins3" className="ml-2 text-sm font-bold text-gray-700">Add Global Insurance?</label></motion.div>
                                    </div>
                                </div>

                                {/* DYNAMIC PACKAGE LIST */}
                                <div>
                                    <motion.h3 variants={itemVariants} className="mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Package Items ({formData.packages.length})</motion.h3>
                                    
                                    <div className="space-y-6">
                                        {formData.packages.map((pkg, index) => (
                                            <motion.div 
                                                variants={itemVariants} 
                                                key={index} 
                                                className="p-5 md:p-6 bg-white border border-gray-200 shadow-sm rounded-2xl relative"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-appBlack">Package #{index + 1}</h4>
                                                    {formData.packages.length > 1 && (
                                                        <button 
                                                            onClick={() => handleRemovePackage(index)}
                                                            className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                                                        >
                                                            - Remove
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    
                                                    {/* NEW: IMAGE UPLOAD UI */}
                                                    <div className="col-span-1 md:col-span-2 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-2">
                                                        <label className={labelClasses}>Package Image</label>
                                                        <div className="flex items-center gap-4 mt-2">
                                                            {/* Thumbnail Preview */}
                                                            {pkg.packageImage && pkg.packageImage !== 'placeholder' ? (
                                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                                                    <img src={pkg.packageImage} alt="Package" className="object-cover w-full h-full" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-16 h-16 rounded-lg bg-gray-200 border border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-400 shrink-0">
                                                                    No Image
                                                                </div>
                                                            )}
                                                            
                                                            {/* Upload Button */}
                                                            <div className="flex-1">
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    id={`file-upload-${index}`}
                                                                    onChange={(e) => handleImageUpload(index, e)}
                                                                />
                                                                <label
                                                                    htmlFor={`file-upload-${index}`}
                                                                    className={`inline-block cursor-pointer px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                                                        uploadingImageIndex === index
                                                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                                            : 'bg-blue-50 text-appNav hover:bg-blue-100 border border-blue-200 shadow-sm'
                                                                    }`}
                                                                >
                                                                    {uploadingImageIndex === index ? 'Uploading...' : 'Choose Image'}
                                                                </label>
                                                                <p className="text-[10px] text-gray-400 mt-1 font-semibold ml-1">PNG, JPG up to 5MB</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Item Name</label><InputField className={customInputClasses} name={`pkg_name_${index}`} value={pkg.packageName} placeholder="e.g. MacBook Pro" required onChange={(e) => handlePackageChange(index, 'packageName', e.target.value)} /></div>
                                                    <div className="col-span-1"><label className={labelClasses}>Category</label><InputField className={customInputClasses} name={`pkg_cat_${index}`} value={pkg.productCategory} dropdownOptions={["GENERAL", "ELECTRONICS", "FASHION", "DOCUMENTS", "HEALTHCARE"]} onChange={(e) => handlePackageChange(index, 'productCategory', e.target.value)} /></div>
                                                    <div className="col-span-1"><label className={labelClasses}>Vendor</label><InputField className={customInputClasses} name={`pkg_ven_${index}`} value={pkg.vendor} placeholder="Enter vendor (optional)" onChange={(e) => handlePackageChange(index, 'vendor', e.target.value)} /></div>
                                                    
                                                    <div className="col-span-1"><label className={labelClasses}>Weight (kg)</label><InputField type="number" className={customInputClasses} name={`pkg_weight_${index}`} value={pkg.weight} required onChange={(e) => handlePackageChange(index, 'weight', parseFloat(e.target.value) || 0)} /></div>
                                                    <div className="col-span-1 grid grid-cols-3 gap-2">
                                                        <div><label className={labelClasses}>L (cm)</label><InputField type="number" className={customInputClasses} name={`pkg_l_${index}`} value={pkg.length} onChange={(e) => handlePackageChange(index, 'length', parseFloat(e.target.value) || 0)} /></div>
                                                        <div><label className={labelClasses}>W (cm)</label><InputField type="number" className={customInputClasses} name={`pkg_w_${index}`} value={pkg.width} onChange={(e) => handlePackageChange(index, 'width', parseFloat(e.target.value) || 0)} /></div>
                                                        <div><label className={labelClasses}>H (cm)</label><InputField type="number" className={customInputClasses} name={`pkg_h_${index}`} value={pkg.height} onChange={(e) => handlePackageChange(index, 'height', parseFloat(e.target.value) || 0)} /></div>
                                                    </div>
                                                    
                                                    <div className="col-span-1"><label className={labelClasses}>Declared Value</label><InputField type="number" className={customInputClasses} name={`pkg_val_${index}`} value={pkg.declaredValue} required onChange={(e) => handlePackageChange(index, 'declaredValue', parseFloat(e.target.value) || 0)} /></div>
                                                    <div className="col-span-1"><label className={labelClasses}>HS Code</label><InputField className={customInputClasses} name={`pkg_hs_${index}`} value={pkg.hsCode} placeholder="Optional customs code" onChange={(e) => handlePackageChange(index, 'hsCode', e.target.value)} /></div>
                                                    
                                                    <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Description</label><ReusableTextarea name={`pkg_desc_${index}`} rows={2} className="w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/50" value={pkg.packageDescription} onChange={(e: any) => handlePackageChange(index, 'packageDescription', e.target.value)} /></div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <motion.div variants={itemVariants} className="mt-6">
                                        <button 
                                            onClick={handleAddPackage}
                                            className="w-full py-4 border-2 border-dashed border-appNav/50 text-appNav font-bold rounded-xl bg-blue-50/30 hover:bg-blue-50/80 transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="text-xl">+</span> Add Another Package
                                        </button>
                                    </motion.div>
                                </div>

                                <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-200">
                                    <Button onClick={handleBookingSubmit} disabled={isSubmitting || uploadingImageIndex !== null} className={`w-full py-4 text-white font-bold text-lg rounded-xl shadow-lg transition-all active:scale-[0.98] ${uploadingImageIndex !== null ? 'bg-gray-400 cursor-not-allowed' : 'bg-appNav hover:shadow-xl'}`}>
                                        {isSubmitting ? "Processing..." : uploadingImageIndex !== null ? "Uploading Image..." : "PAY & BOOK"}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* BOTTOM NAVIGATION */}
            <div className="bg-white/95 p-4 border-t border-gray-200 flex justify-between z-10 relative">
                <div className="w-32">{currentStep > 1 && <Button onClick={handlePrevious} className="w-full bg-gray-100 font-bold text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors active:scale-95">Back</Button>}</div>
                <div className="w-32">{currentStep < 3 && <Button onClick={handleNext} className="w-full bg-appNav font-bold text-white py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-md active:scale-95">Next</Button>}</div>
            </div>

            {/* PAYMENT MODAL */}
            {showPaymentModal && bookingResponse && <BookingPaymentModal bookingData={bookingResponse} customerEmail={formData.senderEmail} customerName={`${formData.senderFirstName} ${formData.senderLastName}`} onClose={() => setShowPaymentModal(false)} />}
        </div>
    );
}
export default BannerStepForm3;

// "use client";
// import React, { useState, useEffect } from 'react';
// import InputField from '../inputs/InputField';
// import ReusableTextarea from '../inputs/ReusableTextarea';
// import Button from '../inputs/Button';
// import LocationCard from '../locationcard/LocationCard';
// import BookingPaymentModal from '../payment/BookingPaymentModal';
// import { BADOBookingPayload, BookingResponseDTO } from '@/types/booking';
// import { CountryDTO } from '@/types/user';
// import { getSupportedCities, getSupportedCountries } from '@/lib/user/actions';
// import { createDropOffBooking } from '@/lib/user/booking.actions';
// import { getAllHubs } from '@/lib/admin/warehouse.actions';
// import { motion, AnimatePresence, Variants } from 'framer-motion';

// // --- TYPES ---
// interface HubTelephone { hubId: number; telephone: string; }
// interface HubWorkHour { id: number; day: string; time: string; }
// interface HubSummaryDTO {
//     id: number; state: string; city: string; country: string; address: string; hubName: string;
//     telephones: HubTelephone[]; workHours: HubWorkHour[];
// }

// const stepImages = {
//     1: "/videos/backgroundvideo.mp4",
//     2: "/videos/backgroundvideo.mp4",
//     3: "/videos/backgroundvideo.mp4"
// };

// // --- FRAMER MOTION VARIANTS ---
// const stepVariants: Variants = {
//     hidden: { opacity: 0, x: 30, scale: 0.98 },
//     show: { 
//         opacity: 1, 
//         x: 0, 
//         scale: 1, 
//         transition: { type: "spring", stiffness: 250, damping: 25, staggerChildren: 0.05 } 
//     },
//     exit: { 
//         opacity: 0, 
//         x: -30, 
//         scale: 0.98, 
//         transition: { duration: 0.2, ease: "easeInOut" } 
//     }
// };

// const itemVariants: Variants = {
//     hidden: { opacity: 0, y: 15 },
//     show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
// };

// const BannerStepForm3: React.FC = () => {
    
//     // --- 1. STATE ---
//     // Removed ALL hardcoded defaults (N/A, 0000, Self) to ensure user enters everything
//     const [formData, setFormData] = useState<BADOBookingPayload>({
//         // Sender
//         senderFirstName: '', senderLastName: '', senderPhoneNumber: '', senderEmail: '',
//         senderAddress: '', senderCity: '', senderCountry: '', senderState: '', 
//         senderLga: '', senderPostCode: '',
        
//         // Receiver
//         receiverFirstname: '', receiverLastname: '', receiverPhoneNumber: '', receiverEmail: '',
//         receiverAddress: '', receiverCity: '', receiverCountry: '', receiverState: '', 
//         receiverLga: '', receiverPostCode: '',

//         // Hub Details
//         hubId: '', email: 'support@bulq.com', phoneNumber: '', 
//         city: '', country: '', address: '', state: '', lga: '',
        
//         // Appointment & Package
//         appointmentDate: '', pickUpDate: '', pickUpTime: '', 
//         package_name: '', package_description: '', packageImage: 'placeholder',
//         weight: 0, length: 0, width: 0, height: 0,
        
//         // Config
//         shipmentType: 'EXPRESS', pickupType: 'BADO', shippingAmount: 0, vendor: '', declaredValue: 0, 
//         productCategory: 'GENERAL', hsCode: '', itemDescription: '', includeInsurance: false, promoCode: '', calculateShipping: true
//     });

//     const [currentStep, setCurrentStep] = useState(1);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [countries, setCountries] = useState<CountryDTO[]>([]);
//     const [senderCities, setSenderCities] = useState<string[]>([]);
//     const [receiverCities, setReceiverCities] = useState<string[]>([]);
//     const [hubs, setHubs] = useState<HubSummaryDTO[]>([]); 
//     const [selectedHubIndex, setSelectedHubIndex] = useState<number | null>(null);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [bookingResponse, setBookingResponse] = useState<BookingResponseDTO | null>(null);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);

//     // --- 2. EFFECTS ---
//     useEffect(() => {
//         const initData = async () => {
//             try { 
//                 const fetchedCountries = await getSupportedCountries();
//                 setCountries(fetchedCountries || []); 
//             } catch (e) {
//                 console.error("Error fetching countries:", e);
//             }

//             try {
//                 const fetchedHubs = await getAllHubs();
//                 setHubs(fetchedHubs || []); 
//             } catch (e) { 
//                 console.error("Error fetching hubs:", e); 
//             }
//         };

//         initData();
//     }, []);
    
//     useEffect(() => { 
//         if(formData.senderCountry) { 
//             const c = countries.find(x => x.countryCode === formData.senderCountry); 
//             if(c) getSupportedCities(c.countryName).then(setSenderCities); 
//         }
//     }, [formData.senderCountry, countries]);

//     useEffect(() => { 
//         if(formData.receiverCountry) { 
//             const c = countries.find(x => x.countryCode === formData.receiverCountry); 
//             if(c) getSupportedCities(c.countryName).then(setReceiverCities); 
//         }
//     }, [formData.receiverCountry, countries]);

//     // --- 3. HANDLERS ---
//     const handleHubSelect = (index: number) => {
//         setSelectedHubIndex(index);
//         const hub = filteredHubs[index];
//         setFormData({ 
//             ...formData, 
//             hubId: hub.id.toString(), 
//             city: hub.city, country: hub.country, address: hub.address, 
//             state: hub.state, lga: hub.city,    
//             phoneNumber: hub.telephones?.[0]?.telephone || "0000000000" 
//         });
//     };

//     const handleBookingSubmit = async () => {
//         setIsSubmitting(true);
//         try {
//             if (!formData.appointmentDate) throw new Error("Please select an appointment date.");
//             if (!formData.hubId) throw new Error("Please select a Drop-off Hub.");

//             const isoDate = new Date(formData.appointmentDate).toISOString().replace('Z', '');

//             const finalPayload: BADOBookingPayload = {
//                 ...formData,
//                 itemDescription: formData.package_description,
//                 appointmentDate: isoDate,
//                 pickUpDate: isoDate.split('T')[0],
//                 pickUpTime: isoDate.split('T')[1].substring(0, 5)
//             };

//             const response = await createDropOffBooking(finalPayload);
//             setBookingResponse(response);
//             setShowPaymentModal(true);
//         } catch (error: any) { alert(error.message || "Booking failed."); } 
//         finally { setIsSubmitting(false); }
//     };

//     const handleNext = () => { if (currentStep < 3) setCurrentStep(prev => prev + 1); };
//     const handlePrevious = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };
//     const filteredHubs = hubs.filter(h => h.hubName.toLowerCase().includes(searchQuery.toLowerCase()) || h.city.toLowerCase().includes(searchQuery.toLowerCase()));
    
//     const customInputClasses = "w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm outline-none text-black font-semibold text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all";
//     const labelClasses = "block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1";

//     return (
//         <div className="w-full h-full bg-gray-50 flex flex-col relative overflow-hidden">
//             {/* BACKGROUND ANIMATION */}
//             <div className="absolute inset-0 z-0 pointer-events-none">
//                 {Object.keys(stepImages).map((step) => (
//                     <div key={step} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${currentStep === Number(step) ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url(${stepImages[Number(step) as keyof typeof stepImages]})` }} />
//                 ))}
//                 <div className="absolute inset-0 bg-white/90 backdrop-blur-[3px]"></div>
//             </div>

//             {/* HEADER & ANIMATED PROGRESS BAR */}
//             <div className="bg-white/95 pt-4 pb-0 border-b border-gray-200 shrink-0 shadow-sm z-10 relative">
//                 <div className="px-4 flex justify-between items-end pb-2">
//                     <h2 className="text-xl font-extrabold text-appBlack tracking-tight">Drop Off Appointment</h2>
//                     <div className="flex gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Step {currentStep} of 3</div>
//                 </div>
//                 {/* Progress Bar Track */}
//                 <div className="w-full h-1 bg-gray-200">
//                     <motion.div 
//                         initial={{ width: "33%" }}
//                         animate={{ width: `${(currentStep / 3) * 100}%` }}
//                         transition={{ type: "spring", stiffness: 100, damping: 20 }}
//                         className="h-full bg-appNav"
//                     />
//                 </div>
//             </div>

//             <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 z-10 relative custom-scrollbar">
//                 <div className="max-w-4xl mx-auto">
//                     <AnimatePresence mode="wait">
                        
//                         {/* STEP 1: SENDER & RECEIVER DETAILS */}
//                         {currentStep === 1 && (
//                             <motion.div key="step1" variants={stepVariants} initial="hidden" animate="show" exit="exit" className="space-y-10 pb-8">
//                                 <div>
//                                     <motion.h3 variants={itemVariants} className="mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Sender Details (You)</motion.h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="senderFirstName" value={formData.senderFirstName} placeholder="First name" onChange={(e) => setFormData({...formData, senderFirstName: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="senderLastName" value={formData.senderLastName} placeholder="Last name" onChange={(e) => setFormData({...formData, senderLastName: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="senderEmail" value={formData.senderEmail} placeholder="Email address" onChange={(e) => setFormData({...formData, senderEmail: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Address</label><InputField className={customInputClasses} name="senderAddress" value={formData.senderAddress} placeholder="Street Address" onChange={(e) => setFormData({...formData, senderAddress: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1">
//                                             <label className={labelClasses}>Country</label>
//                                             <InputField className={customInputClasses} name="senderCountry" value={formData.senderCountry} dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} onChange={(e) => setFormData({...formData, senderCountry: e.target.value, senderCity: ''})} />
//                                         </motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="senderCity" value={formData.senderCity} dropdownOptions={senderCities} onChange={(e) => setFormData({...formData, senderCity: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>State/Province</label><InputField className={customInputClasses} name="senderState" value={formData.senderState} placeholder="State" onChange={(e) => setFormData({...formData, senderState: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="senderPhoneNumber" value={formData.senderPhoneNumber} placeholder="Phone number" onChange={(e) => setFormData({...formData, senderPhoneNumber: e.target.value})} /></motion.div>
//                                     </div>
//                                 </div>
                                
//                                 <div>
//                                     <motion.h3 variants={itemVariants} className="mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Receiver Details (Destination)</motion.h3>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="receiverFirstname" value={formData.receiverFirstname} placeholder="First name" onChange={(e) => setFormData({...formData, receiverFirstname: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="receiverLastname" value={formData.receiverLastname} placeholder="Last name" onChange={(e) => setFormData({...formData, receiverLastname: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="receiverEmail" value={formData.receiverEmail} placeholder="Email address" onChange={(e) => setFormData({...formData, receiverEmail: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Address</label><InputField className={customInputClasses} name="receiverAddress" value={formData.receiverAddress} placeholder="Street Address" onChange={(e) => setFormData({...formData, receiverAddress: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1">
//                                             <label className={labelClasses}>Country</label>
//                                             <InputField className={customInputClasses} name="receiverCountry" value={formData.receiverCountry} dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} onChange={(e) => setFormData({...formData, receiverCountry: e.target.value, receiverCity: ''})} />
//                                         </motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="receiverCity" value={formData.receiverCity} dropdownOptions={receiverCities} onChange={(e) => setFormData({...formData, receiverCity: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>State/Province</label><InputField className={customInputClasses} name="receiverState" value={formData.receiverState} placeholder="State" onChange={(e) => setFormData({...formData, receiverState: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="receiverPhoneNumber" value={formData.receiverPhoneNumber} placeholder="Phone number" onChange={(e) => setFormData({...formData, receiverPhoneNumber: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>LGA / County</label><InputField className={customInputClasses} name="receiverLga" value={formData.receiverLga} placeholder="Local Govt Area" onChange={(e) => setFormData({...formData, receiverLga: e.target.value})} /></motion.div>
//                                         <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Post Code</label><InputField className={customInputClasses} name="receiverPostCode" value={formData.receiverPostCode} placeholder="Post Code" onChange={(e) => setFormData({...formData, receiverPostCode: e.target.value})} /></motion.div>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         )}

//                         {/* STEP 2: SELECT HUB */}
//                         {currentStep === 2 && (
//                             <motion.div key="step2" variants={stepVariants} initial="hidden" animate="show" exit="exit" className="pb-8 flex flex-col items-center">
//                                 <motion.h3 variants={itemVariants} className="w-full text-left mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Select Drop-off Location</motion.h3>
//                                 <motion.input variants={itemVariants} className="w-full pl-4 py-4 bg-white/90 border border-gray-300 rounded-xl mb-6 text-base font-medium shadow-sm backdrop-blur-sm focus:ring-2 focus:ring-appNav transition-all outline-none" placeholder="Search hubs by name, city or state..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//                                 <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {filteredHubs.map((hub, index) => (
//                                         <motion.div variants={itemVariants} key={hub.id} onClick={() => handleHubSelect(index)} className={`cursor-pointer rounded-xl border-2 p-1 transition-all ${selectedHubIndex === index ? 'border-appNav bg-blue-50/60 scale-[1.02] shadow-md' : 'border-transparent bg-white/80 hover:border-gray-300'}`}>
//                                             <LocationCard title={hub.hubName} location={hub.city} address={hub.address} workingHours={hub.workHours.map(wh => ({ day: wh.day, hours: wh.time }))} phoneNumbers={hub.telephones.map(t => t.telephone)} />
//                                         </motion.div>
//                                     ))}
//                                 </div>
//                             </motion.div>
//                         )}

//                         {/* STEP 3: PACKAGE DETAILS */}
//                         {currentStep === 3 && (
//                             <motion.div key="step3" variants={stepVariants} initial="hidden" animate="show" exit="exit" className="pb-8">
//                                 <motion.h3 variants={itemVariants} className="mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Package & Appointment</motion.h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
//                                     <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Package Name</label><InputField className={customInputClasses} name="package_name" value={formData.package_name} placeholder="e.g. MacBook Pro" required onChange={(e) => setFormData({...formData, package_name: e.target.value})} /></motion.div>
//                                     <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Category</label><InputField className={customInputClasses} name="productCategory" value={formData.productCategory} dropdownOptions={["GENERAL", "ELECTRONICS", "FASHION", "DOCUMENTS", "HEALTHCARE"]} onChange={(e) => setFormData({...formData, productCategory: e.target.value})} /></motion.div>
//                                     <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Vendor</label><InputField className={customInputClasses} name="vendor" value={formData.vendor} placeholder="Enter vendor name (optional)" onChange={(e) => setFormData({...formData, vendor: e.target.value})} /></motion.div>
//                                     <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Shipment Type</label><InputField className={customInputClasses} name="shipmentType" value={formData.shipmentType} dropdownOptions={["EXPRESS", "STANDARD"]} onChange={(e) => setFormData({...formData, shipmentType: e.target.value})} /></motion.div>
                                    
//                                     <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm">
//                                         <label className="block text-xs font-bold text-appNav uppercase mb-2 tracking-wider">Drop-off Appointment</label>
//                                         <InputField type="datetime-local" className={customInputClasses} name="appointmentDate" value={formData.appointmentDate} required onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} />
//                                     </motion.div>
                                    
//                                     <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Weight (kg)</label><InputField type="number" className={customInputClasses} name="weight" value={formData.weight} required onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} /></motion.div>
//                                     <motion.div variants={itemVariants} className="col-span-1 grid grid-cols-3 gap-2">
//                                         <div><label className={labelClasses}>L (cm)</label><InputField type="number" className={customInputClasses} name="length" value={formData.length} onChange={(e) => setFormData({...formData, length: parseFloat(e.target.value)})} /></div>
//                                         <div><label className={labelClasses}>W (cm)</label><InputField type="number" className={customInputClasses} name="width" value={formData.width} onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value)})} /></div>
//                                         <div><label className={labelClasses}>H (cm)</label><InputField type="number" className={customInputClasses} name="height" value={formData.height} onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})} /></div>
//                                     </motion.div>
//                                     <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Declared Value</label><InputField type="number" className={customInputClasses} name="declaredValue" value={formData.declaredValue} required onChange={(e) => setFormData({...formData, declaredValue: parseFloat(e.target.value)})} /></motion.div>
//                                     <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>HS Code</label><InputField className={customInputClasses} name="hsCode" value={formData.hsCode} placeholder="Optional" onChange={(e) => setFormData({...formData, hsCode: e.target.value})} /></motion.div>
//                                     <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Promo Code</label><InputField className={customInputClasses} name="promoCode" value={formData.promoCode} placeholder="Optional" onChange={(e) => setFormData({...formData, promoCode: e.target.value})} /></motion.div>
//                                     <motion.div variants={itemVariants} className="col-span-1 flex items-center pt-6"><input type="checkbox" id="ins3" className="w-5 h-5 text-appBanner rounded focus:ring-blue-500" checked={formData.includeInsurance} onChange={(e) => setFormData({...formData, includeInsurance: e.target.checked})} /><label htmlFor="ins3" className="ml-2 text-sm font-bold text-gray-700">Add Insurance?</label></motion.div>
//                                     <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Description</label><ReusableTextarea name="package_description" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/50" value={formData.package_description} onChange={(e: any) => setFormData({...formData, package_description: e.target.value})} /></motion.div>
//                                 </div>
//                                 <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-200">
//                                     <Button onClick={handleBookingSubmit} disabled={isSubmitting} className="w-full py-4 bg-appNav text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">{isSubmitting ? "Processing..." : "PAY & BOOK"}</Button>
//                                 </motion.div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </div>

//             <div className="bg-white/95 p-4 border-t border-gray-200 flex justify-between z-10 relative">
//                 <div className="w-32">{currentStep > 1 && <Button onClick={handlePrevious} className="w-full bg-gray-100 font-bold text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors active:scale-95">Back</Button>}</div>
//                 <div className="w-32">{currentStep < 3 && <Button onClick={handleNext} className="w-full bg-appNav font-bold text-white py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-md active:scale-95">Next</Button>}</div>
//             </div>

//             {showPaymentModal && bookingResponse && <BookingPaymentModal bookingData={bookingResponse} customerEmail={formData.senderEmail} customerName={`${formData.senderFirstName} ${formData.senderLastName}`} onClose={() => setShowPaymentModal(false)} />}
//         </div>
//     );
// }
// export default BannerStepForm3;