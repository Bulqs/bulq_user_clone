"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/lib/utils/store'; 
import { handleSocialLogin } from '@/lib/user/actions';
import { AuthResponse } from '@/lib/actions';
import { NAVIGATION, ROLES } from '@/types/user';

function CallbackHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const addUserInfo = useUserStore((state) => state.addUserInfo);

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (token) {
            // Build the data object based on your AuthResponse interface
            const authData: AuthResponse = {
                token: token,
                firstName: searchParams.get('firstName') || "",
                lastName: searchParams.get('lastName') || "",
                email: searchParams.get('email') || "",
                image: searchParams.get('image') || "",
                username: searchParams.get('email') || "", // Fallback to email
                authorities: [{ authority: ROLES.USER }] 
            };

            // 1. Create the cookie on the server
            handleSocialLogin(authData).then((res) => {
                if (res.success) {
                    // 2. Update Zustand store for the UI/Sidebar
                    addUserInfo({
                        firstName: authData.firstName,
                        lastName: authData.lastName,
                        email: authData.email,
                        image: authData.image,
                    });

                    // 3. Redirect to the correct logged-in path from your NAVIGATION enum
                    router.push(NAVIGATION.HOMELOGGEDIN); 
                } else {
                    router.push(NAVIGATION.LOGIN + "?error=session_creation_failed");
                }
            });
        }
    }, [searchParams, router, addUserInfo]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 font-bold">Verifying Google Account...</p>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <CallbackHandler />
        </Suspense>
    );
}