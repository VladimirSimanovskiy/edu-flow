import { tv } from 'tailwind-variants';
import type { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';
import type { VariantsConfig } from '@/lib/utils/variants';

export interface IconVariants {
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

const iconVariants = tv({
	base: 'h-4 w-4',
	variants: {
		size: {
			sm: 'h-3 w-3',
			md: 'h-4 w-4',
			lg: 'h-5 w-5',
			xl: 'h-6 w-6',
		},
	} satisfies VariantsConfig<IconVariants>,
	defaultVariants: {
		size: 'md',
	},
});

export type IconProps = IconVariants & {
	icon: LucideIcon;
	className?: string;
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(({ icon: Icon, className, size }, ref) => {
	return <Icon ref={ref} className={iconVariants({ size, className })} />;
});

Icon.displayName = 'Icon';
