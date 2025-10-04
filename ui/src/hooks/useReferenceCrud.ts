import { useState, useCallback, useEffect } from 'react';
import type { ReferenceEntity, ReferenceFilters, ReferenceApiService } from '@/types/reference-system';

interface UseReferenceCrudOptions<T extends ReferenceEntity> {
  apiService: ReferenceApiService<T>;
  initialFilters?: ReferenceFilters;
}

interface UseReferenceCrudReturn<T extends ReferenceEntity> {
  // Данные
  data: T[];
  pagination?: any;
  isLoading: boolean;
  error: Error | null;
  
  // Фильтры и поиск
  filters: ReferenceFilters;
  updateFilters: (newFilters: Partial<ReferenceFilters>) => void;
  resetFilters: () => void;
  
  // CRUD операции
  create: (data: Omit<T, 'id'>, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => Promise<void>;
  update: (id: number, data: Partial<T>, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => Promise<void>;
  delete: (id: number, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => Promise<void>;
  
  // Состояние операций
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Ошибки операций
  createError: Error | null;
  updateError: Error | null;
  deleteError: Error | null;
  
  // Обновление данных
  refresh: () => Promise<void>;
}

/**
 * Универсальный хук для работы с справочными данными
 * Следует принципу Single Responsibility - отвечает только за CRUD операции
 */
export const useReferenceCrud = <T extends ReferenceEntity>({
  apiService,
  initialFilters = {},
}: UseReferenceCrudOptions<T>): UseReferenceCrudReturn<T> => {
  // Состояние данных
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Состояние фильтров
  const [filters, setFilters] = useState<ReferenceFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });
  
  // Состояние операций
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Ошибки операций
  const [createError, setCreateError] = useState<Error | null>(null);
  const [updateError, setUpdateError] = useState<Error | null>(null);
  const [deleteError, setDeleteError] = useState<Error | null>(null);

  // Загрузка данных
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiService.getAll(filters);
      setData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Ошибка загрузки данных'));
    } finally {
      setIsLoading(false);
    }
  }, [apiService, filters]);

  // Обновление фильтров
  const updateFilters = useCallback((newFilters: Partial<ReferenceFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Сбрасываем страницу при изменении фильтров
    }));
  }, []);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      ...initialFilters,
    });
  }, [initialFilters]);

  // Создание записи
  const create = useCallback(async (
    newData: Omit<T, 'id'>,
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    try {
      setIsCreating(true);
      setCreateError(null);
      await apiService.create(newData);
      await loadData(); // Перезагружаем данные
      options?.onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка создания записи');
      setCreateError(error);
      options?.onError?.(error);
    } finally {
      setIsCreating(false);
    }
  }, [apiService, loadData]);

  // Обновление записи
  const update = useCallback(async (
    id: number,
    updateData: Partial<T>,
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      await apiService.update(id, updateData);
      await loadData(); // Перезагружаем данные
      options?.onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка обновления записи');
      setUpdateError(error);
      options?.onError?.(error);
    } finally {
      setIsUpdating(false);
    }
  }, [apiService, loadData]);

  // Удаление записи
  const deleteRecord = useCallback(async (
    id: number,
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await apiService.delete(id);
      await loadData(); // Перезагружаем данные
      options?.onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка удаления записи');
      setDeleteError(error);
      options?.onError?.(error);
    } finally {
      setIsDeleting(false);
    }
  }, [apiService, loadData]);

  // Обновление данных
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Загружаем данные при изменении фильтров
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    // Данные
    data,
    pagination,
    isLoading,
    error,
    
    // Фильтры
    filters,
    updateFilters,
    resetFilters,
    
    // CRUD операции
    create,
    update,
    delete: deleteRecord,
    
    // Состояние операций
    isCreating,
    isUpdating,
    isDeleting,
    
    // Ошибки
    createError,
    updateError,
    deleteError,
    
    // Обновление
    refresh,
  };
};