'use server'

import { cookies } from "next/headers";
import { AuthResponse } from "../actions";
import { PickupResponseDTO, SchedulePickupRequest, SchedulePickupResponse, TimeSlotDTO } from "@/types/driver";
import { AuditLogDTO, entityType, LogCountResponse, PageableResponse, ServiceName } from "@/types/logs";



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
 * Fetch audit logs for a specific user filtered by service name.
 * Matches GET http://localhost:8041/api/logs/user/{userId}/service/{serviceName}
 */
export async function getUserServiceLogs(
    userId: string | number,
    serviceName: ServiceName,
    limit: number = 10
): Promise<AuditLogDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `http://localhost:8041/api/logs/user/${userId}/service/${serviceName}?limit=${limit}`, 
            {
                method: 'GET',
                headers: { 
                    ...authHeader, 
                    'accept': '*/*' 
                },
                cache: 'no-store'
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch audit logs");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Audit Log Fetch Error:", error.message);
        throw error;
    }
}

/**
 * Fetch all audit logs for a specific user across all microservices.
 * Useful for building a "User Activity Timeline".
 * Matches GET http://localhost:8041/api/logs/user/{userId}
 *  UI Implementation: Activity TimelineWhen displaying these logs in a "User Profile" or "Admin Dashboard," you can treat the data as a stream of
 * events:TimeActivityServiceDescription10:08 AMUSER_LOGINAUTHUser logged in from IP 192.168...09:45 AMBOOKING_CREATEBOOKINGNew shipment created: #BK-99209:30
 * AMWALLET_DEPOSITWALLETSuccessfully funded ₦5,000
 */
export async function getAllUserLogs(
    userId: string | number,
    limit: number = 5
): Promise<AuditLogDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `http://localhost:8041/api/logs/user/${userId}?limit=${limit}`, 
            {
                method: 'GET',
                headers: { 
                    ...authHeader, 
                    'accept': '*/*' 
                },
                cache: 'no-store'
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch general user logs");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("User Log Fetch Error:", error.message);
        throw error;
    }
}

/**
 * Get a statistical count of all logs for a specific user.
 * Matches GET http://localhost:8041/api/logs/user/{userId}/count
 */
export async function getUserLogCount(
    userId: string | number
): Promise<LogCountResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `http://localhost:8041/api/logs/user/${userId}/count`, 
            {
                method: 'GET',
                headers: { 
                    ...authHeader, 
                    'accept': '*/*' 
                },
                cache: 'no-store'
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch log counts");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Log Count Fetch Error:", error.message);
        throw error;
    }
}

/**
 * Fetch audit logs for a specific user using their email address.
 * Ideal for Support Dashboards.
 * Matches GET http://localhost:8041/api/logs/user/email/{email}
 */
export async function getLogsByUserEmail(
    email: string,
    limit: number = 5
): Promise<AuditLogDTO[]> {
    const authHeader = await getAuthHeader();
    const encodedEmail = encodeURIComponent(email);

    try {
        const res = await fetch(
            `http://localhost:8041/api/logs/user/email/${encodedEmail}?limit=${limit}`, 
            {
                method: 'GET',
                headers: { 
                    ...authHeader, 
                    'accept': '*/*' 
                },
                cache: 'no-store'
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch logs for this email");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Email Log Fetch Error:", error.message);
        throw error;
    }
}

/**
 * Fetch a paginated list of logs for a specific service.
 * Ideal for high-level system monitoring.
 * Matches GET http://localhost:8041/api/logs/service/{serviceName}
 */
export async function getPaginatedServiceLogs(
    serviceName: ServiceName,
    page: number = 0, // Spring Data usually starts at 0
    size: number = 20
): Promise<PageableResponse<AuditLogDTO>> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `http://localhost:8041/api/logs/service/${serviceName}?page=${page}&size=${size}`, 
            {
                method: 'GET',
                headers: { 
                    ...authHeader, 
                    'accept': '*/*' 
                },
                cache: 'no-store'
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch paginated service logs");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Service Log Pagination Error:", error.message);
        throw error;
    }
}

// This final endpoint for the Audit & Logging Microservice (8041) provides a Global Feed. Unlike the previous endpoints that were siloed by user or service, this one pulls the most recent events from across the entire ecosystem. It is the core data source for a "Live Activity Stream" or a "System Pulse" dashboard.

// 1. The Recent Activity Action
// Add this to your lib/user/logActions.ts. This function is intended for high-level monitoring where you need to see what is happening right now across all microservices.

// TypeScript

// lib/user/logActions.ts

/**
 * Fetch the most recent logs across all users and all services.
 * Perfect for a "Global Activity Feed" in an Admin Dashboard.
 * Matches GET http://localhost:8041/api/logs/recent
 */
export async function getRecentGlobalLogs(
    limit: number = 20
): Promise<AuditLogDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `http://localhost:8041/api/logs/recent?limit=${limit}`, 
            {
                method: 'GET',
                headers: { 
                    ...authHeader, 
                    'accept': '*/*' 
                },
                cache: 'no-store' // Always fresh data
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch recent global logs");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Global Logs Fetch Error:", error.message);
        throw error;
    }
}

/**
 * Fetch logs associated with a specific entity (e.g., a specific Booking or Wallet).
 * Matches GET http://localhost:8041/api/logs/entity/{entityId}
 */
export async function getLogsByEntity(
    entityId: string | number,
    entityType: entityType,
    limit: number = 10
): Promise<AuditLogDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `http://localhost:8041/api/logs/entity/${entityId}?entityType=${entityType}&limit=${limit}`, 
            {
                method: 'GET',
                headers: { 
                    ...authHeader, 
                    'accept': '*/*' 
                },
                cache: 'no-store'
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || `Failed to fetch logs for entity ${entityId}`);
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Entity Log Fetch Error:", error.message);
        throw error;
    }
}