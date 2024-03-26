import { CartItemType } from "@/components/Shop/Products/Product";
import { create } from "zustand";

type CartProps = {
  carts: (CartItemType & { id: number })[];
  isImported: boolean;
  setImported: (value: boolean) => void;
  addToCart: (item: CartItemType & { id: number }) => void;
  removeFromCart: (id: number) => void;
  addCollectionToCart: (items: (CartItemType & { id: number })[]) => void;
};

export const useCart = create<CartProps>((set) => ({
  carts: [],
  isImported: false,
  setImported: (value) => set({ isImported: value }),
  addToCart: (item) =>
    set((state: CartProps) => ({ carts: [...state.carts, item] })),
  removeFromCart: (id) =>
    set((state: CartProps) => ({
      carts: state.carts.filter((item) => item.id !== id),
    })),
  addCollectionToCart: (items) =>
    set((state: CartProps) => ({ carts: [...items] })),
}));
