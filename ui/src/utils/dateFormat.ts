/**
 * Форматирует дату в строку формата YYYY-MM-DD
 * @param date - дата для форматирования
 * @returns строка в формате YYYY-MM-DD
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Форматирует дату в строку для отображения пользователю
 * @param date - дата для форматирования
 * @param locale - локаль для форматирования (по умолчанию 'ru')
 * @returns отформатированная строка даты
 */
export const formatDateForDisplay = (date: Date, locale: string = 'ru'): string => {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Форматирует дату в строку для API запросов
 * @param date - дата для форматирования
 * @returns строка в формате YYYY-MM-DD
 */
export const formatDateForApi = formatDateToString;
