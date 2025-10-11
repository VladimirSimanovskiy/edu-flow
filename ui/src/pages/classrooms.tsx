import React from 'react';
import { ReferencePage } from '../components/reference/reference-page';
import { ReferenceConfigFactory } from '../services/reference-config-factory';
import { ClassroomForm } from '../components/reference/classroom';

export const Classrooms: React.FC = () => {
	const config = ReferenceConfigFactory.createClassroomConfig();
	config.formComponent = ClassroomForm;

	return <ReferencePage config={config} />;
};
