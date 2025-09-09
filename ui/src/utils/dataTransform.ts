import type { 
  Lesson as DatabaseLesson, 
  Teacher as DatabaseTeacher, 
  Class as DatabaseClass,
  LessonSchedule,
  ScheduleVersion
} from '../types/database';
import type { 
  Lesson, 
  Teacher, 
  Class,
  LessonScheduleWithTimes,
  ScheduleVersionWithLessons
} from '../types/schedule';

// Helper function to format time from Date or string to string
const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
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
  return {
    ...dbLesson,
    subjectName: dbLesson.subject.name,
    teacherName: shortenTeacherName(dbLesson.teacher.firstName, dbLesson.teacher.lastName, dbLesson.teacher.middleName),
    className: `${dbLesson.class.grade}${dbLesson.class.letter}`,
    classroomNumber: dbLesson.classroom.number,
    startTime: formatTime(dbLesson.lessonSchedule.timeBegin),
    endTime: formatTime(dbLesson.lessonSchedule.timeEnd),
    lessonNumber: dbLesson.lessonSchedule.lessonNumber,
  };
};

// Transform database teacher to UI teacher
export const transformTeacher = (dbTeacher: DatabaseTeacher): Teacher => {
  return {
    ...dbTeacher,
    fullName: `${dbTeacher.firstName} ${dbTeacher.lastName}${dbTeacher.middleName ? ` ${dbTeacher.middleName}` : ''}`,
    subjectNames: dbTeacher.subjects.map(ts => ts.subject.name),
  };
};

// Transform database class to UI class
export const transformClass = (dbClass: DatabaseClass): Class => {
  return {
    ...dbClass,
    name: `${dbClass.grade}${dbClass.letter}`,
    classLeaderName: dbClass.classLeader 
      ? `${dbClass.classLeader.firstName} ${dbClass.classLeader.lastName}`
      : undefined,
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
export const transformScheduleVersion = (dbVersion: ScheduleVersion & { lessons?: DatabaseLesson[] }): ScheduleVersionWithLessons => {
  return {
    ...dbVersion,
    lessons: dbVersion.lessons ? dbVersion.lessons.map(transformLesson) : [],
  };
};

// Transform arrays of data
export const transformLessons = (dbLessons: DatabaseLesson[]): Lesson[] => {
  return dbLessons.map(transformLesson);
};

export const transformTeachers = (dbTeachers: DatabaseTeacher[]): Teacher[] => {
  return dbTeachers.map(transformTeacher);
};

export const transformClasses = (dbClasses: DatabaseClass[]): Class[] => {
  return dbClasses.map(transformClass);
};

export const transformLessonSchedules = (dbSchedules: LessonSchedule[]): LessonScheduleWithTimes[] => {
  return dbSchedules.map(transformLessonSchedule);
};

export const transformScheduleVersions = (dbVersions: (ScheduleVersion & { lessons?: DatabaseLesson[] })[]): ScheduleVersionWithLessons[] => {
  return dbVersions.map(transformScheduleVersion);
};
