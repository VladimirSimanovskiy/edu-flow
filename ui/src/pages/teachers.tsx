import React from 'react';
import { ReferencePage } from '../components/reference/reference-page';

export const Teachers: React.FC = () => {
  return (
    <ReferencePage
      entityType="teachers"
      title="Учителя"
      description="Управление информацией об учителях школы"
    />
  );
};
