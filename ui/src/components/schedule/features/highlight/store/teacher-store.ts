import { create } from 'zustand';

interface TeacherHighlightState {
	highlightedClassId?: number;
	highlightedClassDate?: Date;
	hoverLinked?: {
		day: number;
		lessonNumber: number;
		originalTeacherId: number;
		substituteTeacherId: number;
	};
	substitutionMode?: {
		date: string; // YYYY-MM-DD
		lessonNumber: number;
		idOriginalLesson: number;
		idOriginalTeacher: number;
		classId: number;
	};
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
