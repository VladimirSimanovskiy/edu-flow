import { tv } from 'tailwind-variants';
import { DayButton, type DayButtonProps } from 'react-day-picker';

const calendarDayButtonStyles = tv({
	base: [
		'inline-flex items-center justify-center gap-2',
		'aspect-square h-9 shrink-0 p-2.5',
		'text-xs font-medium text-foreground transition-all',
		'cursor-pointer select-none',
		'disabled:pointer-events-none disabled:text-muted-foreground disabled:opacity-50',
		'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
		'focus-visible:rounded-md',
	],
	variants: {
		selected: {
			true: 'bg-primary text-primary-foreground',
		},
		range_middle: {
			true: 'bg-secondary-bg-hover text-card-foreground',
		},
		outside: {
			true: 'text-muted-foreground',
		},
		today: {
			true: 'relative after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary',
		},
	},
	compoundVariants: [
		{
			selected: false,
			className: 'hover:bg-secondary-bg-hover',
		},
		{
			selected: true,
			range_start: false,
			range_end: false,
			range_middle: false,
			className: 'rounded-md',
		},
		{
			selected: true,
			range_start: true,
			className: 'rounded-l-md',
		},
		{
			selected: true,
			range_end: true,
			className: 'rounded-r-md',
		},
		{
			today: true,
			selected: true,
			range_middle: false,
			className: 'after:bg-primary-foreground',
		},
		{
			outside: true,
			selected: false,
			className: 'hover:text-primary-fg',
		},
	],
});

export interface ModifiersRdp {
	selected?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	today?: boolean;
	focused?: boolean;
	outside?: boolean;

	range_start?: boolean;
	range_end?: boolean;
	range_middle?: boolean;
}

export type CalendarDayButtonProps = DayButtonProps & { modifiers: ModifiersRdp };

/**
 * Кнопка для отображения дня в Calendar
 *
 * @param modifiers - Модификаторы состояния дня (selected, disabled, today, etc.)
 * @param className - Дополнительные CSS классы
 * @param props - Пропсы от react-day-picker DayButton
 */
export const CalendarDayButton = ({ modifiers, className, ...props }: CalendarDayButtonProps) => {
	return (
		<DayButton
			modifiers={modifiers}
			className={calendarDayButtonStyles({ ...modifiers, className })}
			{...props}
			disabled={modifiers.disabled}
		/>
	);
};

CalendarDayButton.displayName = 'CalendarDayButton';
