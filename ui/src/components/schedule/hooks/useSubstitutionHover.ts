import { useCallback } from 'react';
import type { Lesson } from '../../../types/schedule';

export interface TeacherHoverLinkedPayload {
	day: number;
	lessonNumber: number;
	originalTeacherId: number;
	substituteTeacherId: number;
}

export const useSubstitutionHover = (lessons: Lesson[]) => {
	const findBaseLessonByTeacher = useCallback(
		(teacherId: number, dbDay: number, lessonNumber: number) => {
			return lessons.find(
				l =>
					l.dayOfWeek === dbDay &&
					l.lessonNumber === lessonNumber &&
					(l.idTeacher === teacherId ||
						(l.substitution && l.substitution.idTeacher === teacherId))
			);
		},
		[lessons]
	);

	const buildHoverLinkedPayload = useCallback(
		(
			base: Lesson | undefined,
			dbDay: number,
			lessonNumber: number
		): TeacherHoverLinkedPayload | undefined => {
			if (!base || !base.substitution) return undefined;
			return {
				day: dbDay,
				lessonNumber,
				originalTeacherId: base.idTeacher,
				substituteTeacherId: base.substitution.idTeacher,
			};
		},
		[]
	);

	// Week (date provided)
	const onTeacherWeekHoverChange = useCallback(
		(teacherId: number, day: Date, lessonNumber: number, hovered: boolean) => {
			const dbDay = day.getDay() === 0 ? 7 : day.getDay();
			const base = findBaseLessonByTeacher(teacherId, dbDay, lessonNumber);
			return hovered ? buildHoverLinkedPayload(base, dbDay, lessonNumber) : undefined;
		},
		[findBaseLessonByTeacher, buildHoverLinkedPayload]
	);

	const isTeacherWeekHoverLinked = useCallback(
		(
			teacherId: number,
			day: Date,
			lessonNumber: number,
			hoverLinked?: TeacherHoverLinkedPayload
		) => {
			if (!hoverLinked) return false;
			const dbDay = day.getDay() === 0 ? 7 : day.getDay();
			return (
				hoverLinked.day === dbDay &&
				hoverLinked.lessonNumber === lessonNumber &&
				(teacherId === hoverLinked.originalTeacherId ||
					teacherId === hoverLinked.substituteTeacherId)
			);
		},
		[]
	);

	// Day (dayOfWeek number provided)
	const onTeacherDayHoverChange = useCallback(
		(teacherId: number, dayOfWeek: number, lessonNumber: number, hovered: boolean) => {
			const base = findBaseLessonByTeacher(teacherId, dayOfWeek, lessonNumber);
			return hovered ? buildHoverLinkedPayload(base, dayOfWeek, lessonNumber) : undefined;
		},
		[findBaseLessonByTeacher, buildHoverLinkedPayload]
	);

	const isTeacherDayHoverLinked = useCallback(
		(
			teacherId: number,
			dayOfWeek: number,
			lessonNumber: number,
			hoverLinked?: TeacherHoverLinkedPayload
		) => {
			if (!hoverLinked) return false;
			return (
				hoverLinked.day === dayOfWeek &&
				hoverLinked.lessonNumber === lessonNumber &&
				(teacherId === hoverLinked.originalTeacherId ||
					teacherId === hoverLinked.substituteTeacherId)
			);
		},
		[]
	);

	return {
		onTeacherWeekHoverChange,
		isTeacherWeekHoverLinked,
		onTeacherDayHoverChange,
		isTeacherDayHoverLinked,
	};
};
