import React from 'react';
import { tv } from 'tailwind-variants';
import type { VariantsConfig } from '@/lib/utils/variants';

export interface PageLayoutVariants {
	/** Максимальная ширина контейнера */
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
	/** Отступы контейнера */
	padding?: 'none' | 'sm' | 'md' | 'lg';
	/** Фоновый цвет страницы */
	background?: 'white' | 'gray' | 'transparent';
	/** Выравнивание контента */
	align?: 'left' | 'center' | 'right';
	/** Стиль заголовка */
	titleVariant?: 'default' | 'large' | 'compact';
}

export interface PageLayoutProps extends PageLayoutVariants {
	/** Заголовок страницы */
	title?: string;
	/** Описание страницы */
	description?: string;
	/** Дополнительные CSS классы */
	className?: string;
	/** Содержимое страницы */
	children: React.ReactNode;
	/** Дополнительные действия в заголовке */
	actions?: React.ReactNode;
	/** Показывать ли разделитель между заголовком и контентом */
	showDivider?: boolean;
	/** Breadcrumbs навигация */
	breadcrumbs?: React.ReactNode;
	/** Дополнительный контент в заголовке */
	headerExtra?: React.ReactNode;
}

const pageLayoutStyles = tv({
	slots: {
		root: 'w-full min-h-screen',
		container: 'w-full',
		title: 'font-bold text-gray-900 leading-tight',
		description: 'text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base leading-relaxed',
		header: 'mb-6 sm:mb-8',
		headerContent: 'flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4',
		headerMain: 'flex-1 min-w-0',
		headerActions: 'flex-shrink-0 flex flex-col sm:flex-row gap-2',
		divider: 'mt-4 sm:mt-6 border-b border-gray-200',
		content: 'space-y-6',
		breadcrumbs: 'mb-4',
	},
	variants: {
		background: {
			white: { root: 'bg-white' },
			gray: { root: 'bg-gray-50' },
			transparent: { root: '' },
		},
		maxWidth: {
			sm: { container: 'max-w-sm' },
			md: { container: 'max-w-md' },
			lg: { container: 'max-w-lg' },
			xl: { container: 'max-w-xl' },
			'2xl': { container: 'max-w-2xl' },
			'4xl': { container: 'max-w-4xl' },
			'6xl': { container: 'max-w-6xl' },
			'7xl': { container: 'max-w-7xl' },
			full: { container: 'max-w-full' },
		},
		padding: {
			none: { container: '' },
			sm: { container: 'p-2 sm:p-3' },
			md: { container: 'p-4 sm:p-6' },
			lg: { container: 'p-6 sm:p-8' },
		},
		align: {
			left: { container: 'mx-auto' },
			center: { container: 'mx-auto text-center' },
			right: { container: 'ml-auto' },
		},
		titleVariant: {
			default: { title: 'text-2xl sm:text-3xl' },
			large: { title: 'text-3xl sm:text-4xl' },
			compact: { title: 'text-xl sm:text-2xl' },
		},
	} satisfies VariantsConfig<PageLayoutVariants>,
	defaultVariants: {
		maxWidth: '7xl',
		padding: 'lg',
		background: 'transparent',
		align: 'left',
		titleVariant: 'default',
	},
});

/**
 * Универсальный Layout компонент для обертки контента страниц
 *
 * Обеспечивает консистентную структуру страниц с заголовком, описанием
 * и адаптивным контейнером для контента. Следует принципам популярных UI систем.
 *
 * @example
 * <PageLayout
 *   title="Управление учителями"
 *   description="Добавление и редактирование данных учителей"
 *   actions={<Button>Добавить</Button>}
 *   breadcrumbs={<Breadcrumbs />}
 * >
 *   <TeacherTable />
 * </PageLayout>
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
	title,
	description,
	className,
	children,
	actions,
	maxWidth = '7xl',
	padding = 'lg',
	showDivider = false,
	background = 'transparent',
	align = 'left',
	breadcrumbs,
	headerExtra,
	titleVariant = 'default',
}) => {
	const styles = pageLayoutStyles({ maxWidth, padding, background, align, titleVariant });

	return (
		<div className={styles.root({ className })}>
			<div className={styles.container()}>
				{/* Breadcrumbs */}
				{breadcrumbs && <div className={styles.breadcrumbs()}>{breadcrumbs}</div>}

				{/* Заголовок страницы */}
				{(title || description || actions || headerExtra) && (
					<div className={styles.header()}>
						<div className={styles.headerContent()}>
							<div className={styles.headerMain()}>
								{title && <h1 className={styles.title()}>{title}</h1>}
								{description && (
									<p className={styles.description()}>{description}</p>
								)}
								{headerExtra && <div className="mt-3">{headerExtra}</div>}
							</div>
							{actions && <div className={styles.headerActions()}>{actions}</div>}
						</div>
						{showDivider && <div className={styles.divider()} />}
					</div>
				)}

				{/* Контент страницы */}
				<div className={styles.content()}>{children}</div>
			</div>
		</div>
	);
};

export default PageLayout;
