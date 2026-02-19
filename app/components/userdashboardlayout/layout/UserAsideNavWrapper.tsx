"use server";

import UserAsideNav from "./UserAsideNav";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { Session } from "../../../../types/user/index";

// Fetch user session
async function getUserSession(): Promise<Session | null> {
    const cookie = cookies().get("session")?.value;
    
    if (!cookie) {
        return null;
    }
    
    try {
        const session = await decrypt(cookie);
        return session as Session;
    } catch (error) {
        console.error("Error decrypting session:", error);
        return null;
    }
}

export default async function UserAsideNavWrapper() {
    const session = await getUserSession();

    // Provide default values if session is null
    const firstName = session?.firstName || "Guest";
    const lastName = session?.lastName || "User";
    const email = session?.email || "guest@example.com";

    return (
        <UserAsideNav
            firstName={firstName}
            lastName={lastName}
            email={email}
        />
    );
}
