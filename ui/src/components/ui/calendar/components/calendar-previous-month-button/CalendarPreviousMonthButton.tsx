import { Button } from "@/components/ui/button";
import type { PreviousMonthButtonProps } from "react-day-picker";

/**
 * Кнопка для перехода к предыдущему месяцу в Calendar, оборачивает компонент day-picker-chevron
 *
 * @param className - Дополнительные CSS классы
 * @param props - Пропсы от react-day-picker PreviousMonthButton
 */
export const CalendarPreviousMonthButton = ({ className, ...props }: PreviousMonthButtonProps) => {
	return <Button {...props} variant="ghost" className={className} />;
};

CalendarPreviousMonthButton.displayName = "CalendarPreviousMonthButton";
