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

/**
 * Конвертирует HSL цвет в формат для CSS переменных (без hsl() обертки)
 */
export const hslToCSSVariable = (hslColor: string): string => {
	// Извлекаем значения из hsl(214, 95%, 39%) -> "214 95% 39%"
	const match = hslColor.match(/hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/);
	if (match) {
		return `${match[1]} ${match[2]}% ${match[3]}%`;
	}
	return hslColor;
};

/**
 * Генератор CSS переменных для shadcn/ui темы на основе дизайн-системы
 */
export const generateShadcnThemeVariables = () => {
	return {
		light: {
			'--background': hslToCSSVariable(tokens.colors.gray[50]),
			'--foreground': hslToCSSVariable(tokens.colors.gray[900]),
			'--card': hslToCSSVariable(tokens.colors.gray[50]),
			'--card-foreground': hslToCSSVariable(tokens.colors.gray[900]),
			'--popover': hslToCSSVariable(tokens.colors.gray[50]),
			'--popover-foreground': hslToCSSVariable(tokens.colors.gray[900]),
			'--primary': hslToCSSVariable(tokens.colors.primary[500]),
			'--primary-foreground': hslToCSSVariable(tokens.colors.gray[50]),
			'--secondary': hslToCSSVariable(tokens.colors.gray[100]),
			'--secondary-foreground': hslToCSSVariable(tokens.colors.gray[900]),
			'--muted': hslToCSSVariable(tokens.colors.gray[100]),
			'--muted-foreground': hslToCSSVariable(tokens.colors.gray[500]),
			'--accent': hslToCSSVariable(tokens.colors.gray[100]),
			'--accent-foreground': hslToCSSVariable(tokens.colors.gray[900]),
			'--destructive': hslToCSSVariable(tokens.colors.error[500]),
			'--destructive-foreground': hslToCSSVariable(tokens.colors.gray[50]),
			'--border': hslToCSSVariable(tokens.colors.gray[200]),
			'--input': hslToCSSVariable(tokens.colors.gray[200]),
			'--ring': hslToCSSVariable(tokens.colors.primary[500]),
			'--radius': tokens.borderRadius.lg,
		},
		dark: {
			'--background': hslToCSSVariable(tokens.colors.gray[900]),
			'--foreground': hslToCSSVariable(tokens.colors.gray[50]),
			'--card': hslToCSSVariable(tokens.colors.gray[900]),
			'--card-foreground': hslToCSSVariable(tokens.colors.gray[50]),
			'--popover': hslToCSSVariable(tokens.colors.gray[900]),
			'--popover-foreground': hslToCSSVariable(tokens.colors.gray[50]),
			'--primary': hslToCSSVariable(tokens.colors.primary[400]),
			'--primary-foreground': hslToCSSVariable(tokens.colors.gray[900]),
			'--secondary': hslToCSSVariable(tokens.colors.gray[800]),
			'--secondary-foreground': hslToCSSVariable(tokens.colors.gray[50]),
			'--muted': hslToCSSVariable(tokens.colors.gray[800]),
			'--muted-foreground': hslToCSSVariable(tokens.colors.gray[400]),
			'--accent': hslToCSSVariable(tokens.colors.gray[800]),
			'--accent-foreground': hslToCSSVariable(tokens.colors.gray[50]),
			'--destructive': hslToCSSVariable(tokens.colors.error[600]),
			'--destructive-foreground': hslToCSSVariable(tokens.colors.gray[50]),
			'--border': hslToCSSVariable(tokens.colors.gray[800]),
			'--input': hslToCSSVariable(tokens.colors.gray[800]),
			'--ring': hslToCSSVariable(tokens.colors.primary[400]),
		},
	};
};
