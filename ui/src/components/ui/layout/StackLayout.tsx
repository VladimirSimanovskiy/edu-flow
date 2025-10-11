import React from 'react';
import { tv } from 'tailwind-variants';
import type { VariantsConfig } from '@/lib/utils/variants';

export interface StackLayoutVariants {
	/** Направление стека */
	direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
	/** Промежутки между элементами */
	spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	/** Выравнивание элементов по главной оси */
	justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
	/** Выравнивание элементов по поперечной оси */
	align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	/** Обертка элементов */
	wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
	/** Адаптивное направление */
	responsive?: boolean;
	/** Разделители между элементами */
	dividers?: boolean;
	/** Стиль разделителей */
	dividerStyle?: 'solid' | 'dashed' | 'dotted';
}

export interface StackLayoutProps extends StackLayoutVariants {
	/** Содержимое стека */
	children: React.ReactNode;
	/** Дополнительные CSS классы */
	className?: string;
}

const stackLayoutStyles = tv({
	slots: {
		root: 'flex',
		divider: 'border-gray-200',
	},
	variants: {
		direction: {
			row: { root: 'flex-row' },
			column: { root: 'flex-col' },
			'row-reverse': { root: 'flex-row-reverse' },
			'column-reverse': { root: 'flex-col-reverse' },
		},
		spacing: {
			none: { root: 'gap-0' },
			xs: { root: 'gap-1' },
			sm: { root: 'gap-2' },
			md: { root: 'gap-4' },
			lg: { root: 'gap-6' },
			xl: { root: 'gap-8' },
			'2xl': { root: 'gap-12' },
		},
		justify: {
			start: { root: 'justify-start' },
			center: { root: 'justify-center' },
			end: { root: 'justify-end' },
			between: { root: 'justify-between' },
			around: { root: 'justify-around' },
			evenly: { root: 'justify-evenly' },
		},
		align: {
			start: { root: 'items-start' },
			center: { root: 'items-center' },
			end: { root: 'items-end' },
			stretch: { root: 'items-stretch' },
			baseline: { root: 'items-baseline' },
		},
		wrap: {
			nowrap: { root: 'flex-nowrap' },
			wrap: { root: 'flex-wrap' },
			'wrap-reverse': { root: 'flex-wrap-reverse' },
		},
		responsive: {
			true: { root: 'flex-col sm:flex-row' },
			false: { root: '' },
		},
		dividers: {
			true: { divider: '' },
			false: { divider: '' },
		},
		dividerStyle: {
			solid: { divider: 'border-solid' },
			dashed: { divider: 'border-dashed' },
			dotted: { divider: 'border-dotted' },
		},
	} satisfies VariantsConfig<StackLayoutVariants>,
	defaultVariants: {
		direction: 'column',
		spacing: 'md',
		justify: 'start',
		align: 'stretch',
		wrap: 'nowrap',
		responsive: false,
		dividers: false,
		dividerStyle: 'solid',
	},
});

/**
 * Компонент для создания гибких стеков элементов
 *
 * Обеспечивает удобное размещение элементов в ряд или колонку
 * с настройкой отступов, выравнивания и адаптивности.
 */
export const StackLayout: React.FC<StackLayoutProps> = ({
	children,
	className,
	direction = 'column',
	spacing = 'md',
	justify = 'start',
	align = 'stretch',
	wrap = 'nowrap',
	responsive = false,
	dividers = false,
	dividerStyle = 'solid',
}) => {
	const styles = stackLayoutStyles({
		direction,
		spacing,
		justify,
		align,
		wrap,
		responsive,
		dividers,
		dividerStyle,
	});

	// Если включены разделители, оборачиваем children
	const renderChildren = () => {
		if (!dividers) return children;

		const childrenArray = React.Children.toArray(children);
		const isVertical = direction === 'column' || direction === 'column-reverse';

		return childrenArray.map((child, index) => (
			<React.Fragment key={index}>
				{child}
				{index < childrenArray.length - 1 && (
					<div
						className={styles.divider() + ` ${isVertical ? 'border-t' : 'border-l'}`}
					/>
				)}
			</React.Fragment>
		));
	};

	return <div className={styles.root({ className })}>{renderChildren()}</div>;
};

export default StackLayout;
