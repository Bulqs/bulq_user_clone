"use client"; // Ensure this is a client component

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';
import { PaymentSessionResponse } from '@/types/transaction';
import { useRouter } from 'next/navigation';

interface CheckoutPageProps {
  sessionData: PaymentSessionResponse;
}

export default function CheckoutPage({ sessionData }: CheckoutPageProps) {
  const router = useRouter();
  
  // Load Stripe with the key from your session data
  const stripePromise = loadStripe(sessionData.publishableKey!);

  const options = {
    clientSecret: sessionData.clientSecret,
    appearance: { theme: 'stripe' as const },
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
       <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
       
       <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Amount</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">
            {sessionData.currency} {sessionData.amountPayable?.toLocaleString()}
          </p>
       </div>

       <Elements stripe={stripePromise} options={options}>
          <StripePaymentForm 
            bookingId={sessionData.transactionId}
            // 1. Provide the Return URL (Where Stripe redirects after success)
            returnUrl={`${window.location.origin}/pages/paymentstatus/stripe/verify?id=${sessionData.transactionId}`}
            // 2. Provide Cancel Handler (e.g., Go back to dashboard)
            onCancel={() => router.push('/pages/home')}
          />
       </Elements>
    </div>
  );
}