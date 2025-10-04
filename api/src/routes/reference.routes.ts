import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { CrudFactory, REFERENCE_CONFIGS } from '../factories/crud.factory';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { softValidateQuery } from '../middleware/soft-validation.middleware';
import {
  teacherCreateSchema,
  teacherUpdateSchema,
  classroomCreateSchema,
  classroomUpdateSchema,
  subjectCreateSchema,
  subjectUpdateSchema,
  referenceFiltersSchema,
  idParamSchema,
} from '../schemas/reference.schemas';

/**
 * Роуты для справочников
 * Использует универсальный CRUD механизм
 */
export const createReferenceRoutes = (prisma: PrismaClient) => {
  const router = Router();
  const crudFactory = new CrudFactory(prisma);

  // Создаем контроллеры для каждого справочника
  const teacherController = crudFactory.createController(REFERENCE_CONFIGS.teacher);
  const classroomController = crudFactory.createController(REFERENCE_CONFIGS.classroom);
  const subjectController = crudFactory.createController(REFERENCE_CONFIGS.subject);

  // Роуты для учителей
  router.get('/teachers', softValidateQuery(referenceFiltersSchema), teacherController.getAll.bind(teacherController));
  router.get('/teachers/:id', validateParams(idParamSchema), teacherController.getById.bind(teacherController));
  router.post('/teachers', validateBody(teacherCreateSchema), teacherController.create.bind(teacherController));
  router.put('/teachers/:id', 
    validateParams(idParamSchema), 
    validateBody(teacherUpdateSchema), 
    teacherController.update.bind(teacherController)
  );
  router.delete('/teachers/:id', validateParams(idParamSchema), teacherController.delete.bind(teacherController));

  // Роуты для кабинетов
  router.get('/classrooms', softValidateQuery(referenceFiltersSchema), classroomController.getAll.bind(classroomController));
  router.get('/classrooms/:id', validateParams(idParamSchema), classroomController.getById.bind(classroomController));
  router.post('/classrooms', validateBody(classroomCreateSchema), classroomController.create.bind(classroomController));
  router.put('/classrooms/:id', 
    validateParams(idParamSchema), 
    validateBody(classroomUpdateSchema), 
    classroomController.update.bind(classroomController)
  );
  router.delete('/classrooms/:id', validateParams(idParamSchema), classroomController.delete.bind(classroomController));

  // Роуты для предметов
  router.get('/subjects', softValidateQuery(referenceFiltersSchema), subjectController.getAll.bind(subjectController));
  router.get('/subjects/:id', validateParams(idParamSchema), subjectController.getById.bind(subjectController));
  router.post('/subjects', validateBody(subjectCreateSchema), subjectController.create.bind(subjectController));
  router.put('/subjects/:id', 
    validateParams(idParamSchema), 
    validateBody(subjectUpdateSchema), 
    subjectController.update.bind(subjectController)
  );
  router.delete('/subjects/:id', validateParams(idParamSchema), subjectController.delete.bind(subjectController));

  return router;
};
