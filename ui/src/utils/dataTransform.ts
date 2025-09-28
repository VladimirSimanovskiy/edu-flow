import type {
	Lesson as DatabaseLesson,
	Teacher as DatabaseTeacher,
	Class as DatabaseClass,
	LessonSchedule,
	ScheduleVersion,
} from '../types/database';
import type {
	Lesson,
	LessonScheduleWithTimes,
	ScheduleVersionWithLessons,
} from '../types/schedule';
import type { TeacherWithComputedFields, ClassWithComputedFields } from '@shared/types';

// Helper function to format time from Date or string to string
const formatTime = (date: Date | string): string => {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return dateObj.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
};

// Функция для сокращения ФИО в формат "Иванов А.Д."
const shortenTeacherName = (firstName: string, lastName: string, middleName?: string): string => {
	if (!middleName) {
		return `${lastName} ${firstName.charAt(0).toUpperCase()}.`;
	}

	const firstInitial = firstName.charAt(0).toUpperCase();
	const middleInitial = middleName.charAt(0).toUpperCase();

	return `${lastName} ${firstInitial}.${middleInitial}.`;
};

// Transform database lesson to UI lesson
export const transformLesson = (dbLesson: DatabaseLesson): Lesson => {
	// Базовые поля основного урока
	const base = {
		...dbLesson,
		subjectName: dbLesson.subject.name,
		teacherName: shortenTeacherName(
			dbLesson.teacher.firstName,
			dbLesson.teacher.lastName,
			dbLesson.teacher.middleName
		),
		className: `${dbLesson.class.grade}${dbLesson.class.letter}`,
		classroomNumber: dbLesson.classroom.number,
		startTime: formatTime(dbLesson.lessonSchedule.timeBegin),
		endTime: formatTime(dbLesson.lessonSchedule.timeEnd),
		lessonNumber: dbLesson.lessonSchedule.lessonNumber,
		groupNumber: (dbLesson as any).groupNumber ?? null,
	} as Lesson;

	// Поддержка возможного замещения (берём первое для даты)
	if ((dbLesson as any).substitutions && (dbLesson as any).substitutions.length > 0) {
		const sub = (dbLesson as any).substitutions[0];
		base.substitution = {
			id: sub.id,
			date: sub.date,
			teacherName: shortenTeacherName(
				sub.teacher.firstName,
				sub.teacher.lastName,
				sub.teacher.middleName
			),
			idTeacher: sub.idTeacher,
			classroomNumber: sub.classroom.number,
			idClassroom: sub.idClassroom,
		};
	}

	return base;
};

// Transform database teacher to UI teacher
export const transformTeacher = (dbTeacher: DatabaseTeacher): TeacherWithComputedFields => {
	return {
		id: dbTeacher.id,
		firstName: dbTeacher.firstName,
		lastName: dbTeacher.lastName,
		isActive: dbTeacher.isActive,
		createdAt: dbTeacher.createdAt,
		updatedAt: dbTeacher.updatedAt,
		middleName: dbTeacher.middleName ?? null,
		email: dbTeacher.email ?? null,
		phone: dbTeacher.phone ?? null,
		idAssignedClassroom: dbTeacher.idAssignedClassroom ?? null,
		idUser: dbTeacher.idUser ?? null,
		fullName: `${dbTeacher.firstName} ${dbTeacher.lastName}${dbTeacher.middleName ? ` ${dbTeacher.middleName}` : ''}`,
		subjectNames: dbTeacher.subjects.map(ts => ts.subject.name),
		assignedClassroomNumber: dbTeacher.assignedClassroom?.number,
	};
};

// Transform database class to UI class
export const transformClass = (dbClass: DatabaseClass): ClassWithComputedFields => {
	return {
		id: dbClass.id,
		grade: dbClass.grade,
		letter: dbClass.letter,
		createdAt: dbClass.createdAt,
		updatedAt: dbClass.updatedAt,
		idClassLeaderTeacher: dbClass.idClassLeaderTeacher ?? null,
		name: `${dbClass.grade}${dbClass.letter}`,
		classLeaderName: dbClass.classLeader
			? `${dbClass.classLeader.firstName} ${dbClass.classLeader.lastName}`
			: undefined,
		studentCount: dbClass.studentHistory?.length ?? 0,
	};
};

// Transform lesson schedule with time formatting
export const transformLessonSchedule = (dbSchedule: LessonSchedule): LessonScheduleWithTimes => {
	return {
		...dbSchedule,
		startTime: formatTime(dbSchedule.timeBegin),
		endTime: formatTime(dbSchedule.timeEnd),
	};
};

// Transform schedule version with lessons
export const transformScheduleVersion = (
	dbVersion: ScheduleVersion & { lessons?: DatabaseLesson[] }
): ScheduleVersionWithLessons => {
	return {
		...dbVersion,
		lessons: dbVersion.lessons ? dbVersion.lessons.map(transformLesson) : [],
	};
};

// Transform arrays of data
export const transformLessons = (dbLessons: DatabaseLesson[]): Lesson[] => {
	return dbLessons.map(transformLesson);
};

export const transformTeachers = (dbTeachers: DatabaseTeacher[]): TeacherWithComputedFields[] => {
	return dbTeachers.map(transformTeacher);
};

export const transformClasses = (dbClasses: DatabaseClass[]): ClassWithComputedFields[] => {
	return dbClasses.map(transformClass);
};

export const transformLessonSchedules = (
	dbSchedules: LessonSchedule[]
): LessonScheduleWithTimes[] => {
	return dbSchedules.map(transformLessonSchedule);
};

export const transformScheduleVersions = (
	dbVersions: (ScheduleVersion & { lessons?: DatabaseLesson[] })[]
): ScheduleVersionWithLessons[] => {
	return dbVersions.map(transformScheduleVersion);
};
