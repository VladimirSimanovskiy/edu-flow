import { create } from 'zustand';

interface ClassHighlightState {
  // Для расписания классов: подсвечиваем уроки выбранного учителя
  highlightedTeacherId?: number;
  highlightedTeacherDate?: Date;
}

interface ClassScheduleState {
  highlight: ClassHighlightState;
  setHighlightedTeacher: (teacherId: number | undefined, date: Date | undefined) => void;
  clearHighlight: () => void;
}

export const useClassScheduleStore = create<ClassScheduleState>((set) => ({
  highlight: {},
  setHighlightedTeacher: (teacherId, date) => {
    console.log('Setting highlighted teacher:', { teacherId, date });
    set(() => ({
      highlight: {
        highlightedTeacherId: teacherId,
        highlightedTeacherDate: date,
      }
    }));
  },
  clearHighlight: () => {
    console.log('Clearing class highlight');
    set(() => ({
      highlight: {}
    }));
  },
}));
