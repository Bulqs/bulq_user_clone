export type PaymentFlowType = 'REDIRECT' | 'MODAL' | 'DIRECT' | 'EMBEDDED' | 'INSTANT';

export interface PaymentMethodDTO {
    provider: string;           // e.g., "PAYSTACK", "FLUTTERWAVE", "STRIPE"
    displayName: string;        // e.g., "Pay with Card/Bank"
    flowType: PaymentFlowType;  // Determines the UI logic
    available: boolean;         // Safety check to hide down providers
    iconUrl: string;            // URL for the logo (e.g., Paystack logo)
    supportedCurrencies: string[]; // e.g., ["NGN", "USD", "GHS"]
}

export interface PaymentInitiationRequest {
    transactionId?: string;
    customerEmail: string;
    customerName: string;
    amount: number;
    callbackUrl: string;
    currency: string;
    reference?: string;
    metadata?: Record<string, any>;
}



export interface PaymentMethodDTO {
    provider: string;
    displayName: string;
    flowType: PaymentFlowType; // Ensure this uses the type above
    available: boolean;
    iconUrl: string;
    supportedCurrencies: string[];
}

export interface PaymentSessionResponse {
    transactionId: string;
    paymentProvider: string;
    flowType: PaymentFlowType;
    sessionId: string;
    authorizationUrl: string; // The URL to send the user to
    provider: string;
    accessCode?: string;      // Used by Paystack/Flutterwave SDKs
    clientSecret?: string;    // Used by Stripe
    publishableKey?: string;
    status: string;
    amountPayable: number;
    currency: string;
    description: string;
    paymentMetadata: Record<string, any>;
    message: string;
    success: boolean;
}

export interface PaymentVerificationResponse {
    success: boolean;
    status: string;               // e.g., "SUCCESSFUL", "FAILED", "PENDING"
    transactionId: string;        // Your internal Booking/Delivery ID
    paymentProvider: string;      // The provider used
    amount: string;               // Formatted amount (e.g., "₦5,000.00")
    providerTransactionId: string; // The gateway's internal reference
    providerReference: string;     // The reference used during initiation
    amountPaid: number;            // Numeric value actually paid
    currency: string;
    completedAt: string;           // ISO Timestamp
    nextAction: string;            // e.g., "REDIRECT_TO_DASHBOARD"
    message: string;               // Backend feedback message
    failureReason: string | null;  // Why it failed, if applicable
    alternativePaymentMethods: string[]; // Suggestions if current provider failed
}