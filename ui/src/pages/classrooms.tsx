import React from 'react';
import { ReferencePage } from '../components/reference/ReferencePage';
import { ReferenceConfigFactory } from '../services/reference-config-factory';
import { ClassroomForm } from '../components/reference/forms/ClassroomForm';

export const Classrooms: React.FC = () => {
  const config = ReferenceConfigFactory.createClassroomConfig();
  config.formComponent = ClassroomForm;
  
  return <ReferencePage config={config} />;
};
