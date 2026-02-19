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

const stepImages = {
    1: "/videos/backgroundvideo.mp4", // Delivery Person
    2: "/videos/backgroundvideo.mp4", // Unboxing
    3: "/videos/backgroundvideo.mp4"  // Van
};

const BannerStepForm2: React.FC = () => {

    const [formData, setFormData] = useState<BookingPayload>({
        sender_firstname: '', sender_lastname: '', sender_email: '', sender_phoneNumber: '',
        sender_address: '', sender_city: '', sender_country: '', sender_state: '', sender_lga: '',
        receiver_firstname: '', receiver_lastname: '', receiver_email: '', receiver_phoneNumber: '',
        receiver_address: '', receiver_city: '', receiver_country: '', receiver_state: '', receiver_lga: '',
        package_name: '', package_description: '', package_image: 'placeholder',
        vendor: '', weight: 0, length: 0, width: 0, height: 0,
        shipment_type: ShipmentType.EXPRESS,
        pickupType: PickupTypes.A2M, 
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

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            receiver_firstname: "Admin", receiver_lastname: "User",
            receiver_email: "admin@bulq.com", receiver_phoneNumber: "+234800000000"
        }));
    }, []);

    useEffect(() => { getSupportedCountries().then(data => setCountries(data || [])) }, []);
    useEffect(() => { if(formData.sender_country) { const c = countries.find(x => x.countryCode === formData.sender_country); if(c) getSupportedCities(c.countryName).then(setSenderCities); }}, [formData.sender_country, countries]);
    useEffect(() => { if(formData.receiver_country) { const c = countries.find(x => x.countryCode === formData.receiver_country); if(c) getSupportedCities(c.countryName).then(setReceiverCities); }}, [formData.receiver_country, countries]);

    const handleNext = () => { if (currentStep < 3) setCurrentStep(prev => prev + 1); };
    const handlePrevious = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

    const handlePaymentClick = async () => {
        setIsSubmitting(true);
        try {
            const payload = { ...formData, itemDescription: formData.package_description, vendor: formData.vendor || "Self" };
            const response = await createPickUpBooking(payload);
            setBookingResponse(response);
            setShowPaymentModal(true);
        } catch (error: any) { alert(error.message); } finally { setIsSubmitting(false); }
    };

    const customInputClasses = "w-full px-4 py-3 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 outline-none text-black font-semibold text-sm disabled:bg-gray-100/50 disabled:text-gray-500 focus:bg-white transition-all";
    const labelClasses = "block text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-1 ml-1 shadow-sm";

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col relative overflow-hidden">
            
            {/* BACKGROUND */}
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

            <div className="bg-white/95 pt-3 pb-2 px-4 border-b border-gray-200 shrink-0 shadow-sm z-10 relative">
                <h2 className="text-lg font-extrabold text-appBlack">From Another To Me</h2>
                <div className="flex gap-2 text-xs font-bold text-gray-400 mt-1">Step {currentStep} of 3</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 relative">
                <div className="max-w-4xl mx-auto">
                    {/* STEP 1: SENDER */}
                    {currentStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h3 className="mb-4 font-bold text-gray-800 border-b border-gray-300 pb-2">Sender Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                                <div className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="sender_firstname" value={formData.sender_firstname} onChange={(e) => setFormData({...formData, sender_firstname: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="sender_lastname" value={formData.sender_lastname} onChange={(e) => setFormData({...formData, sender_lastname: e.target.value})} /></div>
                                <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="sender_email" value={formData.sender_email} onChange={(e) => setFormData({...formData, sender_email: e.target.value})} /></div>
                                <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="sender_phoneNumber" value={formData.sender_phoneNumber} onChange={(e) => setFormData({...formData, sender_phoneNumber: e.target.value})} /></div>
                                <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Pickup Address</label><InputField className={customInputClasses} name="sender_address" value={formData.sender_address} onChange={(e) => setFormData({...formData, sender_address: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Country</label><InputField className={customInputClasses} name="sender_country" value={formData.sender_country} dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} onChange={(e) => setFormData({...formData, sender_country: e.target.value, sender_city: ''})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="sender_city" value={formData.sender_city} dropdownOptions={senderCities} onChange={(e) => setFormData({...formData, sender_city: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>State</label><InputField className={customInputClasses} name="sender_state" value={formData.sender_state} onChange={(e) => setFormData({...formData, sender_state: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>LGA</label><InputField className={customInputClasses} name="sender_lga" value={formData.sender_lga} onChange={(e) => setFormData({...formData, sender_lga: e.target.value})} /></div>
                            </div>
                        </div>
                    )}
                    
                    {/* STEP 2: RECEIVER */}
                    {currentStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h3 className="mb-4 font-bold text-gray-800 border-b border-gray-300 pb-2">Receiver Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                                <div className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="receiver_firstname" value={formData.receiver_firstname} disabled /></div>
                                <div className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="receiver_lastname" value={formData.receiver_lastname} disabled /></div>
                                <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="receiver_email" value={formData.receiver_email} disabled /></div>
                                <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Dropoff Address (Editable)</label><InputField className={customInputClasses} name="receiver_address" value={formData.receiver_address} placeholder="Street Address" onChange={(e) => setFormData({...formData, receiver_address: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Country</label><InputField className={customInputClasses} name="receiver_country" value={formData.receiver_country} dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} onChange={(e) => setFormData({...formData, receiver_country: e.target.value, receiver_city: ''})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="receiver_city" value={formData.receiver_city} dropdownOptions={receiverCities} onChange={(e) => setFormData({...formData, receiver_city: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>State</label><InputField className={customInputClasses} name="receiver_state" value={formData.receiver_state} onChange={(e) => setFormData({...formData, receiver_state: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>LGA</label><InputField className={customInputClasses} name="receiver_lga" value={formData.receiver_lga} onChange={(e) => setFormData({...formData, receiver_lga: e.target.value})} /></div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: DETAILS */}
                    {currentStep === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h3 className="mb-4 font-bold text-gray-800 border-b border-gray-300 pb-2">Package Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                                <div className="col-span-1"><label className={labelClasses}>Package Name</label><InputField className={customInputClasses} name="package_name" value={formData.package_name} required onChange={(e) => setFormData({...formData, package_name: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Category</label><InputField className={customInputClasses} name="productCategory" value={formData.productCategory} dropdownOptions={["GENERAL", "ELECTRONICS", "FASHION", "DOCUMENTS", "HEALTHCARE"]} onChange={(e) => setFormData({...formData, productCategory: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Vendor</label><InputField className={customInputClasses} name="vendor" value={formData.vendor} placeholder="Self" onChange={(e) => setFormData({...formData, vendor: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Shipment Type</label><InputField className={customInputClasses} name="shipment_type" value={formData.shipment_type} dropdownOptions={["EXPRESS", "STANDARD"]} onChange={(e) => setFormData({...formData, shipment_type: e.target.value as ShipmentType})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Pickup Date</label><InputField type="date" className={customInputClasses} name="pick_up_date" value={formData.pick_up_date} required onChange={(e) => setFormData({...formData, pick_up_date: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Pickup Time</label><InputField type="time" className={customInputClasses} name="pick_up_time" value={formData.pick_up_time} required onChange={(e) => setFormData({...formData, pick_up_time: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Weight (kg)</label><InputField type="number" className={customInputClasses} name="weight" value={formData.weight} required onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} /></div>
                                <div className="col-span-1 grid grid-cols-3 gap-2">
                                    <div><label className={labelClasses}>L (cm)</label><InputField type="number" className={customInputClasses} name="length" value={formData.length} onChange={(e) => setFormData({...formData, length: parseFloat(e.target.value)})} /></div>
                                    <div><label className={labelClasses}>W (cm)</label><InputField type="number" className={customInputClasses} name="width" value={formData.width} onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value)})} /></div>
                                    <div><label className={labelClasses}>H (cm)</label><InputField type="number" className={customInputClasses} name="height" value={formData.height} onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})} /></div>
                                </div>
                                <div className="col-span-1"><label className={labelClasses}>Declared Value</label><InputField type="number" className={customInputClasses} name="declaredValue" value={formData.declaredValue} required onChange={(e) => setFormData({...formData, declaredValue: parseFloat(e.target.value)})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>HS Code</label><InputField className={customInputClasses} name="hsCode" value={formData.hsCode} placeholder="Optional" onChange={(e) => setFormData({...formData, hsCode: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Promo Code</label><InputField className={customInputClasses} name="promoCode" value={formData.promoCode} placeholder="Optional" onChange={(e) => setFormData({...formData, promoCode: e.target.value})} /></div>
                                <div className="col-span-1 flex items-center pt-6">
                                    <input type="checkbox" id="ins2" className="w-5 h-5 text-appBanner rounded" checked={formData.includeInsurance} onChange={(e) => setFormData({...formData, includeInsurance: e.target.checked})} />
                                    <label htmlFor="ins2" className="ml-2 text-sm font-bold text-gray-600">Insurance?</label>
                                </div>
                                <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Description</label><ReusableTextarea name="package_description" rows={3} className="w-full px-4 py-3 rounded-lg bg-white/80 border border-gray-300" value={formData.package_description} onChange={(e: any) => setFormData({...formData, package_description: e.target.value})} /></div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <Button onClick={handlePaymentClick} disabled={isSubmitting} className="w-full py-4 bg-appNav text-white rounded-xl shadow-lg hover:shadow-xl transition-all">{isSubmitting ? "Processing..." : "PAY & SHIP"}</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-white/95 p-4 border-t border-gray-200 flex justify-between z-10 relative">
                <div className="w-32">{currentStep > 1 && <Button onClick={handlePrevious} className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">Back</Button>}</div>
                <div className="w-32">{currentStep < 3 && <Button onClick={handleNext} className="w-full bg-appNav text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Next</Button>}</div>
            </div>

            {showPaymentModal && bookingResponse && <BookingPaymentModal bookingData={bookingResponse} customerEmail={formData.sender_email} customerName={formData.sender_firstname} onClose={() => setShowPaymentModal(false)} />}
        </div>
    );
}
export default BannerStepForm2;

// "use client";
// import React, { useState } from 'react';
// import InputField from '../inputs/InputField';
// import ReusableTextarea from '../inputs/ReusableTextarea';
// import Button from '../inputs/Button';
// import WhoToWhoHeading from '../inputs/WhoToWhoHeading';

// const BannerStepForm2: React.FC = () => {

//     const [formData, setFormData] = useState({
//         lastName: '', firstName: '', email: '', phone: '', address: '',
//         name: '', cardName: '', cardNumber: '', cardDate: '', cardCVC: '',
//         cardOTP: '', country: '', city: '', packagename: '', weight: '',
//     });

//     const [currentStep, setCurrentStep] = useState(1);

//     // Max steps is now 3
//     const handleNext = () => {
//         if (currentStep < 3) setCurrentStep((prev) => prev + 1);
//     };
    
//     const handlePrevious = () => { 
//         if (currentStep > 1) setCurrentStep((prev) => prev - 1); 
//     };
    
//     const handleSubmit = () => { 
//         // Handle final form submission here
//         console.log("Form Submitted", formData);
//     };

//     // Styling constants
//     const customInputClasses = "w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:bg-white focus:ring-2 focus:ring-appBanner/20 focus:border-appBanner outline-none transition-all duration-200 ease-in-out hover:border-gray-400 placeholder-gray-400 text-black font-semibold shadow-sm";
//     const labelClasses = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1";

//     const StepIndicator = ({ step, label, isActive, isCompleted }: { step: number, label: string, isActive: boolean, isCompleted: boolean }) => (
//         <div className="flex flex-col items-center z-10">
//             <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-300 border-2 
//                 ${isActive ? 'bg-appNav text-white border-appNav scale-110 shadow-md ring-2 ring-appNav/20' : 
//                   isCompleted ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-300 border-gray-200'}`}>
//                 {isCompleted ? '✓' : step}
//             </div>
//             <span className={`hidden md:block mt-1 text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-appNav' : 'text-gray-300'}`}>{label}</span>
//         </div>
//     );

//     const StepLine = ({ isCompleted }: { isCompleted: boolean }) => (
//         <div className={`flex-1 h-[2px] mx-1 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gray-100'}`}></div>
//     );

//     return (
//         <div className="w-full h-full bg-gray-50 flex flex-col">
            
//             {/* HEADER */}
//             <div className="bg-white pt-3 pb-2 px-4 md:px-6 border-b border-gray-200 shrink-0 shadow-sm z-20">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
//                     <div className="text-center md:text-left mb-2 md:mb-0">
//                         <h2 className="text-base md:text-lg font-extrabold text-appBlack tracking-tight">From Another To Me</h2>
//                         <p className="text-[10px] text-appBanner font-medium uppercase tracking-wide">Shipment Details</p>
//                     </div>
                    
//                     {/* Stepper reduced to 3 steps */}
//                     <div className="flex items-center justify-center w-full md:w-auto md:min-w-[200px]">
//                         <StepIndicator step={1} label="Sender" isActive={currentStep === 1} isCompleted={currentStep > 1} />
//                         <StepLine isCompleted={currentStep > 1} />
//                         <StepIndicator step={2} label="Receiver" isActive={currentStep === 2} isCompleted={currentStep > 2} />
//                         <StepLine isCompleted={currentStep > 2} />
//                         <StepIndicator step={3} label="Details" isActive={currentStep === 3} isCompleted={currentStep > 3} />
//                     </div>
//                 </div>
//             </div>

//             {/* CONTENT */}
//             <div className="flex-1 overflow-y-auto p-4 md:p-8">
//                 <div className="max-w-4xl mx-auto">
//                     {currentStep === 1 && (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                             <div className="col-span-1">
//                                 <label className={labelClasses}>Sender First Name</label>
//                                 <InputField className={customInputClasses} id="FirstName" name="firstName" value={formData.firstName} placeholder="Sender Name" required={true} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
//                             </div>
//                             <div className="col-span-1">
//                                 <label className={labelClasses}>Sender Last Name</label>
//                                 <InputField className={customInputClasses} id="LastName" name="lastName" value={formData.lastName} placeholder="Sender Name" required={true} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
//                             </div>
//                             <div className="col-span-1 md:col-span-2">
//                                 <label className={labelClasses}>Email Address</label>
//                                 <InputField className={customInputClasses} id="email" name="email" value={formData.email} placeholder="sender@example.com" required={true} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
//                             </div>
//                         </div>
//                     )}

//                     {currentStep === 2 && (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                             <div className="col-span-1">
//                                 <label className={labelClasses}>My First Name</label>
//                                 <InputField className={customInputClasses} id="FirstName" name="firstName" value={formData.firstName} placeholder="My Name" required={true} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
//                             </div>
//                             <div className="col-span-1">
//                                 <label className={labelClasses}>My Last Name</label>
//                                 <InputField className={customInputClasses} id="LastName" name="lastName" value={formData.lastName} placeholder="My Name" required={true} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
//                             </div>
//                             <div className="col-span-1 md:col-span-2">
//                                 <label className={labelClasses}>Email Address</label>
//                                 <InputField className={customInputClasses} id="email" name="email" value={formData.email} placeholder="my@email.com" required={true} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
//                             </div>
//                         </div>
//                     )}

//                     {currentStep === 3 && (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                                 <div className="col-span-1">
//                                     <label className={labelClasses}>Package Name</label>
//                                     <InputField className={customInputClasses} id="packagename" name="packagename" value={formData.packagename} placeholder="e.g. Electronics" required={true} onChange={(e) => setFormData({ ...formData, packagename: e.target.value })} />
//                                 </div>
//                                 <div className="col-span-1">
//                                     <label className={labelClasses}>Weight (kg)</label>
//                                     <InputField className={customInputClasses} id="weight" name="weight" value={formData.weight} placeholder="0.00" required={true} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
//                                 </div>
//                                 <div className="col-span-1 md:col-span-2">
//                                     <label className={labelClasses}>Package Description</label>
//                                     <ReusableTextarea id="message" name="message" placeholder="Describe the contents..." rows={4} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:bg-white focus:ring-2 focus:ring-appBanner/20 outline-none transition-all text-black font-medium" />
//                                 </div>
//                             </div>

//                             {/* SUBMIT BUTTON MOVED HERE (End of Details Step) */}
//                             <div className="mt-8 pt-6 border-t border-gray-200">
//                                 <Button 
//                                     type="submit" 
//                                     onClick={handleSubmit} 
//                                     className="w-full py-4 text-base font-bold shadow-lg hover:shadow-xl hover:shadow-appBanner/20 transition-all transform hover:-translate-y-0.5 rounded-xl bg-appNav text-white"
//                                 >
//                                     SUBMIT REQUEST
//                                 </Button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* FOOTER */}
//             <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center shrink-0 z-30">
//                 <div className="w-32">
//                      {currentStep > 1 && (
//                         <Button type="button" onClick={handlePrevious} className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-900 w-full rounded-lg shadow-sm transition-colors text-sm py-2">
//                             &larr; Back
//                         </Button>
//                     )}
//                 </div>
//                 <div className="w-32">
//                     {/* Only show "Next" if NOT on the last step (Step 3) */}
//                     {currentStep < 3 && (
//                         <Button type="button" onClick={handleNext} className="w-full rounded-lg shadow-md hover:shadow-lg transition-all text-sm py-2">
//                             Next Step &rarr;
//                         </Button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default BannerStepForm2;
