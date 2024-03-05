import { create } from 'zustand'

interface Layout {
  sidebar: boolean
  notificationPanel: boolean
  toggleSidebar: () => void
  toggleNotificationPanel: () => void
}

export const useLayout = create<Layout>((set) => ({
  sidebar: true,
  notificationPanel: true,
  toggleSidebar: () => set((state) => ({ sidebar: !state.sidebar })),
  toggleNotificationPanel: () => set((state) => ({ notificationPanel: !state.notificationPanel })),
}))