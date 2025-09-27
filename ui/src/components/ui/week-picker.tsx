import React, { useState, useEffect } from 'react';
import { ru } from 'date-fns/locale';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { QuickDateActions } from './quick-date-actions';
import {
	formatDateForDisplay,
	navigateDate,
	getQuickActions,
	getWeekStart,
	getWeekEnd,
} from '../../utils/dateControlUtils';
import type { DateControlProps } from '../../types/dateControl';

export const WeekPicker: React.FC<DateControlProps> = ({
	value,
	onChange,
	viewType,
	className,
	disabled = false,
	minDate,
	maxDate,
	locale = 'ru',
}) => {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [displayedMonth, setDisplayedMonth] = useState(value);

	// Синхронизируем отображаемый месяц с выбранной датой
	useEffect(() => {
		setDisplayedMonth(value);
	}, [value]);

	const handlePrevious = () => {
		const newDate = navigateDate(value, 'prev', viewType);
		onChange(newDate);
	};

	const handleNext = () => {
		const newDate = navigateDate(value, 'next', viewType);
		onChange(newDate);
	};

	const handleQuickAction = (action: ReturnType<typeof getQuickActions>[0]) => {
		const newDate = action.getDate();
		onChange(newDate);
		// Обновляем отображаемый месяц на месяц новой даты
		setDisplayedMonth(newDate);
	};

	const displayDate = formatDateForDisplay(value, viewType, locale);

	// Получаем начало и конец текущей недели
	const weekStart = getWeekStart(value);
	const weekEnd = getWeekEnd(value);

	return (
		<div className={cn('flex items-center gap-1 sm:gap-2', className)}>
			{/* Previous button */}
			<Button
				variant="outline"
				size="icon"
				onClick={handlePrevious}
				disabled={disabled}
				className="h-8 w-8"
			>
				<ChevronLeftIcon className="h-4 w-4" />
			</Button>

			{/* Week display with popover */}
			<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={cn(
							'justify-start text-left font-normal min-w-[140px] px-3 h-8',
							!value && 'text-muted-foreground'
						)}
						disabled={disabled}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						<span className="text-sm">{displayDate}</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="center">
					<div className="flex flex-col">
						{/* Quick actions */}
						<div className="p-3 border-b">
							<QuickDateActions
								viewType={viewType}
								onActionSelect={handleQuickAction}
								disabled={disabled}
							/>
						</div>

						{/* Week Calendar using range mode */}
						<div className="p-3">
							<Calendar
								mode="range"
								selected={{ from: weekStart, to: weekEnd }}
								onSelect={range => {
									// Определяем, какая дата была выбрана пользователем
									let selectedDate: Date | null = null;

									if (range?.from && range?.to) {
										// Если есть и from, и to, это означает, что пользователь выбрал дату за пределами текущего диапазона
										// Нужно определить, какая из дат новая (не входит в текущий диапазон)
										const currentWeekStart = getWeekStart(value);
										const currentWeekEnd = getWeekEnd(value);

										// Проверяем, какая дата не входит в текущий диапазон
										const fromInCurrentRange =
											range.from >= currentWeekStart &&
											range.from <= currentWeekEnd;
										const toInCurrentRange =
											range.to >= currentWeekStart &&
											range.to <= currentWeekEnd;

										if (!fromInCurrentRange && toInCurrentRange) {
											// from - новая дата
											selectedDate = range.from;
										} else if (fromInCurrentRange && !toInCurrentRange) {
											// to - новая дата
											selectedDate = range.to;
										} else {
											// Если обе даты новые, выбираем более позднюю
											selectedDate =
												range.to > range.from ? range.to : range.from;
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
								}}
								initialFocus
								month={displayedMonth}
								onMonthChange={setDisplayedMonth}
								locale={locale === 'ru' ? ru : undefined}
								disabled={date => {
									if (minDate && date < minDate) return true;
									if (maxDate && date > maxDate) return true;
									return false;
								}}
								modifiersClassNames={{
									range_start:
										'bg-primary text-primary-foreground rounded-l-md font-medium',
									range_end:
										'bg-primary text-primary-foreground rounded-r-md font-medium',
									range_middle:
										'bg-primary/30 text-primary-foreground font-medium',
								}}
							/>
						</div>
					</div>
				</PopoverContent>
			</Popover>

			{/* Next button */}
			<Button
				variant="outline"
				size="icon"
				onClick={handleNext}
				disabled={disabled}
				className="h-8 w-8"
			>
				<ChevronRightIcon className="h-4 w-4" />
			</Button>
		</div>
	);
};
