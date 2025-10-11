/**
 * Публичный API модуля справочника кабинетов
 * Следует принципу Interface Segregation - экспортирует только необходимые интерфейсы
 */

// Экспорт конфигурации таблицы
export { classroomTableColumns } from './classroom-table-config';

// Экспорт сервиса
export { ClassroomService } from './classroom-service';

// Экспорт формы
export { ClassroomForm } from './classroom-form';

// Экспорт конфигурации модуля
export { ClassroomModuleConfig } from './classroom-module-config';
