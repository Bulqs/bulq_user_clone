export enum PickupTypes {
    M2A = "M2A",
    A2M = "A2M",
    SA2 = "SA2",
    PUO = "PUO"
}

export enum ShipmentType {
    EXPRESS = "EXPRESS",
    STANDARD = "STANDARD",
    PRIORITY = "IMPORTANT"
}


export type BookingPayload = {
    sender_firstname: string;
    sender_lastname: string;
    sender_phoneNumber: string;
    sender_address: string;
    sender_email: string;
    sender_city: string;
    sender_country: string;
    sender_state: string;
    sender_lga: string;
    receiver_firstname: string;
    receiver_lastname: string;
    receiver_phoneNumber: string;
    receiver_address: string;
    receiver_email: string;
    receiver_city: string;
    receiver_country: string;
    receiver_state: string;
    receiver_lga: string;
    package_name: string;
    package_description: string;
    package_image: string;
    vendor: string;
    weight: number;
    shipment_type: ShipmentType;
    pickupType: PickupTypes;
    shipping_amount: number;
    pick_up_date: string;
    pick_up_time: string;
    length: number;
    width: number;
    height: number;
    declaredValue: number;
    productCategory: string;
    hsCode: string;
    itemDescription: string;
    includeInsurance: boolean;
    promoCode: string;
    calculateShipping: boolean;
};

export type BookingResponseDTO = {
    deliveryId: string;
    trackingNumber: string;
    totalCost: number;
    baseShippingCost: number;
    customsCost: number;
    insuranceCost: number;
    discountAmount: number;
    currency: string;
    message: string;
    appointmentDate: string;
};

export type BADOBookingPayload = {
    // --- SENDER DETAILS ---
    senderFirstName: string;
    senderLastName: string;
    senderPhoneNumber: string;
    senderAddress: string;
    senderEmail: string;
    senderCity: string;
    senderCountry: string;
    senderState: string;
    senderLga: string;
    senderPostCode: string;

    // --- RECEIVER DETAILS ---
    receiverFirstname: string;
    receiverLastname: string;
    receiverPhoneNumber: string;
    receiverAddress: string;
    receiverEmail: string;
    receiverCity: string;
    receiverCountry: string;
    receiverState: string;
    receiverLga: string;
    receiverPostCode: string;

    // --- APPOINTMENT & HUB DETAILS ---
    appointmentDate: string; // ISO String: 2026-02-07T07:12:38.772Z
    hubId: string;           // <--- ADDED: Unique ID of the selected hub
    
    // Hub Metadata (Snapshot for this booking)
    email: string;           // Hub contact email
    phoneNumber: string;     // Hub contact phone
    city: string;            // Hub city
    country: string;         // Hub country
    address: string;         // Hub address
    state: string;           // Hub state (Province)
    lga: string;             // Hub lga (or City if replacing LGA)

    // --- PACKAGE DETAILS ---
    package_name: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    package_description: string;
    packageImage: string;
    productCategory: string;
    hsCode: string;
    itemDescription: string;
    vendor: string;
    declaredValue: number;

    // --- CONFIGURATION ---
    shipmentType: string;
    pickupType: string;
    shippingAmount: number;
    pickUpDate: string;
    pickUpTime: string;
    includeInsurance: boolean;
    promoCode: string;
    calculateShipping: boolean;
};

// Book a delivery appointment response DTO
export interface BADOResponseDTO {
    deliveryId: string;          // The unique booking reference (e.g., BQ-101)
    trackingNumber: string;      // The tracking code for the customer
    totalCost: number;           // Mapped from BigDecimal
    baseShippingCost: number;    // Mapped from BigDecimal
    customsCost: number;         // Mapped from BigDecimal
    insuranceCost: number;       // Mapped from BigDecimal
    discountAmount: number;      // Mapped from BigDecimal
    currency: string;            // e.g., "NGN" or "USD"
    message: string;             // Status message from backend
    appointmentDate: string;     // Date string from backend
}

// Individual booking item in the list
export interface FilterBookingViewDTO {
    id: number;
    delivery_id: string;
    sender_lastname: string;
    sender_phoneNumber: string;
    receiver_phoneNumber: string;
    receiver_address: string;
    receiver_email: string;
    phoneNumber: string;
    address: string;
    email: string;
    city: string;
    country: string;
    deliveryStatus?: string;
    lga: string;
    package_name: string;
    weight: number; // BigDecimal -> number
    package_description: string;
    shipment_type: string;
    pickupType: string;
    shipping_amount: number; // BigDecimal -> number
    pick_up_date: string;
    pick_up_time: string;
    dropoff_date: string;
    dropoff_time: string;
    trackingNumber: string;
    packageImage?: string;
    status?: string;
    vendor: string
}

// Search/Filter parameters for the GET request
export interface BookingFilterParams {
    createdAt?: string;
    per_page?: number;     // e.g., 10
    page?: number;         // e.g., 1
    sender_firstName?: string;
    receiver_firstName?: string;
    deliveryId?: string;
    shipment_type?: string;
    pickupType?: string;
    phoneNumber?: string;
    email?: string;
    status?: string;       // e.g., "NEW", "PENDING", "COMPLETED"
    dateRange?: string;    // e.g., "2023-01-01 to 2024-01-01"
}


// Statistical types definitions DTO
export interface BookingSummaryDTO {
    month: string;
    year: number;
    day: number;
    status: string;
    totalItems: number;
    totalShippingAmount: number;
}

export interface BookingStatistics {
    totalBookings: number;
    totalRevenue: number;
    pendingCount: number;
    inTransitCount: number;
    awaitingShipmentCount: number;
    unclaimedItemsCount: number;
}

export interface RoleBasedStatistics {
    totalAsSender: number;
    totalAsReceiver: number;
    revenueAsSender: number;
    revenueAsReceiver: number;
}

export interface BookingAnalyticsResponse {
    barChartData: BookingSummaryDTO[];
    pieChartData: BookingSummaryDTO[];
    statistics: BookingStatistics;
    roleBasedStatistics: RoleBasedStatistics;
}

export interface BookingAnalyticsRequest {
    statuses: string[];    // e.g., ["NEW", "PENDING", "DELIVERED"]
    dateRange?: string;    // e.g., "LAST_30_DAYS"
    customStartDate?: string;
    customEndDate?: string;
    groupBy?: string;      // e.g., "MONTH" or "DAY"
    role?: string;         // e.g., "USER" or "ADMIN"
}

export interface AdditionalChargeDetail {
    chargeName: string;
    chargeType: string;
    chargeAmount: number;
}

export interface DiscountDetail {
    discountName: string;
    discountCode: string;
    discountAmount: number;
}

export interface CustomsCalculation {
    dutyAmount: number;
    vatAmount: number;
    importTax: number;
    luxuryTax: number;
    clearanceFee: number;
    totalCustomsCost: number;
    dutyRate: string;
    vatRate: string;
    isDutyFree: boolean;
    isTaxFree: boolean;
    notes: string;
}

export interface ShippingRateBreakdown {
    baseRate: number;
    weightCharge: number;
    dimensionalCharge: number;
    fuelSurcharge: number;
    insuranceCharge: number;
    pickupCharge: number;
    packagingCharge: number;
    handlingCharge: number;
    customsCharge: number;
    additionalCharges: AdditionalChargeDetail[];
    discounts: DiscountDetail[];
}

export interface ShippingRateResponse {
    originZone: string;
    destinationZone: string;
    shippingMethod: string;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
    actualWeight: number;
    volumetricWeight: number;
    chargeableWeight: number;
    baseRate: number;
    weightCharge: number;
    fuelSurcharge: number;
    insuranceCharge: number;
    breakdown: ShippingRateBreakdown;
    subtotal: number;
    discount: number;
    totalAmount: number;
    currency: string;
    success: boolean;
    message: string;
    customsCalculation: CustomsCalculation;
    totalWithCustoms: number;
}

type ShippingMethod = 'STANDARD' | 'EXPRESS' | 'ECONOMY' | 'Consolidate';
export interface ShippingRateRequest {
    originCountry: string;
    originState: string;
    destinationCountry: string;
    destinationState: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    shippingMethodCode: ShippingMethod;
    declaredValue: number;
    promoCode?: string;
    includeInsurance: boolean;
    pickupRequired: boolean;
    productCategory: string;
    hsCode?: string;
    itemDescription: string;
}

// multi-package shipping rate calculator

export interface SinglePackageRequest {
    weight: number;
    length: number;
    width: number;
    height: number;
    declaredValue: number;
    contents: string;
    productCategory: string;
}

export interface PackageCalculation {
    packageNumber: number;
    weight: number;
    chargeableWeight: number;
    individualCost: number;
}

export interface MultiPackageRequest {
    originCountry: string;
    originState: string;
    destinationCountry: string;
    destinationState: string;
    shippingMethodCode: string;
    packages: SinglePackageRequest[];
    includeInsurance: boolean;
    promoCode?: string;
}

export interface MultiPackageResponse {
    totalPackages: number;
    totalWeight: number;
    totalValue: number;
    baseShippingCost: number;
    multiPackageDiscount: number;
    totalAfterDiscount: number;
    packageCalculations: PackageCalculation[];
    success: boolean;
    message: string;
}

// update booking for customer can use the cancel option
export type BookingStatus = 
    | "CANCEL" 
    | "PENDING" 
    | "DELIVERED" 
    | "CONSOLIDATED" 
    | "IN_TRANSIT" 
    | "AWAITING_SHIPMENT" 
    | "RECEIVED" 
    | "SHIPPED" 
    | "SHIP_NOW" 
    | "SURVEY";

export interface UpdateBookingStatusPayload {
    status: BookingStatus;
}



export interface ReturnShippingRequest {
    trackingNumber: string;
    returnReason: ReturnReason;
    additionalNotes?: string;
    returnAddress: string;
    requiresPickup: boolean;
}

// detailed hipping breakdown admin wowns some of this endpoints
export interface DetailedCostBreakdown {
    trackingNumber: string;
    attemptCount: number;      // Number of delivery attempts made
    storageFee: number;        // Accumulated fee if item stayed at hub too long
    returnShippingFee: number; // Cost if the item is being sent back to sender
    redeliveryFee: number;     // Cost to try delivering again
    totalCost: number;         // Sum of all operational fees
    status: string;            // Current status of the shipment
    recommendation: string;    // Backend advice (e.g., "Recommend redelivery")
}

export interface FieldChangeAuditDTO {
    id: number;
    rateId: number;
    changedBy: string;      // Username or ID of the admin
    changedAt: string;      // ISO Timestamp
    changeType: string;      // e.g., "UPDATE", "MANUAL_ADJUSTMENT"
    fieldChanged: string;    // e.g., "baseRate"
    oldValue: string;        // Stored as string to handle different data types
    newValue: string;
    reason: string;          // Why the change was made
    ipAddress: string;       // For security auditing
}

export interface ProhibitedItemsParams {
    originCountry: string;      // ISO Alpha-2 code (e.g., "NG")
    destinationCountry: string; // ISO Alpha-2 code (e.g., "CA")
}

export type ReturnReason = 
    | "QUALITY_ISSUE" 
    | "DEFECTIVE" 
    | "WRONG_ITEM" 
    | "NOT_AS_DESCRIBED" 
    | "SIZE_ISSUE" 
    | "CHANGE_OF_MIND" 
    | "DUPLICATE_ORDER" 
    | "LATE_DELIVERY" 
    | "OTHER";

export interface QuickReturnResponse {
    trackingNumber: string;
    returnReason: string;
    isFreeReturn: boolean;
    returnCost: number;
    returnLabel: string;
    instructions: string;
    shippingDetails: ShippingRateResponse; // Reusing the previously defined DTO
}

export interface RateAuditLogDTO {
    id: number;
    rateId: number;
    changedBy: string;      // Admin username
    changedAt: string;      // ISO Timestamp
    changeType: string;      // e.g., "MANUAL_OVERRIDE", "SYSTEM_UPDATE"
    fieldChanged: string;    // e.g., "insuranceCharge"
    oldValue: string;
    newValue: string;
    reason: string;
    ipAddress: string;
}

export interface BookingSummaryParams {
    dateRange?: string; // e.g., "30_DAYS", "7_DAYS", "12_MONTHS"
    groupBy?: string;   // e.g., "MONTH", "DAY", "YEAR"
    role?: string;      // e.g., "SENDER", "RECEIVER", "ALL"
}

export interface BookingDateFilterParams {
    statuses?: string; // e.g., "NEW,PENDING"
    day?: number;
    month?: string;    // e.g., "February"
    year?: number;
}

export interface TrackingLookupResponse {
    delivery_id: string;
    senderEmail: string;
    receiverEmail: string;
    trackingNumber: string;
    shipping_amount: string; // Note: String type from backend
    successResponse: string; // Usually a status message like "Tracking found"
}

export interface BookingSummaryDTO {
    month: string;
    year: number;
    day: number;
    status: string;
    totalItems: number;          // Long -> number
    totalShippingAmount: number;  // Double -> number
}

export interface UserAuditLogDTO {
    id: number;
    rateId: number;
    changedBy: string;      // The username searched (e.g., "redOx98")
    changedAt: string;      // ISO Timestamp
    changeType: string;      // e.g., "UPDATE", "DELETE", "MANUAL_FIX"
    fieldChanged: string;    // The specific column modified
    oldValue: string;
    newValue: string;
    reason: string;
    ipAddress: string;
}

// export type ShippingMethod = 'EXPRESS' | 'STANDARD' | 'PRIORITY';
export type RestrictionType = 'PROHIBITED' | 'RESTRICTED' | 'PERMITTED' | 'DANGEROUS_GOODS';

export interface ItemValidationParams {
    itemCategory: string;
    itemDescription: string;
    originCountry: string;      // ISO Alpha-2 (e.g., "CA")
    destinationCountry: string; // ISO Alpha-2 (e.g., "NG")
    shippingMethod: ShippingMethod;
}

export interface ItemValidationResponse {
    canShip: boolean;
    restrictionType: RestrictionType;
    message: string;
    specialRequirements: string;
    warnings: string[];
    requiredDocuments: string[];
}

export interface DeliveryActionViewDTO {
    id: number;
    activity: string; // e.g., "Package Picked Up", "Arrived at Lagos Hub"
}

export interface TrackingBookingViewDTO {
    id: number;
    delivery_id: string;
    sender_lastname: string;
    sender_phoneNumber: string;
    receiver_phoneNumber: string;
    receiver_address: string;
    receiver_email: string;
    phoneNumber: string;
    address: string;
    email: string;
    city: string;
    country: string;
    lga: string;
    package_name: string;
    weight: number;
    package_description: string;
    shipment_type: string;
    pickupType: string;
    shipping_amount: number;
    pick_up_date: string;
    pick_up_time: string;
    dropoff_date: string;
    dropoff_time: string;
    actions: DeliveryActionViewDTO[]; // The timeline events
}

// INSURANCE

export interface InsurancePolicyDTO {
    id: number;
    methodCode: string;          // e.g., "STANDARD"
    maxCoverageAmount: number;   // Max payout if lost/damaged
    minDeclaredValue: number;    // Minimum item value required for insurance
    insuranceRate: number;       // Percentage or fixed rate
    minimumPremium: number;      // Lowest cost to insure
    requiredDocuments: string;   // Raw string description
    claimProcessUrl: string;     // Link to the claims portal
    claimProcessingDays: number; // SLA for claims
    coverageDetails: string;     // Text description of what is covered
    exclusions: string;          // What is NOT covered
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    requiredDocumentsList: string[]; // Structured list for UI checklists
}

export type ClaimStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface InsuranceClaimDTO {
    claimReference: string;   // Unique ID for the claim (generated or provided)
    trackingNumber: string;   // The link to the original booking
    claimAmount: number;      // Amount requested (should be <= maxCoverageAmount)
    claimReason: string;      // e.g., "DAMAGED_ITEM", "LOST_IN_TRANSIT"
    description: string;      // User's detailed explanation
    status: string;           // e.g., "SUBMITTED"
    submittedDate: string;    // ISO Timestamp
    resolvedDate?: string;    // Populated when the claim is closed
    supportingDocuments: string; // URL or file reference
}

// LOYALTY FOR CUSTOMERS ADMIN VIEW ONLY
export interface LoyaltyTierStatistics {
    standardCount: number;
    bronzeCount: number;
    silverCount: number;
    goldCount: number;
    platinumCount: number;
    totalCustomers: number;
}

export interface NextTierRequirements {
    nextTier: string;      // e.g., "SILVER", "GOLD"
    amountNeeded: number;  // The remaining spend required
    tierThreshold: number; // The total spend required for that tier
}

export interface CustomerLoyaltyInfo {
    id: number;
    customerEmail: string;
    shipmentsThisMonth: number;
    spentThisMonth: number;
    totalLifetimeShipments: number;
    totalLifetimeSpend: number;
    currentTier: string;      // e.g., "BRONZE", "SILVER", "GOLD"
    tierStartDate: string;    // "YYYY-MM-DD"
    currentMonthStart: string; // "YYYY-MM-DD"
    discountPercent: number;  // e.g., 5 for 5%
    lastUpdated: string;      // ISO Timestamp
    createdAt: string;        // ISO Timestamp
}

export interface TrackingEvent {
    id?: number;
    trackingNumber: string;
    eventTime: string;    // ISO Timestamp
    eventType: string;    // e.g., "PICKED_UP", "IN_TRANSIT", "DELIVERED"
    location: string;
    description: string;
    handledBy?: string;
    facility?: string;
    createdAt?: string;
}

export interface FullTrackingDetails {
    trackingNumber: string;
    currentStatus: string;
    currentLocation: string;
    lastUpdated: string;
    estimatedDaysRemaining: number;
    isDelivered: boolean;
    events: TrackingEvent[];
}