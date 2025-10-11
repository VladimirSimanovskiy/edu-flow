import { useState } from 'react';
import { Plus, Filter, Trash2 } from 'lucide-react';
import { PageLayout } from '@/components/ui/layout';
import { Toolbar, ToolbarButton, ToolbarSeparator } from '@/components/ui/toolbar';
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
import { useReferenceCrud } from '@/hooks/useReferenceCrud';
import { ReferenceTable } from './reference-table';
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

	// Состояние выбора строк в таблице
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

	// Хук для работы с данными
	const {
		data,
		isLoading,
		create,
		update,
		delete: deleteRecord,
		isCreating,
		isUpdating,
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

	const handleBulkDelete = () => {
		const selectedIds = Object.keys(rowSelection)
			.filter(key => rowSelection[key])
			.map(Number);

		selectedIds.forEach(id => {
			const item = data.find(x => x.id === id);
			if (item) {
				deleteRecord(id, {
					onSuccess: () => {
						// Очищаем выбор после успешного удаления
						setRowSelection({});
					},
				});
			}
		});
	};

	// Рендер формы в зависимости от типа сущности
	const renderForm = (isEdit: boolean) => {
		const FormComponent = config.formComponent;
		const onSubmit = (payload: Omit<T, 'id'>) => {
			if (isEdit) {
				// cast to Partial<T> is safe here because edit form may submit partial fields
				handleUpdate(payload as Partial<T>);
			} else {
				handleCreate(payload);
			}
		};
		const commonProps = {
			onSubmit,
			onCancel: handleCancel,
			isLoading: isEdit ? isUpdating : isCreating,
		};

		return (
			<FormComponent
				{...commonProps}
				entity={isEdit && selectedItem ? selectedItem : undefined}
			/>
		);
	};

	return (
		<>
			<PageLayout title={config.title} description={config.description}>
				{/* Тулбар таблицы */}
				<Toolbar className="mb-4">
					<Modal open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
						<ModalTrigger asChild>
							<ToolbarButton>
								<Plus className="h-4 w-4" />
								<span>Добавить</span>
							</ToolbarButton>
						</ModalTrigger>
						<ModalContent className="max-w-4xl">
							<ModalHeader>
								<ModalTitle>
									Добавить {config.title.toLowerCase().slice(0, -1)}
								</ModalTitle>
								<ModalDescription>
									Заполните форму для добавления нового{' '}
									{config.title.toLowerCase().slice(0, -1)} в систему
								</ModalDescription>
							</ModalHeader>
							<ModalBody>{renderForm(false)}</ModalBody>
						</ModalContent>
					</Modal>

					<ToolbarSeparator />

					<ToolbarButton>
						<Filter className="h-4 w-4" />
						<span>Фильтры</span>
					</ToolbarButton>

					{/* Кнопка удаления выбранных элементов */}
					{Object.keys(rowSelection).length > 0 && (
						<>
							<ToolbarSeparator />
							<ToolbarButton
								onClick={handleBulkDelete}
								className="text-red-600 hover:text-red-700 hover:bg-red-50"
							>
								<Trash2 className="h-4 w-4" />
								<span>Удалить выбранные ({Object.keys(rowSelection).length})</span>
							</ToolbarButton>
						</>
					)}
				</Toolbar>

				{/* Таблица данных */}
				<ReferenceTable
					data={data}
					columns={config.columns}
					isLoading={isLoading}
					onEdit={handleEdit}
					onDelete={(id: number) => {
						const item = data.find(x => x.id === id);
						if (item) handleDeleteClick(item);
					}}
					entityType={config.entityType as any}
					rowSelection={rowSelection}
					onRowSelectionChange={setRowSelection}
				/>
			</PageLayout>

			{/* Диалог редактирования */}
			<Modal open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<ModalContent className="max-w-4xl">
					<ModalHeader>
						<ModalTitle>
							Редактировать {config.title.toLowerCase().slice(0, -1)}
						</ModalTitle>
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
		</>
	);
};
