import React from 'react';
import { tv } from 'tailwind-variants';
import type { VariantsConfig } from '@/lib/utils/variants';

export interface ContentLayoutVariants {
	/** Максимальная ширина контента */
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
	/** Отступы */
	padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
	/** Выравнивание контента */
	align?: 'left' | 'center' | 'right';
	/** Фоновый цвет */
	background?: 'white' | 'gray' | 'transparent';
	/** Показывать ли тень */
	shadow?: boolean;
	/** Скругление углов */
	rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
	/** Граница */
	border?: boolean;
}

export interface ContentLayoutProps extends ContentLayoutVariants {
	/** Содержимое */
	children: React.ReactNode;
	/** Дополнительные CSS классы */
	className?: string;
}

const contentLayoutStyles = tv({
	slots: {
		root: 'w-full',
	},
	variants: {
		maxWidth: {
			sm: { root: 'max-w-sm' },
			md: { root: 'max-w-md' },
			lg: { root: 'max-w-lg' },
			xl: { root: 'max-w-xl' },
			'2xl': { root: 'max-w-2xl' },
			'4xl': { root: 'max-w-4xl' },
			'6xl': { root: 'max-w-6xl' },
			'7xl': { root: 'max-w-7xl' },
			full: { root: 'max-w-full' },
		},
		padding: {
			none: { root: '' },
			sm: { root: 'p-2 sm:p-3' },
			md: { root: 'p-4 sm:p-6' },
			lg: { root: 'p-6 sm:p-8' },
			xl: { root: 'p-8 sm:p-10' },
		},
		align: {
			left: { root: 'text-left' },
			center: { root: 'text-center mx-auto' },
			right: { root: 'text-right ml-auto' },
		},
		background: {
			white: { root: 'bg-white' },
			gray: { root: 'bg-gray-50' },
			transparent: { root: '' },
		},
		rounded: {
			none: { root: '' },
			sm: { root: 'rounded-sm' },
			md: { root: 'rounded-md' },
			lg: { root: 'rounded-lg' },
			xl: { root: 'rounded-xl' },
		},
		shadow: {
			true: { root: 'shadow-sm' },
			false: { root: '' },
		},
		border: {
			true: { root: 'border border-gray-200' },
			false: { root: '' },
		},
	} satisfies VariantsConfig<ContentLayoutVariants>,
	defaultVariants: {
		maxWidth: 'full',
		padding: 'md',
		align: 'left',
		background: 'transparent',
		rounded: 'none',
		shadow: false,
		border: false,
	},
});

export const ContentLayout: React.FC<ContentLayoutProps> = ({
	children,
	className,
	maxWidth = 'full',
	padding = 'md',
	align = 'left',
	background = 'transparent',
	shadow = false,
	rounded = 'none',
	border = false,
}) => {
	const styles = contentLayoutStyles({
		maxWidth,
		padding,
		align,
		background,
		shadow,
		rounded,
		border,
	});

	return <div className={styles.root({ className })}>{children}</div>;
};

export default ContentLayout;
