/**
 * Типы для контрола выбора даты
 * Следует принципу Single Responsibility - только типы для date control
 */

export interface DateControlProps {
  /** Текущая выбранная дата */
  value: Date;
  /** Обработчик изменения даты */
  onChange: (date: Date) => void;
  /** Тип представления (день/неделя) */
  viewType: 'day' | 'week';
  /** Дополнительные CSS классы */
  className?: string;
  /** Состояние отключения */
  disabled?: boolean;
  /** Минимальная дата для выбора */
  minDate?: Date;
  /** Максимальная дата для выбора */
  maxDate?: Date;
  /** Локаль для форматирования */
  locale?: string;
}

export interface CalendarProps {
  /** Текущая выбранная дата */
  selectedDate: Date;
  /** Обработчик выбора даты */
  onDateSelect: (date: Date) => void;
  /** Обработчик закрытия календаря */
  onClose: () => void;
  /** Минимальная дата */
  minDate?: Date;
  /** Максимальная дата */
  maxDate?: Date;
  /** Локаль */
  locale?: string;
}

export interface QuickAction {
  /** Уникальный идентификатор действия */
  id: string;
  /** Отображаемое название */
  label: string;
  /** Функция для получения даты */
  getDate: () => Date;
  /** Доступность действия */
  enabled?: boolean;
}

export interface DateNavigationProps {
  /** Текущая дата */
  currentDate: Date;
  /** Тип представления */
  viewType: 'day' | 'week';
  /** Обработчик навигации */
  onNavigate: (date: Date) => void;
  /** Состояние отключения */
  disabled?: boolean;
}

export interface DateDisplayProps {
  /** Дата для отображения */
  date: Date;
  /** Тип представления */
  viewType: 'day' | 'week';
  /** Обработчик клика для открытия календаря */
  onClick?: () => void;
  /** Состояние отключения */
  disabled?: boolean;
  /** Локаль */
  locale?: string;
}
