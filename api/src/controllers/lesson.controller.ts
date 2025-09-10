import { Request, Response } from 'express';
import { LessonService } from '../services/lesson.service';
import type { 
  CreateLessonRequest, 
  UpdateLessonRequest, 
  LessonFilters,
  ApiResponse,
  LessonWithDetails,
  PaginatedResult,
  Lesson,
  LessonBase
} from '@shared/types';

export class LessonController {
  constructor(private lessonService: LessonService) {}

  async getLessons(req: Request, res: Response): Promise<void> {
    try {
      const filters: LessonFilters = req.query;
      const lessons = await this.lessonService.getLessonsWithDetails(filters);
      
      const response: ApiResponse<LessonWithDetails[]> = {
        data: lessons,
        success: true,
        message: 'Lessons retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'LESSONS_FETCH_ERROR'
        }
      });
    }
  }

  async getPaginatedLessons(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const result = await this.lessonService.getPaginatedLessons(filters);
      
      const response: ApiResponse<PaginatedResult<LessonWithDetails>> = {
        data: result,
        success: true,
        message: 'Lessons retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'LESSONS_PAGINATED_FETCH_ERROR'
        }
      });
    }
  }

  async getLessonById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const lesson = await this.lessonService.findById(id);
      
      if (!lesson) {
        res.status(404).json({
          error: {
            message: 'Lesson not found',
            code: 'LESSON_NOT_FOUND'
          }
        });
        return;
      }

      const response: ApiResponse<Lesson> = {
        data: lesson as Lesson,
        success: true,
        message: 'Lesson retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'LESSON_FETCH_ERROR'
        }
      });
    }
  }

  async createLesson(req: Request, res: Response): Promise<void> {
    try {
      const lessonData: CreateLessonRequest = req.body;
      const lesson = await this.lessonService.createLesson(lessonData);
      
      const response: ApiResponse<LessonBase> = {
        data: lesson,
        success: true,
        message: 'Lesson created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({
        error: {
          message: error instanceof Error ? error.message : 'Bad request',
          code: 'LESSON_CREATE_ERROR'
        }
      });
    }
  }

  async updateLesson(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData: UpdateLessonRequest = req.body;
      
      const lesson = await this.lessonService.updateLesson(id, updateData);
      
      const response: ApiResponse<LessonBase> = {
        data: lesson,
        success: true,
        message: 'Lesson updated successfully'
      };

      res.json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        error: {
          message: error instanceof Error ? error.message : 'Bad request',
          code: 'LESSON_UPDATE_ERROR'
        }
      });
    }
  }

  async deleteLesson(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.lessonService.delete(id);
      
      const response: ApiResponse<null> = {
        data: null,
        success: true,
        message: 'Lesson deleted successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'LESSON_DELETE_ERROR'
        }
      });
    }
  }

  async getTeacherSchedule(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = parseInt(req.params.teacherId);
      const date = new Date(req.query.date as string);
      
      if (isNaN(date.getTime())) {
        res.status(400).json({
          error: {
            message: 'Invalid date format',
            code: 'INVALID_DATE'
          }
        });
        return;
      }

      const lessons = await this.lessonService.getTeacherSchedule(teacherId, date);
      
      const response: ApiResponse<LessonWithDetails[]> = {
        data: lessons,
        success: true,
        message: 'Teacher schedule retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'TEACHER_SCHEDULE_FETCH_ERROR'
        }
      });
    }
  }

  async getClassSchedule(req: Request, res: Response): Promise<void> {
    try {
      const classId = parseInt(req.params.classId);
      const date = new Date(req.query.date as string);
      
      if (isNaN(date.getTime())) {
        res.status(400).json({
          error: {
            message: 'Invalid date format',
            code: 'INVALID_DATE'
          }
        });
        return;
      }

      const lessons = await this.lessonService.getClassSchedule(classId, date);
      
      const response: ApiResponse<LessonWithDetails[]> = {
        data: lessons,
        success: true,
        message: 'Class schedule retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'CLASS_SCHEDULE_FETCH_ERROR'
        }
      });
    }
  }
}
