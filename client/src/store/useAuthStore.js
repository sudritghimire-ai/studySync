import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      checkingAuth: true,
      loading: false,

      signup: async (signupData) => {
        try {
          set({ loading: true });
          const res = await axiosInstance.post("/auth/signup", signupData);
          set({ authUser: res.data.user });
          initializeSocket(res.data.user._id);
          toast.success("Account created successfully");
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
          set({ loading: false });
        }
      },

      login: async (loginData) => {
        try {
          set({ loading: true });
          const res = await axiosInstance.post("/auth/login", loginData, {
            withCredentials: true,
          });
          set({ authUser: res.data.user });
          initializeSocket(res.data.user._id);
          toast.success("Logged in successfully");
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
          disconnectSocket();
          set({ authUser: null });
          toast.success("Logged out successfully");
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong");
        }
      },

      checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/me", { withCredentials: true });
          set({ authUser: res.data.user });
          initializeSocket(res.data.user._id);
        } catch (error) {
          set({ authUser: null });
        } finally {
          set({ checkingAuth: false });
        }
      },

      setAuthUser: (user) => set({ authUser: user }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ authUser: state.authUser }),
    }
  )
);
