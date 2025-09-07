import React from 'react';
import { startOfWeek } from 'date-fns';
import { useScheduleStore } from '../../store/scheduleStore';
import { TeacherScheduleTable } from './TeacherScheduleTable';
import { ClassScheduleTable } from './ClassScheduleTable';
import { TeacherDaySchedule } from './TeacherDaySchedule';
import { ClassDaySchedule } from './ClassDaySchedule';
import { DatePicker } from '../ui/DatePicker';
import { ViewToggle } from '../ui/ViewToggle';
import type { Teacher, Class, Lesson, Department } from '../../types/schedule';

// Mock data for demonstration
const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Иванова А.И.',
    fullName: 'Иванова Анна Ивановна',
    email: 'ivanova@school.ru',
    subjects: ['Математика', 'Алгебра'],
    department: 'Математики и информатики',
  },
  {
    id: '2',
    name: 'Петрова М.В.',
    fullName: 'Петрова Мария Владимировна',
    email: 'petrova@school.ru',
    subjects: ['Русский язык', 'Литература'],
    department: 'Русского языка и литературы',
  },
  {
    id: '3',
    name: 'Сидоров П.К.',
    fullName: 'Сидоров Петр Константинович',
    email: 'sidorov@school.ru',
    subjects: ['Физика'],
    department: 'Физики и астрономии',
  },
  {
    id: '4',
    name: 'Козлова Е.А.',
    fullName: 'Козлова Елена Александровна',
    email: 'kozlova@school.ru',
    subjects: ['История', 'Обществознание'],
    department: 'Истории и обществознания',
  },
];

const mockClasses: Class[] = [
  {
    id: '1',
    name: '10А',
    grade: 10,
    students: 25,
  },
  {
    id: '2',
    name: '10Б',
    grade: 10,
    students: 23,
  },
  {
    id: '3',
    name: '11А',
    grade: 11,
    students: 27,
  },
  {
    id: '4',
    name: '11Б',
    grade: 11,
    students: 24,
  },
];

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Математики и информатики',
    teachers: [mockTeachers[0]],
  },
  {
    id: '2',
    name: 'Русского языка и литературы',
    teachers: [mockTeachers[1]],
  },
  {
    id: '3',
    name: 'Физики и астрономии',
    teachers: [mockTeachers[2]],
  },
  {
    id: '4',
    name: 'Истории и обществознания',
    teachers: [mockTeachers[3]],
  },
];

const mockLessons: Lesson[] = [
  // Понедельник
  {
    id: '1',
    subject: 'Математика',
    teacher: 'Иванова А.И.',
    teacherId: '1',
    class: '10А',
    classId: '1',
    classroom: '101',
    startTime: '08:00',
    endTime: '08:45',
    dayOfWeek: 1, // Monday
    weekNumber: 1,
    lessonNumber: 1,
  },
  {
    id: '2',
    subject: 'Русский язык',
    teacher: 'Петрова М.В.',
    teacherId: '2',
    class: '10А',
    classId: '1',
    classroom: '102',
    startTime: '08:45',
    endTime: '09:30',
    dayOfWeek: 1,
    weekNumber: 1,
    lessonNumber: 2,
  },
  {
    id: '3',
    subject: 'Физика',
    teacher: 'Сидоров П.К.',
    teacherId: '3',
    class: '10Б',
    classId: '2',
    classroom: '201',
    startTime: '10:15',
    endTime: '11:00',
    dayOfWeek: 1,
    weekNumber: 1,
    lessonNumber: 3,
  },
  {
    id: '4',
    subject: 'История',
    teacher: 'Козлова Е.А.',
    teacherId: '4',
    class: '11А',
    classId: '3',
    classroom: '103',
    startTime: '08:00',
    endTime: '08:45',
    dayOfWeek: 1,
    weekNumber: 1,
    lessonNumber: 4,
  },
  // Вторник
  {
    id: '5',
    subject: 'Алгебра',
    teacher: 'Иванова А.И.',
    teacherId: '1',
    class: '11А',
    classId: '3',
    classroom: '101',
    startTime: '08:00',
    endTime: '08:45',
    dayOfWeek: 2, // Tuesday
    weekNumber: 1,
    lessonNumber: 1,
  },
  {
    id: '6',
    subject: 'Литература',
    teacher: 'Петрова М.В.',
    teacherId: '2',
    class: '11Б',
    classId: '4',
    classroom: '102',
    startTime: '08:45',
    endTime: '09:30',
    dayOfWeek: 2,
    weekNumber: 1,
    lessonNumber: 2,
  },
  {
    id: '7',
    subject: 'Обществознание',
    teacher: 'Козлова Е.А.',
    teacherId: '4',
    class: '10Б',
    classId: '2',
    classroom: '103',
    startTime: '10:15',
    endTime: '11:00',
    dayOfWeek: 2,
    weekNumber: 1,
    lessonNumber: 3,
  },
  // Среда
  {
    id: '8',
    subject: 'Математика',
    teacher: 'Иванова А.И.',
    teacherId: '1',
    class: '10Б',
    classId: '2',
    classroom: '101',
    startTime: '08:00',
    endTime: '08:45',
    dayOfWeek: 3, // Wednesday
    weekNumber: 1,
    lessonNumber: 1,
  },
  {
    id: '9',
    subject: 'Русский язык',
    teacher: 'Петрова М.В.',
    teacherId: '2',
    class: '11А',
    classId: '3',
    classroom: '102',
    startTime: '08:45',
    endTime: '09:30',
    dayOfWeek: 3,
    weekNumber: 1,
    lessonNumber: 2,
  },
];

interface ScheduleViewProps {
  type: 'teachers' | 'classes';
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ type }) => {
  const { currentView, setDate, setViewType } = useScheduleStore();

  const handleDateChange = (date: Date) => {
    setDate(date);
  };

  const handleViewTypeChange = (viewType: 'day' | 'week') => {
    setViewType(viewType);
  };

  const weekStart = startOfWeek(currentView.date, { weekStartsOn: 1 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {type === 'teachers' ? 'Расписание учителей' : 'Расписание классов'}
          </h1>
          <p className="text-gray-600">
            {type === 'teachers' 
              ? 'Просмотр расписания преподавателей' 
              : 'Просмотр расписания учебных классов'
            }
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <ViewToggle
            viewType={currentView.type}
            onChange={handleViewTypeChange}
          />
        </div>
        
        <DatePicker
          value={currentView.date}
          onChange={handleDateChange}
          viewType={currentView.type}
        />
      </div>

      {/* Schedule Content */}
      {type === 'teachers' ? (
        currentView.type === 'day' ? (
          <TeacherDaySchedule
            teachers={mockTeachers}
            departments={mockDepartments}
            lessons={mockLessons}
            date={currentView.date}
          />
        ) : (
          <TeacherScheduleTable
            teachers={mockTeachers}
            departments={mockDepartments}
            lessons={mockLessons}
            weekStart={weekStart}
          />
        )
      ) : (
        currentView.type === 'day' ? (
          <ClassDaySchedule
            classes={mockClasses}
            lessons={mockLessons}
            date={currentView.date}
          />
        ) : (
          <ClassScheduleTable
            classes={mockClasses}
            lessons={mockLessons}
            weekStart={weekStart}
          />
        )
      )}
    </div>
  );
};
