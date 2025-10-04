import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon/Icon';

interface IconTooltipProps {
	icon: LucideIcon;
	content: string;
	iconSize?: 'sm' | 'md' | 'lg';
	className?: string;
}

export const IconTooltip: React.FC<IconTooltipProps> = ({ 
	icon, 
	content, 
	iconSize = 'sm', 
	className 
}) => {
	return (
		<div className={cn('group relative', className)}>
			<Icon icon={icon} size={iconSize} />
			<div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
				{content}
			</div>
		</div>
	);
};
