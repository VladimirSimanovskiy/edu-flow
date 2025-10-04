import { FeatureIcon } from '../../../icon/FeatureIcon';
import type { LucideIcon } from 'lucide-react';
import React, { type HTMLAttributes, type PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';
import { FormDescription, FormHeader, FormTitle } from '../../components/form-header/FormHeader';

export interface FormHeaderTemplateVariants {
	alignment?: 'compact' | 'left' | 'center';
}

const formHeaderTemplateStyles = tv({
	slots: {
		header: 'flex items-start gap-4',
		contentWrapper: 'flex flex-col',
		icon: 'flex-shrink-0',
	},
	variants: {
		alignment: {
			compact: {
				header: 'flex-row pr-9',
			},
			left: {
				header: 'flex-col gap-2 lg:gap-3',
				contentWrapper: 'gap-0.5',
			},
			center: {
				header: 'flex-col items-center gap-2 text-center lg:gap-3',
				contentWrapper: 'gap-0.5',
			},
		},
	},
	defaultVariants: {
		alignment: 'compact',
	},
});

export type BaseHeaderTemplateProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> &
	FormHeaderTemplateVariants & {
		/** Заголовок формы */
		title: React.ReactNode;
		/** Описание формы */
		description?: React.ReactNode;
		/** Иконка заголовка */
		icon?: LucideIcon;
		/** Кастомная иконка заголовка */
		customIcon?: React.ReactNode;
	};

export const BaseHeaderTemplate = React.forwardRef<
	HTMLDivElement,
	PropsWithChildren<BaseHeaderTemplateProps>
>(({ className, icon: Icon, title, alignment, description, customIcon, ...props }, ref) => {
	const { header, contentWrapper, icon } = formHeaderTemplateStyles({ alignment });

	return (
		<FormHeader ref={ref} className={header({ class: className })} {...props}>
			{Icon && <FeatureIcon size="lg" type="primary" icon={Icon} className={icon()} />}
			{customIcon && customIcon}
			<div className={contentWrapper()}>
				{title}
				{description}
			</div>
		</FormHeader>
	);
});

/**
 * Темплейт заголовка формы. Содержит иконку, заголовок и описание.
 * Имеет различные варианты расположения элементов
 */
export const FormHeaderTemplate = React.forwardRef<
	HTMLDivElement,
	PropsWithChildren<BaseHeaderTemplateProps>
>(({ title, description, ...props }, ref) => {
	return (
		<BaseHeaderTemplate
			title={<FormTitle>{title}</FormTitle>}
			description={<FormDescription>{description}</FormDescription>}
			ref={ref}
			{...props}
		/>
	);
});

FormHeaderTemplate.displayName = 'FormHeaderTemplate';
