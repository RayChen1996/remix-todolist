import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string;
  userEmail: string;
  setToken: (token: string) => void;
  setUserEmail: (email: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      userEmail: "",
      setToken: (token) => set({ token }),
      setUserEmail: (email) => set({ userEmail: email }),
      clear: () => set({ token: "", userEmail: "" }),
    }),
    {
      name: "auth-storage", // localStorage 的 key
      partialize: (state) => ({
        token: state.token,
        userEmail: state.userEmail,
      }),
    },
  ),
);
