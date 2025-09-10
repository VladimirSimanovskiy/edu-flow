import type { 
  User, 
  Teacher, 
  Class, 
  Subject, 
  Classroom, 
  Lesson,
  LessonSchedule,
  ScheduleVersion
} from '../types/database';
import type { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse,
  RefreshTokenResponse,
  AuthUser,
  CreateLessonRequest, 
  UpdateLessonRequest, 
  LessonFilters,
  ApiError 
} from '../../../shared/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Client: Making request to:', url);
    console.log('API Client: Request options:', options);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>).Authorization = `Bearer ${this.accessToken}`;
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If token expired, try to refresh
    if (response.status === 401 && this.refreshToken && endpoint !== '/auth/refresh') {
      try {
        await this.refreshAccessToken();
        // Retry the original request with new token
        if (this.accessToken) {
          (headers as Record<string, string>).Authorization = `Bearer ${this.accessToken}`;
        }
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (refreshError) {
        // Refresh failed, logout user
        this.logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message || 'An error occurred');
    }

    return response.json();
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data: RefreshTokenResponse = await response.json();
    this.accessToken = data.accessToken;
    localStorage.setItem('access_token', data.accessToken);
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('API Client: Attempting login with:', credentials);
    console.log('API Client: Base URL:', this.baseURL);
    
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    console.log('API Client: Login response:', response);
    
    this.accessToken = response.accessToken;
    this.refreshToken = response.refreshToken;
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<{ user: AuthUser }> {
    return this.request<{ user: AuthUser }>('/auth/me');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Ignore logout errors
    } finally {
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Teachers methods
  async getTeachers(): Promise<Teacher[]> {
    return this.request<Teacher[]>('/schedule/teachers');
  }

  async getTeacherById(id: number): Promise<Teacher> {
    return this.request<Teacher>(`/schedule/teachers/${id}`);
  }

  // Classes methods
  async getClasses(): Promise<Class[]> {
    return this.request<Class[]>('/schedule/classes');
  }

  async getClassById(id: number): Promise<Class> {
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

  async getLessonsForWeek(date: string, filters?: Omit<LessonFilters, 'date'>): Promise<Lesson[]> {
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

  // Lesson schedules methods
  async getLessonSchedules(): Promise<LessonSchedule[]> {
    return this.request<LessonSchedule[]>('/schedule/lesson-schedules');
  }

  // Schedule versions methods
  async getScheduleVersions(): Promise<ScheduleVersion[]> {
    return this.request<ScheduleVersion[]>('/schedule/schedule-versions');
  }

  async getCurrentScheduleVersion(): Promise<ScheduleVersion> {
    return this.request<ScheduleVersion>('/schedule/schedule-versions/current');
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

  async deleteLesson(id: number): Promise<void> {
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
