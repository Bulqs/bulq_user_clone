"use client";
import React, { useEffect, useState } from 'react';
import { IoClose, IoCard, IoArrowBack, IoShieldCheckmarkOutline } from "react-icons/io5";
import { FiCheckCircle, FiLock, FiInfo } from "react-icons/fi";
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

// --- HELPER TO GET METHOD DESCRIPTIONS ---
const getMethodDescription = (provider: string) => {
    const lowerProvider = provider.toLowerCase();
    if (lowerProvider.includes('paystack')) {
        return "Pay securely via Local Bank Transfer, USSD, or Debit Cards.";
    }
    if (lowerProvider.includes('stripe')) {
        return "Pay internationally using major Credit and Debit cards.";
    }
    if (lowerProvider.includes('wallet')) {
        return "Instant checkout using your available BulQ account balance.";
    }
    if (lowerProvider.includes('paypal')) {
        return "Fast and secure international payments via PayPal.";
    }
    return "Proceed securely with this payment gateway.";
};

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
            const targetUrl = `${window.location.origin}/paymentstatus/stripe/verify?id=${bookingData.trackingNumber}`;
            const paystackTargetUrl = `${window.location.origin}/paymentstatus/verify?id=${bookingData.trackingNumber}`;
            const isPaystack = method.provider.toLowerCase().includes('paystack');
            
            const payload = {
                customerEmail,
                customerName,
                amount: bookingData.totalCost || 0,
                callbackUrl: isPaystack ? paystackTargetUrl : targetUrl, 
                currency: bookingData.currency,
                reference: `${bookingData.trackingNumber}` 
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
            <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
                
                {/* --- LEFT: Booking Summary (Detailed Breakdown) --- */}
                <div className="w-full md:w-5/12 bg-gradient-to-b from-gray-50 to-gray-100 p-6 md:p-10 border-b md:border-r border-gray-200 flex flex-col overflow-y-auto">
                    <div className="mb-8">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Order Summary</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking ID:</span>
                            <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">{bookingData.trackingNumber}</span>
                        </div>
                    </div>

                    {/* Receipt Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex-1 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-appBanner"></div>
                        
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-dashed border-gray-200">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Billed To</p>
                                <p className="text-sm font-bold text-gray-800 mt-1">{customerName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</p>
                                <p className="text-xs font-bold text-amber-500 mt-1 bg-amber-50 px-2 py-0.5 rounded inline-block">Awaiting Payment</p>
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 font-medium flex items-center gap-2"><FiCheckCircle className="text-green-500 w-4 h-4"/> Base Fee</span>
                                <span className="font-bold text-gray-800">{bookingData.currency} {(bookingData.totalCost || 0).toLocaleString()}</span>
                            </div>
                            
                            {/* Dynamically render these if your DTO supports them later, else they stay hidden */}
                            {(bookingData as any).shippingAmount && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 font-medium">Shipping Rate</span>
                                    <span className="font-bold text-gray-800">{bookingData.currency} {(bookingData as any).shippingAmount.toLocaleString()}</span>
                                </div>
                            )}
                            {(bookingData as any).insuranceAmount && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 font-medium">Insurance Cover</span>
                                    <span className="font-bold text-gray-800">{bookingData.currency} {(bookingData as any).insuranceAmount.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto pt-4 border-t border-dashed border-gray-200">
                            <div className="flex justify-between items-center bg-appTitleBgColor p-4 rounded-xl shadow-inner">
                                <div>
                                    <span className="text-white/60 font-bold uppercase text-[10px] tracking-wider block mb-0.5">Total Amount</span>
                                    <span className="text-xs text-white/80 font-medium">Including Taxes</span>
                                </div>
                                <span className="font-black text-white text-2xl drop-shadow-md">
                                    {bookingData.currency} {(bookingData.totalCost || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-6 flex items-start gap-3 bg-emerald-50/80 p-4 rounded-xl border border-emerald-100">
                        <IoShieldCheckmarkOutline className="w-6 h-6 text-emerald-600 shrink-0" />
                        <p className="text-[10px] font-bold text-emerald-800 leading-relaxed">
                            Your payment is secured with bank-grade 256-bit encryption. We do not store your full card details on our servers.
                        </p>
                    </div>
                </div>

                {/* --- RIGHT: Dynamic Payment Area --- */}
                <div className="w-full md:w-7/12 p-6 md:p-10 relative flex flex-col h-full overflow-hidden bg-white">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-colors z-10">
                        <IoClose size={24} />
                    </button>

                    {/* --- VIEW 1: STRIPE EMBEDDED FORM --- */}
                    {stripeSession && stripeClientSecret ? (
                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-3 mb-8">
                                <button 
                                    onClick={() => { setStripeSession(null); setStripeClientSecret(null); }} 
                                    className="p-2 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors"
                                >
                                    <IoArrowBack size={20} className="text-gray-600" />
                                </button>
                                <div>
                                    <h3 className="text-2xl font-extrabold text-gray-900">Card Payment</h3>
                                    <p className="text-sm font-medium text-gray-500">Complete your transaction via Stripe</p>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                <Elements 
                                    stripe={loadStripe(stripeSession.publishableKey!)} 
                                    options={{ 
                                        clientSecret: stripeClientSecret,
                                        appearance: { 
                                            theme: 'stripe',
                                            variables: { colorPrimary: '#0052FF', borderRadius: '12px' }
                                        } 
                                    }}
                                >
                                    <StripePaymentForm 
                                        bookingId={bookingData.trackingNumber} 
                                        returnUrl={`${window.location.origin}/paymentstatus/stripe/verify?id=${bookingData.trackingNumber}`}
                                        onCancel={() => { setStripeSession(null); setStripeClientSecret(null); }}
                                    />
                                </Elements>
                            </div>
                        </div>
                    ) : (
                        /* --- VIEW 2: METHOD LIST --- */
                        <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
                            <div className="mb-8 pr-12">
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">Select Payment Method</h3>
                                <p className="text-sm font-medium text-gray-500">Choose your preferred gateway to complete the transaction securely.</p>
                            </div>

                            {loadingMethods ? (
                                <div className="flex flex-col items-center justify-center flex-1">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-appBanner mb-4"></div>
                                    <p className="text-sm font-bold text-gray-400">Loading secure gateways...</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.provider}
                                            onClick={() => handlePaymentSelection(method)}
                                            disabled={processingPayment}
                                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 border-2 border-gray-100 rounded-2xl hover:border-appBanner hover:bg-blue-50/30 hover:shadow-md transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div className="flex items-start sm:items-center gap-5">
                                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 p-2 group-hover:scale-105 transition-transform">
                                                    {method.iconUrl ? (
                                                        <Image src={method.iconUrl} alt={method.displayName} width={48} height={48} className="w-full h-full object-contain" />
                                                    ) : <IoCard className="text-gray-400 w-8 h-8" />}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-extrabold text-gray-900 group-hover:text-appBanner transition-colors">{method.displayName}</h4>
                                                    <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed max-w-[250px]">
                                                        {getMethodDescription(method.provider)}
                                                    </p>
                                                    <div className="flex gap-1.5 mt-3">
                                                        {method.supportedCurrencies.map(c => (
                                                            <span key={c} className="text-[9px] font-black px-2 py-0.5 bg-gray-100 group-hover:bg-white text-gray-500 rounded border border-gray-200 uppercase tracking-wider">{c}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-appBanner group-hover:text-white text-gray-400 transition-colors ml-4 shrink-0">
                                                <FiLock size={14} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PROCESSING OVERLAY */}
                    {processingPayment && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl animate-in fade-in">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-100 border-t-appBanner"></div>
                            </div>
                            <h3 className="font-extrabold text-gray-900 text-lg">Initializing Gateway</h3>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Please do not close this window</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPaymentModal;