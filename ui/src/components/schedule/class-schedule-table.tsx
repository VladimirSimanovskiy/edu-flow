import React from 'react';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '../../utils/cn';
import type { Class, Lesson } from '../../types/schedule';
import { useLessonNumbers } from '../../hooks/useLessonNumbers';

interface ClassScheduleTableProps {
  classes: Class[];
  lessons: Lesson[];
  weekStart: Date;
  className?: string;
}

export const ClassScheduleTable: React.FC<ClassScheduleTableProps> = ({
  classes,
  lessons,
  weekStart,
  className,
}) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
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

  // Получаем уроки для конкретного класса, дня и номера урока
  const getLessonForClass = (classId: number, day: Date, lessonNumber: number) => {
    // Приводим день недели к стандарту базы данных (понедельник = 1, воскресенье = 7)
    const dbDayOfWeek = day.getDay() === 0 ? 7 : day.getDay();
    
    return lessons.find(lesson => 
      lesson.idClass === classId &&
      lesson.dayOfWeek === dbDayOfWeek &&
      lesson.lessonNumber === lessonNumber
    );
  };

  return (
    <div className={cn('bg-white rounded-lg border shadow-sm overflow-hidden', className)}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">
          Неделя {format(weekStart, 'd MMM', { locale: ru })} - {format(addDays(weekStart, 6), 'd MMM yyyy', { locale: ru })}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="w-48 p-3 text-left text-sm font-medium text-gray-600 border-r">
                Классы
              </th>
              {days.map((day) => (
                <th key={day.toISOString()} className="p-2 text-center text-sm font-medium text-gray-600 border-r last:border-r-0">
                  <div>
                    <div className="font-semibold">
                      {format(day, 'EEE', { locale: ru })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(day, 'd MMM', { locale: ru })}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
            <tr className="border-b bg-gray-50">
              <th className="w-48 p-3 text-left text-sm font-medium text-gray-600 border-r">
                Класс
              </th>
              {days.map((day) => (
                <th key={`sub-${day.toISOString()}`} className="p-1 text-center text-xs font-medium text-gray-500 border-r last:border-r-0">
                  <div className="grid grid-cols-7 gap-1">
                    {lessonNumbers.map(num => (
                      <div key={num} className="text-center">
                        {num}
                      </div>
                    ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm border-r">
                  <div className="font-medium text-gray-900">
                    {classItem.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {classItem.grade} класс
                  </div>
                </td>
                {days.map((day) => (
                  <td key={`${classItem.id}-${day.toISOString()}`} className="p-1 border-r last:border-r-0">
                    <div className="grid grid-cols-7 gap-1">
                      {lessonNumbers.map(lessonNumber => {
                        const lesson = getLessonForClass(classItem.id, day, lessonNumber);
                        
                        return (
                          <div
                            key={lessonNumber}
                            className={cn(
                              'h-8 border rounded text-xs flex flex-col items-center justify-center',
                              lesson 
                                ? 'bg-blue-100 border-blue-300 text-blue-800' 
                                : 'bg-gray-50 border-gray-200'
                            )}
                          >
                            {lesson ? (
                              <>
                                <div className="font-medium truncate w-full text-center">
                                  {lesson.teacherName}
                                </div>
                                <div className="text-xs text-blue-600 truncate w-full text-center">
                                  {lesson.classroomNumber}
                                </div>
                              </>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
