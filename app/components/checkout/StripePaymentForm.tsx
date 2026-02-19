"use client";
import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../inputs/Button';

interface StripeFormProps {
  bookingId: string;
  returnUrl: string;
  onCancel: () => void;
}

export default function StripePaymentForm({ bookingId, returnUrl, onCancel }: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
        console.error("Stripe.js has not loaded yet.");
        return;
    }

    setIsLoading(true);
    setMessage(null);

    console.log("🚀 Starting Stripe Confirmation...");
    console.log("➡️ Return URL:", returnUrl);

    try {
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: returnUrl,
            },
        });

        // ⚠️ IF WE REACH HERE, IT MEANS REDIRECT FAILED OR ERROR OCCURRED
        // (Successful payments redirect immediately, so this code usually doesn't run on success)
        
        if (error) {
            console.error("❌ Stripe Error:", error);
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message ?? "Payment failed.");
            } else {
                setMessage(`Payment Error: ${error.message}`);
            }
        }
    } catch (err: any) {
        console.error("❌ Unexpected Error:", err);
        setMessage("An unexpected error occurred. Check console.");
    } finally {
        setIsLoading(false); // Stop the spinner
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
      
      <div className="flex-1 overflow-y-auto px-1 py-2">
          <PaymentElement 
            id="payment-element" 
            options={{ layout: 'tabs' }} 
            onReady={() => console.log("✅ Stripe Element Ready")}
          />
          {message && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mt-4 border border-red-100">
                {message}
            </div>
          )}
      </div>

      <div className="mt-6 flex gap-3">
          <Button 
            type="button" 
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg"
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </Button>
      </div>
    </form>
  );
}

// import { useState } from 'react';
// import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// export default function StripePaymentForm({ bookingId }: { bookingId: string }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [message, setMessage] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!stripe || !elements) return;

//     setIsLoading(true);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         // This is where Stripe redirects after the bank challenge (3DS)
//         return_url: `${window.location.origin}/checkout/verify?bookingId=${bookingId}`,
//       },
//     });

//     // This point is only reached if there is an immediate error
//     if (error.type === "card_error" || error.type === "validation_error") {
//       setMessage(error.message ?? "An unexpected error occurred.");
//     } else {
//       setMessage("An unexpected error occurred.");
//     }

//     setIsLoading(false);
//   };

//   return (
//     <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
//       <PaymentElement id="link-authentication-element" />
//       <button
//         disabled={isLoading || !stripe || !elements}
//         className="w-full bg-blue-600 text-white py-3 rounded-md font-bold disabled:opacity-50"
//       >
//         {isLoading ? "Processing..." : "Pay Now"}
//       </button>
//       {message && <div className="text-red-500 text-sm mt-2">{message}</div>}
//     </form>
//   );
// }