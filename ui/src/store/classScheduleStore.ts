import { create } from 'zustand';

interface ClassHighlightState {
  // Для расписания классов: подсвечиваем уроки выбранного учителя
  highlightedTeacherId?: number;
  highlightedTeacherDate?: Date;
  // Hover подсветка пары замещения
  hoverLinked?: {
    day: number;
    lessonNumber: number;
    classId: number;
    originalTeacherId: number;
    substituteTeacherId: number;
  };
}

interface ClassScheduleState {
  highlight: ClassHighlightState;
  setHighlightedTeacher: (teacherId: number | undefined, date: Date | undefined) => void;
  clearHighlight: () => void;
  setHoverLinked: (payload: ClassHighlightState['hoverLinked'] | undefined) => void;
}

export const useClassScheduleStore = create<ClassScheduleState>((set) => ({
  highlight: {},
  setHighlightedTeacher: (teacherId, date) => {
    set(() => ({
      highlight: {
        highlightedTeacherId: teacherId,
        highlightedTeacherDate: date,
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
