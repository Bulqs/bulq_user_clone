"use client";
import React, { useState, useEffect } from 'react';
import InputField from '../inputs/InputField';
import ReusableTextarea from '../inputs/ReusableTextarea';
import Button from '../inputs/Button';
import LocationCard from '../locationcard/LocationCard';
import BookingPaymentModal from '../payment/BookingPaymentModal';
import { BADOBookingPayload, BookingResponseDTO } from '@/types/booking';
import { CountryDTO } from '@/types/user';
import { getSupportedCities, getSupportedCountries } from '@/lib/user/actions';
import { createDropOffBooking } from '@/lib/user/booking.actions';

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

const HUBS_BASE_URL = process.env.HUBS_BASE_URL;

const BannerStepForm3: React.FC = () => {
    
    // --- 1. STATE ---
    const [formData, setFormData] = useState<BADOBookingPayload>({
        // Sender
        senderFirstName: '', senderLastName: '', senderPhoneNumber: '', senderEmail: '',
        senderAddress: '', senderCity: '', senderCountry: '', senderState: '', 
        senderLga: 'N/A', senderPostCode: '000000',
        
        // Receiver
        receiverFirstname: '', receiverLastname: '', receiverPhoneNumber: '', receiverEmail: '',
        receiverAddress: '', receiverCity: '', receiverCountry: '', receiverState: '', 
        receiverLga: 'N/A', receiverPostCode: '000000',

        // Hub Details
        hubId: '', email: 'support@bulq.com', phoneNumber: '', 
        city: '', country: '', address: '', state: '', lga: '',
        
        // Appointment & Package
        appointmentDate: '', pickUpDate: '', pickUpTime: '', 
        package_name: '', package_description: '', packageImage: 'placeholder',
        weight: 0, length: 0, width: 0, height: 0,
        
        // Config
        shipmentType: 'EXPRESS', pickupType: 'BADO', shippingAmount: 0, vendor: 'Self', declaredValue: 0, 
        productCategory: 'GENERAL', hsCode: '0000', itemDescription: '', includeInsurance: false, promoCode: '', calculateShipping: true
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            try { setCountries(await getSupportedCountries() || []); } catch(e) {}
            try {
                const res = await fetch(`${HUBS_BASE_URL}/hubs/all"`, { headers: { 'accept': 'application/json' }, cache: 'no-store' });
                if (res.ok) setHubs(await res.json());
            } catch (e) { console.error(e); }
        };
        initData();
    }, []);
    
    // Load Cities: We look up Country Name using the stored Code to fetch cities
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

    const handleBookingSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (!formData.appointmentDate) throw new Error("Please select an appointment date.");
            if (!formData.hubId) throw new Error("Please select a Drop-off Hub.");

            const isoDate = new Date(formData.appointmentDate).toISOString().replace('Z', '');

            const finalPayload: BADOBookingPayload = {
                ...formData,
                itemDescription: formData.package_description,
                appointmentDate: isoDate,
                pickUpDate: isoDate.split('T')[0],
                pickUpTime: isoDate.split('T')[1].substring(0, 5)
            };

            console.log("🚀 Payload (Country Codes check):", { 
                sender: finalPayload.senderCountry, 
                receiver: finalPayload.receiverCountry 
            });

            const response = await createDropOffBooking(finalPayload);
            setBookingResponse(response);
            setShowPaymentModal(true);
        } catch (error: any) { alert(error.message || "Booking failed."); } 
        finally { setIsSubmitting(false); }
    };

    const handleNext = () => { if (currentStep < 3) setCurrentStep(prev => prev + 1); };
    const handlePrevious = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };
    const filteredHubs = hubs.filter(h => h.hubName.toLowerCase().includes(searchQuery.toLowerCase()) || h.city.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const customInputClasses = "w-full px-4 py-3 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-300 outline-none text-black font-semibold text-sm focus:bg-white transition-all";
    const labelClasses = "block text-[10px] font-bold text-gray-700 uppercase tracking-wide mb-1 ml-1 shadow-sm";

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col relative overflow-hidden">
            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {Object.keys(stepImages).map((step) => (
                    <div key={step} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${currentStep === Number(step) ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url(${stepImages[Number(step) as keyof typeof stepImages]})` }} />
                ))}
                <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]"></div>
            </div>

            <div className="bg-white/95 pt-3 pb-2 px-4 border-b border-gray-200 shrink-0 shadow-sm z-10 relative">
                <h2 className="text-lg font-extrabold text-appBlack">Drop Off Appointment</h2>
                <div className="flex gap-2 text-xs font-bold text-gray-400 mt-1">Step {currentStep} of 3</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 relative">
                <div className="max-w-4xl mx-auto">
                    {/* STEP 1 */}
                    {currentStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
                            <div>
                                <h3 className="mb-4 font-bold text-gray-800 border-b border-gray-300 pb-2">Sender Details (You)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                                    <div className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="senderFirstName" value={formData.senderFirstName} onChange={(e) => setFormData({...formData, senderFirstName: e.target.value})} /></div>
                                    <div className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="senderLastName" value={formData.senderLastName} onChange={(e) => setFormData({...formData, senderLastName: e.target.value})} /></div>
                                    <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="senderEmail" value={formData.senderEmail} onChange={(e) => setFormData({...formData, senderEmail: e.target.value})} /></div>
                                    <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Address</label><InputField className={customInputClasses} name="senderAddress" value={formData.senderAddress} onChange={(e) => setFormData({...formData, senderAddress: e.target.value})} /></div>
                                    
                                    {/* ✅ FIX: Capture Code, Show Name */}
                                    <div className="col-span-1">
                                        <label className={labelClasses}>Country</label>
                                        <InputField 
                                            className={customInputClasses} 
                                            name="senderCountry" 
                                            value={formData.senderCountry} 
                                            dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} 
                                            onChange={(e) => setFormData({...formData, senderCountry: e.target.value})} 
                                        />
                                    </div>
                                    
                                    <div className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="senderCity" value={formData.senderCity} dropdownOptions={senderCities} onChange={(e) => setFormData({...formData, senderCity: e.target.value})} /></div>
                                    <div className="col-span-1"><label className={labelClasses}>State/Province</label><InputField className={customInputClasses} name="senderState" value={formData.senderState} onChange={(e) => setFormData({...formData, senderState: e.target.value})} /></div>
                                    <div className="col-span-1"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="senderPhoneNumber" value={formData.senderPhoneNumber} onChange={(e) => setFormData({...formData, senderPhoneNumber: e.target.value})} /></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-4 font-bold text-gray-800 border-b border-gray-300 pb-2">Receiver Details (Destination)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                                    <div className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} name="receiverFirstname" value={formData.receiverFirstname} onChange={(e) => setFormData({...formData, receiverFirstname: e.target.value})} /></div>
                                    <div className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} name="receiverLastname" value={formData.receiverLastname} onChange={(e) => setFormData({...formData, receiverLastname: e.target.value})} /></div>
                                    <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} name="receiverEmail" value={formData.receiverEmail} onChange={(e) => setFormData({...formData, receiverEmail: e.target.value})} /></div>
                                    <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Address</label><InputField className={customInputClasses} name="receiverAddress" value={formData.receiverAddress} onChange={(e) => setFormData({...formData, receiverAddress: e.target.value})} /></div>
                                    
                                    {/* ✅ FIX: Capture Code, Show Name */}
                                    <div className="col-span-1">
                                        <label className={labelClasses}>Country</label>
                                        <InputField 
                                            className={customInputClasses} 
                                            name="receiverCountry" 
                                            value={formData.receiverCountry} 
                                            dropdownOptions={countries.map(c => ({ label: c.countryName, value: c.countryCode }))} 
                                            onChange={(e) => setFormData({...formData, receiverCountry: e.target.value})} 
                                        />
                                    </div>

                                    <div className="col-span-1"><label className={labelClasses}>City</label><InputField className={customInputClasses} name="receiverCity" value={formData.receiverCity} dropdownOptions={receiverCities} onChange={(e) => setFormData({...formData, receiverCity: e.target.value})} /></div>
                                    <div className="col-span-1"><label className={labelClasses}>State/Province</label><InputField className={customInputClasses} name="receiverState" value={formData.receiverState} onChange={(e) => setFormData({...formData, receiverState: e.target.value})} /></div>
                                    <div className="col-span-1"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} name="receiverPhoneNumber" value={formData.receiverPhoneNumber} onChange={(e) => setFormData({...formData, receiverPhoneNumber: e.target.value})} /></div>
                                    <div className="col-span-1"><label className={labelClasses}>LGA / County</label><InputField className={customInputClasses} name="receiverLga" value={formData.receiverLga} placeholder="Required" onChange={(e) => setFormData({...formData, receiverLga: e.target.value})} /></div>
                                    <div className="col-span-1"><label className={labelClasses}>Post Code</label><InputField className={customInputClasses} name="receiverPostCode" value={formData.receiverPostCode} placeholder="Required" onChange={(e) => setFormData({...formData, receiverPostCode: e.target.value})} /></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: SELECT HUB */}
                    {currentStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center">
                            <h3 className="w-full text-left mb-4 font-bold text-gray-800 border-b border-gray-300 pb-2">Select Drop-off Location</h3>
                            <input className="w-full pl-4 py-3 bg-white/90 border border-gray-300 rounded-xl mb-6 text-sm backdrop-blur-sm focus:ring-2 focus:ring-appBanner transition-all" placeholder="Search hubs by name, city or state..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredHubs.map((hub, index) => (
                                    <div key={hub.id} onClick={() => handleHubSelect(index)} className={`cursor-pointer rounded-xl border-2 p-1 transition-all ${selectedHubIndex === index ? 'border-appNav bg-blue-50/60 scale-[1.02] shadow-md' : 'border-gray-100 bg-white/80 hover:border-gray-300'}`}>
                                        <LocationCard title={hub.hubName} location={hub.city} address={hub.address} workingHours={hub.workHours.map(wh => ({ day: wh.day, hours: wh.time }))} phoneNumbers={hub.telephones.map(t => t.telephone)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PACKAGE & APPOINTMENT */}
                    {currentStep === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h3 className="mb-4 font-bold text-gray-800 border-b border-gray-300 pb-2">Package & Appointment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                                <div className="col-span-1"><label className={labelClasses}>Package Name</label><InputField className={customInputClasses} name="package_name" value={formData.package_name} required onChange={(e) => setFormData({...formData, package_name: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Category</label><InputField className={customInputClasses} name="productCategory" value={formData.productCategory} dropdownOptions={["GENERAL", "ELECTRONICS", "FASHION", "DOCUMENTS", "HEALTHCARE"]} onChange={(e) => setFormData({...formData, productCategory: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Vendor</label><InputField className={customInputClasses} name="vendor" value={formData.vendor} placeholder="Self" onChange={(e) => setFormData({...formData, vendor: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Shipment Type</label><InputField className={customInputClasses} name="shipmentType" value={formData.shipmentType} dropdownOptions={["EXPRESS", "STANDARD"]} onChange={(e) => setFormData({...formData, shipmentType: e.target.value})} /></div>
                                
                                <div className="col-span-1 md:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    <label className="block text-xs font-bold text-appNav uppercase mb-2">Drop-off Appointment</label>
                                    <InputField type="datetime-local" className={customInputClasses} name="appointmentDate" value={formData.appointmentDate} required onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} />
                                </div>
                                
                                <div className="col-span-1"><label className={labelClasses}>Weight (kg)</label><InputField type="number" className={customInputClasses} name="weight" value={formData.weight} required onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} /></div>
                                <div className="col-span-1 grid grid-cols-3 gap-2">
                                    <div><label className={labelClasses}>L (cm)</label><InputField type="number" className={customInputClasses} name="length" value={formData.length} onChange={(e) => setFormData({...formData, length: parseFloat(e.target.value)})} /></div>
                                    <div><label className={labelClasses}>W (cm)</label><InputField type="number" className={customInputClasses} name="width" value={formData.width} onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value)})} /></div>
                                    <div><label className={labelClasses}>H (cm)</label><InputField type="number" className={customInputClasses} name="height" value={formData.height} onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})} /></div>
                                </div>
                                <div className="col-span-1"><label className={labelClasses}>Declared Value</label><InputField type="number" className={customInputClasses} name="declaredValue" value={formData.declaredValue} required onChange={(e) => setFormData({...formData, declaredValue: parseFloat(e.target.value)})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>HS Code</label><InputField className={customInputClasses} name="hsCode" value={formData.hsCode} placeholder="Optional" onChange={(e) => setFormData({...formData, hsCode: e.target.value})} /></div>
                                <div className="col-span-1"><label className={labelClasses}>Promo Code</label><InputField className={customInputClasses} name="promoCode" value={formData.promoCode} placeholder="Optional" onChange={(e) => setFormData({...formData, promoCode: e.target.value})} /></div>
                                <div className="col-span-1 flex items-center pt-6"><input type="checkbox" id="ins3" className="w-5 h-5 text-appBanner rounded" checked={formData.includeInsurance} onChange={(e) => setFormData({...formData, includeInsurance: e.target.checked})} /><label htmlFor="ins3" className="ml-2 text-sm font-bold text-gray-600">Insurance?</label></div>
                                <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Description</label><ReusableTextarea name="package_description" rows={3} className="w-full px-4 py-3 rounded-lg bg-white/80 border border-gray-300" value={formData.package_description} onChange={(e: any) => setFormData({...formData, package_description: e.target.value})} /></div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <Button onClick={handleBookingSubmit} disabled={isSubmitting} className="w-full py-4 bg-appNav text-white rounded-xl shadow-lg hover:shadow-xl transition-all">{isSubmitting ? "Processing..." : "PAY & BOOK"}</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white/95 p-4 border-t border-gray-200 flex justify-between z-10 relative">
                <div className="w-32">{currentStep > 1 && <Button onClick={handlePrevious} className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">Back</Button>}</div>
                <div className="w-32">{currentStep < 3 && <Button onClick={handleNext} className="w-full bg-appNav text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Next</Button>}</div>
            </div>

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
// import { IoSearchOutline } from "react-icons/io5";
// import BookingPaymentModal from '../payment/BookingPaymentModal';
// import { BADOBookingPayload, BookingResponseDTO } from '@/types/booking';
// import { CountryDTO } from '@/types/user';
// import { getSupportedCities, getSupportedCountries } from '@/lib/user/actions';
// import { createDropOffBooking } from '@/lib/user/booking.actions';
// // import { 
// //     CountryDTO, getSupportedCountries, 
// //     BADOBookingPayload, createDropOffBooking, 
// //     BookingResponseDTO 
// // } from '@/lib/user/actions';

// const BannerStepForm3: React.FC = () => {
    
//     // --- 1. STATE MANAGEMENT ---

//     // Initial State matches BADOBookingPayload interface
//     const [formData, setFormData] = useState<BADOBookingPayload>({
//         // Sender (The User)
//         senderFirstName: '', senderLastName: '', senderPhoneNumber: '', senderEmail: '',
//         senderAddress: '', senderCity: '', senderCountry: '', senderState: '', senderLga: '',
//         senderPostCode: '', 
        
//         // Receiver (Required by DTO, even if drop off usually implies just sending)
//         receiverFirstname: '', receiverLastname: '', receiverPhoneNumber: '', receiverEmail: '',
//         receiverAddress: '', receiverCity: '', receiverCountry: '', receiverState: '', receiverLga: '',
//         receiverPostCode: '',

//         // Hub Details (Selected in Step 2)
//         email: '', phoneNumber: '', city: '', country: '', address: '', state: '', lga: '',
        
//         // Schedule
//         appointmentDate: '', 
//         pickUpDate: '', pickUpTime: '', 

//         // Package
//         package_name: '', package_description: '', packageImage: 'placeholder',
//         weight: 0, length: 0, width: 0, height: 0,
        
//         // Config
//         shipmentType: 'EXPRESS', 
//         pickupType: 'BADO', // Fixed for this form
//         shippingAmount: 0,
//         vendor: 'Self', declaredValue: 0, productCategory: 'General', hsCode: '', 
//         itemDescription: '', includeInsurance: false, promoCode: '', calculateShipping: true
//     });

//     // UI State
//     const [currentStep, setCurrentStep] = useState(1);
//     const [isSubmitting, setIsSubmitting] = useState(false);
    
//     // Data Loading State
//     const [countries, setCountries] = useState<CountryDTO[]>([]);
//     const [senderCities, setSenderCities] = useState<string[]>([]);
//     const [isLoadingSenderCities, setIsLoadingSenderCities] = useState(false);

//     // Hub Selection State
//     const [selectedHubIndex, setSelectedHubIndex] = useState<number | null>(null);
//     const [searchQuery, setSearchQuery] = useState("");

//     // Modal State
//     const [bookingResponse, setBookingResponse] = useState<BookingResponseDTO | null>(null);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);

//     // Mock Hub Data (Ideally this comes from an API /api/v1/hubs)
//     const hubs = [
//         { id: 1, title: "Bulq Lagos", city: "Ikeja", address: "123 Ikeja Road", state: "Lagos", email: "lagos@bulq.com", phone: "+234800000000", country: "Nigeria" },
//         { id: 2, title: "Bulq Abuja", city: "Abuja", address: "456 Central Area", state: "FCT", email: "abuja@bulq.com", phone: "+234811111111", country: "Nigeria" },
//         { id: 3, title: "Bulq London", city: "London", address: "789 Thames St", state: "London", email: "uk@bulq.com", phone: "+447000000000", country: "United Kingdom" }
//     ];

//     // --- 2. DATA FETCHING EFFECTS ---

//     // Fetch Countries on Mount
//     useEffect(() => {
//         const loadCountries = async () => {
//             try {
//                 const data = await getSupportedCountries();
//                 setCountries(data || []);
//             } catch (error) { console.error(error); }
//         };
//         loadCountries();
//     }, []);

//     // Fetch Cities when Sender Country changes
//     useEffect(() => {
//         const loadSenderCities = async () => {
//             if (!formData.senderCountry) { setSenderCities([]); return; }
//             setIsLoadingSenderCities(true);
//             try {
//                 const cities = await getSupportedCities(formData.senderCountry);
//                 setSenderCities(cities || []);
//             } catch (e) { console.error(e); } 
//             finally { setIsLoadingSenderCities(false); }
//         };
//         loadSenderCities();
//     }, [formData.senderCountry]);

//     // --- 3. HANDLERS ---

//     const handleHubSelect = (index: number) => {
//         setSelectedHubIndex(index);
//         const hub = hubs[index];
        
//         // Map selected Hub to formData
//         setFormData({
//             ...formData,
//             city: hub.city,
//             country: hub.country,
//             address: hub.address,
//             state: hub.state,
//             email: hub.email,
//             phoneNumber: hub.phone
//         });
//     };

//     const handleNext = () => { 
//         // Validation logic can go here
//         if (currentStep < 3) setCurrentStep(prev => prev + 1); 
//     };
    
//     const handlePrevious = () => { 
//         if (currentStep > 1) setCurrentStep(prev => prev - 1); 
//     };

//     const handleBookingSubmit = async () => {
//         if (!formData.appointmentDate) {
//             alert("Please select an appointment date.");
//             return;
//         }
        
//         setIsSubmitting(true);
//         try {
//             // Ensure Date is ISO String (Backend Requirement)
//             const dateObj = new Date(formData.appointmentDate);
//             const isoDate = dateObj.toISOString(); // 2026-01-04T05:06:05.796Z

//             const finalPayload = { 
//                 ...formData, 
//                 appointmentDate: isoDate,
//                 pickUpDate: isoDate.split('T')[0], // Fallback if needed
//                 pickUpTime: isoDate.split('T')[1].substring(0, 5)
//             };

//             // Call BADO API
//             const response = await createDropOffBooking(finalPayload);
            
//             console.log("Drop Off Booking Success:", response);
//             setBookingResponse(response);
//             setShowPaymentModal(true); // Open Payment Modal

//         } catch (error: any) {
//             console.error("BADO Error:", error);
//             alert(error.message || "Drop-off booking failed. Please check your details.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // Filter hubs based on search
//     const filteredHubs = hubs.filter(h => 
//         h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
//         h.city.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     // --- STYLES ---
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

//     return (
//         <div className="w-full h-full bg-gray-50 flex flex-col">
             
//              {/* HEADER */}
//              <div className="bg-white pt-3 pb-2 px-4 pr-12 md:pl-6 md:pr-16 border-b border-gray-200 shrink-0 shadow-sm z-20">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
//                     <div className="text-center md:text-left mb-2 md:mb-0">
//                         <h2 className="text-base md:text-lg font-extrabold text-appBlack tracking-tight">Drop Off</h2>
//                         <p className="text-[10px] text-appBanner font-medium uppercase tracking-wide">Book Appointment</p>
//                     </div>
//                     <div className="flex items-center justify-center w-full md:w-auto md:min-w-[200px]">
//                         <StepIndicator step={1} label="My Details" isActive={currentStep === 1} isCompleted={currentStep > 1} />
//                         <StepLine isCompleted={currentStep > 1} />
//                         <StepIndicator step={2} label="Select Hub" isActive={currentStep === 2} isCompleted={currentStep > 2} />
//                         <StepLine isCompleted={currentStep > 2} />
//                         <StepIndicator step={3} label="Package" isActive={currentStep === 3} isCompleted={currentStep > 3} />
//                     </div>
//                 </div>
//             </div>

//             {/* SCROLLABLE CONTENT */}
//             <div className="flex-1 overflow-y-auto p-4 md:p-8">
//                 <div className="max-w-4xl mx-auto">
                    
//                     {/* --- STEP 1: SENDER (ME) --- */}
//                     {currentStep === 1 && (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                             <div className="col-span-1"><label className={labelClasses}>First Name</label><InputField className={customInputClasses} id="sfname" name="senderFirstName" value={formData.senderFirstName} placeholder="John" required onChange={(e) => setFormData({...formData, senderFirstName: e.target.value})} /></div>
//                             <div className="col-span-1"><label className={labelClasses}>Last Name</label><InputField className={customInputClasses} id="slname" name="senderLastName" value={formData.senderLastName} placeholder="Doe" required onChange={(e) => setFormData({...formData, senderLastName: e.target.value})} /></div>
                            
//                             <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Email</label><InputField className={customInputClasses} id="semail" name="senderEmail" value={formData.senderEmail} placeholder="email@example.com" required onChange={(e) => setFormData({...formData, senderEmail: e.target.value})} /></div>
//                             <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Address</label><InputField className={customInputClasses} id="saddr" name="senderAddress" value={formData.senderAddress} placeholder="Address" required onChange={(e) => setFormData({...formData, senderAddress: e.target.value})} /></div>
                            
//                             {/* Dynamic Country */}
//                             <div className="col-span-1">
//                                 <label className={labelClasses}>Country</label>
//                                 <InputField 
//                                     className={customInputClasses} id="scountry" name="senderCountry" 
//                                     value={formData.senderCountry} placeholder="Country" 
//                                     dropdownOptions={countries.map(c => c.countryName || "")} 
//                                     onChange={(e) => setFormData({...formData, senderCountry: e.target.value, senderCity: ''})} 
//                                 />
//                             </div>

//                             {/* Dynamic City */}
//                             <div className="col-span-1">
//                                 <label className={labelClasses}>City</label>
//                                 <InputField 
//                                     className={customInputClasses} id="scity" name="senderCity" 
//                                     value={formData.senderCity} 
//                                     placeholder={isLoadingSenderCities ? "Loading..." : "City"} 
//                                     dropdownOptions={senderCities}
//                                     disabled={!formData.senderCountry}
//                                     onChange={(e) => setFormData({...formData, senderCity: e.target.value})} 
//                                 />
//                             </div>

//                             <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Phone</label><InputField className={customInputClasses} id="sphone" name="senderPhoneNumber" value={formData.senderPhoneNumber} placeholder="+123..." required onChange={(e) => setFormData({...formData, senderPhoneNumber: e.target.value})} /></div>
//                         </div>
//                     )}

//                     {/* --- STEP 2: SELECT HUB --- */}
//                     {currentStep === 2 && (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center">
//                             <div className="w-full max-w-md relative mb-6">
//                                 <input className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-appNav transition-all text-sm" placeholder="Search for a hub..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//                                 <IoSearchOutline className="absolute left-3 top-3.5 text-gray-400 text-xl" />
//                             </div>
                            
//                             <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {filteredHubs.map((hub, index) => (
//                                     <div 
//                                         key={hub.id} 
//                                         onClick={() => handleHubSelect(index)}
//                                         className={`cursor-pointer transform transition-all rounded-xl border-2 p-1 ${selectedHubIndex === index ? 'border-appNav scale-[1.02] shadow-lg bg-blue-50/20' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'}`}
//                                     >
//                                         <LocationCard
//                                             title={hub.title}
//                                             location={hub.city}
//                                             address={hub.address}
//                                             workingHours={[{ day: "Mon-Fri", hours: "8am-5pm" }]}
//                                             phoneNumbers={[hub.phone]}
//                                         />
//                                         {selectedHubIndex === index && (
//                                             <div className="text-center text-xs font-bold text-appNav py-1 border-t border-gray-100 mt-2">
//                                                 ✓ Selected
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* --- STEP 3: PACKAGE & APPOINTMENT --- */}
//                     {currentStep === 3 && (
//                         <div className="animate-in fade-in slide-in-from-right-4 duration-300">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
//                                 <div className="col-span-1"><label className={labelClasses}>Package Name</label><InputField className={customInputClasses} id="pname" name="package_name" value={formData.package_name} placeholder="Item Name" required onChange={(e) => setFormData({...formData, package_name: e.target.value})} /></div>
//                                 <div className="col-span-1"><label className={labelClasses}>Shipment Type</label><InputField className={customInputClasses} id="stype" name="shipmentType" value={formData.shipmentType} dropdownOptions={["EXPRESS", "STANDARD", "ECONOMY"]} onChange={(e) => setFormData({...formData, shipmentType: e.target.value})} /></div>
                                
//                                 {/* Appointment Date */}
//                                 <div className="col-span-1 md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
//                                     <label className="block text-xs font-bold text-appNav uppercase mb-2">Schedule Appointment</label>
//                                     <InputField type="datetime-local" className="w-full px-4 py-2 bg-white rounded-lg border border-blue-200 text-sm" id="appt" name="appointmentDate" value={formData.appointmentDate} required onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})} />
//                                     <p className="text-[10px] text-gray-500 mt-1">Please select a date and time to drop off your package.</p>
//                                 </div>
                                
//                                 <div className="col-span-1"><label className={labelClasses}>Weight (kg)</label><InputField type="number" className={customInputClasses} id="w" name="weight" value={formData.weight} placeholder="0" required onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} /></div>
//                                 <div className="col-span-1 grid grid-cols-3 gap-2">
//                                     <div><label className={labelClasses}>L (cm)</label><InputField type="number" className={customInputClasses} id="l" name="length" value={formData.length} placeholder="0" onChange={(e) => setFormData({...formData, length: parseFloat(e.target.value)})} /></div>
//                                     <div><label className={labelClasses}>W (cm)</label><InputField type="number" className={customInputClasses} id="wi" name="width" value={formData.width} placeholder="0" onChange={(e) => setFormData({...formData, width: parseFloat(e.target.value)})} /></div>
//                                     <div><label className={labelClasses}>H (cm)</label><InputField type="number" className={customInputClasses} id="h" name="height" value={formData.height} placeholder="0" onChange={(e) => setFormData({...formData, height: parseFloat(e.target.value)})} /></div>
//                                 </div>

//                                 <div className="col-span-1"><label className={labelClasses}>Declared Value</label><InputField type="number" className={customInputClasses} id="dval" name="declaredValue" value={formData.declaredValue} placeholder="0.00" onChange={(e) => setFormData({...formData, declaredValue: parseFloat(e.target.value)})} /></div>
                                
//                                 <div className="col-span-1 md:col-span-2"><label className={labelClasses}>Description</label><ReusableTextarea id="msg" name="package_description" placeholder="Contents..." rows={3} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300" value={formData.package_description} onChange={(e: any) => setFormData({...formData, package_description: e.target.value})} /></div>
//                             </div>
                            
//                             {/* SUBMIT */}
//                             <div className="mt-8 pt-6 border-t border-gray-200">
//                                 <Button 
//                                     type="submit" 
//                                     onClick={handleBookingSubmit} 
//                                     disabled={isSubmitting} 
//                                     className={`w-full py-4 text-base font-bold shadow-lg rounded-xl text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-appNav hover:shadow-xl hover:-translate-y-0.5 transition-all'}`}
//                                 >
//                                     {isSubmitting ? "BOOKING..." : "CONFIRM DROP OFF & PAY"}
//                                 </Button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* FOOTER NAV */}
//             <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center shrink-0 z-30">
//                 <div className="w-32">{currentStep > 1 && <Button type="button" onClick={handlePrevious} className="bg-white text-gray-700 border border-gray-300 w-full rounded-lg text-sm py-2">&larr; Back</Button>}</div>
//                 <div className="w-32">{currentStep < 3 && <Button type="button" onClick={handleNext} className="w-full rounded-lg shadow-md text-sm py-2">Next Step &rarr;</Button>}</div>
//             </div>

//             {/* PAYMENT MODAL */}
//             {showPaymentModal && bookingResponse && (
//                 <BookingPaymentModal 
//                     bookingData={bookingResponse}
//                     customerEmail={formData.senderEmail}
//                     customerName={`${formData.senderFirstName} ${formData.senderLastName}`}
//                     onClose={() => setShowPaymentModal(false)}
//                 />
//             )}
//         </div>
//     );
// }

// export default BannerStepForm3;
// // "use client";
// // import React, { useState } from 'react';
// // import InputField from '../inputs/InputField';
// // import ReusableTextarea from '../inputs/ReusableTextarea';
// // import Button from '../inputs/Button';
// // import WhoToWhoHeading from '../inputs/WhoToWhoHeading';
// // import LocationCard from '../locationcard/LocationCard';
// // import { IoSearchOutline } from "react-icons/io5";

// // const BannerStepForm3: React.FC = () => {
// //     const [currentStep, setCurrentStep] = useState(1);
    
// //     const [formData, setFormData] = useState({
// //         lastName: '', firstName: '', email: '', phone: '', address: '',
// //         name: '', cardName: '', cardNumber: '', cardDate: '', cardCVC: '',
// //         cardOTP: '', country: '', city: '', packagename: '', weight: '',
// //     });

// //     const workingHours = [
// //         { day: "Monday", hours: "8am - 5pm" },
// //         { day: "Tuesday", hours: "8am - 5pm" },
// //         { day: "Wednesday", hours: "8am - 5pm" },
// //         { day: "Thursday", hours: "8am - 5pm" },
// //         { day: "Friday", hours: "8am - 5pm" },
// //         { day: "Saturday", hours: "8am - 5pm" },
// //     ];
// //     const phoneNumbers = ["+234 807 8789 675"];

// //     const handleNext = () => {
// //         // Stop at step 3
// //         if (currentStep < 3) setCurrentStep((prev) => prev + 1);
// //     };
    
// //     const handlePrevious = () => { 
// //         if (currentStep > 1) setCurrentStep((prev) => prev - 1); 
// //     };
    
// //     const handlePaymentClick = () => { 
// //         console.log("Processing Drop Off Payment...");
// //     };

// //     // Styling constants
// //     const customInputClasses = "w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:bg-white focus:ring-2 focus:ring-appBanner/20 focus:border-appBanner outline-none transition-all duration-200 ease-in-out hover:border-gray-400 placeholder-gray-400 text-black font-semibold shadow-sm";
// //     const labelClasses = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1";

// //     const StepIndicator = ({ step, label, isActive, isCompleted }: { step: number, label: string, isActive: boolean, isCompleted: boolean }) => (
// //         <div className="flex flex-col items-center z-10">
// //             <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-300 border-2 
// //                 ${isActive ? 'bg-appNav text-white border-appNav scale-110 shadow-md ring-2 ring-appNav/20' : 
// //                   isCompleted ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-300 border-gray-200'}`}>
// //                 {isCompleted ? '✓' : step}
// //             </div>
// //             <span className={`hidden md:block mt-1 text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-appNav' : 'text-gray-300'}`}>{label}</span>
// //         </div>
// //     );

// //     const StepLine = ({ isCompleted }: { isCompleted: boolean }) => (
// //         <div className={`flex-1 h-[2px] mx-1 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gray-100'}`}></div>
// //     );

// //     return (
// //         <div className="w-full h-full bg-gray-50 flex flex-col">
             
// //              {/* HEADER */}
// //              <div className="bg-white pt-3 pb-2 px-4 pr-12 md:pl-6 md:pr-16 border-b border-gray-200 shrink-0 shadow-sm z-20">
// //                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
// //                     <div className="text-center md:text-left mb-2 md:mb-0">
// //                         <h2 className="text-base md:text-lg font-extrabold text-appBlack tracking-tight">Drop Off</h2>
// //                         <p className="text-[10px] text-appBanner font-medium uppercase tracking-wide">Book a Drop Off Service</p>
// //                     </div>
                    
// //                     {/* Stepper reduced to 3 steps */}
// //                     <div className="flex items-center justify-center w-full md:w-auto md:min-w-[200px]">
// //                         <StepIndicator step={1} label="My Details" isActive={currentStep === 1} isCompleted={currentStep > 1} />
// //                         <StepLine isCompleted={currentStep > 1} />
// //                         <StepIndicator step={2} label="Hub" isActive={currentStep === 2} isCompleted={currentStep > 2} />
// //                         <StepLine isCompleted={currentStep > 2} />
// //                         <StepIndicator step={3} label="Details" isActive={currentStep === 3} isCompleted={currentStep > 3} />
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* CONTENT */}
// //             <div className="flex-1 overflow-y-auto p-4 md:p-8">
// //                 <div className="max-w-4xl mx-auto">
// //                     {currentStep === 1 && (
// //                         <div className="animate-in fade-in slide-in-from-right-4 duration-300 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
// //                             <div className="col-span-1">
// //                                 <label className={labelClasses}>First Name</label>
// //                                 <InputField className={customInputClasses} id="FirstName" name="firstName" value={formData.firstName} placeholder="Enter your firstname" required={true} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
// //                             </div>
// //                             <div className="col-span-1">
// //                                 <label className={labelClasses}>Last Name</label>
// //                                 <InputField className={customInputClasses} id="LastName" name="lastName" value={formData.lastName} placeholder="Enter your lastname" required={true} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
// //                             </div>
// //                             <div className="col-span-1 md:col-span-2">
// //                                 <label className={labelClasses}>Email</label>
// //                                 <InputField className={customInputClasses} id="email" name="email" value={formData.email} placeholder="Enter your email" required={true} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
// //                             </div>
// //                             <div className="col-span-1 md:col-span-2">
// //                                 <label className={labelClasses}>Phone</label>
// //                                 <InputField className={customInputClasses} id="phone" name="phone" value={formData.phone} placeholder="Enter your phone" required={true} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
// //                             </div>
// //                         </div>
// //                     )}

// //                     {currentStep === 2 && (
// //                         <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center">
// //                             <div className="w-full max-w-md relative mb-6">
// //                                 <input className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-appNav transition-all shadow-sm text-black placeholder-gray-400" placeholder="Search for a hub..." />
// //                                 <IoSearchOutline className="absolute left-3 top-3.5 text-gray-400 text-xl" />
// //                             </div>
                            
// //                             <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
// //                                 {[1, 2, 3, 4].map((item) => (
// //                                     <div key={item} className="transform transition-all hover:scale-[1.01] hover:shadow-lg rounded-xl border border-gray-100 bg-white">
// //                                         <LocationCard
// //                                             title="Bulq Lagos"
// //                                             location="Ikeja"
// //                                             address="123 Ikeja Road, Lagos Island"
// //                                             workingHours={workingHours}
// //                                             phoneNumbers={phoneNumbers}
// //                                         />
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         </div>
// //                     )}

// //                     {currentStep === 3 && (
// //                         <div className="animate-in fade-in slide-in-from-right-4 duration-300">
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
// //                                 <div className="col-span-1">
// //                                     <label className={labelClasses}>Package Name</label>
// //                                     <InputField className={customInputClasses} id="packagename" name="packagename" value={formData.packagename} placeholder="e.g. Electronics" required={true} onChange={(e) => setFormData({ ...formData, packagename: e.target.value })} />
// //                                 </div>
// //                                 <div className="col-span-1">
// //                                     <label className={labelClasses}>Weight (kg)</label>
// //                                     <InputField className={customInputClasses} id="weight" name="weight" value={formData.weight} placeholder="0.00" required={true} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
// //                                 </div>
// //                                 <div className="col-span-1 md:col-span-2">
// //                                     <label className={labelClasses}>Package Description</label>
// //                                     <ReusableTextarea id="message" name="message" placeholder="Describe the contents..." rows={4} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:bg-white focus:ring-2 focus:ring-appBanner/20 outline-none transition-all text-black font-medium" />
// //                                 </div>
// //                             </div>

// //                             {/* SUBMIT BUTTON MOVED HERE (End of Step 3) */}
// //                             <div className="mt-8 pt-6 border-t border-gray-200">
// //                                 <Button 
// //                                     type="submit" 
// //                                     onClick={handlePaymentClick} 
// //                                     className="w-full py-4 text-base font-bold shadow-lg hover:shadow-xl hover:shadow-appBanner/20 transition-all transform hover:-translate-y-0.5 rounded-xl bg-appNav text-white"
// //                                 >
// //                                     PAY NOW & SHIP
// //                                 </Button>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>
// //             </div>

// //             {/* FOOTER */}
// //             <div className="bg-white p-4 border-t border-gray-200 flex justify-between items-center shrink-0 z-30">
// //                 <div className="w-32">
// //                      {currentStep > 1 && (
// //                         <Button type="button" onClick={handlePrevious} className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-900 w-full rounded-lg shadow-sm transition-colors text-sm py-2">
// //                             &larr; Back
// //                         </Button>
// //                     )}
// //                 </div>
// //                 <div className="w-32">
// //                     {/* Only show Next if not on last step (3) */}
// //                     {currentStep < 3 && (
// //                         <Button type="button" onClick={handleNext} className="w-full rounded-lg shadow-md hover:shadow-lg transition-all text-sm py-2">
// //                             Next Step &rarr;
// //                         </Button>
// //                     )}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default BannerStepForm3;
