import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { tv } from 'tailwind-variants';
import { cn } from '../../../utils/cn';

export interface ProgressBarSizeVariants {
	/** Размер индикатора */
	size?: 'sm' | 'md' | 'lg';
}

export interface ProgressBarVariants extends ProgressBarSizeVariants {
	/** Индикатор неопределенного состояния прогресса */
	indeterminate?: boolean;
}

const progressBarStyles = tv({
	slots: {
		track: 'relative w-full overflow-hidden rounded-full bg-secondary-bg-hover',
		indicator: 'h-full bg-primary-accent transition-transform !duration-500',
	},
	variants: {
		size: {
			sm: { track: 'h-1' },
			md: { track: 'h-2' },
			lg: { track: 'h-3' },
		},
		indeterminate: {
			true: {
				indicator:
					'!duration-1500 absolute w-full origin-left animate-indeterminate-bar rounded-full',
			},
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> &
	ProgressBarVariants & {
		/** Максимальное значение прогресса. По умолчанию 100 */
		max?: number;
		/** Значение прогресса от 0 до max. Если не указано или null, считается равным 0 */
		value?: number | null;
		/** Классы для индикатора */
		indicatorClassName?: string;
		/** Функция для получения доступной текстовой метки, представляющей текущее значение в удобочитаемом формате. 
	Если не указана, метка значения будет озвучена как числовое значение в процентах от максимального значения. */
		getValueLabel?(value: number, max: number): string;
	};

export const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	ProgressProps
>(({ className, value, max = 100, size, indicatorClassName, indeterminate, ...props }, ref) => {
	const styles = progressBarStyles({ size, indeterminate });
	const currentValue = indeterminate ? null : (value ?? 0);

	const indicatorStyle = React.useMemo(() => {
		if (indeterminate) return;

		const safeMax = max <= 0 ? 100 : max;
		const safeValue = Math.max(0, Math.min(safeMax, currentValue ?? 0));
		const percentage = (safeValue / safeMax) * 100;

		return { transform: `translateX(-${100 - percentage}%)` };
	}, [indeterminate, currentValue, max]);

	return (
		<ProgressPrimitive.Root
			ref={ref}
			className={cn(styles.track(), className)}
			value={currentValue}
			max={max}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className={cn(styles.indicator(), indicatorClassName)}
				style={indicatorStyle}
			/>
		</ProgressPrimitive.Root>
	);
});
Progress.displayName = ProgressPrimitive.Root.displayName;
