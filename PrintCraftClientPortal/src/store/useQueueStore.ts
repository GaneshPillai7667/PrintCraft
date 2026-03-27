import { create } from 'zustand';

export type QueueItem = {
  id: string;
  stage: string;
  priority: 'Normal' | 'Express' | 'SameDay' | 'Vip';
  dueDate: string;
};

type QueueState = {
  items: QueueItem[];
  setItems: (items: QueueItem[]) => void;
  upsertItem: (item: QueueItem) => void;
};

export const useQueueStore = create<QueueState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  upsertItem: (item) =>
    set((state) => {
      const exists = state.items.find((x) => x.id === item.id);
      if (!exists) {
        return { items: [item, ...state.items] };
      }

      return { items: state.items.map((x) => (x.id === item.id ? item : x)) };
    })
}));
