import * as React from 'react';
import { tv } from 'tailwind-variants';
import { CircleHelp } from 'lucide-react';
import { FieldLabel } from '@/components/ui/label/field-label';
import { Description } from '@/components/ui/description';
import { cn } from '@/lib/utils';
import { useId } from 'react';
import type { VariantsConfig } from '@/lib/utils/variants';

export type FieldLayout = 'horizontal' | 'vertical' | 'responsive';

export interface FieldVariants {
	/** Вариант расположения элементов поля */
	layout?: FieldLayout;
	showGap?: boolean;
}

const fieldStyles = tv({
	slots: {
		wrapper: 'flex w-full space-y-0',
		labelWrapper: 'flex items-center gap-1',
		controlWrapper: 'flex w-full min-w-0 flex-1 flex-col',
		description: 'text-xs',
		error: 'text-status-error',
	},
	variants: {
		layout: {
			horizontal: {
				wrapper: 'flex-row gap-4',
				labelWrapper: 'h-10 lg:h-9',
			},
			vertical: {
				wrapper: 'flex-col gap-2',
				labelWrapper: 'h-4',
			},
			responsive: {
				wrapper: 'flex-col gap-2 lg:flex-row lg:gap-4',
				labelWrapper: 'h-4 lg:h-9',
			},
		},
		showGap: {
			true: { controlWrapper: 'gap-y-2' },
		},
	} satisfies VariantsConfig<FieldVariants>,
	defaultVariants: {
		layout: 'horizontal',
	},
});

type DescriptionPlacement = 'text' | 'icon';

type ControlProps = {
	/** Режим только для чтения */
	readonly?: boolean;
	/** Идентификатор элемента. Используется для связи лейбла с элементом управления */
	id?: string;
	/** Текст сообщения об ошибке. При наличии делает поле невалидным */
	error?: string;
};

export type FieldProps = Omit<FieldVariants, 'showGap'> & {
	/** Заголовок поля */
	title: string;
	/** Описание поля */
	description?: string;
	/** Режим только для чтения */
	readonly?: boolean;
	/** Расположение описания */
	descriptionPlacement?: DescriptionPlacement;
	/** Функция рендеринга контрола */
	control: (props: ControlProps) => React.ReactNode;
	/** Обязательное поле */
	required?: boolean;
	/** Текст ошибки */
	error?: string;
	/** Дополнительные классы для контейнера */
	className?: string;
	/** Дополнительные классы для лейбла */
	labelClassName?: string;
};

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
	(
		{
			title,
			description,
			descriptionPlacement = 'text',
			control,
			required,
			error,
			className,
			labelClassName,
			layout,
			readonly,
		},
		ref
	) => {
		const generatedId = useId();
		const showTextDescription = description && descriptionPlacement !== 'icon';
		const showIconDescription = description && descriptionPlacement === 'icon';

		const styles = fieldStyles({ layout, showGap: !!(showTextDescription || error) });

		return (
			<div ref={ref} className={styles.wrapper({ className })}>
				<div className={styles.labelWrapper({ className: labelClassName })}>
					<FieldLabel
						tooltip={description}
						icon={showIconDescription ? CircleHelp : void 0}
						required={!readonly && required}
						htmlFor={generatedId}
					>
						{title}
					</FieldLabel>
				</div>

				<div className={styles.controlWrapper()}>
					{control({ readonly, id: generatedId, error })}
					<div>
						{showTextDescription && (
							<Description className={cn(styles.description())} children={description} />
						)}
						{error && <Description className={cn(styles.description(), styles.error())} children={error} />}
					</div>
				</div>
			</div>
		);
	}
);

Field.displayName = 'Field';
