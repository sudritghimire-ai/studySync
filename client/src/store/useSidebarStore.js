// src/store/useSidebarStore.js
import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  isDrawerOpen: false,
  toggleDrawer: () =>
    set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));
