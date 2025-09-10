import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller';

export const createTeacherRoutes = (teacherController: TeacherController): Router => {
  const router = Router();

  // GET /api/teachers - Get all teachers with filters
  router.get('/', (req, res) => teacherController.getTeachers(req, res));

  // GET /api/teachers/paginated - Get paginated teachers
  router.get('/paginated', (req, res) => teacherController.getPaginatedTeachers(req, res));

  // GET /api/teachers/active - Get active teachers
  router.get('/active', (req, res) => teacherController.getActiveTeachers(req, res));

  // GET /api/teachers/:id - Get teacher by ID
  router.get('/:id', (req, res) => teacherController.getTeacherById(req, res));

  // POST /api/teachers - Create new teacher
  router.post('/', (req, res) => teacherController.createTeacher(req, res));

  // PUT /api/teachers/:id - Update teacher
  router.put('/:id', (req, res) => teacherController.updateTeacher(req, res));

  // DELETE /api/teachers/:id - Delete teacher
  router.delete('/:id', (req, res) => teacherController.deleteTeacher(req, res));

  // GET /api/teachers/subject/:subjectId - Get teachers by subject
  router.get('/subject/:subjectId', (req, res) => teacherController.getTeachersBySubject(req, res));

  // POST /api/teachers/:teacherId/subjects - Assign subject to teacher
  router.post('/:teacherId/subjects', (req, res) => teacherController.assignSubject(req, res));

  // DELETE /api/teachers/:teacherId/subjects - Remove subject from teacher
  router.delete('/:teacherId/subjects', (req, res) => teacherController.removeSubject(req, res));

  return router;
};
