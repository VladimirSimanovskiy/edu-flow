/**
 * Публичный API модуля справочника учителей
 * Следует принципу Interface Segregation - экспортирует только необходимые интерфейсы
 */

// Экспорт конфигурации таблицы
export { teacherTableColumns } from './teacher-table-config';

// Экспорт сервиса
export { TeacherService } from './teacher-service';

// Экспорт формы
export { TeacherForm } from './teacher-form';

// Экспорт конфигурации модуля
export { TeacherModuleConfig } from './teacher-module-config';
