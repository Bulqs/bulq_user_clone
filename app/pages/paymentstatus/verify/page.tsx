"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyPaymentStatus } from '@/lib/user/transaction.actions';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
    CheckCircle2, 
    Download, 
    AlertTriangle, 
    Home, 
    Package, 
    Calendar, 
    CreditCard, 
    ArrowRight,
    FileText 
} from 'lucide-react';

// 1. Move the main logic into an inner component
function PaymentVerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const bookingId = searchParams.get('id');
    const paymentRef = searchParams.get('reference') || searchParams.get('trxref');

    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [error, setError] = useState("");
    
    // Ref points to the container wrapping BOTH the receipt and the policy
    const receiptRef = useRef<HTMLDivElement>(null);

    // --- LOGIC ---
    useEffect(() => {
        if (!bookingId) {
            setError("Invalid verification link. Missing Booking ID.");
            setLoading(false);
            return;
        }

        const verify = async () => {
            try {
                const response = await verifyPaymentStatus(bookingId);
                
                // Logic: Amount Fallback + "true" string bug handler
                const finalAmount = response.amountPaid ?? Number(response.amount);
                const isSuccessStatus = response.success === true || 
                                        response.status === 'SUCCESSFUL' || 
                                        response.status === 'PAID' || 
                                        response.status === 'true'; 

                if (isSuccessStatus && !isNaN(finalAmount) && finalAmount > 0) {
                    setVerified(true);
                    setBookingDetails({
                        ...response,
                        amountPaid: finalAmount,
                        completedAt: response.completedAt || new Date().toISOString()
                    });
                } else {
                    setVerified(false);
                    setError(`Verification Failed. Status: ${response.status}`);
                }
            } catch (err: any) {
                console.error("Verification Error:", err);
                setError(err.message || "Failed to verify payment.");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [bookingId, paymentRef]);

    // --- MULTI-PAGE PDF GENERATOR ---
    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return;
        
        try {
            // 1. Capture the full height of the container
            const canvas = await html2canvas(receiptRef.current, { 
                scale: 2, 
                backgroundColor: '#ffffff',
                useCORS: true 
            });

            const imgData = canvas.toDataURL('image/png');
            
            // 2. Setup A4 dimensions (mm)
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210;
            const pageHeight = 297;
            
            // 3. Calculate dimensions of the image on the PDF
            const imgWidth = pageWidth; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            // 4. Add First Page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // 5. Loop to add extra pages if content is long
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight; // Shift image up
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position - heightLeft - 297, imgWidth, imgHeight); 
                // Note: The positioning logic for slicing images in jsPDF can be tricky. 
                // A simpler visual approach is simply shifting the negative top margin:
                pdf.addImage(imgData, 'PNG', 0, -(pageHeight * (Math.ceil(imgHeight / pageHeight) - Math.ceil(heightLeft / pageHeight))), imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            pdf.save(`Bulq-Receipt-${bookingDetails?.transactionId || 'Invoice'}.pdf`);
        } catch (err) {
            console.error("PDF Error", err);
            alert("Could not generate PDF. Please try printing the page.");
        }
    };

    // --- LOADING ---
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <h2 className="text-xl font-bold text-gray-800 mt-6 animate-pulse">Confirming Payment...</h2>
            </div>
        );
    }

    // --- ERROR ---
    if (!verified || error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                    <AlertTriangle className="text-red-500 w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mb-3">Retry</button>
                    <button onClick={() => router.push('/pages/home')} className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl">Return to Dashboard</button>
                </div>
            </div>
        );
    }

    // --- SUCCESS (RECEIPT + POLICY) ---
    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
            
            {/* Top Navigation */}
            <div className="w-full max-w-[800px] flex justify-between items-center mb-6">
                <button 
                    onClick={() => router.push('/pages/newuser')} 
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                    <Home size={16} /> Dashboard
                </button>
                <button 
                    onClick={handleDownloadPDF} 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
                >
                    <Download size={16} /> Download Full Receipt
                </button>
            </div>

            {/* MAIN PRINTABLE CONTAINER */}
            <div ref={receiptRef} className="bg-white w-full max-w-[800px] rounded-3xl shadow-xl overflow-hidden relative border border-gray-200">
                
                {/* === PART 1: PAYMENT SUCCESS CARD === */}
                <div className="relative">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-center text-white">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Payment Successful</h1>
                            <p className="text-blue-100 text-sm mt-1">Thank you for shipping with Bulq</p>
                        </div>
                    </div>

                    {/* Receipt Details */}
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center border-b border-dashed border-gray-200 pb-6 mb-6">
                            <div className="text-center md:text-left mb-4 md:mb-0">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Paid</p>
                                <p className="text-4xl font-extrabold text-gray-900">
                                    <span className="text-xl text-gray-400 font-medium align-top mr-1">{bookingDetails?.currency}</span>
                                    {bookingDetails?.amountPaid?.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold border border-green-200 tracking-wide">
                                PAYMENT CONFIRMED
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <Calendar size={18} />
                                        <span className="text-sm">Date</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {new Date(bookingDetails?.completedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <CreditCard size={18} />
                                        <span className="text-sm">Ref</span>
                                    </div>
                                    <span className="text-xs font-mono font-medium text-gray-600">
                                        {bookingDetails?.providerReference || paymentRef || "N/A"}
                                    </span>
                                </div>
                            </div>

                            {/* Tracking Box */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Tracking Number</p>
                                <p className="text-xl font-black text-slate-800 tracking-wider font-mono mb-2">
                                    {bookingDetails?.transactionId || "BQ-PENDING"}
                                </p>
                                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                                     <QRCodeSVG 
                                        value={bookingDetails?.transactionId || "PENDING"} 
                                        size={80}
                                        level="M"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === PART 2: POLICY & TERMS (Footer) === */}
                <div className="bg-slate-50 border-t-4 border-slate-200 p-8 md:p-12 text-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="text-slate-400" size={24} />
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Shipping Policy & Terms</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-justify">
                        
                        {/* Column 1 */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.1 Package Acceptance Policy</h3>
                                <p className="mb-1"><span className="font-semibold">Permitted Items:</span> Clothing, books, electronics, gadgets, accessories, household goods. Items below $5000 declared value.</p>
                                <p><span className="font-semibold text-red-500">Restricted (Phase 1):</span> Perishables, Gold, Cash, Liquids, Explosives, Flammable items. Food is currently under review.</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.2 Intake Checks & Tagging</h3>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Inspected for external damage upon arrival.</li>
                                    <li>Weighed, photographed, scanned, and assigned a unique barcode label.</li>
                                    <li>Logged with user ID and timestamp in inventory.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.3 Unshippable Items</h3>
                                <p>Items violating policy are held for 14 days then returned/discarded. Unclaimed items (60+ days) attract penalties or auction.</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.4 Security & Mitigation</h3>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>24/7 Warehouse surveillance.</li>
                                    <li>Staff background checks & access monitoring.</li>
                                    <li>Barcode-based tracking & random audits.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.5 Repacking & Consolidation</h3>
                                <p>Repacking is performed to save costs. Fragile items are double-wrapped. Consolidations are video-recorded for verification.</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.6 Delivery Scheduling</h3>
                                <p>Currently capped at Monthly Deliveries (MVP). Max orders: 10 packages or 30kg. Future tiers will unlock weekly/bi-weekly options.</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.7 Insurance & Liability</h3>
                                <p>Goods-in-Transit Insurance included up to $500. Additional coverage available at checkout. Liability waivers accepted on transaction.</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.8 Operational Tools</h3>
                                <p>Handheld barcode scanners, integrated tracking software, and weight mismatch alerts ensure accuracy.</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.9 Enforcement</h3>
                                <p>Users acknowledge liability and customs compliance. Penalties for violations include fines, confiscation, or account suspension.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
                        <p>© {new Date().getFullYear()} Bulq Logistics. All rights reserved. By using our service, you agree to the terms above.</p>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-xs text-gray-400">
                Need help? <a href="#" className="text-blue-600 underline hover:text-black">Contact Support</a>
            </p>
        </div>
    );
}

// 2. Export the main page component wrapped in Suspense
export default function PaymentVerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <h2 className="text-xl font-bold text-gray-800 mt-6 animate-pulse">Loading verification data...</h2>
            </div>
        }>
            <PaymentVerifyContent />
        </Suspense>
    );
}

// "use client";

// import React, { useEffect, useState, useRef } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { verifyPaymentStatus } from '@/lib/user/transaction.actions';
// import { QRCodeSVG } from 'qrcode.react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { 
//     CheckCircle2, 
//     Download, 
//     AlertTriangle, 
//     Home, 
//     Package, 
//     Calendar, 
//     CreditCard, 
//     ArrowRight,
//     FileText 
// } from 'lucide-react';

// export default function PaymentVerifyPage() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
    
//     const bookingId = searchParams.get('id');
//     const paymentRef = searchParams.get('reference') || searchParams.get('trxref');

//     const [loading, setLoading] = useState(true);
//     const [verified, setVerified] = useState(false);
//     const [bookingDetails, setBookingDetails] = useState<any>(null);
//     const [error, setError] = useState("");
    
//     // Ref points to the container wrapping BOTH the receipt and the policy
//     const receiptRef = useRef<HTMLDivElement>(null);

//     // --- LOGIC ---
//     useEffect(() => {
//         if (!bookingId) {
//             setError("Invalid verification link. Missing Booking ID.");
//             setLoading(false);
//             return;
//         }

//         const verify = async () => {
//             try {
//                 const response = await verifyPaymentStatus(bookingId);
                
//                 // Logic: Amount Fallback + "true" string bug handler
//                 const finalAmount = response.amountPaid ?? Number(response.amount);
//                 const isSuccessStatus = response.success === true || 
//                                         response.status === 'SUCCESSFUL' || 
//                                         response.status === 'PAID' || 
//                                         response.status === 'true'; 

//                 if (isSuccessStatus && !isNaN(finalAmount) && finalAmount > 0) {
//                     setVerified(true);
//                     setBookingDetails({
//                         ...response,
//                         amountPaid: finalAmount,
//                         completedAt: response.completedAt || new Date().toISOString()
//                     });
//                 } else {
//                     setVerified(false);
//                     setError(`Verification Failed. Status: ${response.status}`);
//                 }
//             } catch (err: any) {
//                 console.error("Verification Error:", err);
//                 setError(err.message || "Failed to verify payment.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         verify();
//     }, [bookingId, paymentRef]);

//     // --- MULTI-PAGE PDF GENERATOR ---
//     const handleDownloadPDF = async () => {
//         if (!receiptRef.current) return;
        
//         try {
//             // 1. Capture the full height of the container
//             const canvas = await html2canvas(receiptRef.current, { 
//                 scale: 2, 
//                 backgroundColor: '#ffffff',
//                 useCORS: true 
//             });

//             const imgData = canvas.toDataURL('image/png');
            
//             // 2. Setup A4 dimensions (mm)
//             const pdf = new jsPDF('p', 'mm', 'a4');
//             const pageWidth = 210;
//             const pageHeight = 297;
            
//             // 3. Calculate dimensions of the image on the PDF
//             const imgWidth = pageWidth; 
//             const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
//             let heightLeft = imgHeight;
//             let position = 0;

//             // 4. Add First Page
//             pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;

//             // 5. Loop to add extra pages if content is long
//             while (heightLeft >= 0) {
//                 position = heightLeft - imgHeight; // Shift image up
//                 pdf.addPage();
//                 pdf.addImage(imgData, 'PNG', 0, position - heightLeft - 297, imgWidth, imgHeight); 
//                 // Note: The positioning logic for slicing images in jsPDF can be tricky. 
//                 // A simpler visual approach is simply shifting the negative top margin:
//                 pdf.addImage(imgData, 'PNG', 0, -(pageHeight * (Math.ceil(imgHeight / pageHeight) - Math.ceil(heightLeft / pageHeight))), imgWidth, imgHeight);
//                 heightLeft -= pageHeight;
//             }
            
//             // Alternatively, a simpler loop for standard slicing:
//             /*
//             let pageIdx = 0;
//             while (heightLeft > 0) {
//                 if(pageIdx > 0) pdf.addPage();
//                 pdf.addImage(imgData, 'PNG', 0, -(pageHeight * pageIdx), imgWidth, imgHeight);
//                 heightLeft -= pageHeight;
//                 pageIdx++;
//             }
//             */

//             pdf.save(`Bulq-Receipt-${bookingDetails?.transactionId || 'Invoice'}.pdf`);
//         } catch (err) {
//             console.error("PDF Error", err);
//             alert("Could not generate PDF. Please try printing the page.");
//         }
//     };

//     // --- LOADING ---
//     if (loading) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//                 <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
//                 <h2 className="text-xl font-bold text-gray-800 mt-6 animate-pulse">Confirming Payment...</h2>
//             </div>
//         );
//     }

//     // --- ERROR ---
//     if (!verified || error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//                 <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100 relative overflow-hidden">
//                     <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
//                     <AlertTriangle className="text-red-500 w-12 h-12 mx-auto mb-4" />
//                     <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
//                     <p className="text-gray-500 mb-8">{error}</p>
//                     <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mb-3">Retry</button>
//                     <button onClick={() => router.push('/pages/home')} className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl">Return to Dashboard</button>
//                 </div>
//             </div>
//         );
//     }

//     // --- SUCCESS (RECEIPT + POLICY) ---
//     return (
//         <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
            
//             {/* Top Navigation */}
//             <div className="w-full max-w-[800px] flex justify-between items-center mb-6">
//                 <button 
//                     onClick={() => router.push('/pages/newuser')} 
//                     className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
//                 >
//                     <Home size={16} /> Dashboard
//                 </button>
//                 <button 
//                     onClick={handleDownloadPDF} 
//                     className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
//                 >
//                     <Download size={16} /> Download Full Receipt
//                 </button>
//             </div>

//             {/* MAIN PRINTABLE CONTAINER */}
//             <div ref={receiptRef} className="bg-white w-full max-w-[800px] rounded-3xl shadow-xl overflow-hidden relative border border-gray-200">
                
//                 {/* === PART 1: PAYMENT SUCCESS CARD === */}
//                 <div className="relative">
//                     {/* Header */}
//                     <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-center text-white">
//                         <div className="flex flex-col items-center">
//                             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
//                                 <CheckCircle2 className="w-10 h-10 text-green-500" />
//                             </div>
//                             <h1 className="text-3xl font-bold tracking-tight">Payment Successful</h1>
//                             <p className="text-blue-100 text-sm mt-1">Thank you for shipping with Bulq</p>
//                         </div>
//                     </div>

//                     {/* Receipt Details */}
//                     <div className="p-8">
//                         <div className="flex flex-col md:flex-row justify-between items-center border-b border-dashed border-gray-200 pb-6 mb-6">
//                             <div className="text-center md:text-left mb-4 md:mb-0">
//                                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Paid</p>
//                                 <p className="text-4xl font-extrabold text-gray-900">
//                                     <span className="text-xl text-gray-400 font-medium align-top mr-1">{bookingDetails?.currency}</span>
//                                     {bookingDetails?.amountPaid?.toLocaleString()}
//                                 </p>
//                             </div>
//                             <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold border border-green-200 tracking-wide">
//                                 PAYMENT CONFIRMED
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-4">
//                                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                                     <div className="flex items-center gap-3 text-gray-500">
//                                         <Calendar size={18} />
//                                         <span className="text-sm">Date</span>
//                                     </div>
//                                     <span className="text-sm font-semibold text-gray-900">
//                                         {new Date(bookingDetails?.completedAt).toLocaleDateString()}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                                     <div className="flex items-center gap-3 text-gray-500">
//                                         <CreditCard size={18} />
//                                         <span className="text-sm">Ref</span>
//                                     </div>
//                                     <span className="text-xs font-mono font-medium text-gray-600">
//                                         {bookingDetails?.providerReference || paymentRef || "N/A"}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Tracking Box */}
//                             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center">
//                                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Tracking Number</p>
//                                 <p className="text-xl font-black text-slate-800 tracking-wider font-mono mb-2">
//                                     {bookingDetails?.transactionId || "BQ-PENDING"}
//                                 </p>
//                                 <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
//                                      <QRCodeSVG 
//                                         value={bookingDetails?.transactionId || "PENDING"} 
//                                         size={80}
//                                         level="M"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* === PART 2: POLICY & TERMS (Footer) === */}
//                 <div className="bg-slate-50 border-t-4 border-slate-200 p-8 md:p-12 text-slate-700">
//                     <div className="flex items-center gap-3 mb-6">
//                         <FileText className="text-slate-400" size={24} />
//                         <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Shipping Policy & Terms</h2>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-justify">
                        
//                         {/* Column 1 */}
//                         <div className="space-y-6">
//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.1 Package Acceptance Policy</h3>
//                                 <p className="mb-1"><span className="font-semibold">Permitted Items:</span> Clothing, books, electronics, gadgets, accessories, household goods. Items below $5000 declared value.</p>
//                                 <p><span className="font-semibold text-red-500">Restricted (Phase 1):</span> Perishables, Gold, Cash, Liquids, Explosives, Flammable items. Food is currently under review.</p>
//                             </div>

//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.2 Intake Checks & Tagging</h3>
//                                 <ul className="list-disc pl-4 space-y-1">
//                                     <li>Inspected for external damage upon arrival.</li>
//                                     <li>Weighed, photographed, scanned, and assigned a unique barcode label.</li>
//                                     <li>Logged with user ID and timestamp in inventory.</li>
//                                 </ul>
//                             </div>

//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.3 Unshippable Items</h3>
//                                 <p>Items violating policy are held for 14 days then returned/discarded. Unclaimed items (60+ days) attract penalties or auction.</p>
//                             </div>

//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.4 Security & Mitigation</h3>
//                                 <ul className="list-disc pl-4 space-y-1">
//                                     <li>24/7 Warehouse surveillance.</li>
//                                     <li>Staff background checks & access monitoring.</li>
//                                     <li>Barcode-based tracking & random audits.</li>
//                                 </ul>
//                             </div>
//                         </div>

//                         {/* Column 2 */}
//                         <div className="space-y-6">
//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.5 Repacking & Consolidation</h3>
//                                 <p>Repacking is performed to save costs. Fragile items are double-wrapped. Consolidations are video-recorded for verification.</p>
//                             </div>

//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.6 Delivery Scheduling</h3>
//                                 <p>Currently capped at Monthly Deliveries (MVP). Max orders: 10 packages or 30kg. Future tiers will unlock weekly/bi-weekly options.</p>
//                             </div>

//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.7 Insurance & Liability</h3>
//                                 <p>Goods-in-Transit Insurance included up to $500. Additional coverage available at checkout. Liability waivers accepted on transaction.</p>
//                             </div>

//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.8 Operational Tools</h3>
//                                 <p>Handheld barcode scanners, integrated tracking software, and weight mismatch alerts ensure accuracy.</p>
//                             </div>

//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.9 Enforcement</h3>
//                                 <p>Users acknowledge liability and customs compliance. Penalties for violations include fines, confiscation, or account suspension.</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mt-8 pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
//                         <p>© {new Date().getFullYear()} Bulq Logistics. All rights reserved. By using our service, you agree to the terms above.</p>
//                     </div>
//                 </div>
//             </div>

//             <p className="mt-8 text-xs text-gray-400">
//                 Need help? <a href="#" className="text-blue-600 underline hover:text-black">Contact Support</a>
//             </p>
//         </div>
//     );
// }

// "use client";
// import React, { useEffect, useState, useRef } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// // Update the import path if your DTO is in a different file
// import { verifyPaymentStatus } from '@/lib/user/transaction.actions'; 
// import { PaymentVerificationResponse } from '@/types/transaction'; 
// import { QRCodeSVG } from 'qrcode.react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { IoCheckmarkCircle, IoDownload, IoAlertCircle, IoHome, IoCube } from "react-icons/io5";
// import Button from '@/app/components/inputs/Button';

// export default function PaymentVerifyPage() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
    
//     // Get URL Parameters
//     const bookingId = searchParams.get('id');
//     const paymentRef = searchParams.get('reference') || searchParams.get('trxref');

//     const [loading, setLoading] = useState(true);
//     const [verified, setVerified] = useState(false);
    
//     // We use 'any' here because we might merge Booking details later
//     // or if the backend sends more data than the strict PaymentVerificationResponse
//     const [bookingDetails, setBookingDetails] = useState<any>(null); 
//     const [error, setError] = useState("");
    
//     const receiptRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!bookingId) {
//             setError("Invalid verification link. Missing Booking ID.");
//             setLoading(false);
//             return;
//         }

//         const verify = async () => {
//             try {
//                 const response = await verifyPaymentStatus(bookingId);
                
//                 // FIX: Check success using the flat structure of PaymentVerificationResponse
//                 if (response && (response.status === 'SUCCESSFUL' || response.status === 'PAID' || response.success)) {
//                     setVerified(true);
                    
//                     // FIX: Removed '.data' since the response is flat
//                     // Note: If this response doesn't have sender/receiver info, 
//                     // you might need to call getBookingById(bookingId) here to merge it.
//                     setBookingDetails(response); 
//                 } else {
//                     setError("Payment verification failed. Status: " + (response?.status || 'Unknown'));
//                     if (response?.failureReason) {
//                         console.error("Failure Reason:", response.failureReason);
//                     }
//                 }
//             } catch (err: any) {
//                 console.error("Verification Error:", err);
//                 setError(err.message || "Failed to verify payment.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         verify();
//     }, [bookingId, paymentRef]);

//     const handleDownloadPDF = async () => {
//         if (!receiptRef.current) return;

//         try {
//             const canvas = await html2canvas(receiptRef.current, { scale: 2 });
//             const imgData = canvas.toDataURL('image/png');
//             const pdf = new jsPDF('p', 'mm', 'a4');
//             const pdfWidth = pdf.internal.pageSize.getWidth();
//             const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
//             pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//             pdf.save(`Bulq-Receipt-${bookingDetails?.transactionId || 'Invoice'}.pdf`);
//         } catch (err) {
//             console.error("PDF Generation Failed", err);
//             alert("Could not generate PDF. Please try printing the page.");
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-appBanner mb-4"></div>
//                 <h2 className="text-xl font-bold text-gray-700">Verifying Payment...</h2>
//                 <p className="text-gray-500 text-sm mt-2">Please wait while we confirm your transaction.</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
//                 <IoAlertCircle className="text-red-500 text-6xl mb-4" />
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
//                 <p className="text-red-600 mb-6 text-center max-w-md">{error}</p>
//                 <div className="flex gap-4">
//                     <Button onClick={() => window.location.reload()} className="bg-gray-800 text-white px-6 py-2 rounded-lg">Retry</Button>
//                     <Button onClick={() => router.push('/dashboard')} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">Go to Dashboard</Button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
            
//             {/* ACTION BUTTONS */}
//             <div className="w-full max-w-3xl flex justify-between items-center mb-6">
//                 <Button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-black">
//                     <IoHome /> Back to Dashboard
//                 </Button>
//                 <Button onClick={handleDownloadPDF} className="bg-appNav text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-bold hover:-translate-y-1 transition-transform">
//                     <IoDownload size={20} /> Download PDF Receipt
//                 </Button>
//             </div>

//             {/* RECEIPT CONTENT */}
//             <div ref={receiptRef} className="bg-white w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden relative">
                
//                 {/* Header */}
//                 <div className="bg-green-600 p-8 text-center text-white relative overflow-hidden">
//                     <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
//                     <IoCheckmarkCircle className="text-6xl mx-auto mb-2 relative z-10" />
//                     <h1 className="text-3xl font-extrabold relative z-10">Payment Successful</h1>
//                     <p className="opacity-90 relative z-10">Your booking has been confirmed.</p>
//                 </div>

//                 <div className="p-8 md:p-12">
//                     {/* Top Info Grid */}
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-100">
//                         <div>
//                             <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Amount Paid</p>
//                             {/* FIX: Use amountPaid from PaymentVerificationResponse */}
//                             <p className="text-xl font-bold text-gray-900">
//                                 {bookingDetails?.currency} {(bookingDetails?.amountPaid || 0).toLocaleString()}
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Date</p>
//                             {/* FIX: Use completedAt from response */}
//                             <p className="text-lg font-medium text-gray-900">
//                                 {bookingDetails?.completedAt ? new Date(bookingDetails.completedAt).toLocaleDateString() : new Date().toLocaleDateString()}
//                             </p>
//                         </div>
//                         <div className="col-span-2">
//                             <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Transaction Ref</p>
//                             <p className="text-sm font-mono bg-gray-100 p-2 rounded text-gray-600 break-all">
//                                 {bookingDetails?.providerReference || paymentRef || "N/A"}
//                             </p>
//                         </div>
//                     </div>

//                     {/* QR Code & Tracking Section */}
//                     <div className="flex flex-col items-center justify-center py-6 bg-blue-50/50 rounded-2xl border border-blue-100 mb-8">
//                         <h3 className="text-sm font-bold text-blue-900 uppercase mb-4 tracking-widest">Tracking Number</h3>
                        
//                         <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
//                             {/* FIX: Use transactionId as Tracking ID based on DTO comments */}
//                             <QRCodeSVG 
//                                 value={bookingDetails?.transactionId || "PENDING"} 
//                                 size={150}
//                                 level="H"
//                                 includeMargin={true}
//                             />
//                         </div>

//                         <p className="text-3xl font-black text-appBanner tracking-widest">
//                             {bookingDetails?.transactionId || "BQ-PENDING"}
//                         </p>
//                         <p className="text-xs text-gray-400 mt-2">Scan to track shipment status</p>
//                     </div>

//                     {/* Shipping Instructions */}
//                     <div className="mb-8">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="w-8 h-8 rounded-full bg-appNav text-white flex items-center justify-center">
//                                 <IoCube />
//                             </div>
//                             <h3 className="text-lg font-bold text-gray-900">Shipping Instructions</h3>
//                         </div>

//                         <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-sm text-gray-700 leading-relaxed">
//                             {/* Note: 'pickupType' isn't in PaymentVerificationResponse. 
//                                 Ideally, we should fetch the full booking details to toggle this accurately.
//                                 Defaulting to Generic instructions if missing. */}
//                             {bookingDetails?.pickupType === 'BADO' ? (
//                                 <>
//                                     <p className="font-bold mb-2">Drop-Off Required:</p>
//                                     <p>Please take your package to the selected hub <strong>{bookingDetails?.hubName || "Bulq Logistics Hub"}</strong> at the scheduled time.</p>
//                                 </>
//                             ) : (
//                                 <>
//                                     <p className="font-bold mb-2">Courier Pick-Up / Processing:</p>
//                                     <p>A courier has been notified. Please ensure the package is sealed and the label is attached.</p>
//                                     {bookingDetails?.nextAction && (
//                                         <p className="mt-2 text-blue-600 font-bold">Next Step: {bookingDetails.nextAction}</p>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     {/* Customer Info */}
//                     {/* Note: Sender/Receiver info is NOT in PaymentVerificationResponse. 
//                         These will be empty unless you fetch the full booking object. */}
//                     <div className="grid grid-cols-2 gap-8 text-sm">
//                         <div>
//                             <p className="font-bold text-gray-900 mb-1">Sender</p>
//                             <p className="text-gray-600">{bookingDetails?.senderFirstName || "N/A"} {bookingDetails?.senderLastName || ""}</p>
//                             <p className="text-gray-500">{bookingDetails?.senderEmail || "N/A"}</p>
//                         </div>
//                         <div className="text-right">
//                              <p className="font-bold text-gray-900 mb-1">Receiver</p>
//                             <p className="text-gray-600">{bookingDetails?.receiverFirstname || "N/A"} {bookingDetails?.receiverLastname || ""}</p>
//                             <p className="text-gray-500">{bookingDetails?.receiverCountry || "N/A"}</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="bg-gray-50 p-6 text-center text-[10px] text-gray-400 border-t border-gray-100">
//                     <p>Generated by Bulq Logistics • {new Date().toLocaleString()}</p>
//                     <p>Keep this receipt for your records. For support, contact help@bulqlogistics.com</p>
//                 </div>
//             </div>

//             <div className="mt-8 text-center">
//                 <p className="text-gray-500 text-sm">Need help? <a href="/support" className="text-appBanner font-bold hover:underline">Contact Support</a></p>
//             </div>
//         </div>
//     );
// }