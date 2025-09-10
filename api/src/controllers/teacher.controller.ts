import { Request, Response } from 'express';
import { TeacherService } from '../services/teacher.service';
import type { 
  CreateTeacherRequest, 
  UpdateTeacherRequest, 
  TeacherFilters,
  ApiResponse,
  TeacherWithDetails,
  PaginatedResult 
} from '@shared/types';

export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  async getTeachers(req: Request, res: Response): Promise<void> {
    try {
      const filters: TeacherFilters = req.query;
      const teachers = await this.teacherService.getTeachersWithDetails(filters);
      
      const response: ApiResponse<TeacherWithDetails[]> = {
        data: teachers,
        success: true,
        message: 'Teachers retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'TEACHERS_FETCH_ERROR'
        }
      });
    }
  }

  async getPaginatedTeachers(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const result = await this.teacherService.getPaginatedTeachers(filters);
      
      const response: ApiResponse<PaginatedResult<TeacherWithDetails>> = {
        data: result,
        success: true,
        message: 'Teachers retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'TEACHERS_PAGINATED_FETCH_ERROR'
        }
      });
    }
  }

  async getTeacherById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const teacher = await this.teacherService.findById(id);
      
      if (!teacher) {
        res.status(404).json({
          error: {
            message: 'Teacher not found',
            code: 'TEACHER_NOT_FOUND'
          }
        });
        return;
      }

      const response: ApiResponse<any> = {
        data: teacher,
        success: true,
        message: 'Teacher retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'TEACHER_FETCH_ERROR'
        }
      });
    }
  }

  async createTeacher(req: Request, res: Response): Promise<void> {
    try {
      const teacherData: CreateTeacherRequest = req.body;
      const teacher = await this.teacherService.createTeacher(teacherData);
      
      const response: ApiResponse<any> = {
        data: teacher,
        success: true,
        message: 'Teacher created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({
        error: {
          message: error instanceof Error ? error.message : 'Bad request',
          code: 'TEACHER_CREATE_ERROR'
        }
      });
    }
  }

  async updateTeacher(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData: UpdateTeacherRequest = req.body;
      
      const teacher = await this.teacherService.updateTeacher(id, updateData);
      
      const response: ApiResponse<any> = {
        data: teacher,
        success: true,
        message: 'Teacher updated successfully'
      };

      res.json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        error: {
          message: error instanceof Error ? error.message : 'Bad request',
          code: 'TEACHER_UPDATE_ERROR'
        }
      });
    }
  }

  async deleteTeacher(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.teacherService.delete(id);
      
      const response: ApiResponse<null> = {
        data: null,
        success: true,
        message: 'Teacher deleted successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'TEACHER_DELETE_ERROR'
        }
      });
    }
  }

  async getTeachersBySubject(req: Request, res: Response): Promise<void> {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const teachers = await this.teacherService.getTeachersBySubject(subjectId);
      
      const response: ApiResponse<TeacherWithDetails[]> = {
        data: teachers,
        success: true,
        message: 'Teachers by subject retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'TEACHERS_BY_SUBJECT_FETCH_ERROR'
        }
      });
    }
  }

  async getActiveTeachers(req: Request, res: Response): Promise<void> {
    try {
      const teachers = await this.teacherService.getActiveTeachers();
      
      const response: ApiResponse<TeacherWithDetails[]> = {
        data: teachers,
        success: true,
        message: 'Active teachers retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          code: 'ACTIVE_TEACHERS_FETCH_ERROR'
        }
      });
    }
  }

  async assignSubject(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = parseInt(req.params.teacherId);
      const { subjectId } = req.body;
      
      await this.teacherService.assignSubjectToTeacher(teacherId, subjectId);
      
      const response: ApiResponse<null> = {
        data: null,
        success: true,
        message: 'Subject assigned to teacher successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(400).json({
        error: {
          message: error instanceof Error ? error.message : 'Bad request',
          code: 'SUBJECT_ASSIGN_ERROR'
        }
      });
    }
  }

  async removeSubject(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = parseInt(req.params.teacherId);
      const { subjectId } = req.body;
      
      await this.teacherService.removeSubjectFromTeacher(teacherId, subjectId);
      
      const response: ApiResponse<null> = {
        data: null,
        success: true,
        message: 'Subject removed from teacher successfully'
      };

      res.json(response);
    } catch (error) {
      res.status(400).json({
        error: {
          message: error instanceof Error ? error.message : 'Bad request',
          code: 'SUBJECT_REMOVE_ERROR'
        }
      });
    }
  }
}
