import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { tv } from 'tailwind-variants';
import { Button } from '@/components/ui/button';
import type { VariantsConfig } from '@/lib/utils/variants';

export interface BreadcrumbItem {
	/** Текст элемента */
	label: string;
	/** Ссылка элемента */
	href?: string;
	/** Иконка элемента */
	icon?: React.ReactNode;
	/** Активный элемент */
	active?: boolean;
	/** Обработчик клика */
	onClick?: () => void;
}

export interface BreadcrumbsVariants {
	/** Размер хлебных крошек */
	size?: 'sm' | 'md' | 'lg';
}

export interface BreadcrumbsProps extends BreadcrumbsVariants {
	/** Элементы хлебных крошек */
	items: BreadcrumbItem[];
	/** Дополнительные CSS классы */
	className?: string;
	/** Показывать ли домашнюю иконку */
	showHome?: boolean;
	/** Ссылка на главную страницу */
	homeHref?: string;
	/** Обработчик клика по главной странице */
	onHomeClick?: () => void;
	/** Разделитель между элементами */
	separator?: React.ReactNode;
	/** Максимальное количество видимых элементов */
	maxItems?: number;
}

const breadcrumbsStyles = tv({
	slots: {
		root: 'flex items-center space-x-1',
		homeButton: 'p-1 h-auto',
		separator: 'flex items-center',
		list: 'flex items-center space-x-1',
		item: 'flex items-center',
		link: 'h-auto px-1 py-0.5 text-gray-600 hover:text-gray-900',
		text: 'px-1 py-0.5 text-gray-500',
		active: 'text-gray-900 font-medium',
	},
	variants: {
		size: {
			sm: {
				homeButton: 'text-xs',
				link: 'text-xs',
				text: 'text-xs',
			},
			md: {
				homeButton: 'text-sm',
				link: 'text-sm',
				text: 'text-sm',
			},
			lg: {
				homeButton: 'text-base',
				link: 'text-base',
				text: 'text-base',
			},
		},
	} satisfies VariantsConfig<BreadcrumbsVariants>,
	defaultVariants: {
		size: 'md',
	},
});

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
	items,
	className,
	showHome = true,
	onHomeClick,
	size = 'md',
	separator,
	maxItems,
}) => {
	const styles = breadcrumbsStyles({ size });

	const defaultSeparator = <ChevronRight className="h-4 w-4 text-gray-400" />;

	// Обработка максимального количества элементов
	const getDisplayItems = () => {
		if (!maxItems || items.length <= maxItems) {
			return items;
		}

		const firstItem = items[0];
		const lastItems = items.slice(-(maxItems - 2));

		return [firstItem, { label: '...', href: undefined, active: false }, ...lastItems];
	};

	const displayItems = getDisplayItems();

	return (
		<nav className={styles.root({ className })} aria-label="Breadcrumb">
			{/* Домашняя иконка */}
			{showHome && (
				<>
					<Button
						variant="ghost"
						size="sm"
						className={styles.homeButton()}
						onClick={onHomeClick}
					>
						<Home className="h-4 w-4" />
						<span className="sr-only">Главная</span>
					</Button>
					{displayItems.length > 0 && (
						<div className={styles.separator()}>{separator || defaultSeparator}</div>
					)}
				</>
			)}

			{/* Элементы хлебных крошек */}
			<ol className={styles.list()}>
				{displayItems.map((item, index) => (
					<li key={index} className={styles.item()}>
						{item.href || item.onClick ? (
							<Button
								variant="ghost"
								size="sm"
								className={
									styles.link() + (item.active ? ` ${styles.active()}` : '')
								}
								onClick={item.onClick}
							>
								{item.icon && <span className="mr-1">{item.icon}</span>}
								{item.label}
							</Button>
						) : (
							<span
								className={
									styles.text() + (item.active ? ` ${styles.active()}` : '')
								}
							>
								{item.icon && <span className="mr-1">{item.icon}</span>}
								{item.label}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
};

export default Breadcrumbs;
