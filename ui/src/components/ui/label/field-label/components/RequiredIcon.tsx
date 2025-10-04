import React from 'react';
import { cn } from '@/lib/utils';

interface RequiredIconProps {
	className?: string;
}

export const RequiredIcon: React.FC<RequiredIconProps> = ({ className }) => {
	return (
		<span
			className={cn('inline-block w-2 h-2 bg-red-500 rounded-full', className)}
			aria-label="Обязательное поле"
		/>
	);
};
