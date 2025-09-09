import { create } from 'zustand';

interface TeacherHighlightState {
  // Для расписания учителей: подсвечиваем уроки выбранного класса
  highlightedClassId?: number;
  highlightedClassDate?: Date;
}

interface TeacherScheduleState {
  highlight: TeacherHighlightState;
  setHighlightedClass: (classId: number | undefined, date: Date | undefined) => void;
  clearHighlight: () => void;
}

export const useTeacherScheduleStore = create<TeacherScheduleState>((set) => ({
  highlight: {},
  setHighlightedClass: (classId, date) => {
    console.log('Setting highlighted class:', { classId, date });
    set(() => ({
      highlight: {
        highlightedClassId: classId,
        highlightedClassDate: date,
      }
    }));
  },
  clearHighlight: () => {
    console.log('Clearing teacher highlight');
    set(() => ({
      highlight: {}
    }));
  },
}));
