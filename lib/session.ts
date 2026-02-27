import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { FetchError } from "./FetchError";
import { Session, User } from "../types/user"
import { AuthResponse } from "./actions";
import { JWTExpired } from "jose/errors";


const exp = 24 * 60 * 60 * 1000;

// Custom error for expired or invalid session
class SessionExpiredError extends Error {
    constructor(message: string = 'Session has expired') {
        super(message);
        this.name = 'SessionExpiredError';
    }
}

// const secretKey = process.env.SESSION_SECRET;
const secretKey = "8e04db4e442d390931fd8d5397cc669ecd3961de0d0a825e4cf580d05a4cb989";
console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
if (!secretKey) {
    throw new Error('SESSION_SECRET environment variable is not defined');
}
const key = new TextEncoder().encode(secretKey);

export type SignInResposne = {
    token: string,
    user: User
    exp: number
}

// Encrypt session
export async function encrypt(payload: Session) {
    const expirationTime = new Date(Date.now() + exp); // 1 hour from now in seconds

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expirationTime) // Set expiration time as a timestamp
        .sign(key);
}

// Decrypt session
export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        if (error instanceof JWTExpired) {
            throw new SessionExpiredError();
        }
        throw error; // Re-throw other errors
    }
}

// Create session for Authenticated User
export async function createSession(payload: AuthResponse) {
    try {
        // // Set expiration time to 1 hour from now
        // const expires = new Date(Date.now() + Math.floor(exp / 1000));
        // const session = await encrypt({ ...payload, SESSION_EXPIRY: Math.floor(expires.getTime() / 1000) });

        // Simply add the milliseconds directly to Date.now()
        const expires = new Date(Date.now() + exp);

        // Convert the final future date back into seconds for the payload
        const session = await encrypt({
            ...payload,
            SESSION_EXPIRY: Math.floor(expires.getTime() / 1000)
        });

        // Save the session in a cookie
        (await cookies()).set("session", session, { expires, httpOnly: true });

    } catch (error) {
        if (error instanceof FetchError) {
            // Custom error handling logic
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

// Logout user
export async function logout() {
    // Destroy the session
    (await cookies()).set("session", "", { expires: new Date(0) });
}

// Retrieve session from user storage
export async function getSession() {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch (error) {
        return null;
    }
}

// Update session
export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;
    // Refresh the session to expire in 1 hour
    try {
        const parsed = await decrypt(session);
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        parsed.exp = Math.floor(expires.getTime() / 1000);
        const res = NextResponse.next();
        res.cookies.set({
            name: "session",
            value: await encrypt(parsed),
            httpOnly: true,
            expires,
        });
        return res;
    } catch (error) {
        return null;
    }
}