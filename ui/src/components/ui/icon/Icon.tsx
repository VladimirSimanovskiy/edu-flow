import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IconProps {
	icon: LucideIcon;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const sizeClasses = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
};

export const Icon: React.FC<IconProps> = ({ icon: IconComponent, size = 'md', className }) => {
	return <IconComponent className={cn(sizeClasses[size], className)} />;
};
