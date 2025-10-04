import React from 'react';
import { Label } from '../Label';
import { tv } from 'tailwind-variants';
import { Icon } from '@/components/ui/icon';
import type { LucideIcon } from 'lucide-react';
import { IconTooltip } from '@/components/ui/icon-tooltip';
import { RequiredIcon } from './components/RequiredIcon';

const fieldLabelVariants = tv({
	slots: {
		base: 'flex h-4 min-w-0 items-center gap-x-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		requiredMark: 'h-2 w-2 self-start',
		icon: 'ml-1 text-muted',
		labelWrapper: 'truncate',
	},
});

interface FieldLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
	className?: string;
	required?: boolean;
	icon?: LucideIcon;
	tooltip?: string;
}

export const FieldLabel = React.forwardRef<React.ElementRef<typeof Label>, FieldLabelProps>(
	({ className, children, htmlFor, icon, tooltip, required, ...props }, ref) => {
		const { base, requiredMark, labelWrapper, icon: iconStyles } = fieldLabelVariants();

		return (
			<Label ref={ref} className={base({ className })} htmlFor={htmlFor} {...props}>
				<span className={labelWrapper()}>{children}</span>
				{required && <RequiredIcon className={requiredMark()} />}
				{icon &&
					(tooltip ? (
						<IconTooltip
							content={tooltip}
							iconSize="sm"
							icon={icon}
							className={iconStyles()}
						/>
					) : (
						<Icon size="sm" icon={icon} className={iconStyles()} />
					))}
			</Label>
		);
	}
);

FieldLabel.displayName = 'FieldLabel';
