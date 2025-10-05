import React from 'react';
import { ReferencePage } from '@/components/reference/reference-page';
import { ReferenceConfigFactory } from '@/services/reference-config-factory';
import { TeacherForm } from '@/components/reference/forms/TeacherForm';

/**
 * Страница управления учителями с новой архитектурой
 * Следует принципу Dependency Inversion - зависит от абстракций
 * Следует принципу Open/Closed - легко расширяется
 */
export const TeachersPageNew: React.FC = () => {
  // Создаем конфигурацию для учителей
  const config = ReferenceConfigFactory.createTeacherConfig();
  
  // Заменяем заглушку на реальный компонент формы
  config.formComponent = TeacherForm;

  return <ReferencePage config={config} />;
};

export default TeachersPageNew;
