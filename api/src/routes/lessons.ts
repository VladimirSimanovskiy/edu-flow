import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';

export const createLessonRoutes = (lessonController: LessonController): Router => {
  const router = Router();

  // GET /api/lessons - Get all lessons with filters
  router.get('/', (req, res) => lessonController.getLessons(req, res));

  // GET /api/lessons/paginated - Get paginated lessons
  router.get('/paginated', (req, res) => lessonController.getPaginatedLessons(req, res));

  // GET /api/lessons/:id - Get lesson by ID
  router.get('/:id', (req, res) => lessonController.getLessonById(req, res));

  // POST /api/lessons - Create new lesson
  router.post('/', (req, res) => lessonController.createLesson(req, res));

  // PUT /api/lessons/:id - Update lesson
  router.put('/:id', (req, res) => lessonController.updateLesson(req, res));

  // DELETE /api/lessons/:id - Delete lesson
  router.delete('/:id', (req, res) => lessonController.deleteLesson(req, res));

  // GET /api/lessons/teacher/:teacherId/schedule - Get teacher schedule for date
  router.get('/teacher/:teacherId/schedule', (req, res) => lessonController.getTeacherSchedule(req, res));

  // GET /api/lessons/class/:classId/schedule - Get class schedule for date
  router.get('/class/:classId/schedule', (req, res) => lessonController.getClassSchedule(req, res));

  return router;
};
