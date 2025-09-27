import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Утилита для создания условных классов
export function conditionalClass(
	condition: boolean,
	trueClass: string,
	falseClass?: string
): string {
	return condition ? trueClass : falseClass || '';
}

// Утилита для создания классов с вариантами
export function variantClass(
	baseClass: string,
	variant: string,
	variants: Record<string, string>
): string {
	return cn(baseClass, variants[variant]);
}

// Утилита для создания классов с размерами
export function sizeClass(baseClass: string, size: string, sizes: Record<string, string>): string {
	return cn(baseClass, sizes[size]);
}
