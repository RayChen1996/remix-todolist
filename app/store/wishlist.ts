import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Todo } from "~/schema/Todo";

interface WishItem {
  id: string;
  createTime: number;
  content: string;
  status: boolean;
}

interface WishState {
  wishList: Todo[]; // ← 這裡要指定為 WishItem[]
  clear: () => void;
  remove: (item: WishItem) => void;
  add: (item: WishItem) => void;
}

export const useWishListStore = create<WishState>()(
  persist(
    (set) => ({
      wishList: [],
      clear: () => set({ wishList: [] }),
      remove: (item) =>
        set((state) => ({
          wishList: state.wishList.filter(
            (wishItem) => wishItem.id !== item.id,
          ),
        })),
      add: (item) =>
        set((state) => ({
          wishList: [...state.wishList, item],
        })),
    }),
    {
      name: "wishlist-storage", // localStorage 的 key
      partialize: (state) => ({
        wishList: state.wishList,
      }),
    },
  ),
);
