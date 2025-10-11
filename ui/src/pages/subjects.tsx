import React from 'react';
import { ReferencePage } from '../components/reference/reference-page';
import { ReferenceConfigFactory } from '../services/reference-config-factory';
import { SubjectForm } from '../components/reference/subject';

export const Subjects: React.FC = () => {
	const config = ReferenceConfigFactory.createSubjectConfig();
	config.formComponent = SubjectForm;

	return <ReferencePage config={config} />;
};
