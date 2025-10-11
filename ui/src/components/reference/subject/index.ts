/**
 * Публичный API модуля справочника предметов
 * Следует принципу Interface Segregation - экспортирует только необходимые интерфейсы
 */

// Экспорт конфигурации таблицы
export { subjectTableColumns } from './subject-table-config';

// Экспорт сервиса
export { SubjectService } from './subject-service';

// Экспорт формы
export { SubjectForm } from './subject-form';

// Экспорт конфигурации модуля
export { SubjectModuleConfig } from './subject-module-config';
