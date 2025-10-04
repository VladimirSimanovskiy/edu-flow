import React from 'react';
import { ReferencePage } from '../components/reference/reference-page';

export const Subjects: React.FC = () => {
  return (
    <ReferencePage
      entityType="subjects"
      title="Предметы"
      description="Управление информацией о предметах"
    />
  );
};
