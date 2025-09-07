import type { 
  User, 
  Teacher, 
  Class, 
  Subject, 
  Classroom, 
  Lesson 
} from '../types/database';
import type { 
  LoginRequest, 
  RegisterRequest, 
  CreateLessonRequest, 
  UpdateLessonRequest, 
  LessonFilters,
  ApiResponse,
  ApiError 
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message || 'An error occurred');
    }

    return response.json();
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Teachers methods
  async getTeachers(): Promise<Teacher[]> {
    return this.request<Teacher[]>('/schedule/teachers');
  }

  async getTeacherById(id: string): Promise<Teacher> {
    return this.request<Teacher>(`/schedule/teachers/${id}`);
  }

  // Classes methods
  async getClasses(): Promise<Class[]> {
    return this.request<Class[]>('/schedule/classes');
  }

  async getClassById(id: string): Promise<Class> {
    return this.request<Class>(`/schedule/classes/${id}`);
  }

  // Subjects methods
  async getSubjects(): Promise<Subject[]> {
    return this.request<Subject[]>('/schedule/subjects');
  }

  // Classrooms methods
  async getClassrooms(): Promise<Classroom[]> {
    return this.request<Classroom[]>('/schedule/classrooms');
  }

  // Lessons methods
  async getLessons(filters?: LessonFilters): Promise<Lesson[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/schedule/lessons?${queryString}` : '/schedule/lessons';
    
    return this.request<Lesson[]>(endpoint);
  }

  async getLessonsForDay(date: string, filters?: Omit<LessonFilters, 'dayOfWeek'>): Promise<Lesson[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/schedule/lessons/day/${date}?${queryString}` : `/schedule/lessons/day/${date}`;
    
    return this.request<Lesson[]>(endpoint);
  }

  async getLessonsForWeek(date: string, filters?: Omit<LessonFilters, 'weekNumber'>): Promise<Lesson[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/schedule/lessons/week/${date}?${queryString}` : `/schedule/lessons/week/${date}`;
    
    return this.request<Lesson[]>(endpoint);
  }

  async createLesson(lessonData: CreateLessonRequest): Promise<Lesson> {
    return this.request<Lesson>('/schedule/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  }

  async updateLesson(lessonData: UpdateLessonRequest): Promise<Lesson> {
    const { id, ...data } = lessonData;
    return this.request<Lesson>(`/schedule/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLesson(id: string): Promise<void> {
    return this.request<void>(`/schedule/lessons/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
