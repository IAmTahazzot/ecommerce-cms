import { create } from 'zustand'

type overview = {
  // stats for the last 30 days
  stats: {
    sales: number
    orders: number
    customers: number
    revenue: number
  }

  setStats: (stats: overview['stats']) => void

  // sales for the current year of the last 12 months
  sales: number[]
  setSales: (sales: overview['sales']) => void
}

export const useOverview = create<overview>((set) => ({
  stats: {
    sales: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  },
  sales: [],
  setStats: (stats) => set({ stats }),
  setSales: (sales) => set({ sales }),
}))
