import { Button } from '../../../button';
import { Checkbox } from '../../../checkbox';
import { useIsMobile } from '../../../../../hooks/useBreakpoints';
import React from 'react';
import { tv } from 'tailwind-variants';
import { FormFooter } from '../../components/form-footer/FormFooter';

const formFooterTemplateStyles = tv({
	slots: {
		container: 'flex w-full flex-col gap-3 lg:flex-row',
		startBlock: 'flex items-center py-1 lg:py-2.5',
		endBlock: 'ml-auto flex w-full flex-col gap-3 lg:w-auto lg:flex-row',
	},
});

export interface FormFooterTemplateProps {
	/** Дополнительные классы */
	className?: string;
	/** Текст для чекбокса */
	checkboxLabel?: string;
	/** Пропсы для чекбокса */
	checkboxProps?: React.ComponentProps<typeof Checkbox>;
	/** Основная кнопка */
	primaryButton?: React.ReactNode;
	/** Пропсы для основной кнопки */
	primaryButtonProps?: React.ComponentProps<typeof Button>;
	/** Вторичная кнопка */
	secondaryButton?: React.ReactNode;
	/** Пропсы для вторичной кнопки */
	secondaryButtonProps?: React.ComponentProps<typeof Button>;
}

/**
 * Темплейт футера формы. Содержит чекбокс и 2 кнопки, которыми можно управлять.
 * Адаптивен к размерам устройств
 */
export const FormFooterTemplate = React.forwardRef<HTMLDivElement, FormFooterTemplateProps>(
	(
		{
			className,
			primaryButton,
			secondaryButton,
			checkboxLabel,
			checkboxProps,
			primaryButtonProps,
			secondaryButtonProps,
		},
		ref
	) => {
		const isMobile = useIsMobile();
		const { container, startBlock, endBlock } = formFooterTemplateStyles();

		if (isMobile) {
			primaryButtonProps = { ...primaryButtonProps, size: 'lg' };
			secondaryButtonProps = { ...secondaryButtonProps, size: 'lg' };
		}
		const primaryButtonElement = primaryButton && (
			<Button key="primary-button" variant="primary" {...primaryButtonProps}>
				{primaryButton}
			</Button>
		);

		const secondaryButtonElement = secondaryButton && (
			<Button key="secondary-button" variant="outline" {...secondaryButtonProps}>
				{secondaryButton}
			</Button>
		);

		return (
			<FormFooter className={className} ref={ref}>
				<div className={container()}>
					{checkboxLabel && (
						<div className={startBlock()}>
							<Checkbox {...checkboxProps} />
							<label className="ml-2 text-sm text-muted-foreground">
								{checkboxLabel}
							</label>
						</div>
					)}
					<div className={endBlock()}>
						{isMobile
							? [primaryButtonElement, secondaryButtonElement]
							: [secondaryButtonElement, primaryButtonElement]}
					</div>
				</div>
			</FormFooter>
		);
	}
);

FormFooterTemplate.displayName = 'FormFooterTemplate';
