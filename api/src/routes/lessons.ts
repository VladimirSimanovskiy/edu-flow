import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

export const createLessonRoutes = (lessonController: LessonController): Router => {
  const router = Router();

  // GET /api/lessons - Get all lessons with filters
  router.get('/', authenticateToken, (req, res) => lessonController.getLessons(req, res));

  // GET /api/lessons/paginated - Get paginated lessons
  router.get('/paginated', authenticateToken, (req, res) => lessonController.getPaginatedLessons(req, res));

  // GET /api/lessons/:id - Get lesson by ID
  router.get('/:id', authenticateToken, (req, res) => lessonController.getLessonById(req, res));

  // POST /api/lessons - Create new lesson (Admin only)
  router.post('/', authenticateToken, requireRole(['ADMIN']), (req, res) => lessonController.createLesson(req, res));

  // PUT /api/lessons/:id - Update lesson (Admin only)
  router.put('/:id', authenticateToken, requireRole(['ADMIN']), (req, res) => lessonController.updateLesson(req, res));

  // DELETE /api/lessons/:id - Delete lesson (Admin only)
  router.delete('/:id', authenticateToken, requireRole(['ADMIN']), (req, res) => lessonController.deleteLesson(req, res));

  // GET /api/lessons/teacher/:teacherId/schedule - Get teacher schedule for date
  router.get('/teacher/:teacherId/schedule', authenticateToken, (req, res) => lessonController.getTeacherSchedule(req, res));

  // GET /api/lessons/class/:classId/schedule - Get class schedule for date
  router.get('/class/:classId/schedule', authenticateToken, (req, res) => lessonController.getClassSchedule(req, res));

  return router;
};
