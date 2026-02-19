import { PaymentSessionResponse } from "@/types/transaction";

export const handlePaymentLogic = (response: PaymentSessionResponse, bookingId: string) => {
  if (!response.success) {
    throw new Error(response.message || "Payment initiation failed");
  }

  switch (response.paymentProvider.toLowerCase()) {
    case 'paystack':
      // Paystack usually returns a redirect URL for the "Unified" flow
      if (response.flowType === 'REDIRECT' && response.authorizationUrl) {
        window.location.href = response.authorizationUrl;
      }
      break;

    case 'stripe':
      // For Stripe, we don't redirect yet; we stay on the page to mount Elements
      // The parent component should react to this by showing the StripeForm
      return 'SHOW_STRIPE_ELEMENTS';

    case 'wallet':
      // Internal wallet is usually a DIRECT flow that completes immediately
      if (response.status === 'SUCCESSFUL' || response.status === 'PAID') {
        window.location.href = `/checkout/verify?bookingId=${bookingId}`;
      }
      break;

    default:
      // Fallback for generic REDIRECT providers (like Flutterwave or PayPal)
      if (response.authorizationUrl) {
        window.location.href = response.authorizationUrl;
      }
  }
};