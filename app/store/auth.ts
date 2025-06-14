// ~/store/auth.ts
import { create } from "zustand";

interface AuthState {
  token: string;
  userEmail: string;
  setToken: (token: string) => void;
  setUserEmail: (email: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: "",
  userEmail: "",
  setToken: (token) => set({ token }),
  setUserEmail: (email) => set({ userEmail: email }),
  clear: () => set({ token: "", userEmail: "" }),
}));
