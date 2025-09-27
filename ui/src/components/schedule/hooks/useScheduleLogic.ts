import { useMemo } from 'react';
import type { Lesson } from '../../../types/schedule';

// Локальный тип для данных урока
export interface LessonData {
	primary?: string;
	secondary?: string[];
	isSubstitution?: boolean;
	isReplacedOriginal?: boolean;
	replaced?: {
		primary?: string;
		secondary?: string[];
	};
}

export const useScheduleLogic = (lessons: Lesson[]) => {
	const getLessonForClass = useMemo(() => {
		return (
			classId: number,
			dayOfWeek: number,
			lessonNumber: number
		): LessonData | undefined => {
			const lesson = lessons.find(
				lesson =>
					lesson.idClass === classId &&
					lesson.dayOfWeek === dayOfWeek &&
					lesson.lessonNumber === lessonNumber
			);

			if (!lesson) return undefined;

			// Для расписания классов: если есть замещение, показываем замещение вместо основного
			if (lesson.substitution) {
				const secondary: string[] = [];
				if (lesson.substitution.teacherName)
					secondary.push(lesson.substitution.teacherName);
				if (lesson.substitution.classroomNumber)
					secondary.push(`каб. ${lesson.substitution.classroomNumber}`);

				return {
					primary: lesson.subjectName,
					secondary,
					isSubstitution: true,
				};
			}

			const secondary: string[] = [];
			if (lesson.teacherName) secondary.push(lesson.teacherName);
			if (lesson.classroomNumber) secondary.push(`каб. ${lesson.classroomNumber}`);

			return {
				primary: lesson.subjectName,
				secondary,
			};
		};
	}, [lessons]);

	const getLessonForTeacher = useMemo(() => {
		return (
			teacherId: number,
			dayOfWeek: number,
			lessonNumber: number
		): LessonData | undefined => {
			// 1) Прямой урок этого учителя
			const directLesson = lessons.find(
				lesson =>
					lesson.idTeacher === teacherId &&
					lesson.dayOfWeek === dayOfWeek &&
					lesson.lessonNumber === lessonNumber
			);

			if (directLesson) {
				if (directLesson.substitution) {
					// Основной урок заменён — показываем его бледным
					const secondary: string[] = [];
					if (directLesson.subjectName) secondary.push(directLesson.subjectName);
					if (directLesson.classroomNumber)
						secondary.push(`каб. ${directLesson.classroomNumber}`);

					return {
						primary: directLesson.className,
						secondary,
						isReplacedOriginal: true,
					};
				}

				const secondary: string[] = [];
				if (directLesson.subjectName) secondary.push(directLesson.subjectName);
				if (directLesson.classroomNumber)
					secondary.push(`каб. ${directLesson.classroomNumber}`);

				return {
					primary: directLesson.className,
					secondary,
				};
			}

			// 2) Урок-замещение, который ведёт этот учитель
			const substitutedLesson = lessons.find(
				lesson =>
					lesson.dayOfWeek === dayOfWeek &&
					lesson.lessonNumber === lessonNumber &&
					lesson.substitution &&
					lesson.substitution.idTeacher === teacherId
			);

			if (substitutedLesson) {
				const subSecondary: string[] = [];
				if (substitutedLesson.subjectName) subSecondary.push(substitutedLesson.subjectName);
				if (substitutedLesson.substitution.classroomNumber)
					subSecondary.push(`каб. ${substitutedLesson.substitution.classroomNumber}`);

				return {
					primary: substitutedLesson.className,
					secondary: subSecondary,
					isSubstitution: true,
				};
			}

			return undefined;
		};
	}, [lessons]);

	const getDayOfWeek = useMemo(() => {
		return (date: Date): number => {
			// Приводим день недели к стандарту базы данных (понедельник = 1, воскресенье = 7)
			return date.getDay() === 0 ? 7 : date.getDay();
		};
	}, []);

	return {
		getLessonForClass,
		getLessonForTeacher,
		getDayOfWeek,
	};
};
