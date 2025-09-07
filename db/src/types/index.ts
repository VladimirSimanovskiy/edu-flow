// Re-export all types from generated Prisma client
export * from '../../generated/prisma';

// Additional custom types
export interface ScheduleView {
  type: 'day' | 'week';
  date: Date;
}

export interface ScheduleFilters {
  teacherId?: string;
  classId?: string;
  subjectId?: string;
  dayOfWeek?: number;
  weekNumber?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
