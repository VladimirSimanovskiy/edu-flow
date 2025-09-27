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
	// Режим создания замещения
	substitutionMode?: {
		date: string; // YYYY-MM-DD
		lessonNumber: number;
		idOriginalLesson: number;
		idOriginalTeacher: number;
		classId: number;
	};
	// Набор свободных учителей по lessonNumber (для подсветки пустых ячеек)
	freeTeacherIdsAtTimeslot?: number[];
}

interface TeacherScheduleState {
	highlight: TeacherHighlightState;
	setHighlightedClass: (classId: number | undefined, date: Date | undefined) => void;
	clearHighlight: () => void;
	setHoverLinked: (payload: TeacherHighlightState['hoverLinked'] | undefined) => void;
	enterSubstitutionMode: (
		payload: TeacherHighlightState['substitutionMode'],
		freeTeacherIds: number[]
	) => void;
	exitSubstitutionMode: () => void;
}

export const useTeacherScheduleStore = create<TeacherScheduleState>(set => ({
	highlight: {},
	setHighlightedClass: (classId, date) => {
		set(() => ({
			highlight: {
				highlightedClassId: classId,
				highlightedClassDate: date,
			},
		}));
	},
	clearHighlight: () => {
		set(() => ({
			highlight: {},
		}));
	},
	setHoverLinked: payload => {
		set(state => ({
			highlight: {
				...state.highlight,
				hoverLinked: payload,
			},
		}));
	},
	enterSubstitutionMode: (payload, freeTeacherIds) => {
		set(state => ({
			highlight: {
				...state.highlight,
				substitutionMode: payload,
				freeTeacherIdsAtTimeslot: freeTeacherIds,
			},
		}));
	},
	exitSubstitutionMode: () => {
		set(state => ({
			highlight: {
				...state.highlight,
				substitutionMode: undefined,
				freeTeacherIdsAtTimeslot: undefined,
			},
		}));
	},
}));
