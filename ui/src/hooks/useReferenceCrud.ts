import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { referenceService } from '../services/reference.service';
import type {
  Teacher,
  Classroom,
  Subject,
  ReferenceFilters,
  TeacherFormData,
  ClassroomFormData,
  SubjectFormData,
} from '../types/reference';

/**
 * Универсальный хук для CRUD операций со справочниками
 * Использует React Query для кэширования и синхронизации состояния
 */
export const useReferenceCrud = <T extends Teacher | Classroom | Subject>(
  entityType: 'teachers' | 'classrooms' | 'subjects',
  initialFilters?: ReferenceFilters
) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ReferenceFilters>(initialFilters || {});
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Получение списка сущностей
  const {
    data: listData,
    isLoading: isLoadingList,
    error: listError,
    refetch: refetchList,
  } = useQuery({
    queryKey: [entityType, 'list', filters],
    queryFn: () => {
      switch (entityType) {
        case 'teachers':
          return referenceService.getTeachers(filters);
        case 'classrooms':
          return referenceService.getClassrooms(filters);
        case 'subjects':
          return referenceService.getSubjects(filters);
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  // Получение одной сущности
  const {
    data: itemData,
    isLoading: isLoadingItem,
    error: itemError,
  } = useQuery({
    queryKey: [entityType, 'item', selectedId],
    queryFn: () => {
      if (!selectedId) return null;
      switch (entityType) {
        case 'teachers':
          return referenceService.getTeacher(selectedId);
        case 'classrooms':
          return referenceService.getClassroom(selectedId);
        case 'subjects':
          return referenceService.getSubject(selectedId);
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
    },
    enabled: !!selectedId,
  });

  // Создание сущности
  const createMutation = useMutation({
    mutationFn: (data: TeacherFormData | ClassroomFormData | SubjectFormData) => {
      switch (entityType) {
        case 'teachers':
          return referenceService.createTeacher(data as TeacherFormData);
        case 'classrooms':
          return referenceService.createClassroom(data as ClassroomFormData);
        case 'subjects':
          return referenceService.createSubject(data as SubjectFormData);
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityType, 'list'] });
    },
  });

  // Обновление сущности
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TeacherFormData | ClassroomFormData | SubjectFormData> }) => {
      switch (entityType) {
        case 'teachers':
          return referenceService.updateTeacher(id, data as Partial<TeacherFormData>);
        case 'classrooms':
          return referenceService.updateClassroom(id, data as Partial<ClassroomFormData>);
        case 'subjects':
          return referenceService.updateSubject(id, data as Partial<SubjectFormData>);
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityType, 'list'] });
      queryClient.invalidateQueries({ queryKey: [entityType, 'item'] });
    },
  });

  // Удаление сущности
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      switch (entityType) {
        case 'teachers':
          return referenceService.deleteTeacher(id);
        case 'classrooms':
          return referenceService.deleteClassroom(id);
        case 'subjects':
          return referenceService.deleteSubject(id);
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityType, 'list'] });
      if (selectedId) {
        setSelectedId(null);
      }
    },
  });

  // Методы для управления фильтрами
  const updateFilters = (newFilters: Partial<ReferenceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(initialFilters || {});
  };

  // Методы для управления выбранной сущностью
  const selectItem = (id: number) => {
    setSelectedId(id);
  };

  const clearSelection = () => {
    setSelectedId(null);
  };

  return {
    // Данные
    listData,
    itemData,
    selectedId,
    filters,

    // Состояние загрузки
    isLoadingList,
    isLoadingItem,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Ошибки
    listError,
    itemError,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,

    // Методы
    refetchList,
    updateFilters,
    resetFilters,
    selectItem,
    clearSelection,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,

    // Состояние мутаций
    isCreateSuccess: createMutation.isSuccess,
    isUpdateSuccess: updateMutation.isSuccess,
    isDeleteSuccess: deleteMutation.isSuccess,
  };
};
