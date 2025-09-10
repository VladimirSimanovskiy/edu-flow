import { create } from 'zustand';
import type { ScheduleState } from '@shared/types';

export const useScheduleStore = create<ScheduleState>((set) => ({
  currentView: {
    type: 'day',
    date: new Date(),
  },
  filters: {},
  setView: (view) => set({ currentView: view }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  setDate: (date) => set((state) => ({
    currentView: { ...state.currentView, date }
  })),
  setViewType: (type) => set((state) => ({
    currentView: { ...state.currentView, type }
  })),
}));
