import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string;
  userEmail: string;
  nickName: string;
  exp: number;
  setToken: (token: string) => void;
  setUserEmail: (email: string) => void;
  setNickName: (nickName: string) => void;
  setExp: (exp: number) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: "",
      userEmail: "",
      nickName: "",
      exp: 0,
      setExp: (exp) => set({ exp }),
      setToken: (token) => set({ token }),
      setUserEmail: (email) => set({ userEmail: email }),
      setNickName: (nickName) => set({ nickName }),
      clear: () => set({ token: "", userEmail: "" }),
    }),
    {
      name: "auth-storage", // localStorage 的 key
      partialize: (state) => ({
        token: state.token,
        nickName: state.nickName,
        userEmail: state.userEmail,
        exp: state.exp,
      }),
    },
  ),
);
