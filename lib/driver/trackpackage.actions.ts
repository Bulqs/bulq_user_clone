'use server'

import { cookies } from "next/headers";
import { AuthResponse } from "../actions";
import { DriverDetailDTO, DriverSummaryDTO, FullTrackingResponseDTO, MapDriverRequest } from "@/types/driver";
import { TrackingEvent } from "@/types/booking";
import { getSession } from "../session";



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
 * Get the full history and status of a package.
 * Matches GET /api/v1/tracking/{trackingNumber}
 */
// lib/driver/trackpackage.actions.ts
export async function getFullTracking(trackingNumber: string) {
    try {
        // 1. Get the decrypted token from the session
        const authHeader = await getAuthHeader();

        const res = await fetch(`http://localhost:8187/api/v1/tracking/${trackingNumber}`, {
            method: 'GET',
            headers: { 
                ...authHeader, // 2. Spread the Authorization header here
                'accept': '*/*' 
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            return { error: "NOT_FOUND", message: "Tracking number not found" };
        }

        // 3. IMPORTANT: Don't console.log(res.json())! 
        // If you want to debug, log the data after it's parsed.
        const data = await res.json();
        console.log("Tracking Data:", data);
        
        return data;
    } catch (error: any) {
        console.error("Fetch Error:", error.message);
        return { error: "SERVER_ERROR", message: "Connection to tracking server failed" };
    }
}
// export async function getFullTracking(trackingNumber: string): Promise<FullTrackingResponseDTO> {
//     try {
//         const res = await fetch(`http://localhost:8187/api/v1/tracking/${trackingNumber}`, {
//             method: 'GET',
//             headers: { 'accept': '*/*' },
//             cache: 'no-store'
//         });

//         if (!res.ok) throw new Error("Tracking number not found");
//         return await res.json();
//     } catch (error: any) {
//         console.error("Full Tracking Error:", error.message);
//         throw error;
//     }
// }

/**
 * Get only the most recent tracking update.
 * Matches GET /api/v1/tracking/{trackingNumber}/latest
 */
export async function getLatestTrackingEvent(trackingNumber: string): Promise<TrackingEvent> {
    const res = await fetch(`http://localhost:8187/api/v1/tracking/${trackingNumber}/latest`, {
        headers: { 'accept': '*/*' }
    });
    if (!res.ok) throw new Error("Latest event not found");
    return await res.json();
}

/**
 * Quick check to see if a package is delivered.
 * Matches GET /api/v1/tracking/{trackingNumber}/is-delivered
 */
export async function checkDeliveryStatus(trackingNumber: string): Promise<boolean> {
    const res = await fetch(`http://localhost:8187/api/v1/tracking/${trackingNumber}/is-delivered`);
    if (!res.ok) return false;
    const data = await res.text();
    return data === 'true';
}