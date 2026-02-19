'use server'

import { AddHubTelephoneRequest, AddHubWorkingHoursRequest, CreateHubRequest, CreateHubResponse, HubFullDetailDTO, UpdateAuthoritiesRequest, UpdateHubRequest, UpdateHubResponse, UserFilterParams, UserResponseDTO } from "@/types/admin";
import { cookies } from "next/headers";
import { AuthResponse } from "../actions";
import { DriverDetailDTO, DriverSummaryDTO, MapDriverRequest, TrackingEvent } from "@/types/driver";



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
 * Fetch a paginated list of users with advanced filtering.
 * ADMIN ONLY
 * Matches GET http://localhost:8084/api/v1/customers/users
 */
export async function getPaginatedUsers(
    params: UserFilterParams
): Promise<UserResponseDTO[]> {
    const authHeader = await getAuthHeader();

    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null)
    );
    const queryString = new URLSearchParams(filteredParams as any).toString();

    try {
        const res = await fetch(`http://localhost:8084/api/v1/customers/users?${queryString}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch users");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("List Users API Error:", error.message);
        throw error;
    }
}


/**
 * Fetch a specific user's profile by their email address.
 * ADMIN ONLY
 * Matches GET http://localhost:8084/api/v1/customers/email?email=...
 */
export async function getUserByEmail(email: string): Promise<UserResponseDTO> {
    const authHeader = await getAuthHeader();
    const encodedEmail = encodeURIComponent(email);

    try {
        const res = await fetch(`http://localhost:8084/api/v1/customers/email?email=${encodedEmail}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': 'application/json' 
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || `User with email ${email} not found`);
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Email Lookup Error:", error.message);
        throw error;
    }
}


/**
 * Update a user's permissions/authorities.
 * ADMIN ONLY
 * Matches PUT http://localhost:8084/api/v1/customers/users/{userId}/update-authorities
 * 
 * When building the Admin UI for role management, keep these factors in mind:
 * Self-Demotion Prevention: The UI should prevent an admin from removing their own ADMIN authority to avoid locking themselves out of the system.
 * Impact Awareness: Changing a user to DRIVER might trigger a requirement for additional fields (like vehicle info) in other services, or changing to ADMIN gives the 
 * access to sensitive financial data in the Transaction Service (8188).
 * Audit Logging: Since the backend likely logs this change, the UI should ideally show a "Reason for change" field (even if stored locally or in a separate
 * audit service).
 */
export async function updateUserAuthorities(
    userId: string | number,
    payload: UpdateAuthoritiesRequest
): Promise<UserResponseDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `http://localhost:8084/api/v1/customers/users/${userId}/update-authorities`, 
            {
                method: 'PUT',
                headers: { 
                    ...authHeader, 
                    'Content-Type': 'application/json',
                    'accept': 'application/json' 
                },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to update user authorities");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Authority Update Error:", error.message);
        throw error;
    }
}


/**
 * Update core Hub location details.
 * Matches PUT http://localhost:8098/api/v1/hubs/update-hub
 */
export async function updateHubCoreDetails(
    payload: UpdateHubRequest
): Promise<UpdateHubResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch("http://localhost:8098/api/v1/hubs/update-hub", {
            method: 'PUT',
            headers: { 
                ...authHeader, 
                'Content-Type': 'application/json',
                'accept': 'application/json' 
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to update hub details");
        }

        return await res.json();
    } catch (error: any) {
        console.error("Hub Update Error:", error.message);
        throw error;
    }
}

/**
 * 
 * DRIVERS
 * 
 */
/**
 * Assign or re-map a driver to a specific operational Hub.
 * Matches PUT http://localhost:8187/api/v1/drivers/{driverId}/map-driver
 */
export async function mapDriverToHub(
    driverId: string | number,
    payload: MapDriverRequest
): Promise<DriverSummaryDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`http://localhost:8187/api/v1/drivers/${driverId}/map-driver`, {
            method: 'PUT',
            headers: { 
                ...authHeader, 
                'Content-Type': 'application/json',
                'accept': 'application/json' 
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to map driver to the selected hub");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Map Driver Error:", error.message);
        throw error;
    }
}

/**
 * View detailed performance and profile of a single driver.
 * Matches GET http://localhost:8187/api/v1/drivers/{driverId}/view-driver
 */
export async function getDriverDetail(driverId: string | number): Promise<DriverDetailDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`http://localhost:8187/api/v1/drivers/${driverId}/view-driver`, {
            method: 'GET',
            headers: { ...authHeader, 'accept': 'application/json' },
            cache: 'no-store'
        });

        if (!res.ok) throw new Error("Driver not found or error fetching performance data");
        return await res.json();
    } catch (error: any) {
        console.error("View Driver Error:", error.message);
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