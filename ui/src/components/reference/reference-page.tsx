import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardFooter, CardSubTitle, CardTitle } from '../ui/card';
import {
	Modal,
	ModalContent,
	ModalBody,
	ModalTrigger,
	ModalHeaderTemplate,
	ModalFooterTemplate,
} from '../ui/modal';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '../ui/alert-dialog';
import { Plus, AlertCircle } from 'lucide-react';
import { useReferenceCrud } from '../../hooks/useReferenceCrud';
import {
	ReferenceTable,
	teacherColumns,
	classroomColumns,
	subjectColumns,
} from './reference-table';
import { ReferenceFilters } from './reference-filters';
import { ReferencePagination } from './reference-pagination';
import { TeacherForm } from './teacher-form';
import { ClassroomForm } from './classroom-form';
import { SubjectForm } from './subject-form';
import type {
	Teacher,
	Classroom,
	Subject,
	TeacherFormData,
	ClassroomFormData,
	SubjectFormData,
} from '../../types/reference';

interface ReferencePageProps {
	entityType: 'teachers' | 'classrooms' | 'subjects';
	title: string;
	description: string;
}

export const ReferencePage: React.FC<ReferencePageProps> = ({ entityType, title, description }) => {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<Teacher | Classroom | Subject | null>(null);
	const [itemToDelete, setItemToDelete] = useState<Teacher | Classroom | Subject | null>(null);

	const {
		listData,
		filters,
		isLoadingList,
		isCreating,
		isUpdating,
		createError,
		updateError,
		deleteError,
		updateFilters,
		resetFilters,
		create,
		update,
		delete: deleteItem,
	} = useReferenceCrud(entityType);

	// Получаем конфигурацию для текущего типа сущности
	const getEntityConfig = () => {
		switch (entityType) {
			case 'teachers':
				return {
					columns: teacherColumns,
					sortOptions: [
						{ value: 'lastName', label: 'По фамилии' },
						{ value: 'firstName', label: 'По имени' },
						{ value: 'email', label: 'По email' },
						{ value: 'createdAt', label: 'По дате создания' },
					],
				};
			case 'classrooms':
				return {
					columns: classroomColumns,
					sortOptions: [
						{ value: 'number', label: 'По номеру' },
						{ value: 'floor', label: 'По этажу' },
						{ value: 'createdAt', label: 'По дате создания' },
					],
				};
			case 'subjects':
				return {
					columns: subjectColumns,
					sortOptions: [
						{ value: 'name', label: 'По названию' },
						{ value: 'code', label: 'По коду' },
						{ value: 'createdAt', label: 'По дате создания' },
					],
				};
			default:
				return { columns: [], sortOptions: [] };
		}
	};

	const { columns, sortOptions } = getEntityConfig();

	// Обработчики для CRUD операций
	const handleCreate = (data: TeacherFormData | ClassroomFormData | SubjectFormData) => {
		create(data, {
			onSuccess: () => {
				setIsCreateDialogOpen(false);
			},
		});
	};

	const handleEdit = (item: Teacher | Classroom | Subject) => {
		setSelectedItem(item);
		setIsEditDialogOpen(true);
	};

	const handleUpdate = (data: TeacherFormData | ClassroomFormData | SubjectFormData) => {
		if (selectedItem) {
			update(
				{ id: selectedItem.id, data },
				{
					onSuccess: () => {
						setIsEditDialogOpen(false);
						setSelectedItem(null);
					},
				}
			);
		}
	};

	const handleDeleteClick = (item: Teacher | Classroom | Subject) => {
		setItemToDelete(item);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (itemToDelete) {
			deleteItem(itemToDelete.id, {
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
		const commonProps = {
			onSubmit: isEdit ? handleUpdate : handleCreate,
			onCancel: handleCancel,
			isLoading: isEdit ? isUpdating : isCreating,
		};

		switch (entityType) {
			case 'teachers':
				return (
					<TeacherForm
						{...commonProps}
						teacher={isEdit ? (selectedItem as Teacher) : undefined}
					/>
				);
			case 'classrooms':
				return (
					<ClassroomForm
						{...commonProps}
						classroom={isEdit ? (selectedItem as Classroom) : undefined}
					/>
				);
			case 'subjects':
				return (
					<SubjectForm
						{...commonProps}
						subject={isEdit ? (selectedItem as Subject) : undefined}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="space-y-6">
			{/* Заголовок */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">{title}</h1>
					<p className="text-gray-600 mt-1">{description}</p>
				</div>
				<Modal open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
					<ModalTrigger asChild>
						<Button startIcon={Plus}>Добавить</Button>
					</ModalTrigger>
					<ModalContent className="max-w-4xl">
						<ModalHeaderTemplate
							title={`Добавить ${title.toLowerCase().slice(0, -1)}`}
							description={`Заполните форму для добавления нового ${title.toLowerCase().slice(0, -1)} в систему`}
							icon={Plus}
						/>
						<ModalBody>{renderForm(false)}</ModalBody>
						<ModalFooterTemplate
							primaryButton={isCreating ? 'Создание...' : 'Создать'}
							secondaryButton="Отмена"
							primaryButtonProps={{
								onClick: () => {
									// Обработка будет в форме
								},
								disabled: isCreating,
							}}
							secondaryButtonProps={{
								onClick: handleCancel,
							}}
						/>
					</ModalContent>
				</Modal>
			</div>

			{/* Фильтры */}
			<ReferenceFilters
				filters={filters}
				onFiltersChange={updateFilters}
				onReset={resetFilters}
				sortOptions={sortOptions}
				entityType={entityType}
			/>

			{/* Таблица */}
			<Card>
				<CardTitle>Список {title.toLowerCase()}</CardTitle>
				<CardSubTitle>Управление {title.toLowerCase()} в системе</CardSubTitle>
				<CardFooter>
					<ReferenceTable
						data={Array.isArray(listData?.data) ? listData.data : []}
						isLoading={isLoadingList}
						onEdit={handleEdit}
						onDelete={handleDeleteClick}
						columns={columns}
						entityType={entityType}
					/>
				</CardFooter>
			</Card>

			{/* Пагинация */}
			{listData?.pagination && (
				<ReferencePagination
					pagination={listData.pagination}
					onPageChange={handlePageChange}
					onLimitChange={handleLimitChange}
				/>
			)}

			{/* Диалог редактирования */}
			<Modal open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<ModalContent className="max-w-4xl">
					<ModalHeaderTemplate
						title={`Редактировать ${title.toLowerCase().slice(0, -1)}`}
						description={`Внесите изменения в данные ${title.toLowerCase().slice(0, -1)}`}
						icon={Plus}
					/>
					<ModalBody>{renderForm(true)}</ModalBody>
					<ModalFooterTemplate
						primaryButton={isUpdating ? 'Обновление...' : 'Обновить'}
						secondaryButton="Отмена"
						primaryButtonProps={{
							onClick: () => {
								// Обработка будет в форме
							},
							disabled: isUpdating,
						}}
						secondaryButtonProps={{
							onClick: handleCancel,
						}}
					/>
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
