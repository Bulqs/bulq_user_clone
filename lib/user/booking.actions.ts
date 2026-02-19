// lib/user/bookingActions.ts
'use server'
import { cookies } from "next/headers";
import { AuthResponse } from "../actions";
import { BADOBookingPayload, BADOResponseDTO, BookingAnalyticsRequest, BookingAnalyticsResponse, BookingDateFilterParams, BookingFilterParams, BookingPayload, BookingResponseDTO, BookingStatus, BookingSummaryDTO, BookingSummaryParams, CustomerLoyaltyInfo, DetailedCostBreakdown, FieldChangeAuditDTO, FilterBookingViewDTO, FullTrackingDetails, InsuranceClaimDTO, InsurancePolicyDTO, ItemValidationParams, ItemValidationResponse, LoyaltyTierStatistics, MultiPackageRequest, MultiPackageResponse, NextTierRequirements, ProhibitedItemsParams, QuickReturnResponse, RateAuditLogDTO, ReturnReason, ReturnShippingRequest, ShippingRateRequest, ShippingRateResponse, TrackingBookingViewDTO, TrackingEvent, TrackingLookupResponse, UserAuditLogDTO } from "@/types/booking";
import { PagedResponse, RecentTrackingDTO } from "@/types/user";
import { getSession } from "../session";
import { TrackingStatisticsDTO } from "@/types/driver";

const BOOKING_BASE_URL = process.env.BOOKING_BASE_URL;
const INSURANCE_BASE_URL = process.env.INSURANCE_BASE_URL;
const LOYALTY_BASE_URL = process.env.LOYALTY_BASE_URL
const TRACKING_BASE_URL = process.env.TRACKING_BASE_URL

// async function getAuthHeader(): Promise<Record<string, string>> {
//     const session = (await cookies()).get("session")?.value;
//     if (!session) return {};
    
//     try {
//         // Since you're using createSession from your session logic, 
//         // the cookie is likely an encrypted/encoded string.
//         // If it's the raw JSON string:
//         const user = JSON.parse(session) as AuthResponse;
//         return { 'Authorization': `Bearer ${user.token}` };
//     } catch (e) {
//         console.error("Auth header error:", e);
//         return {};
//     }
// }

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
 * Handle POST to /booking/pup (Pick Up Package)
 */
export async function createPickUpBooking(payload: BookingPayload): Promise<BookingResponseDTO > {
    const authHeader = await getAuthHeader();
    
    const res = await fetch(`${BOOKING_BASE_URL}/pup`, {
        method: 'POST',
        headers: { 
            ...authHeader, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg || "Pick-up booking failed");
    }
    return res.json();
}

/**
 * Handle POST to /booking/dp (Deliver Package)
 */
export async function createDeliverPackageBooking(payload: BookingPayload): Promise<BookingResponseDTO> {
    const authHeader = await getAuthHeader();
    
    const res = await fetch(`${BOOKING_BASE_URL}/dp`, {
        method: 'POST',
        headers: { 
            ...authHeader, 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg || "Deliver package booking failed");
    }
    return res.json();
}

/**
 * Handle POST to /booking/bado (Book a Delivery Appointment / Drop-off)
 */
export async function createDropOffBooking(payload: BADOBookingPayload): Promise<BookingResponseDTO> {
    const authHeader = await getAuthHeader();
    
    try {
        const res = await fetch(`${BOOKING_BASE_URL}/bado`, {
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
            throw new Error(errorMsg || "Drop-off appointment booking failed");
        }

        const data: BADOResponseDTO = await res.json();
        return data;
        
    } catch (error: any) {
        console.error("BADO Booking Error:", error.message);
        throw error;
    }
}

/**
 * Fetch paginated and filtered bookings
 * Matches GET /api/v1/booking/all
 */
export async function getAllBookings(params: BookingFilterParams): Promise<PagedResponse<FilterBookingViewDTO>> {
    const authHeader = await getAuthHeader();
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {

        // debug keys
        console.log(`Processing Key: ${key}, Value: ${value}, Type: ${typeof value}`);
        // Ensure we only append valid data
        if (value !== undefined && value !== null && value !== '') {
            let finalKey = key === 'per_page' ? 'per_page' : key;
            let finalValue = value;

            if (key === 'page') finalValue = Number(value) + 1; // 0-indexed fix
            
            queryParams.append(finalKey, finalValue.toString());
        }
    });

    const finalUrl = `http://localhost:8087/api/v1/booking/all?${queryParams.toString()}`;
    console.log("FETCHING FROM BACKEND:", finalUrl); // CHECK THIS IN YOUR NEXT.JS TERMINAL

    const res = await fetch(finalUrl, {
        method: 'GET',
        headers: { 
            ...authHeader, 
            'accept': 'application/json' 
        },
    });

    

    //     if (!res.ok) {
    //     throw new Error("Failed to fetch booking history");
    // }

    // console.log(`the content are${res.json()}`)

    return res.json();
}


export async function getAllBookingsForShippingPage(params: BookingFilterParams): Promise<PagedResponse<FilterBookingViewDTO>> {
    const authHeader = await getAuthHeader();
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        // Ensure we only append valid data
        if (value !== undefined && value !== null && value !== '') {
            let finalKey = key === 'per_page' ? 'per_page' : key;
            let finalValue = value;

            if (key === 'page') finalValue = Number(value); // 0-indexed fix
            
            queryParams.append(finalKey, finalValue.toString());
        }
    });

    const finalUrl = `http://localhost:8087/api/v1/booking/all?${queryParams.toString()}`;
    console.log("FETCHING FROM BACKEND:", finalUrl); // CHECK THIS IN YOUR NEXT.JS TERMINAL

    const res = await fetch(finalUrl, {
        method: 'GET',
        headers: { 
            ...authHeader, 
            'accept': 'application/json' 
        },
    });

    

    //     if (!res.ok) {
    //     throw new Error("Failed to fetch booking history");
    // }

    return res.json();
}

export async function getAllBookingsA(params: BookingFilterParams): Promise<PagedResponse<FilterBookingViewDTO>> {
    const authHeader = await getAuthHeader();
    const queryParams = new URLSearchParams();

    // Loop through params and append to URL if they have a value
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
        }
    });

    const res = await fetch(`${BOOKING_BASE_URL}/all?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 
            ...authHeader, 
            'accept': 'application/json' 
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch booking history");
    }


    const value = res.json()
    // console.log(value)
    return value; // This now maps correctly to PagedResponse<FilterBookingViewDTO>

}

/**
 * Fetch booking analytics and statistics for dashboard charts
 * Matches POST /api/v1/booking/summary-stats
 */
export async function getBookingSummaryStats(payload: BookingAnalyticsRequest): Promise<BookingAnalyticsResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/summary-stats`, {
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
            throw new Error(errorMsg || "Failed to fetch analytics data");
        }

        const data: BookingAnalyticsResponse = await res.json();
        return data;

    } catch (error: any) {
        console.error("Analytics API Error:", error.message);
        throw error;
    }
}

/**
 * Calculate shipping rates for a potential booking
 * Matches POST /api/v1/booking/calculate?currency=...
 */
// export async function calculateShippingRate(
//     payload: ShippingRateRequest, 
//     currency: string = "USD",
//     signal?: AbortSignal // Add this
// ): Promise<ShippingRateResponse> {
//     const authHeader = await getAuthHeader();

//     const res = await fetch(`http://localhost:8087/api/v1/booking/calculate?currency=${currency}`, {
//         method: 'POST',
//         headers: { 
//             ...authHeader, 
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//         signal, // Attach the signal here
//         cache: 'no-store'
//     });

//     if (!res.ok) throw new Error("Rate calculation failed");
//     return await res.json();
// }
export async function calculateShippingRate(
    payload: ShippingRateRequest, 
    currency: string = "USD"
): Promise<ShippingRateResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/calculate?currency=${currency}`, {
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
            throw new Error(errorMsg || "Rate calculation failed");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Shipping Calculator Error:", error.message);
        throw error;
    }
}

/**
 * Calculate shipping rates for multiple packages in one shipment
 * Matches POST /api/v1/booking/calculate/multi-package
 */
export async function calculateMultiPackageRate(
    payload: MultiPackageRequest
): Promise<MultiPackageResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/calculate/multi-package`, {
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
            throw new Error(errorMsg || "Multi-package calculation failed");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Multi-Package Calculator Error:", error.message);
        throw error;
    }
}

/**
 * Update booking status (specifically used for Cancellation by customers)
 * Matches PUT /api/v1/booking/{trackingNumber}/update
 */
export async function updateBookingStatus(
    trackingNumber: string, 
    status: BookingStatus
): Promise<{ message: string }> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/${trackingNumber}/update`, {
            method: 'PUT',
            headers: { 
                ...authHeader, 
                'Content-Type': 'application/json',
                'accept': 'application/json' 
            },
            body: JSON.stringify({ status }),
        });

        // Since the backend returns ResponseEntity<String>
        const textResponse = await res.text();

        if (!res.ok) {
            throw new Error(textResponse || "Failed to update booking status");
        }

        return { message: textResponse || "Status updated successfully" };
        
    } catch (error: any) {
        console.error("Update Booking Error:", error.message);
        throw error;
    }
}

/**
 * Calculate the cost of returning a shipment
 * Matches POST /api/v1/booking/calculates
 */
export async function calculateReturnRate(
    payload: ReturnShippingRequest
): Promise<ShippingRateResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/calculates`, {
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
            throw new Error(errorMsg || "Return rate calculation failed");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Return Calculator Error:", error.message);
        throw error;
    }
}

/**
 * Calculate return shipping costs with business policies applied
 * (e.g., checking if the return is free based on the reason)
 * Matches POST /api/v1/booking/calculate-with-policy
 */
export async function calculateReturnWithPolicy(
    payload: ReturnShippingRequest
): Promise<ShippingRateResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/calculate-with-policy`, {
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
            throw new Error(errorMsg || "Policy-based rate calculation failed");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Policy Calculator Error:", error.message);
        throw error;
    }
}

/**
 * Get detailed operational cost breakdown for a shipment
 * Matches GET /api/v1/booking/cost-breakdown/{trackingNumber}
 */
export async function getDetailedCostBreakdown(
    trackingNumber: string
): Promise<DetailedCostBreakdown> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/cost-breakdown/${trackingNumber}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch cost breakdown");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Cost Breakdown API Error:", error.message);
        throw error;
    }
}

/**
 * Get audit history for changes to a specific pricing field
 * ADMIN ONLY
 * Matches GET /api/v1/booking/field/{fieldName}
 */
export async function getFieldChangeHistory(
    fieldName: string
): Promise<FieldChangeAuditDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/field/${fieldName}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch field audit history");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Audit API Error:", error.message);
        throw error;
    }
}

/**
 * Fetch a list of prohibited items based on the origin and destination countries.
 * Matches GET /api/v1/booking/prohibited-items
 * This endpoint should be triggered as soon as the user selects the Origin and Destination in the Shipping Calculator or Booking Form.

Validation: Use the returned list to "fuzz-search" against the user's package_name or itemDescription.

Warning UI: If a match is found, show a modal or a non-blocking warning: "Please note: [Item] may be prohibited when shipping from [Origin] to [Destination]."

Global List: You can also use this to populate a "Prohibited Items" reference page on your site.
 */
export async function getProhibitedItems(
    params: ProhibitedItemsParams
): Promise<string[]> {
    const authHeader = await getAuthHeader();
    
    const queryParams = new URLSearchParams({
        originCountry: params.originCountry,
        destinationCountry: params.destinationCountry
    });

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/prohibited-items?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch prohibited items");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Prohibited Items API Error:", error.message);
        throw error;
    }
}

/**
 * Perform a quick check on return costs and eligibility
 * Matches GET /api/v1/booking/quick-check/{trackingNumber}?reason=...
 * isFreeReturn: This is the most important boolean for the user. If true, you can highlight "Free Return Eligible" in your UI.

instructions: Use this to display step-by-step guidance (e.g., "Pack the item in its original box and wait for the courier").

returnCost: Even if it's not free, showing the cost upfront reduces cart abandonment and support tickets.
 * 
 */
export async function quickReturnCheck(
    trackingNumber: string,
    reason: ReturnReason
): Promise<QuickReturnResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `${BOOKING_BASE_URL}/quick-check/${trackingNumber}?reason=${reason}`, 
            {
                method: 'GET',
                headers: { 
                    ...authHeader, 
                    'accept': 'application/json' 
                },
            }
        );

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            // Handle the 403 Forbidden or other errors
            throw new Error(errorData?.error || "Failed to perform quick return check");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Quick Return Check Error:", error.message);
        throw error;
    }
}

/**
 * Get all audit logs for a specific rate record
 * ADMIN ONLY
 * Matches GET /api/v1/booking/rate/{rateId}
 * 
 * In your Admin Dashboard, this endpoint is used to solve customer disputes. If a customer asks why their totalAmount changed from a previous quote, an Admin can:

Enter the rateId.

See if a human modified a surcharge.

Read the reason provided by the colleague who made the change.
 * 
 */
export async function getRateAuditLogs(
    rateId: string | number
): Promise<RateAuditLogDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/rate/${rateId}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || `Failed to fetch audit logs for rate ${rateId}`);
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Rate Audit API Error:", error.message);
        throw error;
    }
}

/**
 * Get the 100 most recent audit logs across the entire system
 * ADMIN ONLY
 * Matches GET /api/v1/booking/recent
 */
export async function getRecentAuditLogs(): Promise<RateAuditLogDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/recent`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': 'application/json' 
            },
            // Since this is a "Live Feed", we want to ensure we don't cache old data
            cache: 'no-store' 
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch recent audit logs");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Recent Audit API Error:", error.message);
        throw error;
    }
}

/**
 * Check if a package should be returned to the sender.
 * Matches GET /api/v1/booking/should-return/{trackingNumber}
 */
export async function checkIfShouldReturn(
    trackingNumber: string
): Promise<boolean> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/should-return/${trackingNumber}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            // High volatility: we want the most recent status from the warehouse
            cache: 'no-store' 
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to check return status");
        }

        // Parse the raw boolean response
        const data = await res.json();
        return data === true;
        
    } catch (error: any) {
        console.error("Should-Return API Error:", error.message);
        throw error;
    }
}

/**
 * Get summary analytics for pie and bar charts via GET request.
 * Matches GET /api/v1/booking/summary-pie
 * 
 * This GET endpoint is perfect for Server-Side Rendering (SSR) in Next.js because it's easily cacheable and doesn't require a request body.

Role Filtering: By passing role=SENDER or role=RECEIVER, you can instantly toggle the dashboard view for a user who both ships and receives packages.

Time Aggregation: The groupBy=MONTH parameter allows your bar charts to show a year-to-date growth trend, while groupBy=DAY is better for a "This Week" view.
 * 
 */
export async function getBookingSummaryPie(
    params: BookingSummaryParams
): Promise<BookingAnalyticsResponse> {
    const authHeader = await getAuthHeader();
    
    const queryParams = new URLSearchParams();
    if (params.dateRange) queryParams.append('dateRange', params.dateRange);
    if (params.groupBy) queryParams.append('groupBy', params.groupBy);
    if (params.role) queryParams.append('role', params.role);

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/summary-pie?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            // Since this is for a dashboard, we want fresh data
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch booking summary pie data");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Summary Pie API Error:", error.message);
        throw error;
    }
}

/**
 * Get a flat list of booking summaries filtered by date and status
 * Matches GET /api/v1/booking/summary
 */
export async function getBookingSummary(
    params: BookingDateFilterParams
): Promise<BookingSummaryDTO[]> {
    const authHeader = await getAuthHeader();
    
    const queryParams = new URLSearchParams();
    if (params.statuses) queryParams.append('statuses', params.statuses);
    if (params.day) queryParams.append('day', params.day.toString());
    if (params.month) queryParams.append('month', params.month);
    if (params.year) queryParams.append('year', params.year.toString());

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/summary?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch date-based booking summary");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Date Summary API Error:", error.message);
        throw error;
    }
}

/**
 * Lookup booking details by tracking number.
 * Matches GET /api/v1/booking/trackingNumber?trackingNumber=...
 */
export async function lookupBookingByTracking(
    trackingNumber: string
): Promise<TrackingLookupResponse> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `${BOOKING_BASE_URL}/trackingNumber?trackingNumber=${trackingNumber}`, 
            {
                method: 'GET',
                headers: { 
                    ...authHeader, 
                    'accept': 'application/json' 
                },
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Tracking number not found");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Tracking Lookup Error:", error.message);
        throw error;
    }
}

/**
 * Fetch a summary list of bookings for the authenticated user.
 * Matches GET /api/v1/booking/user-summary
 */
export async function getUserBookingSummary(): Promise<BookingSummaryDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/user-summary`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            // Since this is a summary list, we use a short cache or no-store for real-time accuracy
            cache: 'no-store' 
        });

        // if (!res.ok) {
        //     const errorMsg = await res.text();
        //     throw new Error(errorMsg || "Failed to fetch user booking summary");
        // }

        return await res.json();
        
    } catch (error: any) {
        console.error("User Summary API Error:", error.message);
        throw error;
    }
}

/**
 * Get all system changes performed by a specific user/admin.
 * ADMIN ONLY
 * Matches GET /api/v1/booking/user/{username}
 */
export async function getUserAuditLogs(
    username: string
): Promise<UserAuditLogDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/user/${username}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || `Failed to fetch audit logs for user: ${username}`);
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("User Audit API Error:", error.message);
        throw error;
    }
}

/**
 * Perform detailed validation for items against company and country policies.
 * Matches GET /api/v1/booking/validate-item
 */
export async function validateShippingItem(
    params: ItemValidationParams
): Promise<ItemValidationResponse> {
    const authHeader = await getAuthHeader();
    
    const queryParams = new URLSearchParams({
        itemCategory: params.itemCategory,
        itemDescription: params.itemDescription,
        originCountry: params.originCountry,
        destinationCountry: params.destinationCountry,
        shippingMethod: params.shippingMethod
    });

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/validate-item?${queryParams.toString()}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Item validation service unavailable");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Item Validation Error:", error.message);
        throw error;
    }
}

/**
 * Get detailed tracking information and activity history for a booking.
 * Matches GET /api/v1/booking/{trackingNumber}
 * 
 * The actions array is the key to a great User Experience. You can map through it to create a visual progress tracker:
 * Reverse the List: Usually, you want the most recent activity at the top.
 * Status Mapping: Use the activity string to determine icons (e.g., if it contains "Delivered", show a green checkmark).
 * Summary Cards: Use the package_name and shipping_amount to show a "Shipment Summary" card next to the timeline.
 * 
 */
export async function getDetailedTracking(
    trackingNumber: string
): Promise<TrackingBookingViewDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${BOOKING_BASE_URL}/${trackingNumber}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': 'application/json' 
            },
            // We want real-time updates for tracking
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Tracking details not found");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Detailed Tracking API Error:", error.message);
        throw error;
    }
}

/*
 * INSURANCE APIs
 */
/**
 * Fetch the insurance policy details for a specific shipping method.
 * Matches GET /api/v1/insurance/policy/{methodCode}
 * 
 * This data is usually displayed as a "Learn More" tooltip or a side-drawer during the checkout/booking process:

Premium Calculation: You can use the insuranceRate and minimumPremium to explain to the user how the insurance cost in their breakdown was calculated.

Trust Building: Displaying the claimProcessingDays (e.g., "Claims processed within 7 days") increases conversion for high-value shipments.

Documentation Prep: Use requiredDocumentsList to show a preview of what the user should keep (e.g., "Original Receipt," "Photo of Package") in case they need to file a claim later.
 */
export async function getInsurancePolicyByMethod(
    methodCode: string
): Promise<InsurancePolicyDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${INSURANCE_BASE_URL}/policy/${methodCode}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            // Insurance policies don't change often, so we can use a revalidation strategy
            next: { revalidate: 3600 } // Revalidate once per hour
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || `No insurance policy found for method: ${methodCode}`);
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Insurance Policy API Error:", error.message);
        throw error;
    }
}

/**
 * Fetch all active insurance policies across all shipping methods.
 * Matches GET /api/v1/insurance/policies
 */
export async function getAllActiveInsurancePolicies(): Promise<InsurancePolicyDTO[]> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${INSURANCE_BASE_URL}/policies`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            // Cache this globally as it is reference data
            next: { revalidate: 3600 } 
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch insurance policies");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("All Policies API Error:", error.message);
        throw error;
    }
}

/**
 * Submit a new insurance claim for a shipment.
 * Matches POST /api/v1/insurance/claims
 */
export async function fileInsuranceClaim(
    payload: InsuranceClaimDTO
): Promise<InsuranceClaimDTO> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${INSURANCE_BASE_URL}/claims`, {
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
            throw new Error(errorMsg || "Failed to submit insurance claim");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Insurance Claim Error:", error.message);
        throw error;
    }
}

/**
 * LOYALTY INITIATIVEFOR CUSTOMERS
 * 
 */
/**
 * 
 * 
 * 
 * Fetch statistics on customer distribution across loyalty tiers.
 * ADMIN ONLY
 * Matches GET /api/v1/loyalty/statistics
 * This data is best visualized using a Donut Chart or a Tiered Funnel in the Admin Dashboard:
 * Standard/Bronze: Represents your "New" or "Casual" users.
 * Gold/Platinum: Represents your "Power Users" or "VIPs."
 * Actionable Growth: If the platinumCount is low, Admins might decide to launch a promotion to encourage gold users to ship more frequently to reach the next tier.
 */
export async function getLoyaltyTierStatistics(): Promise<LoyaltyTierStatistics> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${LOYALTY_BASE_URL}/statistics`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            // Dashboard data should be relatively fresh
            next: { revalidate: 600 } // Cache for 10 minutes
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to fetch loyalty statistics");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Loyalty Statistics API Error:", error.message);
        throw error;
    }
}

/**
 * Fetch the requirements needed for the user to reach their next loyalty tier.
 * Matches GET /api/v1/loyalty/next-tier
 * 
 * Using this data, you can build a Progress Component in the user's profile or dashboard:
 * Progress Bar: Calculate the percentage: ((tierThreshold - amountNeeded) / tierThreshold) * 100.
 * Motivational Text: "You're just $[amountNeeded] away from [nextTier] status! Ship one more package to unlock faster delivery."
 * Dynamic Badges: Display a "Locked" icon for the nextTier to encourage the user to reach the threshold.
 */
export async function getNextTierRequirements(): Promise<NextTierRequirements> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${LOYALTY_BASE_URL}/next-tier`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            cache: 'no-store' // This changes as the user makes new bookings/payments
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Could not retrieve next tier requirements");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Next Tier API Error:", error.message);
        throw error;
    }
}

/**
 * Fetch the authenticated user's current loyalty status and stats.
 * Matches GET /api/v1/loyalty/my-info
 * This data is the heart of the user's personalized dashboard experience:
 * Tier Badge: Use currentTier to display a color-coded badge (e.g., Gold = #FFD700).
 * Savings Indicator: Show the user how much they are saving with: "You are currently enjoying a [discountPercent]% discount on all shipments!"
 * Lifetime Stats: Use totalLifetimeShipments and totalLifetimeSpend to show the user their journey with the company, fostering a sense of relationship and longevity.
 */
export async function getMyLoyaltyInfo(): Promise<CustomerLoyaltyInfo> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(`${LOYALTY_BASE_URL}/my-info`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to retrieve loyalty information");
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Loyalty Info API Error:", error.message);
        throw error;
    }
}

/**
 * Fetch loyalty information for a specific customer by email.
 * ADMIN ONLY
 * Matches GET /api/v1/loyalty/customer/{email}
 */
export async function getCustomerLoyaltyInfoByAdmin(
    email: string
): Promise<CustomerLoyaltyInfo> {
    const authHeader = await getAuthHeader();

    // Encode the email to handle special characters like '@'
    const encodedEmail = encodeURIComponent(email);

    try {
        const res = await fetch(`${LOYALTY_BASE_URL}/customer/${encodedEmail}`, {
            method: 'GET',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || `Failed to find loyalty info for: ${email}`);
        }

        return await res.json();
        
    } catch (error: any) {
        console.error("Admin Loyalty Lookup Error:", error.message);
        throw error;
    }
}

/**
 * Calculate the loyalty discount value for a specific shipment cost.
 * Matches GET /api/v1/loyalty/calculate-discount?shipmentCost=...
 * 
 * You should integrate this into your Order Summary component on the frontend.Real-time Feedback: As the user adds packages or changes shipping methods (which changes
 * the shipmentCost), call this endpoint to update the "Loyalty Savings" line item.Visual Reinforcement: If the returned value is $> 0$, display it in a distinct color
 * (e.g., green) with a label like "Loyalty Member Savings".Tier Context: Use this alongside getMyLoyaltyInfo() to show the user why they are getting that specific
 * discount (e.g., "5% Silver Tier Discount Applied").
 */
export async function calculateLoyaltyDiscount(
    shipmentCost: number
): Promise<number> {
    const authHeader = await getAuthHeader();

    try {
        const res = await fetch(
            `${LOYALTY_BASE_URL}/calculate-discount?shipmentCost=${shipmentCost}`, 
            {
                method: 'GET',
                headers: { 
                    ...authHeader, 
                    'accept': '*/*' 
                },
            }
        );

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to calculate loyalty discount");
        }

        // Parse the raw number response
        const discountValue = await res.json();
        return Number(discountValue);
        
    } catch (error: any) {
        console.error("Loyalty Discount API Error:", error.message);
        throw error;
    }
}

/**
 * Record a shipment in the loyalty system to update user progress.
 * Matches POST /api/v1/loyalty/record-shipment
 */
export async function recordLoyaltyShipment(
    customerEmail: string,
    shipmentCost: number
): Promise<void> {
    const authHeader = await getAuthHeader();
    
    const queryParams = new URLSearchParams({
        customerEmail: customerEmail,
        shipmentCost: shipmentCost.toString()
    });

    try {
        const res = await fetch(`${LOYALTY_BASE_URL}/record-shipment?${queryParams.toString()}`, {
            method: 'POST',
            headers: { 
                ...authHeader, 
                'accept': '*/*' 
            },
            // Empty body as per CURL requirement
            body: '' 
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || "Failed to record loyalty shipment");
        }
        
    } catch (error: any) {
        console.error("Record Loyalty Shipment Error:", error.message);
        throw error;
    }
}

/**
 * tracking events
 */

export async function getFullTracking(trackingNumber: string): Promise<FullTrackingDetails> {
    const res = await fetch(`${TRACKING_BASE_URL}/${trackingNumber}`, {
        method: 'GET',
        headers: { 'accept': 'application/json' },
        cache: 'no-store'
    });
    if (!res.ok) throw new Error("Tracking details not found");
    return res.json();
}

export async function getLatestTrackingEvent(trackingNumber: string): Promise<TrackingEvent> {
    const res = await fetch(`${TRACKING_BASE_URL}/${trackingNumber}/latest`, {
        method: 'GET',
        headers: { 'accept': 'application/json' },
        cache: 'no-store'
    });
    if (!res.ok) throw new Error("Latest event not found");
    return res.json();
}

export async function checkIsDelivered(trackingNumber: string): Promise<boolean> {
    const res = await fetch(`${TRACKING_BASE_URL}/${trackingNumber}/is-delivered`, {
        method: 'GET',
        headers: { 'accept': '*/*' }
    });
    return res.json(); // Returns true/false
}


/**
 * Post New Tracking Event (Admin/Logistics)
 * Used by drivers or hub managers to update a package's location.
 * @param trackingNumber 
 * @param params 
 * @returns 
 */
export async function addTrackingEvent(
    trackingNumber: string,
    params: { eventType: string; location: string; description: string }
): Promise<TrackingEvent> {
    const authHeader = await getAuthHeader(); // Requires Admin/Staff token
    const queryParams = new URLSearchParams(params);

    const res = await fetch(`${TRACKING_BASE_URL}/${trackingNumber}/events?${queryParams.toString()}`, {
        method: 'POST',
        headers: { ...authHeader, 'accept': '*/*' },
        body: '' // Empty body as per curl
    });
    if (!res.ok) throw new Error("Failed to update tracking event");
    return res.json();
}

/**
 * Fetches the recently tracked items for the logged-in user.
 * Matches GET /api/v1/tracking/recent
 */
export async function getRecentTracking(): Promise<RecentTrackingDTO[]> {
  try {
    const authHeader = await getAuthHeader();

    const res = await fetch(`${TRACKING_BASE_URL}/recent`, {
      method: 'GET',
      headers: {
        ...authHeader,
        'accept': '*/*',
      },
      // Use 'no-store' so the user always sees the latest status, not cached data
      cache: 'no-store', 
    });

    if (!res.ok) {
      console.error(`Error fetching recent tracking: ${res.status} ${res.statusText}`);
      // Return an empty array on error so the UI doesn't crash
      return [];
    }

    return await res.json();
  } catch (error: any) {
    console.error("Recent Tracking Fetch Error:", error.message);
    return [];
  }
}

/**
 * Fetches the complete tracking history for the user.
 * Matches GET /api/v1/tracking/all
 */
export async function getAllTrackingHistory(): Promise<RecentTrackingDTO[]> {
  try {
    const authHeader = await getAuthHeader();
    const res = await fetch(`${TRACKING_BASE_URL}/all`, {
      method: 'GET',
      headers: { ...authHeader, 'accept': '*/*' },
      cache: 'no-store',
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("History Fetch Error:", error);
    return [];
  }
}

/**
 * Fetches the user's shipping statistics.
 * Matches GET /api/v1/tracking/statistics
 */
export async function getTrackingStatistics(): Promise<TrackingStatisticsDTO | null> {
  try {
    const authHeader = await getAuthHeader();
    const res = await fetch(`${TRACKING_BASE_URL}/statistics`, {
      method: 'GET',
      headers: { ...authHeader, 'accept': '*/*' },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Statistics Fetch Error:", error);
    return null;
  }
}