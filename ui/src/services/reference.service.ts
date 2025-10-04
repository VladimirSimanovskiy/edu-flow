import { apiClient } from './apiClient';
import type {
  Teacher,
  Classroom,
  Subject,
  ReferenceFilters,
  ReferencePaginatedResponse,
  ReferenceResponse,
  TeacherFormData,
  ClassroomFormData,
  SubjectFormData,
} from '../types/reference';

/**
 * Сервис для работы со справочниками
 * Универсальный API клиент для CRUD операций
 */
export class ReferenceService {
  private baseUrl = '/api/references';

  // Учителя
  async getTeachers(filters?: ReferenceFilters): Promise<ReferencePaginatedResponse<Teacher>> {
    const response = await apiClient.get(`${this.baseUrl}/teachers`, { params: filters });
    return response.data;
  }

  async getTeacher(id: number): Promise<ReferenceResponse<Teacher>> {
    const response = await apiClient.get(`${this.baseUrl}/teachers/${id}`);
    return response.data;
  }

  async createTeacher(data: TeacherFormData): Promise<ReferenceResponse<Teacher>> {
    const response = await apiClient.post(`${this.baseUrl}/teachers`, data);
    return response.data;
  }

  async updateTeacher(id: number, data: Partial<TeacherFormData>): Promise<ReferenceResponse<Teacher>> {
    const response = await apiClient.put(`${this.baseUrl}/teachers/${id}`, data);
    return response.data;
  }

  async deleteTeacher(id: number): Promise<ReferenceResponse<null>> {
    const response = await apiClient.delete(`${this.baseUrl}/teachers/${id}`);
    return response.data;
  }

  // Кабинеты
  async getClassrooms(filters?: ReferenceFilters): Promise<ReferencePaginatedResponse<Classroom>> {
    const response = await apiClient.get(`${this.baseUrl}/classrooms`, { params: filters });
    return response.data;
  }

  async getClassroom(id: number): Promise<ReferenceResponse<Classroom>> {
    const response = await apiClient.get(`${this.baseUrl}/classrooms/${id}`);
    return response.data;
  }

  async createClassroom(data: ClassroomFormData): Promise<ReferenceResponse<Classroom>> {
    const response = await apiClient.post(`${this.baseUrl}/classrooms`, data);
    return response.data;
  }

  async updateClassroom(id: number, data: Partial<ClassroomFormData>): Promise<ReferenceResponse<Classroom>> {
    const response = await apiClient.put(`${this.baseUrl}/classrooms/${id}`, data);
    return response.data;
  }

  async deleteClassroom(id: number): Promise<ReferenceResponse<null>> {
    const response = await apiClient.delete(`${this.baseUrl}/classrooms/${id}`);
    return response.data;
  }

  // Предметы
  async getSubjects(filters?: ReferenceFilters): Promise<ReferencePaginatedResponse<Subject>> {
    const response = await apiClient.get(`${this.baseUrl}/subjects`, { params: filters });
    return response.data;
  }

  async getSubject(id: number): Promise<ReferenceResponse<Subject>> {
    const response = await apiClient.get(`${this.baseUrl}/subjects/${id}`);
    return response.data;
  }

  async createSubject(data: SubjectFormData): Promise<ReferenceResponse<Subject>> {
    const response = await apiClient.post(`${this.baseUrl}/subjects`, data);
    return response.data;
  }

  async updateSubject(id: number, data: Partial<SubjectFormData>): Promise<ReferenceResponse<Subject>> {
    const response = await apiClient.put(`${this.baseUrl}/subjects/${id}`, data);
    return response.data;
  }

  async deleteSubject(id: number): Promise<ReferenceResponse<null>> {
    const response = await apiClient.delete(`${this.baseUrl}/subjects/${id}`);
    return response.data;
  }
}

export const referenceService = new ReferenceService();
