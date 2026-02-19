'use server'

import { DeleteDocumentImageRequest, FleetDeleteResponse } from "@/types/admin";
import { AuthResponse } from "../actions";
import { cookies } from "next/headers";
import { AddCarriageDocumentRequest, CarriageFilterParams, CarriageImageItem, CarriageResponseDTO, CreateCarriageRequest, DocumentImageItem, UpdateCarriageHubRequest, UpdateCarriageRequest, UpdateDocumentRequest } from "@/types/fleet";


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
 * Delete a general vehicle/carriage image.
 * Matches DELETE /api/v1/business/{businessId}/carriage/{carriageId}/image/{imageId}/delete-image
 */
export async function deleteCarriageImage(
    businessId: string | number,
    carriageId: string | number,
    imageId: string | number
): Promise<FleetDeleteResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `http://localhost:8097/api/v1/business/${businessId}/carriage/${carriageId}/image/${imageId}/delete-image`, 
            {
                method: 'DELETE',
                headers: { ...authHeader, 'accept': '*/*' },
            }
        );

        if (!res.ok) throw new Error("Failed to delete carriage image");
        return await res.text();
    } catch (error: any) {
        console.error("Delete Carriage Image Error:", error.message);
        throw error;
    }
}

/**
 * Delete a specific vehicle document image (Insurance/License).
 * Matches DELETE /api/v1/business/{businessId}/carriage/{carriageId}/document/{docId}/document-image/{imageId}/delete-document-image
 */
export async function deleteDocumentImage(
    businessId: string | number,
    carriageId: string | number,
    documentId: string | number,
    imageId: string | number,
    payload: DeleteDocumentImageRequest
): Promise<FleetDeleteResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `http://localhost:8097/api/v1/business/${businessId}/carriage/${carriageId}/document/${documentId}/document-image/${imageId}/delete-document-image`, 
            {
                method: 'DELETE',
                headers: { 
                    ...authHeader, 
                    'Content-Type': 'application/json',
                    'accept': '*/*' 
                },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) throw new Error("Failed to delete document image");
        return await res.text();
    } catch (error: any) {
        console.error("Delete Document Image Error:", error.message);
        throw error;
    }
}

/**
 * Fetch details for a specific carriage.
 * Matches GET /api/v1/business/{businessId}/carriage/{carriageId}/view-carriage
 */
export async function getCarriageDetail(
    businessId: string | number,
    carriageId: string | number
): Promise<CarriageResponseDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `http://localhost:8097/api/v1/business/${businessId}/carriage/${carriageId}/view-carriage`, 
            {
                method: 'GET',
                headers: { ...authHeader, 'accept': 'application/json' },
            }
        );

        if (!res.ok) throw new Error("Carriage details not found");
        return await res.json();
    } catch (error: any) {
        console.error("View Carriage Error:", error.message);
        throw error;
    }
}

/**
 * List all carriages with pagination and advanced filtering.
 * Matches GET /api/v1/business/all-carriages
 */
export async function getPaginatedCarriages(
    params: CarriageFilterParams
): Promise<CarriageResponseDTO[]> {
    const authHeader = await getAuthHeader();
    
    // Clean up params and build query string
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null)
    );
    const queryString = new URLSearchParams(filteredParams as any).toString();

    try {
        const res = await fetch(`http://localhost:8097/api/v1/business/all-carriages?${queryString}`, {
            method: 'GET',
            headers: { ...authHeader, 'accept': '*/*' },
            cache: 'no-store'
        });

        if (!res.ok) throw new Error("Failed to fetch carriages list");
        return await res.json();
    } catch (error: any) {
        console.error("List Carriages Error:", error.message);
        throw error;
    }
}

/**
 * Register a new vehicle/carriage for a business.
 * Matches POST /api/v1/business/{businessId}/add-carriage
 */
export async function createCarriage(
    businessId: string | number,
    payload: CreateCarriageRequest
): Promise<string> {
    const authHeader = await getAuthHeader();
    const res = await fetch(`http://localhost:8097/api/v1/business/${businessId}/add-carriage`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return res.text();
}

/**
 * Add images to a specific carriage (batch upload).
 * Matches POST /api/v1/business/carriage/{carriageId}/add-image
 */
export async function addCarriageImages(
    carriageId: string | number,
    images: CarriageImageItem[]
): Promise<string> {
    const authHeader = await getAuthHeader();
    const res = await fetch(`http://localhost:8097/api/v1/business/carriage/${carriageId}/add-image`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(images),
    });
    return res.text();
}

/**
 * Add images to a specific carriage document (e.g., Insurance scan).
 * Matches POST /api/v1/business/carriage/{carriageId}/document/{docId}/add-document-image
 */
export async function addDocumentImages(
    carriageId: string | number,
    documentId: string | number,
    images: DocumentImageItem[]
): Promise<string> {
    const authHeader = await getAuthHeader();
    const res = await fetch(`http://localhost:8097/api/v1/business/carriage/${carriageId}/document/${documentId}/add-document-image`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(images),
    });
    return res.text();
}

/**
 * Log new documents for a carriage (Batch support).
 * Matches POST /api/v1/business/carriage/add-carriage-document
 */
export async function addCarriageDocuments(
    payload: AddCarriageDocumentRequest[]
): Promise<string> {
    const authHeader = await getAuthHeader();
    const res = await fetch(`http://localhost:8097/api/v1/business/carriage/add-carriage-document`, {
        method: 'POST',
        headers: { ...authHeader, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return res.text();
}

/**
 * Assign or Update the Hub for a specific carriage.
 * Matches PUT /api/v1/business/{businessId}/carriage/{carriageId}/update
 */
export async function updateCarriageHub(
    businessId: string | number,
    carriageId: string | number,
    payload: UpdateCarriageHubRequest
): Promise<string> {
    const authHeader = await getAuthHeader();
    const res = await fetch(
        `http://localhost:8097/api/v1/business/${businessId}/carriage/${carriageId}/update`, 
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
    return res.json();
}

/**
 * Update a specific document's metadata (e.g., renewing insurance dates).
 * Matches PUT /api/v1/business/{businessId}/carriage/{carriageId}/document/{docId}/update-document
 */
export async function updateCarriageDocument(
    businessId: string | number,
    carriageId: string | number,
    documentId: string | number,
    payload: UpdateDocumentRequest
): Promise<string> {
    const authHeader = await getAuthHeader();
    const res = await fetch(
        `http://localhost:8097/api/v1/business/${businessId}/carriage/${carriageId}/document/${documentId}/update-document`, 
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
    return res.json();
}

/**
 * Update general carriage information.
 * Matches PUT /api/v1/business/{businessId}/carriage/update
 */
export async function updateCarriageGeneralInfo(
    businessId: string | number,
    payload: UpdateCarriageRequest
): Promise<string> {
    const authHeader = await getAuthHeader();
    const res = await fetch(
        `http://localhost:8097/api/v1/business/${businessId}/carriage/update`, 
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
    return res.json();
}