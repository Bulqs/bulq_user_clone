// lib/user/bookingActions.ts
'use server'
import { cookies } from "next/headers";
import { AuthResponse } from "../actions";
import { ComplaintFilterParams, CreateComplaintRequest, CreateComplaintResponseDTO, SingleComplaintResponseDTO, UpdateComplaintRequestDTO } from "@/types/complaints";


const COMPLAINT_BASE_URL = process.env.COMPLAINT_BASE_URL;

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
 * Log a new complaint for a user.
 * Matches POST http://localhost:8088/api/v1/complaints/create
 * 
 * When a user submits the "Contact Support" form:
 * Ticket Confirmation: Upon success, show the ticketId in a bold success state. "Ticket #TKT-8829 created. Please keep this for your records."
 * Contextual Email: Since the request asks for an email, you can pre-fill this from the user's session if they are logged in.
 * UI Feedback: Use a "Success" toast or redirect them to a "My Tickets" view (if you have one).
 */
export async function createComplaint(
    payload: CreateComplaintRequest
): Promise<CreateComplaintResponseDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${COMPLAINT_BASE_URL}/create`, {
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
            throw new Error(errorMsg || "Failed to create complaint ticket");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Complaint Creation Error:", error.message);
        throw error;
    }
}

/**
 * Fetch a paginated list of complaints with optional filters.
 * Matches GET http://localhost:8088/api/v1/complaints/complaints
 * 
 * When building the "Ticket Management" view for your staff:
 * Status Badges: Map the status to Tailwind classes or CSS variables to immediately show the priority (e.g., NEW = bg-red-100 text-red-700).
 * Deep Linking: Use the ticketId as a link to a "Detail View" where the resolutionComment can be added.
 * Search as you Type: Use the email or ticketId filters to create a search bar that updates the list dynamically.
 * Sorting: Default sort_by to dateCreated so the most recent issues appear at the top.
 */
export async function getComplaints(
    params: ComplaintFilterParams
): Promise<SingleComplaintResponseDTO[]> {
    const authHeader = await getAuthHeader();

    // Remove undefined values and build query string
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null)
    );
    const queryString = new URLSearchParams(filteredParams as any).toString();

    try {
        const res = await fetch(`${COMPLAINT_BASE_URL}?${queryString}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            cache: 'no-store' // Ensure admin sees real-time ticket updates
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch complaints list");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("List Complaints Error:", error.message);
        throw error;
    }
}

/**
 * Fetch details for a specific complaint by its database ID.
 * Matches GET http://localhost:8088/api/v1/complaints/get-complaint?id=...
 * 
 * When a user clicks on a ticket from their list, this action provides the full context needed to render the page:
 * Status Tracking: Show the current status (e.g., "ACKNOWLEDGED").
 * Audit Trail: Display when it was created (dateCreated) and if it has been modified (dateModified).
 * Resolution Feedback: If the status is RESOLVED, display the resolutionComment and resolvedAt timestamp so the user knows how the issue was handled.
 * Assigned Agent: For internal admin views, show assignedTo to identify which staff member is handling the ticket.
 * 3. Workflow Comparison: ID vs TicketID
 * Note that your system has two identifiers:
 * id (Internal): Used for database lookups (this endpoint).
 * ticketId (External): The human-readable code (e.g., BQ-TKT-101) shared with the customer.
 */
export async function getComplaintById(id: string): Promise<SingleComplaintResponseDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${COMPLAINT_BASE_URL}/get-complaint?id=${id}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || `Complaint with ID ${id} not found`);
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Fetch Single Complaint Error:", error.message);
        throw error;
    }
}

/**
 * Update a complaint's status and add a resolution comment.
 * ADMIN ONLY - Triggers Kafka email notifications.
 * Matches PUT /api/v1/complaints/{complaintId}/update-complaint
 * 
 * 
 * 
 */
export async function updateComplaintStatus(
    complaintId: number | string,
    payload: UpdateComplaintRequestDTO
): Promise<SingleComplaintResponseDTO> {
    const authHeader = await getAuthHeader();

    try {
        // Note: Backend requires complaintId as both a Path variable AND a RequestParam
        const res = await fetch(
            `${COMPLAINT_BASE_URL}/${complaintId}/update-complaint?complaintId=${complaintId}`, 
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

        if (res.status === 401 || res.status === 403) {
            throw new Error("Unauthorized: Admin access required.");
        }

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to update complaint");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Admin Complaint Update Error:", error.message);
        throw error;
    }
}