import { Router } from 'express';
import { createError } from '../middleware/errorHandler';
import { Lesson, Teacher, Class } from '../types/schedule';

const router = Router();

// Mock data
const teachers: Teacher[] = [
  {
    id: '1',
    name: 'Иванова Анна Ивановна',
    email: 'ivanova@school.com',
    subjects: ['Математика', 'Алгебра'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Петрова Мария Владимировна',
    email: 'petrova@school.com',
    subjects: ['Русский язык', 'Литература'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Сидоров Петр Константинович',
    email: 'sidorov@school.com',
    subjects: ['Физика', 'Химия'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const classes: Class[] = [
  {
    id: '1',
    name: '10А',
    grade: 10,
    students: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: '10Б',
    grade: 10,
    students: 23,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: '11А',
    grade: 11,
    students: 27,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const lessons: Lesson[] = [
  {
    id: '1',
    subject: 'Математика',
    teacher: 'Иванова А.И.',
    classroom: '101',
    startTime: '08:00',
    endTime: '08:45',
    dayOfWeek: 1, // Monday
    weekNumber: 1,
    teacherId: '1',
    classId: '1',
  },
  {
    id: '2',
    subject: 'Русский язык',
    teacher: 'Петрова М.В.',
    classroom: '102',
    startTime: '08:45',
    endTime: '09:30',
    dayOfWeek: 1,
    weekNumber: 1,
    teacherId: '2',
    classId: '1',
  },
  {
    id: '3',
    subject: 'Физика',
    teacher: 'Сидоров П.К.',
    classroom: '201',
    startTime: '10:15',
    endTime: '11:00',
    dayOfWeek: 1,
    weekNumber: 1,
    teacherId: '3',
    classId: '1',
  },
];

// Get all teachers
router.get('/teachers', (req, res, next) => {
  try {
    res.json(teachers);
  } catch (error) {
    next(error);
  }
});

// Get all classes
router.get('/classes', (req, res, next) => {
  try {
    res.json(classes);
  } catch (error) {
    next(error);
  }
});

// Get lessons by date range
router.get('/lessons', (req, res, next) => {
  try {
    const { startDate, endDate, teacherId, classId } = req.query;

    let filteredLessons = lessons;

    if (teacherId) {
      filteredLessons = filteredLessons.filter(lesson => lesson.teacherId === teacherId);
    }

    if (classId) {
      filteredLessons = filteredLessons.filter(lesson => lesson.classId === classId);
    }

    res.json(filteredLessons);
  } catch (error) {
    next(error);
  }
});

// Get lessons for a specific day
router.get('/lessons/day/:date', (req, res, next) => {
  try {
    const { date } = req.params;
    const { teacherId, classId } = req.query;

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    let filteredLessons = lessons.filter(lesson => lesson.dayOfWeek === dayOfWeek);

    if (teacherId) {
      filteredLessons = filteredLessons.filter(lesson => lesson.teacherId === teacherId);
    }

    if (classId) {
      filteredLessons = filteredLessons.filter(lesson => lesson.classId === classId);
    }

    res.json(filteredLessons);
  } catch (error) {
    next(error);
  }
});

// Get lessons for a specific week
router.get('/lessons/week/:date', (req, res, next) => {
  try {
    const { date } = req.params;
    const { teacherId, classId } = req.query;

    const targetDate = new Date(date);
    const weekNumber = Math.ceil(targetDate.getDate() / 7);

    let filteredLessons = lessons.filter(lesson => lesson.weekNumber === weekNumber);

    if (teacherId) {
      filteredLessons = filteredLessons.filter(lesson => lesson.teacherId === teacherId);
    }

    if (classId) {
      filteredLessons = filteredLessons.filter(lesson => lesson.classId === classId);
    }

    res.json(filteredLessons);
  } catch (error) {
    next(error);
  }
});

// Create a new lesson
router.post('/lessons', (req, res, next) => {
  try {
    const lessonData = req.body;
    
    const newLesson: Lesson = {
      id: (lessons.length + 1).toString(),
      ...lessonData,
    };

    lessons.push(newLesson);
    res.status(201).json(newLesson);
  } catch (error) {
    next(error);
  }
});

// Update a lesson
router.put('/lessons/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const lessonData = req.body;

    const lessonIndex = lessons.findIndex(lesson => lesson.id === id);
    if (lessonIndex === -1) {
      return next(createError('Lesson not found', 404));
    }

    lessons[lessonIndex] = { ...lessons[lessonIndex], ...lessonData };
    res.json(lessons[lessonIndex]);
  } catch (error) {
    next(error);
  }
});

// Delete a lesson
router.delete('/lessons/:id', (req, res, next) => {
  try {
    const { id } = req.params;

    const lessonIndex = lessons.findIndex(lesson => lesson.id === id);
    if (lessonIndex === -1) {
      return next(createError('Lesson not found', 404));
    }

    lessons.splice(lessonIndex, 1);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as scheduleRoutes };
