/**
 * Компонент выбора даты
 * Применяет принцип Single Responsibility - только выбор даты
 */

import React, { useState, useEffect } from 'react';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateForDisplay, getWeekStart, getWeekEnd } from '../../../utils/dateControlUtils';

interface DatePickerProps {
	/** Текущая дата */
	value: Date;
	/** Тип представления */
	viewType: 'day' | 'week';
	/** Обработчик изменения даты */
	onChange: (date: Date) => void;
	/** Дополнительные CSS классы */
	className?: string;
	/** Состояние отключения */
	disabled?: boolean;
	/** Минимальная дата */
	minDate?: Date;
	/** Максимальная дата */
	maxDate?: Date;
	/** Локаль */
	locale?: 'ru' | 'en';
}

export const DatePicker: React.FC<DatePickerProps> = ({
	value,
	viewType,
	onChange,
	disabled = false,
	locale = 'ru',
}) => {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [displayedMonth, setDisplayedMonth] = useState(value);

	// Синхронизируем отображаемый месяц с выбранной датой
	useEffect(() => {
		setDisplayedMonth(value);
	}, [value]);

	const handleDateSelect = (date: Date) => {
		if (date) {
			if (viewType === 'week') {
				const weekStart = getWeekStart(date);
				onChange(weekStart);
			} else {
				onChange(date);
			}
			setIsCalendarOpen(false);
		}
	};

	const handleWeekRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
		if (!range) return;

		let selectedDate: Date | null = null;

		if (range?.from && range?.to) {
			const currentWeekStart = getWeekStart(value);
			const currentWeekEnd = getWeekEnd(value);

			const fromInCurrentRange =
				range.from >= currentWeekStart && range.from <= currentWeekEnd;
			const toInCurrentRange = range.to >= currentWeekStart && range.to <= currentWeekEnd;

			if (!fromInCurrentRange && toInCurrentRange) {
				selectedDate = range.from;
			} else if (fromInCurrentRange && !toInCurrentRange) {
				selectedDate = range.to;
			} else {
				selectedDate = range.to > range.from ? range.to : range.from;
			}
		} else if (range?.from) {
			selectedDate = range.from;
		} else if (range?.to) {
			selectedDate = range.to;
		}

		if (selectedDate) {
			const weekStart = getWeekStart(selectedDate);
			onChange(weekStart);
			setIsCalendarOpen(false);
		}
	};

	const displayDate = formatDateForDisplay(value, viewType, locale);
	const weekStart = getWeekStart(value);
	const weekEnd = getWeekEnd(value);

	return (
		<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						// Mobile: grow to fill available width
						'justify-start text-left font-normal w-full flex-1 px-2 h-8',
						// Desktop: fixed width
						'sm:w-[200px] sm:flex-none sm:px-3',
						!value && 'text-muted-foreground'
					)}
					disabled={disabled}
				>
					<CalendarIcon className="mr-1 sm:mr-2 h-4 w-4 shrink-0" />
					<span className="text-xs sm:text-sm whitespace-nowrap tabular-nums leading-none">
						{displayDate}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				{/* Calendar */}
				{viewType === 'week' ? (
					<Calendar
						className="border-0"
						mode="range"
						selected={{ from: weekStart, to: weekEnd }}
						onSelect={handleWeekRangeSelect}
						month={displayedMonth}
						onMonthChange={setDisplayedMonth}
						locale={ru}
						required
					/>
				) : (
					<Calendar
						className="border-0"
						mode="single"
						selected={value}
						onSelect={handleDateSelect}
						month={displayedMonth}
						onMonthChange={setDisplayedMonth}
						locale={ru}
						required
					/>
				)}

				<div className="p-3 border-b flex justify-center">
					{/* Quick actions */}
					<Button
						variant="outline"
						size="xs"
						className="w-full"
						onClick={() => {
							const today = new Date();
							onChange(today);
							setDisplayedMonth(today);
							setIsCalendarOpen(false);
						}}
						disabled={disabled}
					>
						Сегодня
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};
