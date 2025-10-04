import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { tv } from 'tailwind-variants';

const featureIconStyles = tv({
	base: 'flex items-center justify-center rounded-lg',
	variants: {
		size: {
			sm: 'h-8 w-8',
			md: 'h-10 w-10',
			lg: 'h-12 w-12',
		},
		type: {
			primary: 'bg-primary text-primary-foreground',
			secondary: 'bg-secondary text-secondary-foreground',
			success: 'bg-green-100 text-green-600',
			warning: 'bg-yellow-100 text-yellow-600',
			error: 'bg-red-100 text-red-600',
		},
	},
	defaultVariants: {
		size: 'md',
		type: 'primary',
	},
});

export interface FeatureIconProps {
	/** Иконка */
	icon: LucideIcon;
	/** Размер иконки */
	size?: 'sm' | 'md' | 'lg';
	/** Тип иконки */
	type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
	/** Дополнительные классы */
	className?: string;
}

/**
 * Компонент иконки с фоном
 */
export const FeatureIcon: React.FC<FeatureIconProps> = ({ icon: Icon, size, type, className }) => {
	return (
		<div className={featureIconStyles({ size, type, className })}>
			<Icon className="h-5 w-5" />
		</div>
	);
};
