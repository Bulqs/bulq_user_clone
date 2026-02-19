export interface CreateComplaintRequest {
    email: string;
    complaint: string;
}

export interface CreateComplaintResponseDTO {
    ticketId: string; // The generated reference number (e.g., TKT-12345)
    message: string;  // A confirmation message (e.g., "Your complaint has been logged")
}

export type ComplaintStatus = 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED' | 'PENDING';

export interface SingleComplaintResponseDTO {
    id: string;
    status: ComplaintStatus;
    name: string;
    email: string;
    ticketId: string;
    assignedTo: string;
    resolutionComment: string;
    resolvedAt: string;
    complaint: string;
    dateCreated: string;
    createdBy: string;
    dateModified: string;
    modifiedBy: string;
    source: string;
}

export interface ComplaintFilterParams {
    sort_by?: string;
    per_page?: number;
    page?: number;
    id?: string;
    ticketId?: string;
    email?: string;
}

export interface UpdateComplaintRequestDTO {
    status: ComplaintStatus; // 'NEW', 'ACKNOWLEDGED', 'RESOLVED', 'PENDING'
    resolutionComment: string; // The text explaining the update or fix
}