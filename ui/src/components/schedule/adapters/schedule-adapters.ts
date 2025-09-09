import type { Class, Teacher } from '../../../types/schedule';
import type { ScheduleEntity } from '../base/week-schedule-table';
import type { LessonData } from '../base/lesson-cell';

// Функция для сокращения ФИО в формат "Иванов А.Д."
const shortenTeacherName = (fullName: string): string => {
  const parts = fullName.trim().split(' ');
  if (parts.length < 3) return fullName; // Если не полное ФИО, возвращаем как есть
  
  // Порядок в fullName: Имя Фамилия Отчество
  const firstName = parts[0];
  const lastName = parts[1];
  const middleName = parts[2];
  
  const firstInitial = firstName.charAt(0).toUpperCase();
  const middleInitial = middleName.charAt(0).toUpperCase();
  
  return `${lastName} ${firstInitial}.${middleInitial}.`;
};

// Адаптер для классов
export const classToScheduleEntity = (classItem: Class): ScheduleEntity => ({
  id: classItem.id,
  name: classItem.name,
  subtitle: `${classItem.grade} класс`,
});

// Адаптер для учителей
export const teacherToScheduleEntity = (teacher: Teacher): ScheduleEntity => ({
  id: teacher.id,
  name: shortenTeacherName(teacher.fullName),
  subtitle: teacher.subjectNames.join(', '),
});

// Функции для получения уроков
export const getLessonForClass = (lessons: any[], classId: number, day: Date, lessonNumber: number): LessonData | undefined => {
  const dbDayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
  
  const lesson = lessons.find(lesson => 
    lesson.idClass === classId &&
    lesson.dayOfWeek === dbDayOfWeek &&
    lesson.lessonNumber === lessonNumber
  );

  if (!lesson) return undefined;

  const secondary: string[] = [];
  if (lesson.teacherName) secondary.push(lesson.teacherName);
  if (lesson.classroomNumber) secondary.push(`каб. ${lesson.classroomNumber}`);

  return {
    primary: lesson.subjectName, // Для классов primary - это предмет
    secondary
  };
};

export const getLessonForTeacher = (lessons: any[], teacherId: number, day: Date, lessonNumber: number): LessonData | undefined => {
  const dbDayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
  
  const lesson = lessons.find(lesson => 
    lesson.idTeacher === teacherId &&
    lesson.dayOfWeek === dbDayOfWeek &&
    lesson.lessonNumber === lessonNumber
  );

  if (!lesson) return undefined;

  const secondary: string[] = [];
  if (lesson.subjectName) secondary.push(lesson.subjectName);
  if (lesson.classroomNumber) secondary.push(`каб. ${lesson.classroomNumber}`);

  return {
    primary: lesson.className, // Для учителей primary - это класс
    secondary
  };
};
