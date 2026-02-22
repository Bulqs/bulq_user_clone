// lib/user/bookingActions.ts
'use server'
import { cookies } from "next/headers";
import { AuthResponse } from "../actions";
import { PaymentInitiationRequest, PaymentMethodDTO, PaymentSessionResponse, PaymentVerificationResponse } from "@/types/transaction";
import { getSession } from "../session";

const TRANSACTION_BASE_URL = process.env.TRANSACTION_BASE_URL
export async function getAuthHeader(): Promise<Record<string, string>> {
    // 1. Use your existing getSession logic to decrypt the cookie
    const session = await getSession();
    
    // 2. Check if the session exists and has the token
    // Based on your createSession payload, the token is nested inside
    if (!session || !session.token) {
        console.error("Auth Header: No valid session or token found after decryption");
        return {};
    }

    // 3. Return the actual decrypted token
    console.log(session.token)
    return { 'Authorization': `Bearer ${session.token}` };
}


/**
 * Fetch all supported and active payment methods.
 * Matches GET ${TRANSACTION_BASE_URL}payment-methods
 * 
 * When building the "Select Payment Method" screen:
 * Currency Matching: Filter the list on the frontend to only show providers that support the currency of the booking (e.g., if the booking is NGN, show Paystack; if USD, show Stripe).
 * Provider Icons: Use the iconUrl directly in your list items for a professional, trustworthy look.
 * Dynamic Flow: * If flowType === 'REDIRECT', your "Pay" button should use window.location.href = redirectUrl.
 * If flowType === 'MODAL', you might trigger a provider-specific SDK (like Paystack Inline).
 */
export async function getPaymentMethods(): Promise<PaymentMethodDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${TRANSACTION_BASE_URL}/payment-methods`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            // Cache payment methods for a few minutes as they rarely change
            next: { revalidate: 300 } 
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch payment methods");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Payment Methods API Error:", error.message);
        throw error;
    }
}

// export async function getPaymentMethods(): Promise<PaymentMethodDTO[]> {
//     // REMOVED: const authHeader = await getAuthHeader(); 

//     try {
//         const res = await fetch(`${TRANSACTION_BASE_URL}payment-methods`, {
//             method: 'GET',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'accept': '*/*' 
//             },
//             next: { revalidate: 300 } 
//         });

//         if (!res.ok) {
//             const errorMsg = await res.text();
//             throw new Error(errorMsg || "Failed to fetch payment methods");
//         }

//         return await res.json();
        
//     } catch (error: any) {
//         console.error("Payment Methods API Error:", error.message);
//         throw error; // Propagate error so UI can handle it
//     }
// }

/**
 * Specifically initiate a payment session for a Shipping/Booking transaction.
 * Matches POST /api/v1/unified/shipping/{bookingId}/payment/{provider}
 * Initiate a payment session for a specific booking.
 * Matches POST /api/v1/unified/{bookingId}/payment/{provider}
 * 
 * rontend Payment Flow Logic
 * Once you receive the PaymentSessionResponse, your application should handle it based on the flowType:
 * REDIRECT Flow:
 * TypeScript
 * if (response.flowType === 'REDIRECT') {
 * window.location.href = response.authorizationUrl;
 * }
 * MODAL/SDK Flow (e.g., Paystack/Stripe): Use the accessCode or clientSecret to initialize the provider's library (e.g., Stripe.confirmPayment or PaystackPop.setup).
 * Callback: The callbackUrl you provide in the request is where the gateway will send the user after the payment is finished. You will then need to verify that transaction.
 * 
 * Frontend: Calls initiateShippingPayment for provider=stripe.
 * Backend (8188): Communicates with Stripe API and returns clientSecret and publishableKey.
 * Frontend: Mounts PaymentElement using those keys.
 * User: Enters card details.
 * Stripe: Processes payment and redirects to your /verify page.
 * Frontend: Calls verifyPaymentStatus to ensure the Bulq database is updated.
 */
export async function initiateShippingPayment(
    bookingId: string,
    provider: string,
    payload: PaymentInitiationRequest
): Promise<PaymentSessionResponse> {
    const authHeader = await getAuthHeader();

    // Ensure provider is lowercase to avoid URL mapping issues
    const providerPath = provider.toLowerCase();

    try {
        const res = await fetch(
            `${TRANSACTION_BASE_URL}/shipping/${bookingId}/payment/${providerPath}`, 
            {
                method: 'POST',
                headers: { 
                    ...authHeader, 
                    'Content-Type': 'application/json',
                    'accept': '*/*' 
                },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || `Failed to initiate shipping payment via ${provider}`);
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Shipping Payment Initiation Error:", error.message);
        throw error;
    }
}

/**
 * Verify the payment status for a specific shipment/booking.
 * Matches GET /api/v1/unified/shipping/{bookingId}/verify
 * Frontend "Post-Payment" Logic
 * When the user returns from the payment gateway to your callbackUrl, your application should follow this pattern:
 * Show a Loading State: Display a "Verifying your payment..." spinner.
 * Call verifyPaymentStatus: Send the bookingId to the backend.
 * Handle the Outcome:
 * If success is true: Show a success animation and redirect to the Tracking Page.
 * If status is PENDING: Inform the user that the payment is being processed by the bank and to check back in a few minutes.
 * If success is false: Display the failureReason and offer the alternativePaymentMethods to try again.
 */
export async function verifyPaymentStatus(
    bookingId: string
): Promise<PaymentVerificationResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${TRANSACTION_BASE_URL}/shipping/${bookingId}/verify`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            // Verification should always bypass cache for real-time accuracy
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to verify payment status");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Payment Verification Error:", error.message);
        throw error;
    }
}

/**
 * UMAR KINDLY TAKE NOTE OF THIS TO BUILD THE CHECKOUT PAGE
 * 
 * How the "Internal Wallet" works
 * Since the Wallet(ignore the wallet for now till further notice, as we haven't implemented the flow yet in the backend, focus on paystack and stripe) 
 * is internal to your system, the initiateShippingPayment call for the wallet provider likely does the following on the
 * backend:Checks the user's balance.Deducts the amount immediately.Returns success: true and status: 'SUCCESSFUL'.The frontend logic then just redirects the user to the 
 * verify page, which confirms the booking is now active.4. Comparison Table of LogicProviderFlow TypeFrontend ActionNext StepPaystackREDIRECTwindow.location.hrefExternal
 * Site $\rightarrow$ CallbackStripeMODAL / DIRECTMount <Elements>Submit Form $\rightarrow$ CallbackWalletDIRECTAPI Call SuccessInstant Redirect to Verify
 * 
 * 
 * 
 * export default function CheckoutContainer({ bookingId, customerData }) {
  const [session, setSession] = useState<PaymentSessionResponse | null>(null);
  const [view, setView] = useState<'SELECTION' | 'STRIPE' | 'PROCESSING'>('SELECTION');

  const onSelectProvider = async (provider: string) => {
    setView('PROCESSING');
    try {
      const res = await initiateShippingPayment(bookingId, provider, customerData);
      setSession(res);

      const action = handlePaymentLogic(res, bookingId);
      
      if (action === 'SHOW_STRIPE_ELEMENTS') {
        setView('STRIPE');
      }
    } catch (err) {
      setView('SELECTION');
      alert(err.message);
    }
  };

  return (
    <div>
      {view === 'SELECTION' && (
        <PaymentMethodList onSelect={onSelectProvider} />
      )}

      {view === 'STRIPE' && session && (
        <StripeWrapper sessionData={session} />
      )}

      {view === 'PROCESSING' && <Spinner label="Setting up secure payment..." />}
    </div>
  );
}
 */