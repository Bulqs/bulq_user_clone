import { decrypt } from "@/lib/session";
import { Session } from "@/types/user";
import { cookies } from "next/headers";
// import { Session } from "../../../../types/index";

export function getFormattedDate(date: Date = new Date()) {
    // const date = new Date();

    const time = date.toLocaleTimeString(["en-US"], { hour: "2-digit", minute: "2-digit" });

    const year = date.getFullYear();

    const month = date.toLocaleString('default', { month: "long" });

    const monthShort = date.toLocaleString('default', { month: "short" });

    const day = date.toLocaleString('default', { day: "2-digit" });

    const hours = date.getHours();

    const minutes = date.getMinutes()

    return { year, month, monthShort, day, time, hours, minutes };
}

export function capitalizeFirstLetter(string: string) {
    if (typeof string !== "string" || string.length === 0) {
        return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getUserName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`
}

// Fetch user session
export async function getUserSession(): Promise<Session | null> {
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

