export interface DriverSummaryDTO {
    driverId: number;
    driverName: string;
    phoneNumber: string;
    email: string;
}

export interface DriverDetailDTO extends DriverSummaryDTO {
    completedOrders: string; // Counts are returned as strings in this API
    cancelledOrders: string;
    pendingOrders: string;
}

export interface DriverFilterParams {
    createdAt?: string;
    per_page?: number;
    page?: number;
    id?: number;
    driverName?: string;
    phoneNumber?: string;
    email?: string;
}

export interface MapDriverRequest {
    hubId: number;
}

export interface AssignedDriverDetails {
    id: number;
    driverName: string;
    image: string;
    completedOrders: string;
    cancelledOrders: string;
    pendingOrders: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
    city: string;
    vehicleType: string;
    vehiclePlateNumber: string;
    isAvailable: boolean;
    isActive: boolean;
    rating: number;
    totalDeliveries: number;
    maxDailyPickups: number;
    createdAt: string;
    updatedAt: string;
    fullName: string;
}

export interface PickupResponseDTO {
    id: number;
    bookingId: number;
    pickupDate: string;
    pickupTimeSlot: string;
    pickupAddress: string;
    pickupCity: string;
    pickupState: string;
    contactPerson: string;
    contactPhone: string;
    specialInstructions: string;
    status: string; // e.g., "PENDING", "COMPLETED", "FAILED"
    assignedDriver: AssignedDriverDetails | null;
    actualPickupTime: string | null;
    failureReason: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

//PICKUP types

export interface AssignedDriverDetails {
    id: number;
    driverName: string;
    image: string;
    completedOrders: string;
    cancelledOrders: string;
    pendingOrders: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
    city: string;
    vehicleType: string;
    vehiclePlateNumber: string;
    isAvailable: boolean;
    isActive: boolean;
    rating: number;
    totalDeliveries: number;
    maxDailyPickups: number;
    createdAt: string;
    updatedAt: string;
    fullName: string;
}

export interface PickupResponseDTO {
    id: number;
    bookingId: number;
    pickupDate: string;
    pickupTimeSlot: string;
    pickupAddress: string;
    pickupCity: string;
    pickupState: string;
    contactPerson: string;
    contactPhone: string;
    specialInstructions: string;
    status: string; // e.g., "PENDING", "COMPLETED", "FAILED"
    assignedDriver: AssignedDriverDetails | null;
    actualPickupTime: string | null;
    failureReason: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface TimeSlotDTO {
    slot: string;           // e.g., "MORNING_09_12"
    isAvailable: boolean;
    availableDrivers: number;
    displayText: string;    // e.g., "9:00 AM - 12:00 PM"
}

export interface SchedulePickupRequest {
    bookingId: number;
    date: string;           // YYYY-MM-DD
    timeSlot: string;
    pickupAddress: string;
    city: string;
    state: string;
    contactPerson: string;
    contactPhone: string;
    customerEmail: string;
    specialInstructions: string;
}

export interface SchedulePickupResponse {
    pickupId: number;
    bookingId: number;
    pickupDate: string;
    pickupTimeSlot: string;
    status: string;
    driverName: string;
    driverPhone: string;
    confirmationMessage: string;
}

export interface TrackingEvent {
    id?: number;
    trackingNumber: string;
    eventTime: string;
    eventType: string; // e.g., "PICKED_UP", "IN_TRANSIT", "ARRIVED_AT_HUB"
    location: string;
    description: string;
    facility?: string;
    handledBy?: string;
    createdAt?: string;
}

export interface FullTrackingResponseDTO {
    trackingNumber: string;
    currentStatus: string;
    currentLocation: string;
    lastUpdated: string;
    estimatedDaysRemaining: number;
    totalWeight: number;
    isDelivered: boolean;
    events: TrackingEvent[];
}

// Define a type that combines the API response with your UI timeline
export type DisplayTracking = FullTrackingResponseDTO & {
    stages: {
        stage: string;
        date: string;
        time: string;
        description: string;
        completed: boolean;
    }[];
};

export interface DeliveryStats {
    addressType: string;
    totalDeliveries: number;
    deliveredItems: number;
    pendingItems: number;
    inTransitItems: number;
    totalAmount: number;
    deliveredAmount: number;
}

export interface OverallStats {
    totalBookings: number;
    totalDelivered: number;
    totalRevenue: number;
    averageOrderValue: number;
}

export interface TrackingStatisticsDTO {
    homeDeliveries: DeliveryStats;
    officeDeliveries: DeliveryStats;
    overallStats: OverallStats;
    userEmail: string;
}