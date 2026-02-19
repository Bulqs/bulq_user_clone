'use server'

import { AddHubTelephoneRequest, AddHubWorkingHoursRequest, CreateHubRequest, CreateHubResponse, HubFilterParams, HubFullDetailDTO, HubSummaryDTO, UpdateAuthoritiesRequest, UserFilterParams, UserResponseDTO } from "@/types/admin";
import { cookies } from "next/headers";
import { AuthResponse } from "../actions";



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
 * 
 * HUB/ WAREHOUSE ACTIONS
 * 
 */

/**
 * Create a new physical Hub/Warehouse location.
 * ADMIN ONLY
 * Matches POST http://localhost:8098/api/v1/hubs/create-hub
 */
export async function createHub(
    payload: CreateHubRequest
): Promise<CreateHubResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch("http://localhost:8098/api/v1/hubs/create-hub", {
            method: 'POST',
            headers: { 
                ...authHeader, 
                'Content-Type': 'application/json',
                'accept': '*/*' 
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to create hub location");
        }

        // Returns a success message string (e.g., "Hub created successfully")
        return await res.text();
        
    } catch (error: any) {
        console.error("Hub Creation Error:", error.message);
        throw error;
    }
}

/**
 * Fetch detailed information for a single hub including hours and phones.
 * Matches GET http://localhost:8098/api/v1/hubs/{id}
 */
export async function getHubDetail(id: string | number): Promise<HubFullDetailDTO> {
    const authHeader = await getAuthHeader();
    const res = await fetch(`http://localhost:8098/api/v1/hubs/${id}`, {
        method: 'GET',
        headers: { ...authHeader, 'accept': 'application/json' },
    });
    if (!res.ok) throw new Error("Hub not found");
    return res.json();
}

/**
 * Delete a hub location.
 * Matches DELETE http://localhost:8098/api/v1/hubs/delete-hub
 */
export async function deleteHub(id: number): Promise<string> {
    const authHeader = await getAuthHeader();
    const res = await fetch(`http://localhost:8098/api/v1/hubs/delete-hub`, {
        method: 'DELETE',
        headers: { 
            ...authHeader, 
            'Content-Type': 'application/json',
            'accept': '*/*' 
        },
        body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Failed to delete hub");
    return res.text();
}

/**
 * Add a new telephone contact to a hub.
 * Matches POST http://localhost:8098/api/v1/hubs/add-hub-telephone
 */
export async function addHubTelephone(payload: AddHubTelephoneRequest): Promise<string> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch("http://localhost:8098/api/v1/hubs/add-hub-telephone", {
            method: 'POST',
            headers: { 
                ...authHeader, 
                'Content-Type': 'application/json',
                'accept': '*/*' 
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(await res.text() || "Failed to add telephone");
        return await res.text();
    } catch (error: any) {
        console.error("Add Telephone Error:", error.message);
        throw error;
    }
}

/**
 * Add operational hours for a specific day.
 * Matches POST http://localhost:8098/api/v1/hubs/create-hub-workinghours
 */
export async function createHubWorkingHours(payload: AddHubWorkingHoursRequest): Promise<string> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch("http://localhost:8098/api/v1/hubs/create-hub-workinghours", {
            method: 'POST',
            headers: { 
                ...authHeader, 
                'Content-Type': 'application/json',
                'accept': '*/*' 
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(await res.text() || "Failed to add working hours");
        return await res.text();
    } catch (error: any) {
        console.error("Add Working Hours Error:", error.message);
        throw error;
    }
}

/**
 * List hubs in paginated format with advanced filters.
 * Matches GET http://localhost:8098/api/v1/hubs/
 */
export async function getPaginatedHubs(params: HubFilterParams): Promise<HubFullDetailDTO[]> {
    const authHeader = await getAuthHeader();
    const query = new URLSearchParams(params as any).toString();

    try {
        const res = await fetch(`http://localhost:8098/api/v1/hubs/?${query}`, {
            method: 'GET',
            headers: { ...authHeader, 'accept': '*/*' },
            cache: 'no-store'
        });
        return await res.json();
    } catch (error: any) {
        console.error("Pagination Fetch Error:", error.message);
        throw error;
    }
}

/**
 * View all hubs (Summary list).
 * Matches GET http://localhost:8098/api/v1/hubs/all
 */
export async function getAllHubs(): Promise<HubSummaryDTO[]> {
    try {
        const res = await fetch("http://localhost:8098/api/v1/hubs/all", {
            method: 'GET',
            headers: { 'accept': 'application/json' },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) {
            console.error("Failed to fetch hubs:", res.statusText);
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error("Error fetching hubs:", error);
        return [];
    }
}

/**
 * View hubs filtered by country name/code.
 * Matches GET http://localhost:8098/api/v1/hubs/by-country/{country}
 */
export async function getHubsByCountry(countryCode: string): Promise<any> {
    const res = await fetch(`http://localhost:8098/api/v1/hubs/by-country/${countryCode}?country=${countryCode}`, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
    });
    return await res.json();
}

