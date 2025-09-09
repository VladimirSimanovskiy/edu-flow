import type { Class, Teacher } from '../../../types/schedule';
import type { ScheduleEntity } from '../base/week-schedule-table';

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
export const getLessonForClass = (lessons: any[], classId: number, day: Date, lessonNumber: number) => {
  const dbDayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
  
  return lessons.find(lesson => 
    lesson.idClass === classId &&
    lesson.dayOfWeek === dbDayOfWeek &&
    lesson.lessonNumber === lessonNumber
  );
};

export const getLessonForTeacher = (lessons: any[], teacherId: number, day: Date, lessonNumber: number) => {
  const dbDayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
  
  return lessons.find(lesson => 
    lesson.idTeacher === teacherId &&
    lesson.dayOfWeek === dbDayOfWeek &&
    lesson.lessonNumber === lessonNumber
  );
};
