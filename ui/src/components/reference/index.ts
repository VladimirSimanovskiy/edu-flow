/**
 * Главный экспорт всех модулей справочников
 * Следует принципу Interface Segregation - экспортирует только необходимые интерфейсы
 */

// Экспорт общих компонентов
export { ReferenceTable } from './reference-table';
export { ReferencePage } from './reference-page';

// Экспорт модулей справочников
export * from './teacher';
export * from './classroom';
export * from './subject';
