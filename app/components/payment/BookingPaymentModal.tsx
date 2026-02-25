"use client";
import React, { useEffect, useState } from 'react';
import { IoClose, IoCard, IoArrowBack } from "react-icons/io5";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { BookingResponseDTO } from '@/types/booking';
import { PaymentMethodDTO, PaymentSessionResponse } from '@/types/transaction';
import { getPaymentMethods, initiateShippingPayment } from '@/lib/user/transaction.actions';
import StripePaymentForm from '../checkout/StripePaymentForm';
import Image from 'next/image';

interface BookingPaymentModalProps {
    bookingData: BookingResponseDTO;
    customerEmail: string;
    customerName: string;
    onClose: () => void;
}

const BookingPaymentModal: React.FC<BookingPaymentModalProps> = ({ 
    bookingData, 
    customerEmail, 
    customerName,
    onClose 
}) => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDTO[]>([]);
    const [loadingMethods, setLoadingMethods] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    
    // STRIPE STATE
    const [stripeSession, setStripeSession] = useState<PaymentSessionResponse | null>(null);
    const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);

    // MANUAL OVERRIDE (Keep empty for production)
    const MANUAL_CLIENT_SECRET = ""; 

    useEffect(() => {
        const loadMethods = async () => {
            try {
                const methods = await getPaymentMethods();
                setPaymentMethods(methods.filter(m => m.available));
            } catch (error) {
                console.error("Failed to load payment methods", error);
            } finally {
                setLoadingMethods(false);
            }
        };
        loadMethods();
    }, []);

    const handlePaymentSelection = async (method: PaymentMethodDTO) => {
        setProcessingPayment(true);
        try {
            // --- CONSTRUCT URLS ---
            // UPDATED: Points to your new Stripe specific verify page
            // We pass the trackingNumber as 'id' so the verify page can pick it up
            const targetUrl = `${window.location.origin}/pages/paymentstatus/stripe/verify?id=${bookingData.trackingNumber}`;
            // 2. Paystack's target URL (removed 'stripe/')
            const paystackTargetUrl = `${window.location.origin}/pages/paymentstatus/verify?id=${bookingData.trackingNumber}`;

            // 3. Check if the selected method is Paystack
            const isPaystack = method.provider.toLowerCase().includes('paystack');
            
            // const payload = {
            //     customerEmail,
            //     customerName,
            //     amount: bookingData.totalCost || 0,
            //     callbackUrl: targetUrl, 
            //     currency: bookingData.currency,
            //     reference: `${bookingData.trackingNumber}` 
            // };

            const payload = {
                customerEmail,
                customerName,
                amount: bookingData.totalCost || 0,
                // Assign the correct URL dynamically
                callbackUrl: isPaystack ? paystackTargetUrl : targetUrl, 
                currency: bookingData.currency,
                reference: `${bookingData.trackingNumber}` 
                // reference: `${bookingData.trackingNumber}_${Date.now()}`
            };

            const response = await initiateShippingPayment(
                bookingData.trackingNumber, 
                method.provider, 
                payload
            );
            
            console.log("Payment Response:", response);
            let flow = response.flowType;

            // FALLBACK Logic
            if (!flow) {
                if (response.authorizationUrl) flow = 'REDIRECT';
                else if (response.clientSecret || response.sessionId) flow = 'EMBEDDED';
                else if (response.success) flow = 'INSTANT';
            }

            // 1. STRIPE / EMBEDDED FLOW
            if (flow === 'EMBEDDED' || (flow === 'MODAL' && method.provider.toLowerCase().includes('stripe'))) {
                
                const resolvedKey = response.publishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
                const resolvedSecret = response.clientSecret || response.sessionId || (response as any).paymentMetadata?.clientSecret || MANUAL_CLIENT_SECRET;

                if (resolvedSecret && resolvedKey) {
                    setStripeSession({
                        ...response,
                        publishableKey: resolvedKey 
                    });
                    setStripeClientSecret(resolvedSecret);
                    setProcessingPayment(false); 
                } else {
                    console.error("Stripe Config Error", { hasKey: !!resolvedKey, hasSecret: !!resolvedSecret });
                    alert("Configuration Error: Stripe Client Secret is missing.");
                    setProcessingPayment(false);
                }
            }
            // 2. REDIRECT FLOW (Paystack)
            else if (flow === 'REDIRECT') {
                if (response.authorizationUrl) window.location.href = response.authorizationUrl;
                else throw new Error("No redirect URL provided.");
            } 
            // 3. INSTANT FLOW (Wallet)
            else if (flow === 'INSTANT' || flow === 'DIRECT') {
                window.location.href = payload.callbackUrl;
            }
            else {
                alert(`Unexpected flow: ${flow}`);
                setProcessingPayment(false);
            }

        } catch (error: any) {
            console.error("Payment Initiation Failed", error);
            alert(error.message || "Failed to start payment.");
            setProcessingPayment(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]">
                
                {/* LEFT: Booking Summary */}
                <div className="w-full md:w-5/12 bg-gray-50 p-6 md:p-8 border-b md:border-r border-gray-100 flex flex-col overflow-y-auto">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6">Booking Summary</h3>
                    <div className="space-y-4 flex-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Tracking ID</span>
                            <span className="font-bold text-appBanner">{bookingData.trackingNumber}</span>
                        </div>
                        <div className="w-full h-px bg-gray-200 my-2"></div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total To Pay</span>
                            <span className="font-extrabold text-gray-900 text-lg">
                                {bookingData.currency} {(bookingData.totalCost || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Dynamic Payment Area */}
                <div className="w-full md:w-7/12 p-6 md:p-8 relative flex flex-col h-full overflow-hidden">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 z-10">
                        <IoClose size={24} />
                    </button>

                    {/* --- VIEW 1: STRIPE EMBEDDED FORM --- */}
                    {stripeSession && stripeClientSecret ? (
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-6">
                                <button 
                                    onClick={() => { setStripeSession(null); setStripeClientSecret(null); }} 
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <IoArrowBack size={20} />
                                </button>
                                <h3 className="text-xl font-extrabold text-gray-900">Card Payment</h3>
                            </div>
                            
                            <Elements 
                                stripe={loadStripe(stripeSession.publishableKey!)} 
                                options={{ 
                                    clientSecret: stripeClientSecret,
                                    appearance: { theme: 'stripe' } 
                                }}
                            >
                                <StripePaymentForm 
                                    bookingId={bookingData.trackingNumber} 
                                    // UPDATED: Points to the new page location with correct ID param
                                    returnUrl={`${window.location.origin}/pages/paymentstatus/stripe/verify?id=${bookingData.trackingNumber}`}
                                    onCancel={() => { setStripeSession(null); setStripeClientSecret(null); }}
                                />
                            </Elements>
                        </div>
                    ) : (
                        /* --- VIEW 2: METHOD LIST --- */
                        <div className="flex flex-col h-full overflow-y-auto">
                            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Select Payment Method</h3>
                            <p className="text-sm text-gray-500 mb-8">Choose a secure payment gateway.</p>

                            {loadingMethods ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-appBanner"></div>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.provider}
                                            onClick={() => handlePaymentSelection(method)}
                                            disabled={processingPayment}
                                            className="group flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-appBanner hover:bg-blue-50 transition-all text-left shadow-sm disabled:opacity-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-lg p-1 border border-gray-100 flex items-center justify-center">
                                                    {method.iconUrl ? (
                                                        <Image src={method.iconUrl} alt={method.displayName} 
                                                        width={48}   // <-- Add this
                                                        height={48}  // <-- Add this
                                                        className="w-full h-full object-contain" />
                                                    ) : <IoCard className="text-gray-400" size={24} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 group-hover:text-appBanner">{method.displayName}</h4>
                                                    <div className="flex gap-2 mt-1">
                                                        {method.supportedCurrencies.map(c => (
                                                            <span key={c} className="text-[10px] font-bold px-2 bg-gray-100 text-gray-600 rounded border border-gray-200">{c}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PROCESSING OVERLAY */}
                    {processingPayment && (
                        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 rounded-xl">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-appBanner mb-4"></div>
                            <p className="font-bold text-gray-700">Initializing Payment...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPaymentModal;

// "use client";
// import React, { useEffect, useState } from 'react';
// import { IoClose, IoCard, IoArrowBack } from "react-icons/io5";
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import { BookingResponseDTO } from '@/types/booking';
// import { PaymentMethodDTO, PaymentSessionResponse } from '@/types/transaction';
// import { getPaymentMethods, initiateShippingPayment } from '@/lib/user/transaction.actions';
// import StripePaymentForm from '../checkout/StripePaymentForm';
// // import { 
// //     BookingResponseDTO, 
// //     PaymentMethodDTO, 
// //     PaymentSessionResponse,
// //     getPaymentMethods, 
// //     initiateShippingPayment 
// // } from '@/lib/user/transaction.actions';
// // import StripePaymentForm from './StripePaymentForm'; 

// interface BookingPaymentModalProps {
//     bookingData: BookingResponseDTO;
//     customerEmail: string;
//     customerName: string;
//     onClose: () => void;
// }

// const BookingPaymentModal: React.FC<BookingPaymentModalProps> = ({ 
//     bookingData, 
//     customerEmail, 
//     customerName,
//     onClose 
// }) => {
//     const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDTO[]>([]);
//     const [loadingMethods, setLoadingMethods] = useState(true);
//     const [processingPayment, setProcessingPayment] = useState(false);
    
//     // STRIPE STATE
//     const [stripeSession, setStripeSession] = useState<PaymentSessionResponse | null>(null);
    
//     // HARDCODED KEY FOR TESTING
//     const TEST_PUBLISHABLE_KEY = 'pk_test_51LCbxwD30CaerxYvQHHfQoTY2mbrmQ8B4eLzCyfkzxm9R6EgZMGO4BIqW7P8sjNfuy7RTywuJE7K9l9HEjuQqB4s00axDuoKY9';

//     // Fetch Payment Methods
//     useEffect(() => {
//         const loadMethods = async () => {
//             try {
//                 const methods = await getPaymentMethods();
//                 setPaymentMethods(methods.filter(m => m.available));
//             } catch (error) {
//                 console.error("Failed to load payment methods", error);
//             } finally {
//                 setLoadingMethods(false);
//             }
//         };
//         loadMethods();
//     }, []);

//     const handlePaymentSelection = async (method: PaymentMethodDTO) => {
//         setProcessingPayment(true);
//         try {
//             const payload = {
//                 customerEmail,
//                 customerName,
//                 amount: bookingData.totalCost || 0,
//                 // Verify page usually looks up by ID, so we keep ID here
//                 callbackUrl: `${window.location.origin}/paymentstatus/verify?id=${bookingData.trackingNumber}`, 
//                 currency: bookingData.currency,
//                 // Reference uses Tracking Number for readability
//                 reference: `${bookingData.trackingNumber}}`
//             };

//             // IMPORTANT: Use trackingNumber (UUID) for the API route, not trackingNumber
//             const response = await initiateShippingPayment(
//                 bookingData.trackingNumber, 
//                 method.provider, 
//                 payload
//             );
            
//             console.log("Payment Response:", response);
//             let flow = response.flowType;

//             // FALLBACK Logic for older backend responses
//             if (!flow) {
//                 if (response.authorizationUrl) flow = 'REDIRECT';
//                 else if (response.clientSecret) flow = 'EMBEDDED'; // Client secret implies embedded
//                 else if (response.success) flow = 'INSTANT';
//             }

//             // 1. STRIPE / EMBEDDED FLOW
//             if (flow === 'EMBEDDED' || (flow === 'MODAL' && method.provider.toLowerCase().includes('stripe'))) {
                
//                 // Key Priority: 1. Backend Response -> 2. Hardcoded Test Key -> 3. Env Var
//                 const resolvedKey = response.publishableKey || TEST_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

//                 if (response.clientSecret && resolvedKey) {
//                     setStripeSession({
//                         ...response,
//                         publishableKey: resolvedKey 
//                     });
//                     setProcessingPayment(false); 
//                 } else {
//                     console.error("Stripe Config Error", { backendKey: response.publishableKey, localKey: response.publishableKey });
//                     alert("Configuration Error: Stripe Keys missing.");
//                     setProcessingPayment(false);
//                 }
//             }
//             // 2. REDIRECT FLOW (Paystack)
//             else if (flow === 'REDIRECT') {
//                 if (response.authorizationUrl) window.location.href = response.authorizationUrl;
//                 else throw new Error("No redirect URL provided.");
//             } 
//             // 3. INSTANT FLOW (Wallet)
//             else if (flow === 'INSTANT' || flow === 'DIRECT') {
//                 window.location.href = payload.callbackUrl;
//             }
//             else {
//                 alert(`Unexpected flow: ${flow}`);
//                 setProcessingPayment(false);
//             }

//         } catch (error: any) {
//             console.error("Payment Initiation Failed", error);
//             alert(error.message || "Failed to start payment.");
//             setProcessingPayment(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//             <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]">
                
//                 {/* LEFT: Booking Summary */}
//                 <div className="w-full md:w-5/12 bg-gray-50 p-6 md:p-8 border-b md:border-r border-gray-100 flex flex-col overflow-y-auto">
//                     <h3 className="text-xl font-extrabold text-gray-900 mb-6">Booking Summary</h3>
//                     <div className="space-y-4 flex-1">
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-500">Tracking ID</span>
//                             <span className="font-bold text-appBanner">{bookingData.trackingNumber}</span>
//                         </div>
//                         <div className="w-full h-px bg-gray-200 my-2"></div>
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-500">Total To Pay</span>
//                             <span className="font-extrabold text-gray-900 text-lg">
//                                 {bookingData.currency} {(bookingData.totalCost || 0).toLocaleString()}
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* RIGHT: Dynamic Payment Area */}
//                 <div className="w-full md:w-7/12 p-6 md:p-8 relative flex flex-col h-full overflow-hidden">
//                     <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 z-10">
//                         <IoClose size={24} />
//                     </button>

//                     {/* --- VIEW 1: STRIPE EMBEDDED FORM --- */}
//                     {stripeSession ? (
//                         <div className="flex flex-col h-full">
//                             <div className="flex items-center gap-2 mb-6">
//                                 <button 
//                                     onClick={() => setStripeSession(null)} 
//                                     className="p-1 hover:bg-gray-100 rounded-full"
//                                 >
//                                     <IoArrowBack size={20} />
//                                 </button>
//                                 <h3 className="text-xl font-extrabold text-gray-900">Card Payment</h3>
//                             </div>
                            
//                             <Elements 
//                                 stripe={loadStripe(stripeSession.publishableKey!)} 
//                                 options={{ 
//                                     clientSecret: stripeSession.clientSecret,
//                                     appearance: { theme: 'stripe' } 
//                                 }}
//                             >
//                                 <StripePaymentForm 
//                                     bookingId={bookingData.trackingNumber} // Display purposes inside form
//                                     returnUrl={`${window.location.origin}/paymentstatus/verify/verify?id=${bookingData.trackingNumber}`}
//                                     onCancel={() => setStripeSession(null)}
//                                 />
//                             </Elements>
//                         </div>
//                     ) : (
//                         /* --- VIEW 2: METHOD LIST --- */
//                         <div className="flex flex-col h-full overflow-y-auto">
//                             <h3 className="text-xl font-extrabold text-gray-900 mb-2">Select Payment Method</h3>
//                             <p className="text-sm text-gray-500 mb-8">Choose a secure payment gateway.</p>

//                             {loadingMethods ? (
//                                 <div className="flex justify-center py-12">
//                                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-appBanner"></div>
//                                 </div>
//                             ) : (
//                                 <div className="grid gap-4">
//                                     {paymentMethods.map((method) => (
//                                         <button
//                                             key={method.provider}
//                                             onClick={() => handlePaymentSelection(method)}
//                                             disabled={processingPayment}
//                                             className="group flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-appBanner hover:bg-blue-50 transition-all text-left shadow-sm disabled:opacity-50"
//                                         >
//                                             <div className="flex items-center gap-4">
//                                                 <div className="w-12 h-12 bg-white rounded-lg p-1 border border-gray-100 flex items-center justify-center">
//                                                     {method.iconUrl ? (
//                                                         <Image src={method.iconUrl} alt={method.displayName} className="w-full h-full object-contain" />
//                                                     ) : <IoCard className="text-gray-400" size={24} />}
//                                                 </div>
//                                                 <div>
//                                                     <h4 className="font-bold text-gray-900 group-hover:text-appBanner">{method.displayName}</h4>
//                                                     <div className="flex gap-2 mt-1">
//                                                         {method.supportedCurrencies.map(c => (
//                                                             <span key={c} className="text-[10px] font-bold px-2 bg-gray-100 text-gray-600 rounded border border-gray-200">{c}</span>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* PROCESSING OVERLAY */}
//                     {processingPayment && (
//                         <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 rounded-xl">
//                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-appBanner mb-4"></div>
//                             <p className="font-bold text-gray-700">Initializing Payment...</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BookingPaymentModal;

// "use client";
// import { getPaymentMethods, initiateShippingPayment } from '@/lib/user/transaction.actions';
// import { BookingResponseDTO } from '@/types/booking';
// import { PaymentMethodDTO } from '@/types/transaction';
// import React, { useEffect, useState } from 'react';
// import { IoClose, IoCard } from "react-icons/io5";

// interface BookingPaymentModalProps {
//     bookingData: BookingResponseDTO;
//     customerEmail: string;
//     customerName: string;
//     onClose: () => void;
// }

// const BookingPaymentModal: React.FC<BookingPaymentModalProps> = ({ 
//     bookingData, 
//     customerEmail, 
//     customerName,
//     onClose 
// }) => {
//     const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDTO[]>([]);
//     const [loadingMethods, setLoadingMethods] = useState(true);
//     const [processingPayment, setProcessingPayment] = useState(false);

//     // Fetch Payment Methods on Mount
//     useEffect(() => {
//         const loadMethods = async () => {
//             try {
//                 const methods = await getPaymentMethods();
                
//                 console.log("API Methods:", methods);
//                 console.log("Booking Currency:", bookingData.currency);

//                 // FIX: Only filter by 'available'. REMOVED currency check.
//                 // This allows Paystack (NGN) to appear even for USD bookings.
//                 const validMethods = methods.filter(m => m.available);
                
//                 setPaymentMethods(validMethods);
//             } catch (error) {
//                 console.error("Failed to load payment methods", error);
//             } finally {
//                 setLoadingMethods(false);
//             }
//         };
//         loadMethods();
//     }, [bookingData.currency]);

//     const handlePaymentSelection = async (method: PaymentMethodDTO) => {
//         setProcessingPayment(true);
//         try {
//             // 1. Prepare Payload
//             const payload = {
//                 customerEmail,
//                 customerName,
//                 amount: bookingData.totalCost || 0,
//                 callbackUrl: `${window.location.origin}/paymentstatus/verify?id=${bookingData.trackingNumber}`,
//                 currency: bookingData.currency,
//                 reference: `${bookingData.trackingNumber}-${Date.now()}` // Unique Ref
//             };

//             console.log("🚀 [Frontend] Sending Payment Payload:", payload);

//             // 2. Call API
//             const response = await initiateShippingPayment(
//                 bookingData.trackingNumber, 
//                 method.provider, 
//                 payload
//             );
            
//             console.log("✅ [Backend] Raw Payment Response:", response);

//             // --- 3. ROBUST FLOW DETECTION ---
//             let flow = response.flowType;
//             console.log("ℹ️ [Logic] Initial Flow Type:", flow);

//             // FALLBACK: If backend sent null, infer the flow
//             if (!flow) {
//                 if (response.authorizationUrl) {
//                     console.log("⚠️ [Logic] Flow inferred as REDIRECT (Found authorizationUrl).");
//                     flow = 'REDIRECT';
//                 } else if (response.success || response.status === 'success' || response.sessionId) {
//                     console.log("⚠️ [Logic] Flow inferred as INSTANT (Found success flag/sessionId).");
//                     flow = 'INSTANT';
//                 }
//             } else {
//                 console.log(`ℹ️ [Logic] Using explicit Flow Type: ${flow}`);
//             }
//             // --------------------------------

//             // 4. Handle The Flow
//             if (flow === 'REDIRECT') {
//                 if (response.authorizationUrl) {
//                     console.log("🔄 [Action] Redirecting to:", response.authorizationUrl);
//                     window.location.href = response.authorizationUrl;
//                 } else {
//                     console.error("❌ [Error] REDIRECT flow but no URL found in response.");
//                     alert("Error: Payment provider returned REDIRECT but no URL.");
//                     setProcessingPayment(false);
//                 }
//             } 
            
//             else if (flow === 'INSTANT' || flow === 'DIRECT') {
//                 console.log("⚡ [Action] Payment Instant/Direct. Verifying...");
//                 window.location.href = payload.callbackUrl;
//             }

//             else if (flow === 'EMBEDDED' || flow === 'MODAL') {
//                 console.log("🧩 [Action] Handling Embedded/Modal Flow.");
//                 if (method.provider.toLowerCase() === 'stripe') {
//                      alert("Stripe Integration: Please use the Client Secret: " + (response.clientSecret || response.sessionId));
//                      setProcessingPayment(false);
//                 } else if (response.authorizationUrl) {
//                     window.location.href = response.authorizationUrl;
//                 } else {
//                     alert(`Please check your ${method.provider} integration.`);
//                     setProcessingPayment(false);
//                 }
//             }

//             else {
//                 console.warn("❓ [Warning] Unknown Flow Type:", flow);
//                 alert(`Unexpected payment flow: ${flow || 'null'}. Please contact support.`);
//                 setProcessingPayment(false);
//             }

//         } catch (error: any) {
//             console.error("❌ [Error] Payment Initiation Failed:", error);
//             alert(error.message || "Failed to start payment.");
//             setProcessingPayment(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//             <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]">
                
//                 {/* LEFT: Booking Summary */}
//                 <div className="w-full md:w-5/12 bg-gray-50 p-6 md:p-8 border-b md:border-r border-gray-100 flex flex-col overflow-y-auto">
//                     <h3 className="text-xl font-extrabold text-gray-900 mb-6">Booking Summary</h3>
                    
//                     <div className="space-y-4 flex-1">
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-500">Tracking ID</span>
//                             <span className="font-bold text-appBanner">{bookingData.trackingNumber}</span>
//                         </div>
//                         <div className="w-full h-px bg-gray-200 my-2"></div>
                        
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-500">Base Shipping</span>
//                             <span className="font-medium text-gray-900">{bookingData.currency} {(bookingData.baseShippingCost || 0).toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-500">Insurance</span>
//                             <span className="font-medium text-gray-900">{bookingData.currency} {(bookingData.insuranceCost || 0).toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between text-sm">
//                             <span className="text-gray-500">Customs/Tax</span>
//                             <span className="font-medium text-gray-900">{bookingData.currency} {(bookingData.customsCost || 0).toLocaleString()}</span>
//                         </div>
                        
//                         {(bookingData.discountAmount || 0) > 0 && (
//                             <div className="flex justify-between text-sm text-green-600">
//                                 <span>Discount</span>
//                                 <span>-{bookingData.currency} {(bookingData.discountAmount || 0).toLocaleString()}</span>
//                             </div>
//                         )}
//                     </div>

//                     <div className="mt-8 pt-6 border-t border-gray-200">
//                         <div className="flex justify-between items-end">
//                             <span className="text-gray-500 font-medium">Total To Pay</span>
//                             <span className="text-2xl font-extrabold text-gray-900">
//                                 {bookingData.currency} {(bookingData.totalCost || 0).toLocaleString()}
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* RIGHT: Payment Method Selection */}
//                 <div className="w-full md:w-7/12 p-6 md:p-8 relative overflow-y-auto">
//                     <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 z-10">
//                         <IoClose size={24} />
//                     </button>

//                     <h3 className="text-xl font-extrabold text-gray-900 mb-2">Select Payment Method</h3>
//                     <p className="text-sm text-gray-500 mb-8">Choose a secure payment gateway to complete your booking.</p>

//                     {loadingMethods ? (
//                         <div className="flex justify-center py-12">
//                             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-appBanner"></div>
//                         </div>
//                     ) : (
//                         <div className="grid gap-4">
//                             {paymentMethods.length > 0 ? paymentMethods.map((method) => (
//                                 <button
//                                     key={method.provider}
//                                     onClick={() => handlePaymentSelection(method)}
//                                     disabled={processingPayment}
//                                     className="group flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-appBanner hover:bg-blue-50 transition-all duration-200 text-left shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     <div className="flex items-center gap-4">
//                                         <div className="w-12 h-12 relative bg-white rounded-lg p-1 border border-gray-100 flex items-center justify-center overflow-hidden">
//                                             {method.iconUrl ? (
//                                                 <Image src={method.iconUrl} alt={method.displayName} className="w-full h-full object-contain" />
//                                             ) : (
//                                                 <IoCard className="text-gray-400" size={24} />
//                                             )}
//                                         </div>
//                                         <div>
//                                             <h4 className="font-bold text-gray-900 group-hover:text-appBanner">{method.displayName}</h4>
                                            
//                                             {/* Currency Badge */}
//                                             <div className="flex gap-2 mt-1">
//                                                 {method.supportedCurrencies.map(curr => (
//                                                     <span key={curr} className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
//                                                         {curr}
//                                                     </span>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
                                    
//                                     <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-appBanner flex items-center justify-center">
//                                         <div className="w-3 h-3 rounded-full bg-appBanner opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                                     </div>
//                                 </button>
//                             )) : (
//                                 <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
//                                     No payment methods available for {bookingData.currency}
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {processingPayment && (
//                         <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-20 rounded-xl">
//                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-appBanner mb-4"></div>
//                             <p className="font-bold text-gray-700">Redirecting to Payment Gateway...</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BookingPaymentModal;