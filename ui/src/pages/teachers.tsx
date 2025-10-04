import React from 'react';
import { ReferencePage } from '../components/reference/ReferencePage';
import { ReferenceConfigFactory } from '../services/reference-config-factory';
import { TeacherForm } from '../components/reference/forms/TeacherForm';

export const Teachers: React.FC = () => {
	const config = ReferenceConfigFactory.createTeacherConfig();
	config.formComponent = TeacherForm;

	return <ReferencePage config={config} />;
};
