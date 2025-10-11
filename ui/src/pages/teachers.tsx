import React from 'react';
import { ReferencePage } from '../components/reference/reference-page';
import { ReferenceConfigFactory } from '../services/reference-config-factory';
import { TeacherForm } from '../components/reference/teacher';

export const Teachers: React.FC = () => {
	const config = ReferenceConfigFactory.createTeacherConfig();
	config.formComponent = TeacherForm;

	return <ReferencePage config={config} />;
};
