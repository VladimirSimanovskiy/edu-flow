import React from 'react';
import { tv } from 'tailwind-variants';
import type { VariantsConfig } from '@/lib/utils/variants';

export interface SectionLayoutVariants {
	/** Отступы секции */
	padding?: 'none' | 'sm' | 'md' | 'lg';
	/** Фоновый цвет секции */
	background?: 'white' | 'gray' | 'transparent';
	/** Скругление углов */
	rounded?: 'none' | 'sm' | 'md' | 'lg';
	/** Тень */
	shadow?: boolean;
	/** Граница */
	border?: boolean;
	/** Размер заголовка */
	titleSize?: 'sm' | 'md' | 'lg';
}

export interface SectionLayoutProps extends SectionLayoutVariants {
	/** Содержимое секции */
	children: React.ReactNode;
	/** Заголовок секции */
	title?: string;
	/** Описание секции */
	description?: string;
	/** Дополнительные CSS классы */
	className?: string;
	/** Дополнительные действия в заголовке секции */
	actions?: React.ReactNode;
	/** Показывать ли разделитель */
	divider?: boolean;
}

const sectionLayoutStyles = tv({
	slots: {
		root: 'w-full',
		header: 'mb-4 sm:mb-6',
		headerContent: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
		headerMain: 'flex-1 min-w-0',
		headerActions: 'flex-shrink-0',
		title: 'text-gray-900 leading-tight',
		description: 'text-gray-600 mt-1 text-sm sm:text-base',
		divider: 'mt-3 sm:mt-4 border-b border-gray-200',
		content: 'space-y-4',
	},
	variants: {
		padding: {
			none: { root: '' },
			sm: { root: 'p-3 sm:p-4' },
			md: { root: 'p-4 sm:p-6' },
			lg: { root: 'p-6 sm:p-8' },
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
		},
		shadow: {
			true: { root: 'shadow-sm' },
			false: { root: '' },
		},
		border: {
			true: { root: 'border border-gray-200' },
			false: { root: '' },
		},
		titleSize: {
			sm: { title: 'text-lg font-semibold' },
			md: { title: 'text-xl font-semibold' },
			lg: { title: 'text-2xl font-bold' },
		},
	} satisfies VariantsConfig<SectionLayoutVariants>,
	defaultVariants: {
		padding: 'md',
		background: 'transparent',
		rounded: 'none',
		shadow: false,
		border: false,
		titleSize: 'md',
	},
});

/**
 * Компонент для создания секций с заголовком и контентом
 *
 * Используется для группировки связанного контента на странице
 * с возможностью добавления заголовка, описания и действий.
 */
export const SectionLayout: React.FC<SectionLayoutProps> = ({
	children,
	title,
	description,
	className,
	actions,
	padding = 'md',
	background = 'transparent',
	divider = false,
	rounded = 'none',
	shadow = false,
	border = false,
	titleSize = 'md',
}) => {
	const styles = sectionLayoutStyles({
		padding,
		background,
		rounded,
		shadow,
		border,
		titleSize,
	});

	return (
		<section className={styles.root({ className })}>
			{/* Заголовок секции */}
			{(title || description || actions) && (
				<div className={styles.header()}>
					<div className={styles.headerContent()}>
						<div className={styles.headerMain()}>
							{title && <h2 className={styles.title()}>{title}</h2>}
							{description && <p className={styles.description()}>{description}</p>}
						</div>
						{actions && <div className={styles.headerActions()}>{actions}</div>}
					</div>
					{divider && <div className={styles.divider()} />}
				</div>
			)}

			{/* Контент секции */}
			<div className={styles.content()}>{children}</div>
		</section>
	);
};

export default SectionLayout;
