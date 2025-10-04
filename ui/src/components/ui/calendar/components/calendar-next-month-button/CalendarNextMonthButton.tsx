import { Button } from "@/components/ui/button";
import type { NextMonthButtonProps } from "react-day-picker";

/**
 * Кнопка для перехода к следующему месяцу в Calendar, оборачивает компонент day-picker-chevron
 *
 * @param className - Дополнительные CSS классы
 * @param props - Пропсы от react-day-picker NextMonthButton
 */
export const CalendarNextMonthButton = ({ className, ...props }: NextMonthButtonProps) => {
	return <Button {...props} variant="ghost" className={className} />;
};

CalendarNextMonthButton.displayName = "CalendarNextMonthButton";
