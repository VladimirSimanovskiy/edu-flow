import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller';
import { authenticateToken, requireRole } from '../middleware/auth';

export const createTeacherRoutes = (teacherController: TeacherController): Router => {
  const router = Router();

  // GET /api/teachers - Get all teachers with filters
  router.get('/', authenticateToken, (req, res) => teacherController.getTeachers(req, res));

  // GET /api/teachers/paginated - Get paginated teachers
  router.get('/paginated', authenticateToken, (req, res) => teacherController.getPaginatedTeachers(req, res));

  // GET /api/teachers/active - Get active teachers
  router.get('/active', authenticateToken, (req, res) => teacherController.getActiveTeachers(req, res));

  // GET /api/teachers/:id - Get teacher by ID
  router.get('/:id', authenticateToken, (req, res) => teacherController.getTeacherById(req, res));

  // POST /api/teachers - Create new teacher (Admin only)
  router.post('/', authenticateToken, requireRole(['ADMIN']), (req, res) => teacherController.createTeacher(req, res));

  // PUT /api/teachers/:id - Update teacher (Admin only)
  router.put('/:id', authenticateToken, requireRole(['ADMIN']), (req, res) => teacherController.updateTeacher(req, res));

  // DELETE /api/teachers/:id - Delete teacher (Admin only)
  router.delete('/:id', authenticateToken, requireRole(['ADMIN']), (req, res) => teacherController.deleteTeacher(req, res));

  // GET /api/teachers/subject/:subjectId - Get teachers by subject
  router.get('/subject/:subjectId', authenticateToken, (req, res) => teacherController.getTeachersBySubject(req, res));

  // POST /api/teachers/:teacherId/subjects - Assign subject to teacher (Admin only)
  router.post('/:teacherId/subjects', authenticateToken, requireRole(['ADMIN']), (req, res) => teacherController.assignSubject(req, res));

  // DELETE /api/teachers/:teacherId/subjects - Remove subject from teacher (Admin only)
  router.delete('/:teacherId/subjects', authenticateToken, requireRole(['ADMIN']), (req, res) => teacherController.removeSubject(req, res));

  return router;
};
