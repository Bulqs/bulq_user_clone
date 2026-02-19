export type PaperCategory = 'INSURANCE' | 'LICENSE' | 'ROAD_WORTHINESS' | 'HACKNEY_PERMIT';

export interface DeleteDocumentImageRequest {
    paperCategory: PaperCategory | string;
    documentStartDate: string; // YYYY-MM-DD
    documentEndDate: string;   // YYYY-MM-DD
    country: string;
    state: string;
}

/** * Note: The response for both is a string message 
 * e.g., "business product deleted"
 */
export type FleetDeleteResponse = string;

export interface CarriageResponseDTO {
    id: number;
    plateNumber: string;
    carriageName: string;
    inspection: string;      // e.g., "PASSED", "PENDING"
    yearOfPurchase: string;
    businessName: string;
    hubName: string;
    assignedDriver: string;  // Name or ID of the driver
    carriageCategory: string; // e.g., "TRUCK", "VAN", "BIKE"
}

export interface CarriageFilterParams {
    createdAt?: string;
    per_page?: number;
    page?: number;
    id?: number;
    plateNumber?: string;
    carriageName?: string;
    businessName?: string;
    country?: string;
    state?: string;
}

export interface CreateCarriageRequest {
    carriageName: string;
    plateNumber: string;
    yearOfPurchase: string;
    carriageCategory: string; // e.g., "TRUCK", "VAN"
    country: string;
    state: string;
}

export interface CarriageImageItem {
    carriageId: number;
    image: string; // URL
}

export interface DocumentImageItem {
    documentId: number;
    image: string; // URL
}

export interface AddCarriageDocumentRequest {
    carriageId: number;
    documentName: string;    // e.g., "Comprehensive Insurance"
    paperCategory: string;   // "License" or "Insurance"
    documentStartDate: string; 
    documentEndDate: string;
    country: string;
    state: string;
}

export interface UpdateCarriageHubRequest {
    hubId: number;
    hubName: string;
    hubAddress: string;
}

export interface UpdateDocumentRequest {
    paperCategory: string; // "INSURANCE" | "LICENSE"
    documentStartDate: string;
    documentEndDate: string;
    country: string;
    state: string;
}

export interface UpdateCarriageRequest {
    carriageId: number;
    carriageName: string;
    plateNumber: string;
    expiry_date: string; // Note: specific naming convention for this endpoint
    carriageCategory: string;
    country: string;
    state: string;
}