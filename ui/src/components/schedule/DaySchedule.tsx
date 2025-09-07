import React from 'react';
import { format, parseISO } from 'date-fns';
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

interface DayScheduleProps {
  lessons: Lesson[];
  date: Date;
  className?: string;
}

export const DaySchedule: React.FC<DayScheduleProps> = ({
  lessons,
  date,
  className,
}) => {
  const timeSlots = [
    '08:00', '08:45', '09:30', '10:15', '11:00', '11:45',
    '12:30', '13:15', '14:00', '14:45', '15:30', '16:15'
  ];

  const getLessonForTime = (time: string) => {
    return lessons.find(lesson => lesson.startTime === time);
  };

  return (
    <div className={cn('bg-white rounded-lg border shadow-sm', className)}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">
          {format(date, 'EEEE, d MMMM yyyy', { locale: ru })}
        </h3>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {timeSlots.map((time) => {
            const lesson = getLessonForTime(time);
            
            return (
              <div
                key={time}
                className={cn(
                  'flex items-center p-3 rounded-lg border',
                  lesson ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                )}
              >
                <div className="w-20 text-sm font-medium text-gray-600">
                  {time}
                </div>
                
                <div className="flex-1 ml-4">
                  {lesson ? (
                    <div>
                      <div className="font-medium text-gray-900">
                        {lesson.subject}
                      </div>
                      <div className="text-sm text-gray-600">
                        {lesson.teacher} • {lesson.classroom}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic">
                      Нет урока
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
