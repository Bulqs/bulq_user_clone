import { HubSummaryDTO } from "@/types/admin";
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
const HUBS_BASE_URL = process.env.HUBS_BASE_URL


// Import your types (adjust the path based on your folder structure)
// import { HubSummaryDTO } from '@/types/hub'; 

/**
 * Fetches all available hubs from the API.
 * @returns {Promise<HubSummaryDTO[]>} An array of hub summaries.
 */
export const getAllHubs = async (): Promise<HubSummaryDTO[]> => {
    try {
        const response = await fetch(`${HUBS_BASE_URL}/all`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                // Add authorization header here later if this endpoint gets secured!
                // 'Authorization': `Bearer ${token}` 
            },
            // If using Next.js App Router and you want fresh data every time, uncomment this:
            // cache: 'no-store' 
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch hubs. Status: ${response.status}`);
        }

        const data: HubSummaryDTO[] = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching all hubs:", error);
        // Depending on your UI, you might want to return an empty array instead of throwing
        return []; 
    }
};