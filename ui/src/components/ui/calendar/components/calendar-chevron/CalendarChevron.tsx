import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from "lucide-react";
import type { ChevronProps } from "react-day-picker";
import { tv } from "tailwind-variants";

const calendarChevronStyles = tv({
	base: "size-4"
});

/**
 * Компонент для отображения стрелок навигации в Calendar
 *
 * @param className - Дополнительные CSS классы
 * @param orientation - Направление стрелки ('left' | 'right' | 'up' | 'down')
 * @param props - Остальные пропсы от react-day-picker Chevron
 */
export const CalendarChevron = ({ className, orientation, ...props }: ChevronProps): React.JSX.Element => {
	if (orientation === "left") {
		return <ChevronLeftIcon className={calendarChevronStyles({ className })} {...props} />;
	}
	if (orientation === "right") {
		return <ChevronRightIcon className={calendarChevronStyles({ className })} {...props} />;
	}
	if (orientation === "up") {
		return <ChevronUpIcon className={calendarChevronStyles({ className })} {...props} />;
	}
	return <ChevronDownIcon className={calendarChevronStyles({ className })} {...props} />;
};

CalendarChevron.displayName = "CalendarChevron";
