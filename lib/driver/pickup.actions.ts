'use server'

import { cookies } from "next/headers";
import { AuthResponse } from "../actions";
import { PickupResponseDTO, SchedulePickupRequest, SchedulePickupResponse, TimeSlotDTO } from "@/types/driver";



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
 * Fetch available time slots for a specific city and date.
 * Matches GET /api/v1/pickups/available-slots
 */
export async function getAvailableSlots(city: string, date: string): Promise<TimeSlotDTO[]> {
    const authHeader = await getAuthHeader();
    try {
        const res = await fetch(
            `http://localhost:8187/api/v1/pickups/available-slots?city=${encodeURIComponent(city)}&date=${date}`, 
            {
                method: 'GET',
                headers: { ...authHeader, 'accept': '*/*' },
                cache: 'no-store'
            }
        );
        return await res.json();
    } catch (error: any) {
        console.error("Fetch Slots Error:", error.message);
        throw error;
    }
}

/**
 * Schedule a new pickup for a booking.
 * Matches POST /api/v1/pickups/schedule
 */
export async function schedulePickup(payload: SchedulePickupRequest): Promise<SchedulePickupResponse> {
    const authHeader = await getAuthHeader();
    const res = await fetch("http://localhost:8187/api/v1/pickups/schedule", {
        method: 'POST',
        headers: { 
            ...authHeader, 
            'Content-Type': 'application/json',
            'accept': '*/*' 
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to schedule pickup");
    return await res.json();
}

/**
 * Reschedule an existing pickup to a new date/time.
 * Matches PUT /api/v1/pickups/{pickupId}/reschedule
 */
export async function reschedulePickup(
    pickupId: number | string,
    newDate: string,
    newTimeSlot: string
): Promise<PickupResponseDTO> {
    const authHeader = await getAuthHeader();
    const res = await fetch(
        `http://localhost:8187/api/v1/pickups/${pickupId}/reschedule?newDate=${newDate}&newTimeSlot=${newTimeSlot}`, 
        {
            method: 'PUT',
            headers: { ...authHeader, 'accept': '*/*' }
        }
    );
    if (!res.ok) throw new Error("Rescheduling failed. Slot might be full.");
    return await res.json();
}

/**
 * Cancel a scheduled pickup with a specific reason.
 * Matches PUT http://localhost:8187/api/v1/pickups/{pickupId}/cancel?reason=...
 */
export async function cancelPickup(
    pickupId: string | number,
    reason: string
): Promise<string> {
    const authHeader = await getAuthHeader();
    const encodedReason = encodeURIComponent(reason);

    try {
        const res = await fetch(
            `http://localhost:8187/api/v1/pickups/${pickupId}/cancel?reason=${encodedReason}`, 
            {
                method: 'PUT',
                headers: { 
                    ...authHeader, 
                    'accept': '*/*' 
                }
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to cancel the pickup");
        }

        // Returns "success" or a success message string
        return await res.text();
        
    } catch (error: any) {
        console.error("Cancel Pickup Error:", error.message);
        throw error;
    }
}