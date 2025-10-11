import { useState } from 'react';
import { Plus, Filter, Trash2 } from 'lucide-react';
import { PageLayout } from '@/components/ui/layout';
import { Toolbar, ToolbarButton, ToolbarSeparator } from '@/components/ui/toolbar';
import { Modal, ModalContent, ModalTrigger } from '@/components/ui/modal';
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
	const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<T | null>(null);
	const [itemsToBulkDelete, setItemsToBulkDelete] = useState<T[]>([]);

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

	const handleBulkDeleteConfirm = () => {
		// Вызываем onDelete для каждой выбранной записи
		itemsToBulkDelete.forEach(item => {
			deleteRecord(item.id, {
				onSuccess: () => {
					// Очищаем выбор после успешного удаления
					setRowSelection({});
				},
			});
		});

		setIsBulkDeleteDialogOpen(false);
		setItemsToBulkDelete([]);
	};

	const handleCancel = () => {
		setIsCreateDialogOpen(false);
		setIsEditDialogOpen(false);
		setIsBulkDeleteDialogOpen(false);
		setSelectedItem(null);
		setItemsToBulkDelete([]);
	};

	const handleBulkDelete = () => {
		const selectedIds = Object.keys(rowSelection)
			.filter(key => rowSelection[key])
			.map(Number);

		// Находим все выбранные элементы
		const selectedItems = selectedIds
			.map(id => data.find(x => x.id === id))
			.filter((item): item is T => item !== undefined);

		if (selectedItems.length > 0) {
			setItemsToBulkDelete(selectedItems);
			setIsBulkDeleteDialogOpen(true);
		}
	};

	// Рендер формы в зависимости от типа сущности
	const renderForm = (isEdit: boolean) => {
		const FormComponent = config.formComponent;
		const onSubmit = (payload: Omit<T, 'id'>) => {
			if (isEdit) {
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
						<ModalContent>{renderForm(false)}</ModalContent>
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
					entityType={config.entityType as any}
					rowSelection={rowSelection}
					onRowSelectionChange={setRowSelection}
				/>
			</PageLayout>

			{/* Диалог редактирования */}
			<Modal open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<ModalContent>{renderForm(true)}</ModalContent>
			</Modal>

			{/* Диалог удаления */}
			<AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
						<AlertDialogDescription>
							Вы уверены, что хотите удалить выбранные элементы? Это действие
							необратимо.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={handleCancel}>Отмена</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleBulkDeleteConfirm}
							className="bg-red-600 hover:bg-red-700"
						>
							Удалить все
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
