import { Root, type RootProps } from "react-day-picker";
import { tv } from "tailwind-variants";

const calendarRootStyles = tv({
	base: [
		"w-fit rounded-md border bg-background",
		"border border-solid border-secondary-border bg-secondary-bg shadow-sm"
	]
});

/**
 * Корневой контейнер для Calendar
 *
 * @param className - Дополнительные CSS классы
 * @param props - Пропсы от react-day-picker Root
 */
export const CalendarRoot = ({ className, ...props }: RootProps) => {
	return <Root {...props} className={calendarRootStyles({ className })} />;
};

CalendarRoot.displayName = "CalendarRoot";
