import { create } from 'zustand';

interface TeacherHighlightState {
  // Для расписания учителей: подсвечиваем уроки выбранного класса
  highlightedClassId?: number;
  highlightedClassDate?: Date;
  // Hover подсветка пары замещения
  hoverLinked?: {
    day: number;
    lessonNumber: number;
    originalTeacherId: number;
    substituteTeacherId: number;
  };
}

interface TeacherScheduleState {
  highlight: TeacherHighlightState;
  setHighlightedClass: (classId: number | undefined, date: Date | undefined) => void;
  clearHighlight: () => void;
  setHoverLinked: (payload: TeacherHighlightState['hoverLinked'] | undefined) => void;
}

export const useTeacherScheduleStore = create<TeacherScheduleState>((set) => ({
  highlight: {},
  setHighlightedClass: (classId, date) => {
    set(() => ({
      highlight: {
        highlightedClassId: classId,
        highlightedClassDate: date,
      }
    }));
  },
  clearHighlight: () => {
    set(() => ({
      highlight: {}
    }));
  },
  setHoverLinked: (payload) => {
    set((state) => ({
      highlight: {
        ...state.highlight,
        hoverLinked: payload,
      }
    }));
  },
}));
