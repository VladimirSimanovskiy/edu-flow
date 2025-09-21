import type { Class, Teacher, Lesson } from '../../../types/schedule';
import type { ScheduleEntity } from '../ui/table/week-schedule-table';
import type { LessonData } from '../ui/table/lesson-cell';

// Helpers
const shortenTeacherName = (fullName: string): string => {
  const parts = fullName.trim().split(' ');
  if (parts.length < 3) return fullName;
  const firstName = parts[0];
  const lastName = parts[1];
  const middleName = parts[2];
  const firstInitial = firstName.charAt(0).toUpperCase();
  const middleInitial = middleName.charAt(0).toUpperCase();
  return `${lastName} ${firstInitial}.${middleInitial}.`;
};

// Entities
export const classToScheduleEntity = (classItem: Class): ScheduleEntity => ({
  id: classItem.id,
  name: classItem.name,
  subtitle: `${classItem.grade} класс`,
});

export const teacherToScheduleEntity = (teacher: Teacher): ScheduleEntity => ({
  id: teacher.id,
  name: shortenTeacherName(teacher.fullName),
  subtitle: teacher.subjectNames.join(', '),
});

// Lessons
export const getLessonForClass = (lessons: Lesson[], classId: number, day: Date, lessonNumber: number): LessonData | undefined => {
  const dbDayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
  const lesson = lessons.find(l => l.idClass === classId && l.dayOfWeek === dbDayOfWeek && l.lessonNumber === lessonNumber);
  if (!lesson) return undefined;

  if (lesson.substitution) {
    const secondary: string[] = [];
    if (lesson.substitution.teacherName) secondary.push(lesson.substitution.teacherName);
    if (lesson.substitution.classroomNumber) secondary.push(`каб. ${lesson.substitution.classroomNumber}`);
    return { primary: lesson.subjectName, secondary, isSubstitution: true };
  }

  const secondary: string[] = [];
  if (lesson.teacherName) secondary.push(lesson.teacherName);
  if (lesson.classroomNumber) secondary.push(`каб. ${lesson.classroomNumber}`);
  return { primary: lesson.subjectName, secondary };
};

export const getLessonForTeacher = (lessons: Lesson[], teacherId: number, day: Date, lessonNumber: number): LessonData | undefined => {
  const dbDayOfWeek = day.getDay() === 0 ? 7 : day.getDay();

  const direct = lessons.find(l => l.idTeacher === teacherId && l.dayOfWeek === dbDayOfWeek && l.lessonNumber === lessonNumber);
  if (direct) {
    if (direct.substitution) {
      const secondary: string[] = [];
      if (direct.subjectName) secondary.push(direct.subjectName);
      if (direct.classroomNumber) secondary.push(`каб. ${direct.classroomNumber}`);
      return { primary: direct.className, secondary, isReplacedOriginal: true };
    }
    const secondary: string[] = [];
    if (direct.subjectName) secondary.push(direct.subjectName);
    if (direct.classroomNumber) secondary.push(`каб. ${direct.classroomNumber}`);
    return { primary: direct.className, secondary };
  }

  const substituted = lessons.find(l => l.dayOfWeek === dbDayOfWeek && l.lessonNumber === lessonNumber && l.substitution && l.substitution.idTeacher === teacherId);
  if (substituted) {
    const subSecondary: string[] = [];
    if (substituted.subjectName) subSecondary.push(substituted.subjectName);
    if (substituted.substitution && substituted.substitution.classroomNumber) subSecondary.push(`каб. ${substituted.substitution.classroomNumber}`);
    return { primary: substituted.className, secondary: subSecondary, isSubstitution: true };
  }

  return undefined;
};
