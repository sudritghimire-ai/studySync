// src/store/useSidebarStore.js
import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  isDrawerOpen: false,
  shouldOpenOnHome: false,          // << add this
  toggleDrawer: () =>
    set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setShouldOpenOnHome: (value) =>   // << add this
    set({ shouldOpenOnHome: value }),
}));
