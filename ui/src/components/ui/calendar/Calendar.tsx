import { useMemo } from "react";
import { tv } from "tailwind-variants";
import { CalendarChevron } from "./components/calendar-chevron/CalendarChevron";
import { CalendarDayButton } from "./components/calendar-day-button/CalendarDayButton";
import { CalendarNextMonthButton } from "./components/calendar-next-month-button/CalendarNextMonthButton";
import { CalendarPreviousMonthButton } from "./components/calendar-previous-month-button/CalendarPreviousMonthButton";
import { CalendarRoot } from "./components/calendar-root/CalendarRoot";
import { CalendarWeekDay } from "./components/calendar-week-day/CalendarWeekDay";
import { DayPicker, type DayPickerProps } from "react-day-picker";

const CalendarStyles = tv({
	base: [
		"bg-background p-3 [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent"
	],
	slots: {
		months: "relative flex flex-col gap-4 md:flex-row",
		month: "flex w-full flex-col gap-4",
		nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
		month_caption: "flex h-9 w-full items-center justify-center px-2",
		dropdowns: "flex h-9 w-full items-center justify-center gap-1.5 text-sm font-medium",
		dropdown_root: [
			"has-focus:border-ring has-focus:ring-ring/50 has-focus:ring-[3px]",
			"shadow-xs relative rounded-md border border-input"
		],
		dropdown: "absolute inset-0 bg-background opacity-0",
		table: "w-full border-collapse",
		weekdays: "flex",
		week: "mt-1 flex",
		hidden: "invisible",
		day: "border-0 p-0"
	}
});

const captionLabelStyle = tv({
	base: "select-none font-medium",
	variants: {
		layout: {
			label: "text-sm",
			dropdown:
				"flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground"
		}
	},
	defaultVariants: {
		layout: "label"
	}
});

const formatMonthDropdown = (date: Date) => date.toLocaleString("default", { month: "short" });

export type CalendarProps = DayPickerProps;

/**
 * Calendar компонент для выбора дат
 *
 * Основан на [react-day-picker](https://Calendar.dev/) с кастомной стилизацией.
 * Поддерживает выбор одной даты, множественный выбор и выбор диапазона дат.
 *
 * @see https://ui-kit.ics-it.ru/?path=/docs/components-day-picker-Calendar--docs
 */
export const Calendar = ({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = "dropdown",
	formatters,
	components,
	...props
}: CalendarProps) => {
	const styles = CalendarStyles();

	/**
	 * По умолчанию react-day-picker ограничивает выбор даты:
	 * - Минимум - текущий год минус 100 лет
	 * - Максимум - последний месяц текущего года
	 * Переопределяем это поведение, чтобы можно было выбирать даты до 2100 года.
	 */
	const endMonth = useMemo(() => {
		return new Date(2100, 11, 31);
	}, []);

	const formattersMemoized: CalendarProps["formatters"] = useMemo(() => {
		return {
			formatMonthDropdown,
			...formatters
		};
	}, [formatters]);

	const classNamesMemoized: CalendarProps["classNames"] = useMemo(() => {
		return {
			months: styles.months(),
			month: styles.month(),
			nav: styles.nav(),
			month_caption: styles.month_caption(),
			dropdowns: styles.dropdowns(),
			dropdown_root: styles.dropdown_root(),
			dropdown: styles.dropdown(),
			caption_label: captionLabelStyle({
				layout: captionLayout === "label" ? captionLayout : "dropdown"
			}),
			table: styles.table(),
			weekdays: styles.weekdays(),
			week: styles.week(),
			hidden: styles.hidden(),
			day: styles.day(),
			...classNames
		};
	}, [classNames]);

	const componentsMemoized: CalendarProps["components"] = useMemo(() => {
		return {
			Root: CalendarRoot,
			Chevron: CalendarChevron,
			DayButton: CalendarDayButton,
			Weekday: CalendarWeekDay,
			PreviousMonthButton: CalendarPreviousMonthButton,
			NextMonthButton: CalendarNextMonthButton,
			...components
		};
	}, [components]);

	return (
		<DayPicker
			endMonth={endMonth}
			showOutsideDays={showOutsideDays}
			className={styles.base({ className })}
			captionLayout={captionLayout}
			formatters={formattersMemoized}
			classNames={classNamesMemoized}
			components={componentsMemoized}
			{...props}
		/>
	);
};

Calendar.displayName = "Calendar";
