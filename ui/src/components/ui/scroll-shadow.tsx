import React from 'react';
import { cn } from '@/utils/cn';

interface ScrollShadowProps {
	position: 'left' | 'right' | 'top' | 'bottom';
	visible: boolean;
	className?: string;
	style?: React.CSSProperties;
}

export const ScrollShadow: React.FC<ScrollShadowProps> = ({
	position,
	visible,
	className,
	style,
}) => {
	const base = 'pointer-events-none absolute z-50 transition-opacity duration-150';
	const byPos: Record<string, string> = {
		left: 'top-0 left-0 h-full w-2 bg-gradient-to-r from-black/10 to-transparent',
		right: 'top-0 right-0 h-full w-2 bg-gradient-to-l from-black/10 to-transparent',
		top: 'top-0 left-0 w-full h-2 bg-gradient-to-b from-black/10 to-transparent',
		bottom: 'bottom-0 left-0 w-full h-2 bg-gradient-to-t from-black/10 to-transparent',
	};

	return (
		<div
			className={cn(base, byPos[position], visible ? 'opacity-100' : 'opacity-0', className)}
			style={style}
		/>
	);
};

export default ScrollShadow;
