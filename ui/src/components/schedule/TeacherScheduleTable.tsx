import React from 'react';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '../../utils/cn';
import type { Teacher, Lesson, Department } from '../../types/schedule';

interface TeacherScheduleTableProps {
  teachers: Teacher[];
  departments: Department[];
  lessons: Lesson[];
  weekStart: Date;
  className?: string;
}

export const TeacherScheduleTable: React.FC<TeacherScheduleTableProps> = ({
  teachers,
  departments,
  lessons,
  weekStart,
  className,
}) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const lessonNumbers = [1, 2, 3, 4, 5, 6, 7];

  // Получаем уроки для конкретного учителя, дня и номера урока
  const getLessonForTeacher = (teacherId: string, day: Date, lessonNumber: number) => {
    return lessons.find(lesson => 
      lesson.teacherId === teacherId &&
      lesson.dayOfWeek === day.getDay() &&
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
                Учителя
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
                Кафедра / ФИО
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
            {departments.map((department) => (
              <React.Fragment key={department.id}>
                {/* Заголовок кафедры */}
                <tr className="border-b bg-blue-50">
                  <td className="p-3 font-semibold text-blue-900 border-r">
                    {department.name}
                  </td>
                  {days.map((day) => (
                    <td key={`dept-${day.toISOString()}`} className="p-1 border-r last:border-r-0">
                      <div className="grid grid-cols-7 gap-1 h-8">
                        {lessonNumbers.map(num => (
                          <div key={num} className="border border-blue-200 rounded bg-blue-100"></div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Учителя кафедры */}
                {department.teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm border-r">
                      <div className="font-medium text-gray-900">
                        {teacher.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {teacher.subjects.join(', ')}
                      </div>
                    </td>
                    {days.map((day) => (
                      <td key={`${teacher.id}-${day.toISOString()}`} className="p-1 border-r last:border-r-0">
                        <div className="grid grid-cols-7 gap-1">
                          {lessonNumbers.map(lessonNumber => {
                            const lesson = getLessonForTeacher(teacher.id, day, lessonNumber);
                            
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
                                {lesson ? lesson.class : ''}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
