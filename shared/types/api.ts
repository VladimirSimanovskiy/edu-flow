import type {
	Lesson,
	Teacher,
	Class,
	Subject,
	Classroom,
	ScheduleVersion,
	User,
	Student,
} from "./database";

// API Response types
export interface ApiResponse<T> {
	data: T;
	message?: string;
	success: boolean;
}

export interface ApiError {
	error: {
		message: string;
		code: string;
		details?: Record<string, unknown>;
	};
}

// Request types using proper composition
export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	role: UserRole;
}

export interface RefreshTokenRequest {
	refreshToken: string;
}

// Response types for authentication
export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}

export interface RefreshTokenResponse {
	accessToken: string;
	user: User;
}

export interface AuthUser {
	id: number;
	email: string;
	role: UserRole;
	teacher?: Teacher;
	student?: Student;
}

// Create request types - only the fields needed for creation
export type CreateLessonRequest = Pick<
	Lesson,
	| "dayOfWeek"
	| "idTeacher"
	| "idClass"
	| "idSubject"
	| "idClassroom"
	| "idLessonSchedule"
	| "idScheduleVersion"
>;

// Update request types - make all fields optional except id
export type UpdateLessonRequest = WithId<Partial<CreateLessonRequest>>;

// Schedule version request types
export type CreateScheduleVersionRequest = Pick<ScheduleVersion, "dateBegin"> &
	Partial<Pick<ScheduleVersion, "dateEnd" | "description">>;

export type UpdateScheduleVersionRequest = WithId<
	Partial<CreateScheduleVersionRequest>
>;

// Teacher request types
export type CreateTeacherRequest = Pick<Teacher, "firstName" | "lastName"> &
	Optional<
		Teacher,
		"middleName" | "email" | "phone" | "idUser" | "idAssignedClassroom"
	>;

export type UpdateTeacherRequest = WithId<Partial<CreateTeacherRequest>>;

// Class request types
export type CreateClassRequest = Pick<Class, "grade" | "letter"> &
	Optional<Class, "idClassLeaderTeacher">;

export type UpdateClassRequest = WithId<Partial<CreateClassRequest>>;

// Subject request types
export type CreateSubjectRequest = Pick<Subject, "name" | "code"> &
	Optional<Subject, "description">;

export type UpdateSubjectRequest = WithId<Partial<CreateSubjectRequest>>;

// Classroom request types
export type CreateClassroomRequest = Pick<Classroom, "number" | "floor">;

export type UpdateClassroomRequest = WithId<Partial<CreateClassroomRequest>>;

// Filter types using proper composition
export type LessonFilters = Partial<
	Pick<
		Lesson,
		| "idTeacher"
		| "idClass"
		| "idSubject"
		| "dayOfWeek"
		| "idScheduleVersion"
	>
> & {
	startDate?: string;
	endDate?: string;
	date?: string;
};

// Extended filters for values filter integration
export interface LessonValuesFilters {
	// Single value filters (existing)
	idTeacher?: number;
	idClass?: number;
	idSubject?: number;
	dayOfWeek?: number;
	idScheduleVersion?: number;
	date?: string;
	startDate?: string;
	endDate?: string;

	// Multiple values filters (new)
	teachers?: {
		inList: boolean; // true = include only these teachers, false = exclude these teachers
		items: number[]; // array of teacher IDs
	};
	classes?: {
		inList: boolean; // true = include only these classes, false = exclude these classes
		items: number[]; // array of class IDs
	};
	subjects?: {
		inList: boolean; // true = include only these subjects, false = exclude these subjects
		items: number[]; // array of subject IDs
	};
}

export type TeacherFilters = Partial<
	Pick<Teacher, "isActive" | "idAssignedClassroom">
> & {
	search?: string; // Search by name or email
};

export type ClassFilters = Partial<
	Pick<Class, "grade" | "idClassLeaderTeacher">
> & {
	search?: string; // Search by grade or letter
};

export type SubjectFilters = {
	search?: string; // Search by name or code
};

export type ClassroomFilters = Partial<Pick<Classroom, "floor" | "number">>;

export type ScheduleVersionFilters = Partial<
	Pick<ScheduleVersion, "dateBegin" | "dateEnd" | "description">
>;

// Pagination types
export interface PaginationOptions {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
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

// Extended types with computed fields for API responses
// Using proper type composition instead of duplication
export type LessonWithDetails = LessonWithComputedFields;
export type TeacherWithDetails = TeacherWithComputedFields;
export type ClassWithDetails = ClassWithComputedFields;

// Utility type to replace lessons field with enhanced type
export type ScheduleVersionWithLessons = Omit<ScheduleVersion, "lessons"> & {
	lessons: LessonWithDetails[];
};

// Base lesson type without relations (for create/update operations)
export interface LessonBase {
	id: number;
	dayOfWeek: number;
	createdAt: Date;
	updatedAt: Date;
	idTeacher: number;
	idClass: number;
	idSubject: number;
	idClassroom: number;
	idLessonSchedule: number;
	idScheduleVersion: number;
}

// Type aliases for consistency
export type LessonWithUI = LessonWithDetails;
export type TeacherWithUI = TeacherWithDetails;
export type ClassWithUI = ClassWithDetails;

// Constants and enums
export const DAYS_OF_WEEK = [
	"Воскресенье",
	"Понедельник",
	"Вторник",
	"Среда",
	"Четверг",
	"Пятница",
	"Суббота",
] as const;

export const LESSON_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type LessonNumber = (typeof LESSON_NUMBERS)[number];
export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

// ============================================================================
// UTILITY TYPES FOR PROPER TYPE COMPOSITION
// ============================================================================

// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type ReplaceField<T, K extends keyof T, V> = Omit<T, K> & Record<K, V>;
export type WithComputedFields<T, C> = T & C;

// Specific utility types for our domain
export type WithTimestamps<T> = T & {
	createdAt: Date;
	updatedAt: Date;
};

export type WithId<T> = T & {
	id: number;
};

// Enhanced entity types using proper composition
// For API responses - only base fields + computed fields (no relations)
export type LessonWithComputedFields = Pick<
	Lesson,
	| "id"
	| "dayOfWeek"
	| "createdAt"
	| "updatedAt"
	| "idTeacher"
	| "idClass"
	| "idSubject"
	| "idClassroom"
	| "idLessonSchedule"
	| "idScheduleVersion"
> & {
	subjectName: string;
	teacherName: string;
	className: string;
	classroomNumber: number;
	startTime: string;
	endTime: string;
	lessonNumber: number;
	groupNumber?: number | null;
	// Если присутствует замещение для даты, возвращаем его краткие данные
	substitution?: {
		id: number;
		date: Date;
		idTeacher: number;
		teacherName: string;
		idClassroom: number;
		classroomNumber: number;
	};
	// Для недельного вида: массив замещений на разные даты
	substitutions?: Array<{
		id: number;
		date: Date;
		idTeacher: number;
		teacherName: string;
		idClassroom: number;
		classroomNumber: number;
	}>;
};

export type TeacherWithComputedFields = Pick<
	Teacher,
	"id" | "firstName" | "lastName" | "isActive" | "createdAt" | "updatedAt"
> & {
	middleName: string | null;
	email: string | null;
	phone: string | null;
	idAssignedClassroom: number | null;
	idUser: number | null;
	fullName: string;
	subjectNames: string[];
	assignedClassroomNumber?: number;
};

export type ClassWithComputedFields = Pick<
	Class,
	"id" | "grade" | "letter" | "createdAt" | "updatedAt"
> & {
	idClassLeaderTeacher: number | null;
	name: string;
	classLeaderName?: string;
	studentCount: number;
};
