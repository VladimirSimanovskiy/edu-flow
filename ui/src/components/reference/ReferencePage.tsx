import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardSubTitle, CardTitle } from '@/components/ui/card';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalTrigger,
  ModalDescription,
} from '@/components/ui/modal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';
import { useReferenceCrud } from '@/hooks/useReferenceCrud';
import { ReferenceTable } from './ReferenceTable';
import { ReferenceFilters } from './ReferenceFilters';
import { ReferencePagination } from './ReferencePagination';
import type { ReferencePageProps, ReferenceEntity } from '@/types/reference-system';

/**
 * Универсальная страница справочника
 * Следует принципу Open/Closed - легко расширяется новыми типами сущностей
 * Следует принципу Single Responsibility - отвечает только за отображение справочника
 */
export const ReferencePage = <T extends ReferenceEntity>({ config }: ReferencePageProps<T>) => {
  // Состояние модальных окон
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  // Хук для работы с данными
  const {
    data,
    pagination,
    isLoading,
    filters,
    updateFilters,
    resetFilters,
    create,
    update,
    delete: deleteRecord,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
  } = useReferenceCrud<T>({
    apiService: config.apiService,
  });

  // Обработчики для CRUD операций
  const handleCreate = (data: Omit<T, 'id'>) => {
    create(data, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
      },
    });
  };

  const handleEdit = (item: T) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: Partial<T>) => {
    if (selectedItem) {
      update(selectedItem.id, data, {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedItem(null);
        },
      });
    }
  };

  const handleDeleteClick = (item: T) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      deleteRecord(itemToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setItemToDelete(null);
        },
      });
    }
  };

  const handleCancel = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    setItemToDelete(null);
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
  };

  const handleLimitChange = (limit: number) => {
    updateFilters({ limit, page: 1 });
  };

  // Рендер формы в зависимости от типа сущности
  const renderForm = (isEdit: boolean) => {
    const FormComponent = config.formComponent;
    const commonProps = {
      onSubmit: isEdit ? handleUpdate : handleCreate,
      onCancel: handleCancel,
      isLoading: isEdit ? isUpdating : isCreating,
    };

    return (
      <FormComponent
        {...commonProps}
        entity={isEdit ? selectedItem : undefined}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
          <p className="text-gray-600 mt-1">{config.description}</p>
        </div>
        <Modal open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <ModalTrigger asChild>
            <Button startIcon={Plus}>Добавить</Button>
          </ModalTrigger>
          <ModalContent className="max-w-4xl">
            <ModalHeader>
              <ModalTitle>Добавить {config.title.toLowerCase().slice(0, -1)}</ModalTitle>
              <ModalDescription>
                Заполните форму для добавления нового{' '}
                {config.title.toLowerCase().slice(0, -1)} в систему
              </ModalDescription>
            </ModalHeader>
            <ModalBody>{renderForm(false)}</ModalBody>
          </ModalContent>
        </Modal>
      </div>

      {/* Фильтры */}
      <ReferenceFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
        sortOptions={config.sortOptions}
        config={config}
      />

      {/* Таблица */}
      <Card>
        <CardTitle>Список {config.title.toLowerCase()}</CardTitle>
        <CardSubTitle>Управление {config.title.toLowerCase()} в системе</CardSubTitle>
        <CardFooter>
          <ReferenceTable
            data={data}
            columns={config.columns}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </CardFooter>
      </Card>

      {/* Пагинация */}
      {pagination && (
        <ReferencePagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      {/* Диалог редактирования */}
      <Modal open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <ModalContent className="max-w-4xl">
          <ModalHeader>
            <ModalTitle>Редактировать {config.title.toLowerCase().slice(0, -1)}</ModalTitle>
            <ModalDescription>
              Внесите изменения в данные {config.title.toLowerCase().slice(0, -1)}
            </ModalDescription>
          </ModalHeader>
          <ModalBody>{renderForm(true)}</ModalBody>
        </ModalContent>
      </Modal>

      {/* Диалог удаления */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этот элемент? Это действие нельзя
              отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ошибки */}
      {(createError || updateError || deleteError) && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-red-800">Ошибка</p>
              <p className="text-sm text-red-600">
                {createError?.message ||
                  updateError?.message ||
                  deleteError?.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
