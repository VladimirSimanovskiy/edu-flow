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

export const getLessonForClass = (lessons: any[], classId: number, day: Date, lessonNumber: number): LessonData | undefined => {
  const dbDayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
  
  const lesson = lessons.find(lesson => 
    lesson.idClass === classId &&
    lesson.dayOfWeek === dbDayOfWeek &&
    lesson.lessonNumber === lessonNumber
  );

  if (!lesson) return undefined;

  // Если есть замещение — показываем замещение вместо основного урока и помечаем как substitution
  if (lesson.substitution) {
    const secondary: string[] = [];
    if (lesson.substitution.teacherName) secondary.push(lesson.substitution.teacherName);
    if (lesson.substitution.classroomNumber) secondary.push(`каб. ${lesson.substitution.classroomNumber}`);

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

export const getLessonForTeacher = (lessons: any[], teacherId: number, day: Date, lessonNumber: number): LessonData | undefined => {
  const dbDayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
  
  // 1) Прямой урок этого учителя
  const directLesson = lessons.find(lesson => 
    lesson.idTeacher === teacherId &&
    lesson.dayOfWeek === dbDayOfWeek &&
    lesson.lessonNumber === lessonNumber
  );

  if (directLesson) {
    // Если есть замещение — показать основной урок бледным
    if (directLesson.substitution) {
      const secondary: string[] = [];
      if (directLesson.subjectName) secondary.push(directLesson.subjectName);
      if (directLesson.classroomNumber) secondary.push(`каб. ${directLesson.classroomNumber}`);

      return {
        primary: directLesson.className,
        secondary,
        isReplacedOriginal: true,
      };
    }

    const secondary: string[] = [];
    if (directLesson.subjectName) secondary.push(directLesson.subjectName);
    if (directLesson.classroomNumber) secondary.push(`каб. ${directLesson.classroomNumber}`);

    return {
      primary: directLesson.className,
      secondary,
    };
  }

  // 2) Урок по замещению для этого учителя (он ведёт чужой урок)
  const substitutedLesson = lessons.find(lesson => 
    lesson.dayOfWeek === dbDayOfWeek &&
    lesson.lessonNumber === lessonNumber &&
    lesson.substitution && lesson.substitution.idTeacher === teacherId
  );

  if (substitutedLesson) {
    const subSecondary: string[] = [];
    if (substitutedLesson.subjectName) subSecondary.push(substitutedLesson.subjectName);
    if (substitutedLesson.substitution.classroomNumber) subSecondary.push(`каб. ${substitutedLesson.substitution.classroomNumber}`);

    return {
      primary: substitutedLesson.className,
      secondary: subSecondary,
      isSubstitution: true,
    };
  }

  return undefined;
};
