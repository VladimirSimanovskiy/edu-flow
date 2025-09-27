import { useMemo } from 'react';
import { formatDateForApi } from '../../../utils/dateFormat';

/**
 * Хук для работы с датами в расписании
 * @param date - дата для обработки
 * @returns объект с отформатированными датами и метаданными
 */
export const useScheduleDate = (date: Date) => {
	return useMemo(() => {
		const dateString = formatDateForApi(date);

		return {
			// Строка для API запросов
			apiDateString: dateString,
			// Исходная дата
			originalDate: date,
			// Год
			year: date.getFullYear(),
			// Месяц (1-12)
			month: date.getMonth() + 1,
			// День
			day: date.getDate(),
			// День недели (0-6, где 0 = воскресенье)
			dayOfWeek: date.getDay(),
		};
	}, [date]);
};
