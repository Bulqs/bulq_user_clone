"use client";
import React, { useEffect, useState } from 'react';
import InputField from '../inputs/InputField';
import ReusableTextarea from '../inputs/ReusableTextarea';
import Button from '../inputs/Button';
import BookingPaymentModal from '../payment/BookingPaymentModal';
import { BookingPayload, BookingResponseDTO, ShipmentType, PickupTypes } from '@/types/booking';
import { CountryDTO } from '@/types/user';
import { getSupportedCities, getSupportedCountries } from '@/lib/user/actions';
import { createPickUpBooking } from '@/lib/user/booking.actions';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface BannerStepFormProps {
    isSenderEditable?: boolean; 
    onClose?: () => void;
}

// LOGISTICS IMAGES
const stepImages = {
    1: "/videos/backgroundvideo.mp4", // Office
    2: "/videos/backgroundvideo.mp4", // Handover
    3: "/videos/backgroundvideo.mp4"  // Plane
};

// --- FRAMER MOTION VARIANTS ---
const stepVariants: Variants = {
    hidden: { opacity: 0, x: 30, scale: 0.98 },
    show: { 
        opacity: 1, 
        x: 0, 
        scale: 1, 
        transition: { type: "spring", stiffness: 250, damping: 25, staggerChildren: 0.05 } 
    },
    exit: { 
        opacity: 0, 
        x: -30, 
        scale: 0.98, 
        transition: { duration: 0.2, ease: "easeInOut" } 
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const BannerStepForm: React.FC<BannerStepFormProps> = ({ isSenderEditable = false, onClose }) => {

    const [formData, setFormData] = useState<BookingPayload>({
        sender_firstname: '', sender_lastname: '', sender_email: '', sender_phoneNumber: '',
        sender_address: '', sender_city: '', sender_country: '', sender_state: '', sender_lga: '',
        receiver_firstname: '', receiver_lastname: '', receiver_email: '', receiver_phoneNumber: '',
        receiver_address: '', receiver_city: '', receiver_country: '', receiver_state: '', receiver_lga: '',
        package_name: '', package_description: '', package_image: 'placeholder',
        vendor: '', weight: 0, length: 0, width: 0, height: 0,
        shipment_type: ShipmentType.EXPRESS,
        pickupType: isSenderEditable ? PickupTypes.SA2 : PickupTypes.M2A, 
        shipping_amount: 0, declaredValue: 0, pick_up_date: '', pick_up_time: '',
        productCategory: 'GENERAL', hsCode: '', itemDescription: '', 
        includeInsurance: false, promoCode: '', calculateShipping: true
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countries, setCountries] = useState<CountryDTO[]>([]);
    const [senderCities, setSenderCities] = useState<string[]>([]);
    const [receiverCities, setReceiverCities] = useState<string[]>([]);
    const [bookingResponse, setBookingResponse] = useState<BookingResponseDTO | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Fetch Countries and Cities
    useEffect(() => { getSupportedCountries().then(data => setCountries(data || [])) }, []);
    useEffect(() => { if(formData.sender_country) { const c = countries.find(x => x.countryCode === formData.sender_country); if(c) getSupportedCities(c.countryName).then(setSenderCities); }}, [formData.sender_country, countries]);
    useEffect(() => { if(formData.receiver_country) { const c = countries.find(x => x.countryCode === formData.receiver_country); if(c) getSupportedCities(c.countryName).then(setReceiverCities); }}, [formData.receiver_country, countries]);

    const handleNext = () => { if (currentStep < 3) setCurrentStep(prev => prev + 1); };
    const handlePrevious = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

    const handlePaymentClick = async () => {
        setIsSubmitting(true);
        try {
            // Removed the hardcoded fallback for vendor
            const payload = { ...formData, itemDescription: formData.package_description, vendor: formData.vendor };
            const response = await createPickUpBooking(payload);
            setBookingResponse(response);
            setShowPaymentModal(true);
        } catch (error: any) { alert(error.message); } finally { setIsSubmitting(false); }
    };

    const customInputClasses = "w-full px-4 py-3 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 outline-none text-black font-semibold text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all";
    const labelClasses = "block text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-1 ml-1";

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col relative overflow-hidden">
            
            {/* BACKGROUND ANIMATION */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {Object.keys(stepImages).map((step) => (
                    <div
                        key={step}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${currentStep === Number(step) ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url(${stepImages[Number(step) as keyof typeof stepImages]})` }}
                    />
                ))}
                <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]"></div>
            </div>

            {/* HEADER & ANIMATED PROGRESS BAR */}
            <div className="bg-white/95 pt-4 pb-0 border-b border-gray-200 shrink-0 shadow-sm z-10 relative">
                <div className="px-4 flex justify-between items-end pb-2">
                    <h2 className="text-xl font-extrabold text-appBlack tracking-tight">{isSenderEditable ? "Specific Address" : "From Me To Another"}</h2>
                    <div className="flex gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Step {currentStep} of 3</div>
                </div>
                {/* Progress Bar Track */}
                <div className="w-full h-1 bg-gray-200">
                    <motion.div 
                        initial={{ width: "33%" }}
                        animate={{ width: `${(currentStep / 3) * 100}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="h-full bg-appNav"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 z-10 relative custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="show" exit="exit" className="pb-8">
                                <motion.h3 variants={itemVariants} className="mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Sender Details</motion.h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="sender_firstname" value={formData.sender_firstname} placeholder="First name" onChange={(e) => setFormData({...formData, sender_firstname: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="sender_lastname" value={formData.sender_lastname} placeholder="Last name" onChange={(e) => setFormData({...formData, sender_lastname: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="sender_email" value={formData.sender_email} placeholder="Email address" onChange={(e) => setFormData({...formData, sender_email: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="sender_phoneNumber" value={formData.sender_phoneNumber} placeholder="Phone number" onChange={(e) => setFormData({...formData, sender_phoneNumber: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Pickup Address</label><InputField className={customInputClasses} name="sender_address" value={formData.sender_address} placeholder="Full street address" onChange={(e) => setFormData({...formData, sender_address: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Country</label><InputField className={customInputClasses} name="sender_country" value={formData.sender_country} dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} onChange={(e) => setFormData({...formData, sender_country: e.target.value, sender_city: ''})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="sender_city" value={formData.sender_city} dropdownOptions={senderCities} onChange={(e) => setFormData({...formData, sender_city: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>State</label><InputField className={customInputClasses} name="sender_state" value={formData.sender_state} placeholder="State" onChange={(e) => setFormData({...formData, sender_state: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>LGA</label><InputField className={customInputClasses} name="sender_lga" value={formData.sender_lga} placeholder="Local Govt Area" onChange={(e) => setFormData({...formData, sender_lga: e.target.value})} /></motion.div>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 2 && (
                            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="show" exit="exit" className="pb-8">
                                <motion.h3 variants={itemVariants} className="mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Receiver Details</motion.h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="receiver_firstname" value={formData.receiver_firstname} placeholder="First name" onChange={(e) => setFormData({...formData, receiver_firstname: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="receiver_lastname" value={formData.receiver_lastname} placeholder="Last name" onChange={(e) => setFormData({...formData, receiver_lastname: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="receiver_email" value={formData.receiver_email} placeholder="Email address" onChange={(e) => setFormData({...formData, receiver_email: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="receiver_phoneNumber" value={formData.receiver_phoneNumber} placeholder="Phone number" onChange={(e) => setFormData({...formData, receiver_phoneNumber: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Dropoff Address</label><InputField className={customInputClasses} name="receiver_address" value={formData.receiver_address} placeholder="Full street address" onChange={(e) => setFormData({...formData, receiver_address: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Country</label><InputField className={customInputClasses} name="receiver_country" value={formData.receiver_country} dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} onChange={(e) => setFormData({...formData, receiver_country: e.target.value, receiver_city: ''})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="receiver_city" value={formData.receiver_city} dropdownOptions={receiverCities} onChange={(e) => setFormData({...formData, receiver_city: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>State</label><InputField className={customInputClasses} name="receiver_state" value={formData.receiver_state} placeholder="State" onChange={(e) => setFormData({...formData, receiver_state: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>LGA</label><InputField className={customInputClasses} name="receiver_lga" value={formData.receiver_lga} placeholder="Local Govt Area" onChange={(e) => setFormData({...formData, receiver_lga: e.target.value})} /></motion.div>
                                </div>
                            </motion.div>
                        )}
                        {currentStep === 3 && (
                            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="show" exit="exit" className="pb-8">
                                <motion.h3 variants={itemVariants} className="mb-6 font-extrabold text-2xl text-gray-800 border-b border-gray-300 pb-2">Package Details</motion.h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Package Name</label><InputField className={customInputClasses} name="package_name" value={formData.package_name} placeholder="e.g. MacBook Pro" required onChange={(e) => setFormData({...formData, package_name: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Category</label><InputField className={customInputClasses} name="productCategory" value={formData.productCategory} dropdownOptions={["GENERAL", "ELECTRONICS", "FASHION", "DOCUMENTS", "HEALTHCARE"]} onChange={(e) => setFormData({...formData, productCategory: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Vendor</label><InputField className={customInputClasses} name="vendor" value={formData.vendor} placeholder="Enter vendor name (optional)" onChange={(e) => setFormData({...formData, vendor: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Shipment Type</label><InputField className={customInputClasses} name="shipment_type" value={formData.shipment_type} dropdownOptions={["EXPRESS", "STANDARD"]} onChange={(e) => setFormData({...formData, shipment_type: e.target.value as ShipmentType})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Pickup Date</label><InputField type="date" className={customInputClasses} name="pick_up_date" value={formData.pick_up_date} required onChange={(e) => setFormData({...formData, pick_up_date: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Pickup Time</label><InputField type="time" className={customInputClasses} name="pick_up_time" value={formData.pick_up_time} required onChange={(e) => setFormData({...formData, pick_up_time: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Weight (kg)</label><InputField type="number" className={customInputClasses} name="weight" value={formData.weight} required onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1 grid grid-cols-3 gap-2">
                                        <div><label className={labelClasses}>L (cm)</label><InputField type="number" className={customInputClasses} name="length" value={formData.length} onChange={(e) => setFormData({...formData, length: parseFloat(e.target.value)})} /></div>
                                        <div><label className={labelClasses}>W (cm)</label><InputField type="number" className={customInputClasses} name="width" value={formData.width} onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value)})} /></div>
                                        <div><label className={labelClasses}>H (cm)</label><InputField type="number" className={customInputClasses} name="height" value={formData.height} onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})} /></div>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Declared Value</label><InputField type="number" className={customInputClasses} name="declaredValue" value={formData.declaredValue} required onChange={(e) => setFormData({...formData, declaredValue: parseFloat(e.target.value)})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>HS Code</label><InputField className={customInputClasses} name="hsCode" value={formData.hsCode} placeholder="Optional" onChange={(e) => setFormData({...formData, hsCode: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1"><label className={labelClasses}>Promo Code</label><InputField className={customInputClasses} name="promoCode" value={formData.promoCode} placeholder="Optional" onChange={(e) => setFormData({...formData, promoCode: e.target.value})} /></motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1 flex items-center pt-6">
                                        <input type="checkbox" id="ins1" className="w-5 h-5 text-appBanner rounded focus:ring-blue-500" checked={formData.includeInsurance} onChange={(e) => setFormData({...formData, includeInsurance: e.target.checked})} />
                                        <label htmlFor="ins1" className="ml-2 text-sm font-bold text-gray-700">Add Insurance?</label>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="col-span-1 md:col-span-2"><label className={labelClasses}>Description</label><ReusableTextarea name="package_description" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500/50 outline-none" value={formData.package_description} onChange={(e: any) => setFormData({...formData, package_description: e.target.value})} /></motion.div>
                                </div>
                                <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-gray-200">
                                    <Button onClick={handlePaymentClick} disabled={isSubmitting} className="w-full py-4 bg-appNav text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">{isSubmitting ? "Processing..." : "PAY & SHIP"}</Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            <div className="bg-white/95 p-4 border-t border-gray-200 flex justify-between z-10 relative">
                <div className="w-32">{currentStep > 1 && <Button onClick={handlePrevious} className="w-full bg-gray-100 font-bold text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors active:scale-95">Back</Button>}</div>
                <div className="w-32">{currentStep < 3 && <Button onClick={handleNext} className="w-full bg-appNav font-bold text-white py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-md active:scale-95">Next</Button>}</div>
            </div>

            {showPaymentModal && bookingResponse && <BookingPaymentModal bookingData={bookingResponse} customerEmail={formData.sender_email} customerName={formData.sender_firstname} onClose={() => setShowPaymentModal(false)} />}
        </div>
    );
}
export default BannerStepForm;

// "use client";
// import React, { useEffect, useState } from 'react';
// import InputField from '../inputs/InputField';
// import ReusableTextarea from '../inputs/ReusableTextarea';
// import Button from '../inputs/Button';
// import BookingPaymentModal from '../payment/BookingPaymentModal';
// import { BookingPayload, BookingResponseDTO, ShipmentType, PickupTypes } from '@/types/booking';
// import { CountryDTO } from '@/types/user';
// import { getSupportedCities, getSupportedCountries } from '@/lib/user/actions';
// import { createPickUpBooking } from '@/lib/user/booking.actions';

// interface BannerStepFormProps {
//     isSenderEditable?: boolean; 
//     onClose?: () => void;
// }

// const BannerStepForm: React.FC<BannerStepFormProps> = ({ isSenderEditable = false, onClose }) => {

//     const [formData, setFormData] = useState<BookingPayload>({
//         // Sender
//         sender_firstname: '', sender_lastname: '', sender_email: '', sender_phoneNumber: '',
//         sender_address: '', sender_city: '', sender_country: '', sender_state: '', sender_lga: '',
//         // Receiver
//         receiver_firstname: '', receiver_lastname: '', receiver_email: '', receiver_phoneNumber: '',
//         receiver_address: '', receiver_city: '', receiver_country: '', receiver_state: '', receiver_lga: '',
//         // Package
//         package_name: '', package_description: '', package_image: 'placeholder',
//         vendor: '', weight: 0, length: 0, width: 0, height: 0,
//         // Config
//         shipment_type: ShipmentType.EXPRESS,
//         pickupType: isSenderEditable ? PickupTypes.SA2 : PickupTypes.M2A, 
//         shipping_amount: 0, declaredValue: 0, pick_up_date: '', pick_up_time: '',
//         // Meta
//         productCategory: 'GENERAL', hsCode: '', itemDescription: '', 
//         includeInsurance: false, promoCode: '', calculateShipping: true
//     });

//     const [currentStep, setCurrentStep] = useState(1);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [countries, setCountries] = useState<CountryDTO[]>([]);
//     const [senderCities, setSenderCities] = useState<string[]>([]);
//     const [receiverCities, setReceiverCities] = useState<string[]>([]);
//     const [bookingResponse, setBookingResponse] = useState<BookingResponseDTO | null>(null);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);

//     // Auto-fill Me if sender is NOT editable
//     useEffect(() => {
//         if (!isSenderEditable) {
//             setFormData(prev => ({
//                 ...prev,
//                 sender_firstname: "Admin", sender_lastname: "User",
//                 sender_email: "admin@bulq.com", sender_phoneNumber: "+234800000000"
//             }));
//         }
//     }, [isSenderEditable]);

//     useEffect(() => { getSupportedCountries().then(data => setCountries(data || [])) }, []);
//     useEffect(() => { if(formData.sender_country) { const c = countries.find(x => x.countryCode === formData.sender_country); if(c) getSupportedCities(c.countryName).then(setSenderCities); }}, [formData.sender_country, countries]);
//     useEffect(() => { if(formData.receiver_country) { const c = countries.find(x => x.countryCode === formData.receiver_country); if(c) getSupportedCities(c.countryName).then(setReceiverCities); }}, [formData.receiver_country, countries]);

//     const handleNext = () => { if (currentStep < 3) setCurrentStep(prev => prev + 1); };
//     const handlePrevious = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

//     const handlePaymentClick = async () => {
//         setIsSubmitting(true);
//         try {
//             const payload = { ...formData, itemDescription: formData.package_description, vendor: formData.vendor || "Self" };
//             const response = await createPickUpBooking(payload);
//             setBookingResponse(response);
//             setShowPaymentModal(true);
//         } catch (error: any) { alert(error.message); } finally { setIsSubmitting(false); }
//     };

//     const customInputClasses = "w-full px-4 py-3 rounded-lg bg-white border border-gray-300 outline-none text-black font-semibold text-sm disabled:bg-gray-100 disabled:text-gray-500";
//     const labelClasses = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1";

//     return (
//         <div className="w-full h-full bg-gray-50 flex flex-col">
//             <div className="bg-white pt-3 pb-2 px-4 border-b border-gray-200 shrink-0 shadow-sm z-20">
//                 <h2 className="text-lg font-extrabold text-appBlack">{isSenderEditable ? "Specific Address" : "From Me To Another"}</h2>
//                 <div className="flex gap-2 text-xs font-bold text-gray-400 mt-1">Step {currentStep} of 3</div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 md:p-8">
//                 <div className="max-w-4xl mx-auto">
//                     {/* STEP 1: SENDER */}
//                     {currentStep === 1 && (
//                         <div className="animate-in fade-in slide-in-from-right-4">
//                             <h3 className="mb-4 font-bold text-gray-700 border-b pb-2">Sender Details</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                                 <div className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="sender_firstname" value={formData.sender_firstname} onChange={(e) => setFormData({...formData, sender_firstname: e.target.value})} disabled={!isSenderEditable} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="sender_lastname" value={formData.sender_lastname} onChange={(e) => setFormData({...formData, sender_lastname: e.target.value})} disabled={!isSenderEditable} /></div>
//                                 <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="sender_email" value={formData.sender_email} onChange={(e) => setFormData({...formData, sender_email: e.target.value})} disabled={!isSenderEditable} /></div>
//                                 <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="sender_phoneNumber" value={formData.sender_phoneNumber} onChange={(e) => setFormData({...formData, sender_phoneNumber: e.target.value})} disabled={!isSenderEditable} /></div>
                                
//                                 <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Pickup Address</label><InputField className={customInputClasses} name="sender_address" value={formData.sender_address} placeholder="Street Address" onChange={(e) => setFormData({...formData, sender_address: e.target.value})} /></div>
                                
//                                 <div className="col-span-1"><label className={labelClasses}>Country</label><InputField className={customInputClasses} name="sender_country" value={formData.sender_country} dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} onChange={(e) => setFormData({...formData, sender_country: e.target.value, sender_city: ''})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="sender_city" value={formData.sender_city} dropdownOptions={senderCities} onChange={(e) => setFormData({...formData, sender_city: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>State</label><InputField className={customInputClasses} name="sender_state" value={formData.sender_state} onChange={(e) => setFormData({...formData, sender_state: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>LGA</label><InputField className={customInputClasses} name="sender_lga" value={formData.sender_lga} onChange={(e) => setFormData({...formData, sender_lga: e.target.value})} /></div>
//                             </div>
//                         </div>
//                     )}
                    
//                     {/* STEP 2: RECEIVER */}
//                     {currentStep === 2 && (
//                         <div className="animate-in fade-in slide-in-from-right-4">
//                             <h3 className="mb-4 font-bold text-gray-700 border-b pb-2">Receiver Details</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                                 <div className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="receiver_firstname" value={formData.receiver_firstname} onChange={(e) => setFormData({...formData, receiver_firstname: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="receiver_lastname" value={formData.receiver_lastname} onChange={(e) => setFormData({...formData, receiver_lastname: e.target.value})} /></div>
//                                 <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="receiver_email" value={formData.receiver_email} onChange={(e) => setFormData({...formData, receiver_email: e.target.value})} /></div>
//                                 <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="receiver_phoneNumber" value={formData.receiver_phoneNumber} onChange={(e) => setFormData({...formData, receiver_phoneNumber: e.target.value})} /></div>
                                
//                                 <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Dropoff Address</label><InputField className={customInputClasses} name="receiver_address" value={formData.receiver_address} placeholder="Street Address" onChange={(e) => setFormData({...formData, receiver_address: e.target.value})} /></div>
                                
//                                 <div className="col-span-1"><label className={labelClasses}>Country</label><InputField className={customInputClasses} name="receiver_country" value={formData.receiver_country} dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} onChange={(e) => setFormData({...formData, receiver_country: e.target.value, receiver_city: ''})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="receiver_city" value={formData.receiver_city} dropdownOptions={receiverCities} onChange={(e) => setFormData({...formData, receiver_city: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>State</label><InputField className={customInputClasses} name="receiver_state" value={formData.receiver_state} onChange={(e) => setFormData({...formData, receiver_state: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>LGA</label><InputField className={customInputClasses} name="receiver_lga" value={formData.receiver_lga} onChange={(e) => setFormData({...formData, receiver_lga: e.target.value})} /></div>
//                             </div>
//                         </div>
//                     )}

//                     {/* STEP 3: DETAILS */}
//                     {currentStep === 3 && (
//                         <div className="animate-in fade-in slide-in-from-right-4">
//                             <h3 className="mb-4 font-bold text-gray-700 border-b pb-2">Package Details</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                                 <div className="col-span-1"><label className={labelClasses}>Package Name</label><InputField className={customInputClasses} name="package_name" value={formData.package_name} required onChange={(e) => setFormData({...formData, package_name: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>Category</label><InputField className={customInputClasses} name="productCategory" value={formData.productCategory} dropdownOptions={["GENERAL", "ELECTRONICS", "FASHION", "DOCUMENTS", "HEALTHCARE"]} onChange={(e) => setFormData({...formData, productCategory: e.target.value})} /></div>
                                
//                                 <div className="col-span-1"><label className={labelClasses}>Vendor</label><InputField className={customInputClasses} name="vendor" value={formData.vendor} placeholder="Self" onChange={(e) => setFormData({...formData, vendor: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>Shipment Type</label><InputField className={customInputClasses} name="shipment_type" value={formData.shipment_type} dropdownOptions={["EXPRESS", "STANDARD"]} onChange={(e) => setFormData({...formData, shipment_type: e.target.value as ShipmentType})} /></div>
                                
//                                 <div className="col-span-1"><label className={labelClasses}>Pickup Date</label><InputField type="date" className={customInputClasses} name="pick_up_date" value={formData.pick_up_date} required onChange={(e) => setFormData({...formData, pick_up_date: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>Pickup Time</label><InputField type="time" className={customInputClasses} name="pick_up_time" value={formData.pick_up_time} required onChange={(e) => setFormData({...formData, pick_up_time: e.target.value})} /></div>

//                                 <div className="col-span-1"><label className={labelClasses}>Weight (kg)</label><InputField type="number" className={customInputClasses} name="weight" value={formData.weight} required onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} /></div>
                                
//                                 <div className="col-span-1 grid grid-cols-3 gap-2">
//                                     <div><label className={labelClasses}>L (cm)</label><InputField type="number" className={customInputClasses} name="length" value={formData.length} onChange={(e) => setFormData({...formData, length: parseFloat(e.target.value)})} /></div>
//                                     <div><label className={labelClasses}>W (cm)</label><InputField type="number" className={customInputClasses} name="width" value={formData.width} onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value)})} /></div>
//                                     <div><label className={labelClasses}>H (cm)</label><InputField type="number" className={customInputClasses} name="height" value={formData.height} onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})} /></div>
//                                 </div>

//                                 <div className="col-span-1"><label className={labelClasses}>Declared Value</label><InputField type="number" className={customInputClasses} name="declaredValue" value={formData.declaredValue} required onChange={(e) => setFormData({...formData, declaredValue: parseFloat(e.target.value)})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>HS Code</label><InputField className={customInputClasses} name="hsCode" value={formData.hsCode} placeholder="Optional" onChange={(e) => setFormData({...formData, hsCode: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>Promo Code</label><InputField className={customInputClasses} name="promoCode" value={formData.promoCode} placeholder="Optional" onChange={(e) => setFormData({...formData, promoCode: e.target.value})} /></div>
                                
//                                 <div className="col-span-1 flex items-center pt-6">
//                                     <input type="checkbox" id="ins1" className="w-5 h-5 text-appBanner rounded" checked={formData.includeInsurance} onChange={(e) => setFormData({...formData, includeInsurance: e.target.checked})} />
//                                     <label htmlFor="ins1" className="ml-2 text-sm font-bold text-gray-600">Insurance?</label>
//                                 </div>

//                                 <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Description</label><ReusableTextarea name="package_description" rows={3} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300" value={formData.package_description} onChange={(e: any) => setFormData({...formData, package_description: e.target.value})} /></div>
//                             </div>
//                             <div className="mt-8 pt-6 border-t border-gray-200">
//                                 <Button onClick={handlePaymentClick} disabled={isSubmitting} className="w-full py-4 bg-appNav text-white rounded-xl shadow-lg">{isSubmitting ? "Processing..." : "PAY & SHIP"}</Button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
            
//             <div className="bg-white p-4 border-t border-gray-200 flex justify-between">
//                 <div className="w-32">{currentStep > 1 && <Button onClick={handlePrevious} className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg">Back</Button>}</div>
//                 <div className="w-32">{currentStep < 3 && <Button onClick={handleNext} className="w-full bg-appNav text-white py-2 rounded-lg">Next</Button>}</div>
//             </div>

//             {showPaymentModal && bookingResponse && <BookingPaymentModal bookingData={bookingResponse} customerEmail={formData.sender_email} customerName={formData.sender_firstname} onClose={() => setShowPaymentModal(false)} />}
//         </div>
//     );
// }
// export default BannerStepForm;

// "use client";
// import React, { useEffect, useState } from 'react';
// import InputField from '../inputs/InputField';
// import ReusableTextarea from '../inputs/ReusableTextarea';
// import Button from '../inputs/Button';
// import WhoToWhoHeading from '../inputs/WhoToWhoHeading';
// import BookingPaymentModal from '../payment/BookingPaymentModal';
// import { BookingPayload } from '@/types/booking';

// // Ensure these imports match your actual file structure
// import { 
//     BookingResponseDTO,
//     ShipmentType,
//     PickupTypes
// } from '@/types/booking';
// import { CountryDTO } from '@/types/user';
// import { getSupportedCities, getSupportedCountries } from '@/lib/user/actions';
// import { createPickUpBooking } from '@/lib/user/booking.actions';

// const BannerStepForm: React.FC = () => {

//     // --- 1. STATE MANAGEMENT ---

//     const [formData, setFormData] = useState<BookingPayload>({
//         // Sender Details
//         sender_firstname: '', sender_lastname: '', sender_email: '', sender_phoneNumber: '',
//         sender_address: '', sender_city: '', sender_country: '', sender_state: '', sender_lga: '',
        
//         // Receiver Details
//         receiver_firstname: '', receiver_lastname: '', receiver_email: '', receiver_phoneNumber: '',
//         receiver_address: '', receiver_city: '', receiver_country: '', receiver_state: '', receiver_lga: '',
        
//         // Package Details
//         package_name: '', package_description: '', 
//         package_image: 'https://images.pexels.com/photos/842876/pexels-photo-842876.jpeg?cs=srgb&dl=pexels-wordsurfer-842876.jpg&fm=jpg', // Placeholder until file upload is ready
//         vendor: '', 
//         weight: 0, length: 0, width: 0, height: 0,
        
//         // Configuration
//         shipment_type: ShipmentType.EXPRESS,
//         pickupType: PickupTypes.M2A, // FIX: Uses Enum (M2A) instead of raw string
//         shipping_amount: 0,
//         declaredValue: 0,
//         pick_up_date: '',
//         pick_up_time: '',
        
//         // Compliance & Meta
//         productCategory: 'GENERAL', 
//         hsCode: '', 
//         itemDescription: '', 
//         includeInsurance: false,
//         promoCode: '', 
//         calculateShipping: true
//     });

//     // UI States
//     const [currentStep, setCurrentStep] = useState(1);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // Data Loading States
//     const [countries, setCountries] = useState<CountryDTO[]>([]);
    
//     // Sender Cities
//     const [senderCities, setSenderCities] = useState<string[]>([]);
//     const [loadingSenderCities, setLoadingSenderCities] = useState(false);

//     // Receiver Cities
//     const [receiverCities, setReceiverCities] = useState<string[]>([]);
//     const [loadingReceiverCities, setLoadingReceiverCities] = useState(false);

//     // Modal States
//     const [bookingResponse, setBookingResponse] = useState<BookingResponseDTO | null>(null);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);


//     // --- 2. API EFFECTS ---

//     // Load Countries
//     useEffect(() => {
//         const loadCountries = async () => {
//             try {
//                 const data = await getSupportedCountries();
//                 setCountries(data || []);
//             } catch (error) { console.error("Failed to load countries", error); }
//         };
//         loadCountries();
//     }, []);

//     // Helper: Convert "NG" -> "Nigeria" for City API
//     const getCountryNameFromCode = (code: string) => {
//         const country = countries.find(c => c.countryCode === code);
//         return country ? country.countryName : code;
//     };

//     // Load Sender Cities
//     useEffect(() => {
//         const fetchSenderCities = async () => {
//             if (!formData.sender_country) { setSenderCities([]); return; }
//             setLoadingSenderCities(true);
//             try {
//                 // Lookup the Name because the State holds the Code
//                 const countryName = getCountryNameFromCode(formData.sender_country);
//                 const cities = await getSupportedCities(countryName);
//                 setSenderCities(cities || []);
//             } catch (e) { console.error(e); } 
//             finally { setLoadingSenderCities(false); }
//         };
//         fetchSenderCities();
//     }, [formData.sender_country, countries]);

//     // Load Receiver Cities
//     useEffect(() => {
//         const fetchReceiverCities = async () => {
//             if (!formData.receiver_country) { setReceiverCities([]); return; }
//             setLoadingReceiverCities(true);
//             try {
//                 const countryName = getCountryNameFromCode(formData.receiver_country);
//                 const cities = await getSupportedCities(countryName);
//                 setReceiverCities(cities || []);
//             } catch (e) { console.error(e); } 
//             finally { setLoadingReceiverCities(false); }
//         };
//         fetchReceiverCities();
//     }, [formData.receiver_country, countries]);


//     // --- 3. HANDLERS ---

//     const handleNext = () => { if (currentStep < 3) setCurrentStep(prev => prev + 1); };
//     const handlePrevious = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

//     // Format Date: YYYY-MM-DD -> DD-MM-YYYY
//     const formatDateForBackend = (dateString: string) => {
//         if (!dateString) return "";
//         const [year, month, day] = dateString.split('-');
//         return `${day}-${month}-${year}`;
//     };

//     const handlePaymentClick = async () => {
//         // Basic Validation
//         if (!formData.sender_firstname || !formData.receiver_firstname || !formData.package_name) {
//             alert("Please fill in all required fields.");
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             // Prepare Payload
//             const payloadToSend: BookingPayload = {
//                 ...formData,
//                 pick_up_date: formatDateForBackend(formData.pick_up_date), // Format Date
//                 itemDescription: formData.package_description, // Sync Descriptions
//                 vendor: formData.vendor || "Self", // Default Value
//                 hsCode: formData.hsCode || "000000" // Default Value
//             };

//             console.log("Sending Payload:", payloadToSend); // Debugging

//             const response = await createPickUpBooking(payloadToSend);
            
//             console.log("Booking Created:", response);
//             setBookingResponse(response);
//             setShowPaymentModal(true); // Open Payment Modal

//         } catch (error: any) {
//             console.error("Booking Failed:", error);
//             alert(error.message || "Booking failed. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };


//     // --- 4. STYLES & COMPONENTS ---
//     const customInputClasses = "w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:bg-white focus:ring-2 focus:ring-appBanner/20 focus:border-appBanner outline-none transition-all duration-200 ease-in-out hover:border-gray-400 placeholder-gray-400 text-black font-semibold shadow-sm text-sm";
//     const labelClasses = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1";

//     const StepIndicator = ({ step, label, isActive, isCompleted }: any) => (
//         <div className="flex flex-col items-center z-10">
//             <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-300 border-2 ${isActive ? 'bg-appNav text-white border-appNav scale-110 shadow-md ring-2 ring-appNav/20' : isCompleted ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-300 border-gray-200'}`}>
//                 {isCompleted ? '✓' : step}
//             </div>
//             <span className={`hidden md:block mt-1 text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-appNav' : 'text-gray-300'}`}>{label}</span>
//         </div>
//     );
//     const StepLine = ({ isCompleted }: any) => (<div className={`flex-1 h-[2px] mx-1 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gray-100'}`}></div>);


//     // --- 5. RENDER ---
//     return (
//         <div className="w-full h-full bg-gray-50 flex flex-col">
            
//             {/* HEADER */}
//             <div className="bg-white pt-3 pb-2 px-4 md:px-6 border-b border-gray-200 shrink-0 shadow-sm z-20">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
//                     <div className="text-center md:text-left mb-2 md:mb-0">
//                         <h2 className="text-base md:text-lg font-extrabold text-appBlack tracking-tight">From Me To Another</h2>
//                         <p className="text-[10px] text-appBanner font-medium uppercase tracking-wide">Pick Up Service</p>
//                     </div>
//                     <div className="flex items-center justify-center w-full md:w-auto md:min-w-[200px]">
//                         <StepIndicator step={1} label="Sender" isActive={currentStep === 1} isCompleted={currentStep > 1} />
//                         <StepLine isCompleted={currentStep > 1} />
//                         <StepIndicator step={2} label="Receiver" isActive={currentStep === 2} isCompleted={currentStep > 2} />
//                         <StepLine isCompleted={currentStep > 2} />
//                         <StepIndicator step={3} label="Details" isActive={currentStep === 3} isCompleted={currentStep > 3} />
//                     </div>
//                 </div>
//             </div>

//             {/* CONTENT AREA */}
//             <div className="flex-1 overflow-y-auto p-4 md:p-8">
//                 <div className="max-w-4xl mx-auto">
                    
//                     {/* --- STEP 1: SENDER --- */}
//                     {currentStep === 1 && (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                             <div className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} id="sfname" name="sender_firstname" value={formData.sender_firstname} placeholder="John" required onChange={(e) => setFormData({...formData, sender_firstname: e.target.value})} /></div>
//                             <div className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} id="slname" name="sender_lastname" value={formData.sender_lastname} placeholder="Doe" required onChange={(e) => setFormData({...formData, sender_lastname: e.target.value})} /></div>
//                             <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} id="semail" name="sender_email" value={formData.sender_email} placeholder="john@example.com" required onChange={(e) => setFormData({...formData, sender_email: e.target.value})} /></div>
//                             <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} id="sphone" name="sender_phoneNumber" value={formData.sender_phoneNumber} placeholder="+123..." required onChange={(e) => setFormData({...formData, sender_phoneNumber: e.target.value})} /></div>
                            
//                             <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Street Address</label><InputField className={customInputClasses} id="saddr" name="sender_address" value={formData.sender_address} placeholder="123 Main St" required onChange={(e) => setFormData({...formData, sender_address: e.target.value})} /></div>
                            
//                             {/* COUNTRY (Displays Name, Saves Code) */}
//                             <div className="col-span-1">
//                                 <label className={labelClasses}>Country</label>
//                                 <InputField 
//                                     className={customInputClasses} id="scountry" name="sender_country" 
//                                     value={formData.sender_country} 
//                                     placeholder="Select Country" 
//                                     dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} 
//                                     onChange={(e) => setFormData({...formData, sender_country: e.target.value, sender_city: ''})} 
//                                 />
//                             </div>
//                             <div className="col-span-1">
//                                 <label className={labelClasses}>City</label>
//                                 <InputField 
//                                     className={customInputClasses} id="scity" name="sender_city" 
//                                     value={formData.sender_city} 
//                                     placeholder={loadingSenderCities ? "Loading..." : "Select City"} 
//                                     dropdownOptions={senderCities} 
//                                     disabled={!formData.sender_country} 
//                                     onChange={(e) => setFormData({...formData, sender_city: e.target.value})} 
//                                 />
//                             </div>
//                             <div className="col-span-1"><label className={labelClasses}>State / Province</label><InputField className={customInputClasses} id="sstate" name="sender_state" value={formData.sender_state} placeholder="State" onChange={(e) => setFormData({...formData, sender_state: e.target.value})} /></div>
//                             <div className="col-span-1"><label className={labelClasses}>LGA / County</label><InputField className={customInputClasses} id="slga" name="sender_lga" value={formData.sender_lga} placeholder="LGA" onChange={(e) => setFormData({...formData, sender_lga: e.target.value})} /></div>
//                         </div>
//                     )}

//                     {/* --- STEP 2: RECEIVER --- */}
//                     {currentStep === 2 && (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                             <div className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} id="rfname" name="receiver_firstname" value={formData.receiver_firstname} placeholder="Jane" required onChange={(e) => setFormData({...formData, receiver_firstname: e.target.value})} /></div>
//                             <div className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} id="rlname" name="receiver_lastname" value={formData.receiver_lastname} placeholder="Doe" required onChange={(e) => setFormData({...formData, receiver_lastname: e.target.value})} /></div>
//                             <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} id="remail" name="receiver_email" value={formData.receiver_email} placeholder="jane@example.com" required onChange={(e) => setFormData({...formData, receiver_email: e.target.value})} /></div>
//                             <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} id="rphone" name="receiver_phoneNumber" value={formData.receiver_phoneNumber} placeholder="+123..." required onChange={(e) => setFormData({...formData, receiver_phoneNumber: e.target.value})} /></div>
                            
//                             <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Street Address</label><InputField className={customInputClasses} id="raddr" name="receiver_address" value={formData.receiver_address} placeholder="456 Side St" required onChange={(e) => setFormData({...formData, receiver_address: e.target.value})} /></div>
                            
//                             {/* RECEIVER COUNTRY */}
//                             <div className="col-span-1">
//                                 <label className={labelClasses}>Country</label>
//                                 <InputField 
//                                     className={customInputClasses} id="rcountry" name="receiver_country" 
//                                     value={formData.receiver_country} 
//                                     placeholder="Select Country" 
//                                     dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} 
//                                     onChange={(e) => setFormData({...formData, receiver_country: e.target.value, receiver_city: ''})} 
//                                 />
//                             </div>
//                             <div className="col-span-1">
//                                 <label className={labelClasses}>City</label>
//                                 <InputField 
//                                     className={customInputClasses} id="rcity" name="receiver_city" 
//                                     value={formData.receiver_city} 
//                                     placeholder={loadingReceiverCities ? "Loading..." : "Select City"} 
//                                     dropdownOptions={receiverCities} 
//                                     disabled={!formData.receiver_country} 
//                                     onChange={(e) => setFormData({...formData, receiver_city: e.target.value})} 
//                                 />
//                             </div>
//                             <div className="col-span-1"><label className={labelClasses}>State / Province</label><InputField className={customInputClasses} id="rstate" name="receiver_state" value={formData.receiver_state} placeholder="State" onChange={(e) => setFormData({...formData, receiver_state: e.target.value})} /></div>
//                             <div className="col-span-1"><label className={labelClasses}>LGA / County</label><InputField className={customInputClasses} id="rlga" name="receiver_lga" value={formData.receiver_lga} placeholder="LGA" onChange={(e) => setFormData({...formData, receiver_lga: e.target.value})} /></div>
//                         </div>
//                     )}

//                     {/* --- STEP 3: DETAILS --- */}
//                     {currentStep === 3 && (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                                 <div className="col-span-1"><label className={labelClasses}>Package Name</label><InputField className={customInputClasses} id="pname" name="package_name" value={formData.package_name} placeholder="Item Name" required onChange={(e) => setFormData({...formData, package_name: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>Product Category</label><InputField className={customInputClasses} id="cat" name="productCategory" value={formData.productCategory} dropdownOptions={["GENERAL", "ELECTRONICS", "FASHION", "DOCUMENTS", "HEALTHCARE"]} onChange={(e) => setFormData({...formData, productCategory: e.target.value})} /></div>
                                
//                                 <div className="col-span-1"><label className={labelClasses}>Vendor / Source</label><InputField className={customInputClasses} id="vend" name="vendor" value={formData.vendor} placeholder="e.g. Amazon, Self" onChange={(e) => setFormData({...formData, vendor: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>Shipment Type</label><InputField className={customInputClasses} id="stype" name="shipment_type" value={formData.shipment_type} dropdownOptions={["EXPRESS", "STANDARD", "ECONOMY"]} onChange={(e) => setFormData({...formData, shipment_type: e.target.value as ShipmentType})} /></div>
                                
//                                 <div className="col-span-1"><label className={labelClasses}>Pick Up Date</label><InputField type="date" className={customInputClasses} id="pdate" name="pick_up_date" value={formData.pick_up_date} required onChange={(e) => setFormData({...formData, pick_up_date: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>Pick Up Time</label><InputField type="time" className={customInputClasses} id="ptime" name="pick_up_time" value={formData.pick_up_time} required onChange={(e) => setFormData({...formData, pick_up_time: e.target.value})} /></div>

//                                 <div className="col-span-1"><label className={labelClasses}>Weight (kg)</label><InputField type="number" className={customInputClasses} id="w" name="weight" value={formData.weight} placeholder="0" required onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} /></div>
//                                 <div className="col-span-1 grid grid-cols-3 gap-2">
//                                     <div><label className={labelClasses}>L (cm)</label><InputField type="number" className={customInputClasses} id="l" name="length" value={formData.length} placeholder="0" onChange={(e) => setFormData({...formData, length: parseFloat(e.target.value)})} /></div>
//                                     <div><label className={labelClasses}>W (cm)</label><InputField type="number" className={customInputClasses} id="wi" name="width" value={formData.width} placeholder="0" onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value)})} /></div>
//                                     <div><label className={labelClasses}>H (cm)</label><InputField type="number" className={customInputClasses} id="h" name="height" value={formData.height} placeholder="0" onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})} /></div>
//                                 </div>

//                                 <div className="col-span-1"><label className={labelClasses}>Declared Value</label><InputField type="number" className={customInputClasses} id="dval" name="declaredValue" value={formData.declaredValue} placeholder="0.00" onChange={(e) => setFormData({...formData, declaredValue: parseFloat(e.target.value)})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>HS Code (Optional)</label><InputField className={customInputClasses} id="hs" name="hsCode" value={formData.hsCode} placeholder="e.g. 8512.12" onChange={(e) => setFormData({...formData, hsCode: e.target.value})} /></div>
                                
//                                 <div className="col-span-1"><label className={labelClasses}>Promo Code</label><InputField className={customInputClasses} id="promo" name="promoCode" value={formData.promoCode} placeholder="WELCOME10" onChange={(e) => setFormData({...formData, promoCode: e.target.value})} /></div>
//                                 <div className="col-span-1 flex items-center pt-6">
//                                     <input type="checkbox" id="insure" className="w-5 h-5 text-appBanner rounded cursor-pointer" checked={formData.includeInsurance} onChange={(e) => setFormData({...formData, includeInsurance: e.target.checked})} />
//                                     <label htmlFor="insure" className="ml-2 text-sm font-bold text-gray-600 cursor-pointer">Include Insurance</label>
//                                 </div>
                                
//                                 <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Description</label><ReusableTextarea id="msg" name="package_description" placeholder="Describe contents..." rows={3} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300" value={formData.package_description} onChange={(e: any) => setFormData({...formData, package_description: e.target.value})} /></div>
//                             </div>

//                             <div className="mt-8 pt-6 border-t border-gray-200">
//                                 <Button 
//                                     type="submit" 
//                                     onClick={handlePaymentClick} 
//                                     disabled={isSubmitting}
//                                     className={`w-full py-4 text-base font-bold shadow-lg rounded-xl text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-appNav hover:shadow-xl hover:-translate-y-0.5 transition-all'}`}
//                                 >
//                                     {isSubmitting ? "PROCESSING..." : "PAY NOW & SHIP"}
//                                 </Button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* FOOTER */}
//             <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center shrink-0 z-30">
//                 <div className="w-32">{currentStep > 1 && <Button type="button" onClick={handlePrevious} className="bg-white text-gray-700 border border-gray-300 w-full rounded-lg text-sm py-2">&larr; Back</Button>}</div>
//                 <div className="w-32">{currentStep < 3 && <Button type="button" onClick={handleNext} className="w-full rounded-lg shadow-md text-sm py-2">Next Step &rarr;</Button>}</div>
//             </div>

//             {/* PAYMENT MODAL */}
//             {showPaymentModal && bookingResponse && (
//                 <BookingPaymentModal 
//                     bookingData={bookingResponse}
//                     customerEmail={formData.sender_email}
//                     customerName={`${formData.sender_firstname} ${formData.sender_lastname}`}
//                     onClose={() => setShowPaymentModal(false)}
//                 />
//             )}
//         </div>
//     );
// }

// export default BannerStepForm;
