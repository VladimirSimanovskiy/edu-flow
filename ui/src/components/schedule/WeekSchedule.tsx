import React from 'react';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '../../utils/cn';

interface Lesson {
  id: string;
  subject: string;
  teacher: string;
  classroom: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  weekNumber?: number;
}

interface WeekScheduleProps {
  lessons: Lesson[];
  weekStart: Date;
  className?: string;
}

export const WeekSchedule: React.FC<WeekScheduleProps> = ({
  lessons,
  weekStart,
  className,
}) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = [
    '08:00', '08:45', '09:30', '10:15', '11:00', '11:45',
    '12:30', '13:15', '14:00', '14:45', '15:30', '16:15'
  ];

  const getLessonsForDay = (day: Date) => {
    return lessons.filter(lesson => 
      lesson.dayOfWeek === day.getDay() && 
      lesson.weekNumber === Math.ceil(day.getDate() / 7)
    );
  };

  const getLessonForTimeAndDay = (time: string, day: Date) => {
    const dayLessons = getLessonsForDay(day);
    return dayLessons.find(lesson => lesson.startTime === time);
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
            <tr className="border-b">
              <th className="w-20 p-3 text-left text-sm font-medium text-gray-600">
                Время
              </th>
              {days.map((day) => (
                <th key={day.toISOString()} className="w-32 p-3 text-center text-sm font-medium text-gray-600">
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
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time} className="border-b last:border-b-0">
                <td className="p-3 text-sm font-medium text-gray-600">
                  {time}
                </td>
                {days.map((day) => {
                  const lesson = getLessonForTimeAndDay(time, day);
                  
                  return (
                    <td key={day.toISOString()} className="p-2">
                      {lesson ? (
                        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                          <div className="font-medium text-blue-900">
                            {lesson.subject}
                          </div>
                          <div className="text-blue-700">
                            {lesson.teacher}
                          </div>
                          <div className="text-blue-600">
                            {lesson.classroom}
                          </div>
                        </div>
                      ) : (
                        <div className="h-12 border border-gray-100 rounded"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
