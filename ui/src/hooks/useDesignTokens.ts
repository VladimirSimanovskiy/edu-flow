import { useMemo } from 'react';
import { tokens } from '../design-system/tokens';

export const useDesignTokens = () => {
	return useMemo(
		() => ({
			// Цвета
			colors: {
				primary: tokens.colors.primary,
				success: tokens.colors.success,
				warning: tokens.colors.warning,
				error: tokens.colors.error,
				gray: tokens.colors.gray,
			},

			// Типографика
			typography: {
				fontFamily: tokens.typography.fontFamily,
				fontSize: tokens.typography.fontSize,
				fontWeight: tokens.typography.fontWeight,
				lineHeight: tokens.typography.lineHeight,
			},

			// Отступы
			spacing: tokens.spacing,

			// Радиусы
			borderRadius: tokens.borderRadius,

			// Тени
			boxShadow: tokens.boxShadow,

			// Анимации
			animation: tokens.animation,

			// Z-index
			zIndex: tokens.zIndex,

			// Утилиты для создания стилей
			createStyles: (styles: Record<string, unknown>) => styles,

			// Утилиты для создания вариантов
			createVariant: (
				baseStyles: Record<string, unknown>,
				variants: Record<string, Record<string, unknown>>
			) => {
				return (variant: string) => ({
					...baseStyles,
					...variants[variant],
				});
			},
		}),
		[]
	);
};
