import React from 'react';

interface FormFieldProps {
	label: string;
	description?: string;
	children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, description, children }) => {
	return (
		<div className="space-y-1">
			<div className="text-xs text-gray-500">{label}</div>
			{children}
			{description ? <div className="text-xxs text-gray-400">{description}</div> : null}
		</div>
	);
};
