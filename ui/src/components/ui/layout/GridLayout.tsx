import React from 'react';
import { tv } from 'tailwind-variants';
import type { VariantsConfig } from '@/lib/utils/variants';

export interface GridLayoutVariants {
	/** Промежутки между элементами */
	gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
	/** Выравнивание элементов по вертикали */
	align?: 'start' | 'center' | 'end' | 'stretch';
	/** Выравнивание элементов по горизонтали */
	justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

export interface GridLayoutProps extends GridLayoutVariants {
	/** Содержимое сетки */
	children: React.ReactNode;
	/** Дополнительные CSS классы */
	className?: string;
	/** Количество колонок (responsive: mobile, tablet, desktop) */
	cols?: number | { mobile?: number; tablet?: number; desktop?: number };
	/** Автоматическое заполнение строк */
	autoFit?: boolean;
	/** Минимальная ширина элементов при autoFit */
	minItemWidth?: string;
}

const gridLayoutStyles = tv({
	slots: {
		root: 'grid',
	},
	variants: {
		gap: {
			none: { root: 'gap-0' },
			sm: { root: 'gap-2' },
			md: { root: 'gap-4' },
			lg: { root: 'gap-6' },
			xl: { root: 'gap-8' },
		},
		align: {
			start: { root: 'items-start' },
			center: { root: 'items-center' },
			end: { root: 'items-end' },
			stretch: { root: 'items-stretch' },
		},
		justify: {
			start: { root: 'justify-start' },
			center: { root: 'justify-center' },
			end: { root: 'justify-end' },
			between: { root: 'justify-between' },
			around: { root: 'justify-around' },
			evenly: { root: 'justify-evenly' },
		},
	} satisfies VariantsConfig<GridLayoutVariants>,
	defaultVariants: {
		gap: 'md',
		align: 'stretch',
		justify: 'start',
	},
});

/**
 * Компонент для создания адаптивной сетки
 *
 * Обеспечивает гибкую сетку с настройкой количества колонок
 * для разных размеров экрана и различных вариантов выравнивания.
 *
 * @example
 * // Простое использование
 * <GridLayout cols={3}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </GridLayout>
 *
 * // Responsive сетка
 * <GridLayout cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </GridLayout>
 */
export const GridLayout: React.FC<GridLayoutProps> = ({
	children,
	className,
	cols = 1,
	gap = 'md',
	align = 'stretch',
	justify = 'start',
	autoFit = false,
	minItemWidth = '250px',
}) => {
	const styles = gridLayoutStyles({ gap, align, justify });

	// Генерация CSS Grid стилей
	const getGridStyles = (): React.CSSProperties => {
		if (autoFit) {
			return {
				gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
			};
		}

		if (typeof cols === 'number') {
			return {
				gridTemplateColumns: `repeat(${cols}, 1fr)`,
			};
		}

		// Responsive объект
		const { mobile = 1, tablet = 2, desktop = 3 } = cols;
		return {
			gridTemplateColumns: `repeat(${mobile}, 1fr)`,
			'@media (min-width: 640px)': {
				gridTemplateColumns: `repeat(${tablet}, 1fr)`,
			},
			'@media (min-width: 1024px)': {
				gridTemplateColumns: `repeat(${desktop}, 1fr)`,
			},
		} as React.CSSProperties;
	};

	return (
		<div className={styles.root({ className })} style={getGridStyles()}>
			{children}
		</div>
	);
};

export default GridLayout;
