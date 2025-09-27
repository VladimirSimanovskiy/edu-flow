/**
 * Утилиты для контрола выбора даты
 */

import {
	format,
	startOfWeek,
	endOfWeek,
	addDays,
	addWeeks,
	isSameWeek,
	isToday,
	isTomorrow,
	isYesterday,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import type { QuickAction } from '../types/dateControl';

/**
 * Форматирует дату для отображения в зависимости от типа представления
 */
export const formatDateForDisplay = (
	date: Date,
	viewType: 'day' | 'week',
	locale: string = 'ru'
): string => {
	const localeObj = locale === 'ru' ? ru : undefined;

	if (viewType === 'day') {
		return format(date, 'd MMMM yyyy', { locale: localeObj });
	} else {
		const weekStart = startOfWeek(date, { weekStartsOn: 1, locale: localeObj });
		const weekEnd = endOfWeek(date, { weekStartsOn: 1, locale: localeObj });

		// Если неделя в одном месяце
		if (weekStart.getMonth() === weekEnd.getMonth()) {
			return `${format(weekStart, 'd', { locale: localeObj })} - ${format(weekEnd, 'd MMMM yyyy', { locale: localeObj })}`;
		}

		// Если неделя в разных месяцах
		return `${format(weekStart, 'd MMM', { locale: localeObj })} - ${format(weekEnd, 'd MMM yyyy', { locale: localeObj })}`;
	}
};

/**
 * Получает начало недели для даты
 */
export const getWeekStart = (date: Date): Date => {
	return startOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Получает конец недели для даты
 */
export const getWeekEnd = (date: Date): Date => {
	return endOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Проверяет, является ли дата сегодняшней
 */
export const isCurrentDay = (date: Date): boolean => {
	return isToday(date);
};

/**
 * Проверяет, является ли дата завтрашней
 */
export const isCurrentTomorrow = (date: Date): boolean => {
	return isTomorrow(date);
};

/**
 * Проверяет, является ли дата вчерашней
 */
export const isCurrentYesterday = (date: Date): boolean => {
	return isYesterday(date);
};

/**
 * Проверяет, находится ли дата в текущей неделе
 */
export const isCurrentWeek = (date: Date): boolean => {
	const today = new Date();
	return isSameWeek(date, today, { weekStartsOn: 1 });
};

/**
 * Проверяет, находится ли дата в текущем месяце
 */
export const isCurrentMonth = (date: Date): boolean => {
	const today = new Date();
	return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

/**
 * Получает быстрые действия для выбора даты
 */
export const getQuickActions = (_viewType: 'day' | 'week'): QuickAction[] => {
	const today = new Date();

	return [
		{
			id: 'today',
			label: 'Сегодня',
			getDate: () => today,
			enabled: true,
		},
	];
};

/**
 * Навигация по датам
 */
export const navigateDate = (
	currentDate: Date,
	direction: 'prev' | 'next',
	viewType: 'day' | 'week'
): Date => {
	if (viewType === 'day') {
		return direction === 'prev' ? addDays(currentDate, -1) : addDays(currentDate, 1);
	} else {
		return direction === 'prev' ? addWeeks(currentDate, -1) : addWeeks(currentDate, 1);
	}
};

/**
 * Проверяет, можно ли выбрать дату (в пределах min/max)
 */
export const isDateSelectable = (date: Date, minDate?: Date, maxDate?: Date): boolean => {
	if (minDate && date < minDate) return false;
	if (maxDate && date > maxDate) return false;
	return true;
};

/**
 * Получает массив дней для календаря
 */
export const getCalendarDays = (date: Date): Date[] => {
	const year = date.getFullYear();
	const month = date.getMonth();

	const firstDay = new Date(year, month, 1);
	const startDate = startOfWeek(firstDay, { weekStartsOn: 1 });

	const days: Date[] = [];
	const current = new Date(startDate);

	// 6 недель * 7 дней = 42 дня (достаточно для любого месяца)
	for (let i = 0; i < 42; i++) {
		days.push(new Date(current));
		current.setDate(current.getDate() + 1);
	}

	return days;
};

/**
 * Получает массив недель для календаря
 */
export const getCalendarWeeks = (date: Date): Date[] => {
	const year = date.getFullYear();
	const month = date.getMonth();

	const firstDay = new Date(year, month, 1);
	const startDate = startOfWeek(firstDay, { weekStartsOn: 1 });

	const weeks: Date[] = [];
	const current = new Date(startDate);

	// 6 недель
	for (let i = 0; i < 6; i++) {
		weeks.push(new Date(current));
		current.setDate(current.getDate() + 7);
	}

	return weeks;
};

/**
 * Проверяет, находится ли дата в выбранной неделе
 */
export const isDateInWeek = (date: Date, weekStart: Date): boolean => {
	const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
	return date >= weekStart && date <= weekEnd;
};

/**
 * Получает номер недели в году
 */
export const getWeekNumber = (date: Date): number => {
	const startOfYear = new Date(date.getFullYear(), 0, 1);
	const startOfFirstWeek = startOfWeek(startOfYear, { weekStartsOn: 1 });
	const diffInTime = date.getTime() - startOfFirstWeek.getTime();
	const diffInWeeks = Math.ceil(diffInTime / (7 * 24 * 60 * 60 * 1000));
	return Math.max(1, diffInWeeks);
};
