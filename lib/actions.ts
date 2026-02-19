'use server'
import { BASE_URL, ROLES } from "../types/user";
import { FetchError } from "./FetchError";
import { createSession, logout } from "./session";


export type AuthRequest = {
    email: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    authorities: { authority: ROLES }[];
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    username: string;
};

export async function handleSocialLogin(userData: AuthResponse) {
    await createSession(userData);
    return { success: true };
}

const test_url: string = "http://localhost:8084/api/v1";
const CUSTOMER_BASE_URL = process.env.CUSTOMER_BASE_URL

export async function LoginUser(payload: AuthRequest): Promise<AuthResponse> {
    if (payload.email == null || payload.password == null) {
        return Promise.reject({
            status: 400,
            message: 'Bad credentials',
        });
    }

    // console.log(BASE_URL, payload);

    // Verify credentials && get the user
    const apiUrl = new URL(`${CUSTOMER_BASE_URL}/login`);
    console.log('CUSTOMER_BASE_URL:', process.env.CUSTOMER_BASE_URL);

    console.log(apiUrl), payload;

    // Construct the headers
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            if (response.status == 400) {
                throw new FetchError(response.status, `Incorrect credentials`);
            }
            throw new FetchError(response.status, `Failed to Login user: ${response.statusText}`);
        }
        console.log(response);

        const user = await response.json() as AuthResponse;
        console.log(user);

        await createSession(user);

        return user;
    } catch (error) {
        // Custom error handling logic
        if (error instanceof FetchError) {
            return Promise.reject({
                status: error.status,
                message: error.message,
            });
        }
        return Promise.reject({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}

export async function LogoutUser() {
    logout()
}