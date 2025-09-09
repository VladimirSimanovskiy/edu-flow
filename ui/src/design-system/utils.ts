import { tokens } from './tokens';

/**
 * Утилиты для работы с дизайн-токенами
 */

/**
 * Получить цвет из палитры
 */
export const getColor = (color: string, shade?: number): string | undefined => {
  const colorPath = color.split('.');
  let colorValue: unknown = tokens.colors;
  
  for (const segment of colorPath) {
    if (colorValue && typeof colorValue === 'object' && segment in colorValue) {
      colorValue = (colorValue as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  
  if (typeof colorValue === 'object' && colorValue !== null && shade !== undefined) {
    const shadeValue = (colorValue as Record<string, string>)[shade.toString()];
    return shadeValue;
  }
  
  return typeof colorValue === 'string' ? colorValue : undefined;
};

/**
 * Получить размер шрифта
 */
export const getFontSize = (size: keyof typeof tokens.typography.fontSize) => {
  return tokens.typography.fontSize[size];
};

/**
 * Получить отступ
 */
export const getSpacing = (size: keyof typeof tokens.spacing) => {
  return tokens.spacing[size];
};

/**
 * Получить радиус скругления
 */
export const getBorderRadius = (size: keyof typeof tokens.borderRadius) => {
  return tokens.borderRadius[size];
};

/**
 * Получить тень
 */
export const getBoxShadow = (size: keyof typeof tokens.boxShadow) => {
  return tokens.boxShadow[size];
};

/**
 * Создать CSS переменную
 */
export const createCSSVariable = (name: string, value: string) => {
  return `--${name}: ${value};`;
};

/**
 * Генератор CSS переменных для темы
 */
export const generateThemeVariables = () => {
  const variables: string[] = [];
  
  // Цвета
  Object.entries(tokens.colors.primary).forEach(([shade, value]) => {
    variables.push(createCSSVariable(`color-primary-${shade}`, value));
  });
  
  // Отступы
  Object.entries(tokens.spacing).forEach(([size, value]) => {
    variables.push(createCSSVariable(`spacing-${size}`, value));
  });
  
  // Размеры шрифтов
  Object.entries(tokens.typography.fontSize).forEach(([size, value]) => {
    variables.push(createCSSVariable(`font-size-${size}`, value));
  });
  
  return variables.join('\n');
};
