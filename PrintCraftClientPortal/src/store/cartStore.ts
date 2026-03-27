import { create } from 'zustand';
import type { Product } from '../data/products';

export type CartItem = Product & {
  cartLineId: string;
  quantity: number;
  size: string;
  customerNotes: string;
  designFileName: string;
  designMimeType: string;
  designDataUrl: string;
};

type AddCustomItemInput = {
  product: Product;
  quantity: number;
  size: string;
  customerNotes: string;
  designFileName: string;
  designMimeType: string;
  designDataUrl: string;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  addCustomItem: (input: AddCustomItemInput) => void;
  removeItem: (cartLineId: string) => void;
  increment: (cartLineId: string) => void;
  decrement: (cartLineId: string) => void;
  clear: () => void;
};

function createLineId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `line-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find(
        (x) => x.id === product.id && !x.designDataUrl && x.size === 'M' && !x.customerNotes
      );

      if (existing) {
        return {
          items: state.items.map((x) =>
            x.cartLineId === existing.cartLineId ? { ...x, quantity: x.quantity + 1 } : x
          )
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...product,
            cartLineId: createLineId(),
            quantity: 1,
            size: 'M',
            customerNotes: '',
            designFileName: '',
            designMimeType: '',
            designDataUrl: ''
          }
        ]
      };
    }),
  addCustomItem: (input) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...input.product,
          cartLineId: createLineId(),
          quantity: Math.max(1, input.quantity),
          size: input.size,
          customerNotes: input.customerNotes,
          designFileName: input.designFileName,
          designMimeType: input.designMimeType,
          designDataUrl: input.designDataUrl
        }
      ]
    })),
  removeItem: (cartLineId) => set((state) => ({ items: state.items.filter((x) => x.cartLineId !== cartLineId) })),
  increment: (cartLineId) =>
    set((state) => ({
      items: state.items.map((x) => (x.cartLineId === cartLineId ? { ...x, quantity: x.quantity + 1 } : x))
    })),
  decrement: (cartLineId) =>
    set((state) => ({
      items: state.items
        .map((x) => (x.cartLineId === cartLineId ? { ...x, quantity: Math.max(0, x.quantity - 1) } : x))
        .filter((x) => x.quantity > 0)
    })),
  clear: () => set({ items: [] })
}));
