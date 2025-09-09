import { create } from 'zustand';

interface ScheduleView {
  type: 'day' | 'week';
  date: Date;
}

interface ScheduleFilters {
  teacherId?: string;
  classId?: string;
  subject?: string;
}


interface ScheduleState {
  currentView: ScheduleView;
  filters: ScheduleFilters;
  setView: (view: ScheduleView) => void;
  setFilters: (filters: Partial<ScheduleFilters>) => void;
  setDate: (date: Date) => void;
  setViewType: (type: 'day' | 'week') => void;
}

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
