import { create } from "zustand";

import { axiosInstance } from "../libs/axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingPassword: false,
    isCheckingAuth: true,
    friendsOnline: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/checkout")
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        }finally{
            set({ isCheckingAuth: false})
        }
    }

}))