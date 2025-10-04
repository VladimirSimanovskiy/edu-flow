import React from 'react';
import { ReferencePage } from '../components/reference/reference-page';

export const Classrooms: React.FC = () => {
  return (
    <ReferencePage
      entityType="classrooms"
      title="Кабинеты"
      description="Управление информацией о кабинетах школы"
    />
  );
};
