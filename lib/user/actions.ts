'use server'
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
    AddressCountResponseDTO,
    AddressDeleteResponseDTO,
    AddressRequest,
    AddressResponseDTO,
    AddressUpdateResponseDTO,
    BASE_URL,
    CityDTO,
    CountryDTO,
    ForgotPasswordRequest,
    PagedResponse,
    RegisterUser,
    ResetPasswordRequest,
    UpdatePasswordRequest,
    UpdateProfileRequest,
    UpdateProfileResponse,
    UserAddressListResponseDTO,
  } from "../../types/user";
  import { FetchError } from "../FetchError";
import { createSession, getSession } from "../session";
import { AuthResponse as AuthData, AuthResponse as AuthResponder } from "../actions";
import { UserResponseDTO } from "@/types/admin";


  export type AuthRequest = {
    email: string;
    password: string;
};



export type AuthResponse = {
    message: string;
};




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

export async function getSessionDetails(): Promise<AuthData> {
    // 1. Use your existing getSession logic to decrypt the cookie
    const session = await getSession();
    
    // 2. Check if the session exists and has the token
    // Based on your createSession payload, the token is nested inside
    if (!session || !session.token) {
        console.error("Auth Header: No valid session or token found after decryption");
        return {
            authorities: [],
            email: "null",
            firstName: "null",
            image: "null",
            lastName: "null",
            token: "null",
            username: "null"
        };
    }

    // 3. Return the actual session details
    return {
            authorities: [],
            email: session?.email,
            firstName: session?.firstName,
            image: session?.image,
            lastName: session?.lastName,
            token: "null",
            username: session?.username
        };;
    // console.log(session.token)
    // return { 'Authorization': `Bearer ${session.token}` };
}

/**
 * This function acts as a bridge to allow a Client Component 
 * to set a server-side session cookie.
 */
export async function handleSocialLogin(userData: AuthData) {
    try {
        await createSession(userData);
        return { success: true };
    } catch (error) {
        console.error("Failed to create social session:", error);
        return { success: false };
    }
}

const test_url: string = "${CUSTOMER_BASE_URL}";
const BOOKING_API = "http://localhost:8087/api/v1/booking";
const CUSTOMER_BASE_URL = process.env.CUSTOMER_BASE_URL

export async function Register(payload: RegisterUser): Promise<AuthResponse> {
    if (payload.email == null || payload.password == null) {
        return Promise.reject({
            status: 400,
            message: 'Bad credentials',
        });
    }

    console.log(BASE_URL);

    // Verify credentials && get the user
    const apiUrl = new URL(`${CUSTOMER_BASE_URL}/users/register`);
    console.log(apiUrl);

    // Construct the headers
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        // 1. Handle Error Responses
        if (!response.ok) {
            // Try to parse the JSON error DTO if available
            const errorData = await response.json().catch(() => null);
            const msg = errorData?.message || `Error ${response.status}: Registration failed`;
            throw new FetchError(response.status, msg);
        }

        // 2. Handle Success Response
        // Since Java returns RegistrationResponseDTO, response.json() will work perfectly
        const data = (await response.json()) as AuthResponse;
        
        return data; // returns { message: "Account added" }

    } catch (error: any) {
        if (error instanceof FetchError) {
            return Promise.reject({
                status: error.status,
                message: error.message,
            });
        }
        return Promise.reject({
            status: 500,
            message: error.message || 'Internal Server Error',
        });
    }
}

/**
 * Fetch the profile of the currently authenticated user.
 * Matches GET ${CUSTOMER_BASE_URL}/profile
 * Verified Badge: Use the verified: "true" field to show a "Verified" checkmark next to the user's name.
 * KYC Indicator: If kycStatus is not "APPROVED", show a prompt on the dashboard: "Complete your KYC to unlock full features."
 * Profile Image: If profileImage is null or empty, provide a fallback "User Initial" avatar using firstName.
 * Global State: Instead of calling this on every page, call it once in a layout.tsx or a UserContext provider to make the data available across the entire application.
 */

export async function getMyProfile(): Promise<UserResponseDTO> {
    const authHeader = await getAuthHeader();

    // Debug: This should now show the raw JWT, not the encrypted session string
    console.log("Using Decrypted Token:", authHeader.Authorization?.substring(0, 20));

    const res = await fetch(`${CUSTOMER_BASE_URL}/profile`, {
        method: 'GET',
        headers: { 
            ...authHeader, 
            'accept': 'application/json' 
        },
        cache: 'no-store'
    });

    // if (!res.ok) {
    //     // If it's still returning HTML, we need to see the status
    //     const errorText = await res.text();
    //     console.error(`Profile Fetch Failed (${res.status}):`, errorText.substring(0, 100));
    //     throw new Error(`Server Error: ${res.status}`);
    // }

    return await res.json();
}

/**
 * 
 * @returns 
 * user adds address
 */
export async function addUserAddress(payload: AddressRequest): Promise<AddressResponseDTO> {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${CUSTOMER_BASE_URL}/add-address`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json(); // Parse the JSON error body
    // Throw the specific message from the backend if it exists
    throw new Error(errorData.message || "Failed to add address");
}

  // This will now return data typed as AddressResponseDTO
  return await res.json();
}

/**
 * 
 * @returns 
 * get total address count stats
 */
export async function getAddressCount(): Promise<AddressCountResponseDTO> {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${CUSTOMER_BASE_URL}/addresses/count`, {
    method: 'GET',
    headers: {
      ...authHeader,
      'accept': '*/*',
    },
    cache: 'no-store', // Always get fresh counts
  });

  if (!res.ok) {
    throw new Error("Failed to fetch address counts");
  }

  return await res.json();
}

/**
 * 
 * @returns 
 * Fetch all addresses
 */
export async function getAllUserAddresses(): Promise<UserAddressListResponseDTO> {
  const authHeader = await getAuthHeader();

  const res = await fetch('${CUSTOMER_BASE_URL}/users/addresses/all', {
    method: 'GET',
    headers: {
      ...authHeader,
      'accept': '*/*',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error("Failed to fetch address list");
  }

  return await res.json();
}

/**
 * 
 * @returns 
 * update an address
 */

export async function updateAddress(
  addressId: string, 
  payload: AddressRequest
): Promise<AddressUpdateResponseDTO> {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${CUSTOMER_BASE_URL}/addresses/${addressId}/update`, {
    method: 'PUT',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json',
      'accept': '*/*',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Update Address Error:", errorBody);
    throw new Error("Failed to update address");
  }

  return await res.json();
}

/**
 * 
 * @returns 
 * delete a user address action
 */
export async function deleteAddress(addressId: string | number): Promise<AddressDeleteResponseDTO> {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${CUSTOMER_BASE_URL}/addresses/${addressId}/delete`, {
    method: 'DELETE',
    headers: {
      ...authHeader,
      'accept': '*/*',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Delete Address Error:", errorBody);
    throw new Error("Failed to delete address");
  }

  return await res.json();
}



/**
 * Fetch a list of all supported countries.
 * Matches GET ${CUSTOMER_BASE_URL}/countries
 */
export async function getSupportedCountries(): Promise<CountryDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        console.log(CUSTOMER_BASE_URL)
        const res = await fetch(`${CUSTOMER_BASE_URL}/countries`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': 'application/json' 
            },
            // Revalidate once a day as country lists rarely change
            next: { revalidate: 86400 } 
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to load countries");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Countries Fetch Error:", error.message);
        throw error;
    }
}

/**
 * Initiate a password reset request.
 * Matches POST ${CUSTOMER_BASE_URL}/users/reset-password
 */
export async function requestPasswordReset(payload: ForgotPasswordRequest): Promise<string> {
    try {
        const res = await fetch(`${CUSTOMER_BASE_URL}/users/reset-password`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'accept': 'application/json' 
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to process password reset request");
        }

        // The response is a raw string message (e.g., "Reset link sent to your email")
        return await res.json();
        
    } catch (error: any) {
        console.error("Forgot Password Error:", error.message);
        throw error;
    }
}


/**
 * Reset the user's password using a verification token.
 * Matches POST ${CUSTOMER_BASE_URL}/users/change-password?token=...
 */
export async function completePasswordReset(
    token: string,
    payload: ResetPasswordRequest
): Promise<string> {
    try {
        const res = await fetch(`${CUSTOMER_BASE_URL}/users/change-password?token=${token}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'accept': 'application/json' 
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Invalid or expired reset token");
        }

        // Returns a success message string
        return await res.json();
        
    } catch (error: any) {
        console.error("Password Reset Completion Error:", error.message);
        throw error;
    }
}

/**
 * Update user profile details.
 * Can be called by the user themselves or an admin.
 * Matches PUT /api/v1/customers/user/profile/{userId}/update-profile
 * 
 * For the User (Settings Page)
 * Pre-population: Use getMyProfile() to fill the form initially so the user only changes what they need.
 * Sensitive Changes: If the email or password is changed, your backend might trigger a re-verification flow or an email notification to the old address for security.
 * Location Consistency: Use the getSupportedCountries() list to populate the country field here to ensure valid data is sent back.
 * 
 */
export async function updateProfile(
    userId: string | number,
    payload: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `${CUSTOMER_BASE_URL}/user/profile/${userId}/update-profile`, 
            {
                method: 'PUT',
                headers: { 
                    ...authHeader, 
                    'Content-Type': 'application/json',
                    'accept': '*/*' 
                },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to update profile details");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Update Profile Error:", error.message);
        throw error;
    }
}

/**
 * Update the password of the currently authenticated user.
 * Matches PUT ${CUSTOMER_BASE_URL}/profile/update-password
 */
export async function updatePassword(
    payload: UpdatePasswordRequest
): Promise<UserResponseDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${CUSTOMER_BASE_URL}/profile/update-password`, {
            method: 'PUT',
            headers: { 
                ...authHeader, 
                'Content-Type': 'application/json',
                'accept': 'application/json' 
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to update password");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Password Update Error:", error.message);
        throw error;
    }
}

/**
 * Fetches all cities for a specific country NAME (e.g., 'NIGERIA')
 */
export async function getSupportedCities(countryName: string): Promise<string[]> {
    if (!countryName) return [];

    try {
        // UPDATED: Endpoint matches your curl: /api/v1/customers/country/{name}
        // We use encodeURIComponent to handle spaces safely (e.g. "United Kingdom")
        const response = await fetch(`${CUSTOMER_BASE_URL}/country/${encodeURIComponent(countryName)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            },
            cache: 'no-store', 
        });

        if (!response.ok) {
            // Optional: Log the status to help debug (e.g. 404 if country not found)
            console.warn(`Fetch failed for ${countryName}: ${response.status}`);
            return [];
        }

        const data: CityDTO[] = await response.json();
        
        // UPDATED: Map the 'cityName' property from your specific JSON payload
        if (Array.isArray(data)) {
             return data.map((item) => item.cityName);
        }
        
        return []; 

    } catch (error) {
        console.error("API Error - getSupportedCities:", error);
        return [];
    }
}

/**
 * Search for cities using Country NAME
 */
export async function searchCities(countryName: string, query: string): Promise<string[]> {
    if (!countryName || !query) return [];

    try {
        const response = await fetch(`${CUSTOMER_BASE_URL}/country/search-by-name?country=${encodeURIComponent(countryName)}&query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}