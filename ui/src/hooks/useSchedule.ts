import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import type {
  CreateLessonRequest,
  UpdateLessonRequest,
  LessonFilters,
} from "../types/api";

// Teachers hooks
export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: () => apiClient.getTeachers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => apiClient.getTeacherById(id),
    enabled: !!id,
  });
};

// Classes hooks
export const useClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: () => apiClient.getClasses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useClass = (id: string) => {
  return useQuery({
    queryKey: ["classes", id],
    queryFn: () => apiClient.getClassById(id),
    enabled: !!id,
  });
};

// Subjects hooks
export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => apiClient.getSubjects(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Classrooms hooks
export const useClassrooms = () => {
  return useQuery({
    queryKey: ["classrooms"],
    queryFn: () => apiClient.getClassrooms(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Lessons hooks
export const useLessons = (filters?: LessonFilters) => {
  return useQuery({
    queryKey: ["lessons", filters],
    queryFn: () => apiClient.getLessons(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useLessonsForDay = (
  date: string,
  filters?: Omit<LessonFilters, "dayOfWeek">
) => {
  return useQuery({
    queryKey: ["lessons", "day", date, filters],
    queryFn: () => apiClient.getLessonsForDay(date, filters),
    enabled: !!date,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useLessonsForWeek = (
  date: string,
  filters?: Omit<LessonFilters, "weekNumber">
) => {
  return useQuery({
    queryKey: ["lessons", "week", date, filters],
    queryFn: () => apiClient.getLessonsForWeek(date, filters),
    enabled: !!date,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Lesson mutations
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonData: CreateLessonRequest) =>
      apiClient.createLesson(lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonData: UpdateLessonRequest) =>
      apiClient.updateLesson(lessonData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
};
