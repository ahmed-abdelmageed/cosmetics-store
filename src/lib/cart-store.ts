"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock || 99) }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }),
      clear: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }),
    { name: "cosmetics-cart" }
  )
);

type CartDrawerState = {
  open: boolean;
  /** Increments on every add so the header badge can replay its bump animation. */
  pulse: number;
  show: () => void;
  hide: () => void;
  notifyAdded: () => void;
};

export const useCartDrawer = create<CartDrawerState>()((set) => ({
  open: false,
  pulse: 0,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
  notifyAdded: () => set((s) => ({ open: true, pulse: s.pulse + 1 })),
}));
