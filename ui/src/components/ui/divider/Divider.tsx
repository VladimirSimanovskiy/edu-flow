import React from 'react';
import { tv } from 'tailwind-variants';

export interface DividerVariants {
	orientation?: 'horizontal' | 'vertical';
	status?: 'error';
}

const dividerVariants = tv({
	variants: {
		orientation: {
			horizontal: 'h-px w-full bg-secondary-border',
			vertical: 'h-full w-px bg-secondary-border',
		},
		status: {
			error: 'bg-status-error-border',
		},
	},
	defaultVariants: {
		orientation: 'horizontal',
	},
});

export type DividerProps = DividerVariants & React.HTMLAttributes<HTMLDivElement>;

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
	({ className, status, orientation, ...props }, ref) => {
		return <div className={dividerVariants({ orientation, className, status })} ref={ref} {...props} />;
	}
);

Divider.displayName = 'Divider';


