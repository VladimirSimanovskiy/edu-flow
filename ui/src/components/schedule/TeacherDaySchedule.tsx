import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '../../utils/cn';
import type { Teacher, Lesson } from '../../types/schedule';
import { useLessonNumbers } from '../../hooks/useLessonNumbers';

interface TeacherDayScheduleProps {
  teachers: Teacher[];
  lessons: Lesson[];
  date: Date;
  className?: string;
}

export const TeacherDaySchedule: React.FC<TeacherDayScheduleProps> = ({
  teachers,
  lessons,
  date,
  className,
}) => {
  const { lessonNumbers, isLoading: lessonNumbersLoading } = useLessonNumbers();

  // Показываем загрузку, если номера уроков еще не загружены
  if (lessonNumbersLoading) {
    return (
      <div className={cn('bg-white rounded-lg border shadow-sm p-8', className)}>
        <div className="flex items-center justify-center">
          <div className="text-gray-500">Загрузка расписания уроков...</div>
        </div>
      </div>
    );
  }

  // Получаем урок для конкретного учителя и номера урока на выбранный день
  const getLessonForTeacher = (teacherId: number, lessonNumber: number) => {
    // Приводим день недели к стандарту базы данных (понедельник = 1, воскресенье = 7)
    const dbDayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
    
    const foundLesson = lessons.find(lesson => 
      lesson.idTeacher === teacherId &&
      lesson.dayOfWeek === dbDayOfWeek &&
      lesson.lessonNumber === lessonNumber
    );

    return foundLesson;
  };


  return (
    <div className={cn('bg-white rounded-lg border shadow-sm overflow-hidden', className)}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">
          {format(date, 'EEEE, d MMMM yyyy', { locale: ru })}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="w-48 p-3 text-left text-sm font-medium text-gray-600 border-r">
                Учителя
              </th>
              <th className="p-2 text-center text-sm font-medium text-gray-600">
                <div className={`grid gap-1`} style={{ gridTemplateColumns: `repeat(${lessonNumbers.length}, 1fr)` }}>
                  {lessonNumbers.map(num => (
                    <div key={num} className="text-center font-semibold">
                      {num}
                    </div>
                  ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm border-r">
                  <div className="font-medium text-gray-900">
                    {teacher.fullName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {teacher.subjectNames.join(', ')}
                  </div>
                </td>
                <td className="p-1">
                  <div className={`grid gap-1`} style={{ gridTemplateColumns: `repeat(${lessonNumbers.length}, 1fr)` }}>
                    {lessonNumbers.map(lessonNumber => {
                      const lesson = getLessonForTeacher(teacher.id, lessonNumber);
                      
                      return (
                        <div
                          key={lessonNumber}
                          className={cn(
                            'h-8 border rounded text-xs flex items-center justify-center',
                            lesson 
                              ? 'bg-green-100 border-green-300 text-green-800 font-medium' 
                              : 'bg-gray-50 border-gray-200'
                          )}
                        >
                          {lesson ? lesson.className : ''}
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
