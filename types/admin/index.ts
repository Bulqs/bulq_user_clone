export type UserAuthority = 'USER' | 'ADMIN' | 'SUPPORT' | 'DRIVER';

export interface UserResponseDTO {
    id: number;
    email: string;
    authorities: UserAuthority;
    createdAt: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    username: string;
    verified: string; // "true" or "false"
    profileImage: string;
    uniqueId: string;
    kycStatus: string; // e.g., "PENDING", "APPROVED"
    hubName: string;
    hubAddress: string;
    country: string;
    city: string;
    defaultAddress: string;
    state: string;
}

export interface UserFilterParams {
    sort_by?: string;
    per_page?: number;
    page?: number;
    name?: string;
    username?: string;
    phoneNumber?: string;
    authorities?: UserAuthority;
    email?: string;
}

export interface UpdateAuthoritiesRequest {
    authorities: UserAuthority; // 'USER' | 'ADMIN' | 'SUPPORT' | 'DRIVER'
}

export interface CreateHubRequest {
    state: string;
    city: string;
    country: string;
    address: string;
}

// Based on the curl, the response is a raw success string
export type CreateHubResponse = string;


export interface HubTelephone {
    hubId: number;
    telephone: string;
}

export interface HubWorkHour {
    id: number;
    day: string;
    time: string;
}

/** Full detail object returned by 'find hub detail' and 'list hubs' */
export interface HubFullDetailDTO {
    id: number;
    state: string;
    city: string;
    country: string;
    address: string;
    hubName?: string;
    telephones: HubTelephone[];
    workHours: HubWorkHour[];
}

/** Summary object returned by 'view all' or 'update' */
export interface HubTelephone {
    hubId: number;
    telephone: string;
}

export interface HubWorkHour {
    id: number;
    day: string;
    time: string;
}

// Update the main DTO to match the JSON response
export interface HubSummaryDTO {
    id: number;
    state: string;
    city: string;
    country: string;
    address: string;
    hubName: string;
    province: string,
    // Add these two arrays to match the payload
    telephones: HubTelephone[]; 
    workHours: HubWorkHour[];
}

export interface AddHubTelephoneRequest {
    hubId: number;
    telephone: string;
}

export interface AddHubWorkingHoursRequest {
    hubId: number;
    day: string; // e.g., "Monday"
    time: string; // e.g., "8:00AM - 5:00PM"
}

export interface HubFilterParams {
    createdAt?: string;
    per_page?: number;
    page?: number;
    id?: number;
    state?: string;
    city?: string;
    country?: string;
}

export interface HubSummaryDTO {
    id: number;
    state: string;
    city: string;
    country: string;
    address: string;
    hubName: string;
}

export interface HubFilterParams {
    createdAt?: string;
    per_page?: number;
    page?: number;
    id?: number;
    state?: string;
    city?: string;
    country?: string;
}

export interface HubSummaryDTO {
    id: number;
    state: string;
    city: string;
    country: string;
    address: string;
    hubName: string;
}

export interface UpdateHubRequest {
    id: number;
    state: string;
    city: string;
    country: string;
    address: string;
}

export interface UpdateHubResponse {
    id: number;
    state: string;
    city: string;
    country: string;
    address: string;
    hubName: string; // The backend-calculated name
}

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