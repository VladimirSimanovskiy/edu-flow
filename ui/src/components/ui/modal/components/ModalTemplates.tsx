import React, { type PropsWithChildren } from 'react';
import {
	BaseHeaderTemplate,
	type BaseHeaderTemplateProps,
} from '../../form/templates/header-template/FormHeaderTemplate';
import { ModalDescription, ModalTitle } from '../Modal';
import { FormFooterTemplate } from '../../form/templates/footer-template/FormFooterTemplate';

export const ModalHeaderTemplate = React.forwardRef<
	HTMLDivElement,
	PropsWithChildren<BaseHeaderTemplateProps>
>(({ title, description, ...props }, ref) => {
	return (
		<BaseHeaderTemplate
			title={<ModalTitle>{title}</ModalTitle>}
			description={<ModalDescription>{description}</ModalDescription>}
			ref={ref}
			{...props}
		/>
	);
});

ModalHeaderTemplate.displayName = 'ModalHeaderTemplate';

export const ModalFooterTemplate = FormFooterTemplate;
