// import { ActionTypes, UserType } from "./definitions";
import { ActionTypes, UserType } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Initial state should be null or an empty object based on your type definitions
const INITIAL_STATE: UserType = {
    user: {
    firstName: "",
    lastName: "",
    email: "",
    image: ""
    },
};

export const useUserStore = create(
    persist<UserType & ActionTypes>(
        (set) => ({
            user: INITIAL_STATE.user,
            addUserInfo(userData) {
                set({ 
                    user: {
                        firstName: userData.firstName || "",
                        lastName: userData.lastName || "",
                        email: userData.email || "",
                        image: userData.image || ""
                    }
                });
            },
            destroyUserInfo() {
                set({ 
                    user: {
                        firstName: "",
                        lastName: "",
                        email: "",
                        image: ""
                    } 
                });
            },
        }),
        { name: "userAside", skipHydration: true }
    )
);