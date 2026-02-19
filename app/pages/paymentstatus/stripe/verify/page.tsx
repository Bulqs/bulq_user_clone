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
    Calendar, 
    CreditCard, 
    FileText 
} from 'lucide-react';

// 1. Rename to StripeVerifyContent (Remove 'export default')
function StripeVerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // 1. GET PARAMS
    const bookingId = searchParams.get('id'); 
    const stripeStatus = searchParams.get('redirect_status'); 

    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [error, setError] = useState("");
    
    const receiptRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Validation
        if (!bookingId) {
            setError("Invalid verification link. Missing Transaction Reference (id).");
            setLoading(false);
            return;
        }

        // Fast Fail for Stripe Cancellation
        if (stripeStatus === 'failed') {
            setError("Payment failed or was cancelled.");
            setLoading(false);
            return;
        }

        const verify = async () => {
            try {
                console.log("Verifying Stripe Payment for:", bookingId);
                
                const response = await verifyPaymentStatus(bookingId);
                console.log("Verification Response:", response);

                // CHECK STATUS
                const finalAmount = response.amountPaid ?? Number(response.amount);
                const isSuccess = response.success === true || 
                                  response.status === 'SUCCESSFUL' || 
                                  response.status === 'PAID' ||
                                  (stripeStatus === 'succeeded' && !response.status); 

                if (isSuccess) {
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
                setError(err.message || "Failed to verify payment status.");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [bookingId, stripeStatus]);

    // --- PDF GENERATOR ---
    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return;
        try {
            const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210;
            const pageHeight = 297;
            const imgWidth = pageWidth; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, -(pageHeight * (Math.ceil(imgHeight / pageHeight) - Math.ceil(heightLeft / pageHeight))), imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`Bulq-Receipt-${bookingDetails?.transactionId || 'Invoice'}.pdf`);
        } catch (err) {
            alert("Could not generate PDF. Please try printing the page.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <h2 className="text-xl font-bold text-gray-800 mt-6 animate-pulse">Confirming Payment...</h2>
            </div>
        );
    }

    if (!verified || error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                    <AlertTriangle className="text-red-500 w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mb-3">Retry Verification</button>
                    <button onClick={() => router.push('/pages/home')} className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl">Return to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
            
            <div className="w-full max-w-[800px] flex justify-between items-center mb-6">
                <button onClick={() => router.push('/pages/home')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">
                    <Home size={16} /> Dashboard
                </button>
                <button onClick={handleDownloadPDF} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <Download size={16} /> Download Full Receipt
                </button>
            </div>

            <div ref={receiptRef} className="bg-white w-full max-w-[800px] rounded-3xl shadow-xl overflow-hidden relative border border-gray-200">
                
                <div className="relative">
                    <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-center text-white">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Payment Successful</h1>
                            <p className="text-blue-100 text-sm mt-1">Thank you for shipping with Bulq</p>
                        </div>
                    </div>

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
                                STRIPE CONFIRMED
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
                                        {bookingDetails?.providerReference || bookingId}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Tracking Number</p>
                                <p className="text-xl font-black text-slate-800 tracking-wider font-mono mb-2">
                                    {bookingDetails?.transactionId || bookingId}
                                </p>
                                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                                     <QRCodeSVG value={bookingDetails?.transactionId || bookingId || ""} size={80} level="M" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border-t-4 border-slate-200 p-8 md:p-12 text-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="text-slate-400" size={24} />
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Shipping Policy & Terms</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-justify">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.1 Package Acceptance Policy</h3>
                                <p className="mb-1"><span className="font-semibold">Permitted Items:</span> Clothing, books, electronics, gadgets, accessories, household goods. Items below $5000 declared value.</p>
                                <p><span className="font-semibold text-red-500">Restricted (Phase 1):</span> Perishables, Gold, Cash, Liquids, Explosives, Flammable items. Food is currently under review.</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.5 Repacking & Consolidation</h3>
                                <p>Repacking is performed to save costs. Fragile items are double-wrapped. Consolidations are video-recorded for verification.</p>
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

// 2. NEW DEFAULT EXPORT - Wraps the content above in Suspense
export default function StripeVerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <h2 className="text-xl font-bold text-gray-800 mt-6 animate-pulse">Confirming Stripe Payment...</h2>
            </div>
        }>
            <StripeVerifyContent />
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
//     Calendar, 
//     CreditCard, 
//     FileText 
// } from 'lucide-react';

// export default function StripeVerifyPage() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
    
//     // 1. GET PARAMS
//     // We explicitly passed ?id=BQ-XXX in the modal returnUrl
//     // Stripe appends ?payment_intent=...&redirect_status=...
//     const bookingId = searchParams.get('id'); // The Tracking Number/TrxRef
//     const stripeStatus = searchParams.get('redirect_status'); // 'succeeded' or 'failed'

//     const [loading, setLoading] = useState(true);
//     const [verified, setVerified] = useState(false);
//     const [bookingDetails, setBookingDetails] = useState<any>(null);
//     const [error, setError] = useState("");
    
//     const receiptRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         // Validation
//         if (!bookingId) {
//             setError("Invalid verification link. Missing Transaction Reference (id).");
//             setLoading(false);
//             return;
//         }

//         // Fast Fail for Stripe Cancellation
//         if (stripeStatus === 'failed') {
//             setError("Payment failed or was cancelled.");
//             setLoading(false);
//             return;
//         }

//         const verify = async () => {
//             try {
//                 console.log("Verifying Stripe Payment for:", bookingId);
                
//                 // 2. CALL BACKEND 
//                 // Using the unified endpoint as requested. 
//                 // The bookingId acts as the trxref/trackingNumber.
//                 const response = await verifyPaymentStatus(bookingId);
                
//                 console.log("Verification Response:", response);

//                 // 3. CHECK STATUS
//                 const finalAmount = response.amountPaid ?? Number(response.amount);
//                 const isSuccess = response.success === true || 
//                                   response.status === 'SUCCESSFUL' || 
//                                   response.status === 'PAID' ||
//                                   // Fallback: If backend is slow but Stripe says success
//                                   (stripeStatus === 'succeeded' && !response.status); 

//                 if (isSuccess) {
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
//                 setError(err.message || "Failed to verify payment status.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         verify();
//     }, [bookingId, stripeStatus]);

//     // --- PDF GENERATOR ---
//     const handleDownloadPDF = async () => {
//         if (!receiptRef.current) return;
//         try {
//             const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
//             const imgData = canvas.toDataURL('image/png');
//             const pdf = new jsPDF('p', 'mm', 'a4');
//             const pageWidth = 210;
//             const pageHeight = 297;
//             const imgWidth = pageWidth; 
//             const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
//             let heightLeft = imgHeight;
//             let position = 0;

//             pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;

//             while (heightLeft >= 0) {
//                 position = heightLeft - imgHeight;
//                 pdf.addPage();
//                 pdf.addImage(imgData, 'PNG', 0, -(pageHeight * (Math.ceil(imgHeight / pageHeight) - Math.ceil(heightLeft / pageHeight))), imgWidth, imgHeight);
//                 heightLeft -= pageHeight;
//             }
//             pdf.save(`Bulq-Receipt-${bookingDetails?.transactionId || 'Invoice'}.pdf`);
//         } catch (err) {
//             alert("Could not generate PDF. Please try printing the page.");
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//                 <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
//                 <h2 className="text-xl font-bold text-gray-800 mt-6 animate-pulse">Confirming Payment...</h2>
//             </div>
//         );
//     }

//     if (!verified || error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//                 <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100 relative overflow-hidden">
//                     <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
//                     <AlertTriangle className="text-red-500 w-12 h-12 mx-auto mb-4" />
//                     <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
//                     <p className="text-gray-500 mb-8">{error}</p>
//                     <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mb-3">Retry Verification</button>
//                     <button onClick={() => router.push('/pages/home')} className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl">Return to Dashboard</button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
            
//             {/* Nav */}
//             <div className="w-full max-w-[800px] flex justify-between items-center mb-6">
//                 <button onClick={() => router.push('/pages/home')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">
//                     <Home size={16} /> Dashboard
//                 </button>
//                 <button onClick={handleDownloadPDF} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
//                     <Download size={16} /> Download Full Receipt
//                 </button>
//             </div>

//             {/* Receipt */}
//             <div ref={receiptRef} className="bg-white w-full max-w-[800px] rounded-3xl shadow-xl overflow-hidden relative border border-gray-200">
                
//                 {/* Header */}
//                 <div className="relative">
//                     <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-center text-white">
//                         <div className="flex flex-col items-center">
//                             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
//                                 <CheckCircle2 className="w-10 h-10 text-green-500" />
//                             </div>
//                             <h1 className="text-3xl font-bold tracking-tight">Payment Successful</h1>
//                             <p className="text-blue-100 text-sm mt-1">Thank you for shipping with Bulq</p>
//                         </div>
//                     </div>

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
//                                 STRIPE CONFIRMED
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
//                                         {bookingDetails?.providerReference || bookingId}
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center">
//                                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Tracking Number</p>
//                                 <p className="text-xl font-black text-slate-800 tracking-wider font-mono mb-2">
//                                     {bookingDetails?.transactionId || bookingId}
//                                 </p>
//                                 <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
//                                      <QRCodeSVG 
//                                         value={bookingDetails?.transactionId || bookingId} 
//                                         size={80}
//                                         level="M"
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Terms Footer */}
//                 <div className="bg-slate-50 border-t-4 border-slate-200 p-8 md:p-12 text-slate-700">
//                     <div className="flex items-center gap-3 mb-6">
//                         <FileText className="text-slate-400" size={24} />
//                         <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Shipping Policy & Terms</h2>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-justify">
//                         <div className="space-y-6">
//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.1 Package Acceptance Policy</h3>
//                                 <p className="mb-1"><span className="font-semibold">Permitted Items:</span> Clothing, books, electronics, gadgets, accessories, household goods. Items below $5000 declared value.</p>
//                                 <p><span className="font-semibold text-red-500">Restricted (Phase 1):</span> Perishables, Gold, Cash, Liquids, Explosives, Flammable items. Food is currently under review.</p>
//                             </div>
//                         </div>
//                         <div className="space-y-6">
//                             <div>
//                                 <h3 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">1.5 Repacking & Consolidation</h3>
//                                 <p>Repacking is performed to save costs. Fragile items are double-wrapped. Consolidations are video-recorded for verification.</p>
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