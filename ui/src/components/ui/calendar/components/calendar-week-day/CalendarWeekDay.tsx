import { tv } from "tailwind-variants";
import { Weekday, type WeekdayProps } from "react-day-picker";

const calendarWeekDayStyles = tv({
	base: [
		"inline-flex items-center justify-center gap-2",
		"transition-all",
		"text-xs font-medium text-muted-foreground",
		"w-9 shrink-0 rounded p-0",
		"opacity-70"
	]
});

/**
 * Компонент для отображения дня недели в Calendar
 *
 * @param className - Дополнительные CSS классы
 * @param props - Пропсы от react-day-picker Weekday
 */
export const CalendarWeekDay = ({ className, ...props }: WeekdayProps) => {
	return <Weekday className={calendarWeekDayStyles({ className })} {...props}></Weekday>;
};

CalendarWeekDay.displayName = "CalendarWeekDay";
