// lib/user/bookingActions.ts
'use server'
import { cookies } from "next/headers";
import { AuthResponse } from "../actions";
import { CreateKYCResponseDTO, KYCPersonalInfoRequest } from "@/types/kyc";
import { getSession } from "../session";
const KYC_BASE_URL = process.env.KYC_BASE_URL
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
 * Submit KYC details for verification.
 * Matches POST ${KYC_BASE_URL}/submit
 * 
 * Since KYC involves photos (profilePhoto, idFrontPhoto), you should handle image uploads before calling this endpoint.
 * Client-side Upload: Use a service like Cloudinary or an S3 bucket to upload the raw image files.
 * String Mapping: Take the returned URLs from the upload and place them into the profilePhoto, idFrontPhoto, and idBackPhoto fields of the JSON body.
 * Submission: Call the submitKYC action with the combined data.
 * 4. UI Feedback States
 * Once submitted, the user’s dashboard should reflect their kycStatus:
 * PENDING: Show a yellow banner: "Your documents are being reviewed. This usually takes 24-48 hours."
 * APPROVED: Unlock features like "Wallet Withdrawals" or "High-Value Shipments."
 * REJECTED: Show a red banner with the rejectionReason (e.g., "ID photo was blurry") and a "Retry" button.
 */
export async function submitKYC(
    payload: KYCPersonalInfoRequest
): Promise<CreateKYCResponseDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${KYC_BASE_URL}/submit`, {
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
            throw new Error(errorMsg || "Failed to submit KYC");
        }

        return await res.json();
    } catch (error: any) {
        console.error("KYC Submission Error:", error.message);
        throw error;
    }
}

/**
 * Fetch the current user's KYC details and verification status.
 * Matches GET ${KYC_BASE_URL}/status
 */
export async function getKYCStatus(): Promise<CreateKYCResponseDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${KYC_BASE_URL}/status`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            cache: 'no-store' 
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch KYC status");
        }

        return await res.json();
    } catch (error: any) {
        console.error("Fetch KYC Status Error:", error.message);
        throw error;
    }
}