import { DriverDetailDTO, DriverFilterParams, DriverSummaryDTO, PickupResponseDTO, TrackingEvent } from "@/types/driver";
import { AuthResponse } from "../actions";
import { cookies } from "next/headers";




async function getAuthHeader(): Promise<Record<string, string>> {
    const session = (await cookies()).get("session")?.value;
    if (!session) return {};
    
    try {
        // Since you're using createSession from your session logic,
        // the cookie is likely an encrypted/encoded string.
        // If it's the raw JSON string:
        const user = JSON.parse(session) as AuthResponse;
        return { 'Authorization': `Bearer ${user.token}` };
    } catch (e) {
        console.error("Auth header error:", e);
        return {};
    }
}
/**
 * Fetch a paginated list of all drivers with filters.
 * ADMIN ONLY
 * Matches GET http://localhost:8187/api/v1/drivers/all
 */
export async function getPaginatedDrivers(
    params: DriverFilterParams
): Promise<DriverSummaryDTO[]> {
    const authHeader = await getAuthHeader();
    const query = new URLSearchParams(params as any).toString();

    try {
        const res = await fetch(`http://localhost:8187/api/v1/drivers/all?${query}`, {
            method: 'GET',
            headers: { ...authHeader, 'accept': '*/*' },
            cache: 'no-store'
        });

        if (!res.ok) throw new Error("Failed to fetch drivers list");
        return await res.json();
    } catch (error: any) {
        console.error("List Drivers Error:", error.message);
        throw error;
    }
}

/**
 * Get all pickups assigned to a specific driver for a specific date.
 * Typically used for the Driver's Daily Manifest.
 * Matches GET /api/v1/pickups/driver/{driverId}?date=YYYY-MM-DD
 */
export async function getDriverDailyPickups(
    driverId: string | number,
    date: string // Format: YYYY-MM-DD
): Promise<PickupResponseDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`http://localhost:8187/api/v1/pickups/driver/${driverId}?date=${date}`, {
            method: 'GET',
            headers: { ...authHeader, 'accept': '*/*' },
            cache: 'no-store'
        });

        if (!res.ok) throw new Error("Failed to fetch driver pickups");
        return await res.json();
    } catch (error: any) {
        console.error("Driver Pickup Fetch Error:", error.message);
        throw error;
    }
}

/**
 * Get pickup details associated with a specific Booking ID.
 * Matches GET /api/v1/pickups/booking/{bookingId}
 */
export async function getPickupByBookingId(
    bookingId: string | number
): Promise<PickupResponseDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`http://localhost:8187/api/v1/pickups/booking/${bookingId}`, {
            method: 'GET',
            headers: { ...authHeader, 'accept': '*/*' },
            cache: 'no-store'
        });

        if (!res.ok) throw new Error("Pickup not found for this booking");
        return await res.json();
    } catch (error: any) {
        console.error("Booking Pickup Fetch Error:", error.message);
        throw error;
    }
}

/**
 * Manually create a tracking event for a package.
 * Typically used by Drivers upon arrival or Admins for status overrides.
 * Matches POST /api/v1/tracking/{trackingNumber}/events
 */
export async function createManualTrackingEvent(
    trackingNumber: string,
    params: {
        eventType: string; // e.g., "PICKED_UP", "IN_TRANSIT", "DELIVERED"
        location: string;  // e.g., "IKD" (Ikorodu Hub)
        description: string;
    }
): Promise<TrackingEvent> {
    const authHeader = await getAuthHeader();
    
    // Construct the query string from the params object
    const queryString = new URLSearchParams(params).toString();

    try {
        const res = await fetch(
            `http://localhost:8187/api/v1/tracking/${trackingNumber}/events?${queryString}`, 
            {
                method: 'POST',
                headers: { 
                    ...authHeader, 
                    'accept': '*/*' 
                },
                // The body is empty as data is in the URL
                body: '', 
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to create tracking event");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Manual Tracking Event Error:", error.message);
        throw error;
    }
}