import type { PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';
import React from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface BadgeVariants {
	status?: 'default' | 'info' | 'success' | 'warning' | 'error';
	focus?: 'low' | 'high';
	size?: 'sm' | 'md' | 'lg';
}

const badgeVariants = tv({
	base: 'inline-flex items-center justify-center overflow-hidden rounded-full border px-2.5 font-medium leading-none',
	slots: {
		icon: '',
	},
	variants: {
		status: {
			default: 'border-primary-border bg-status-neutral-bg text-primary-fg',
			info: 'border-status-info-border bg-status-info-bg text-status-info',
			success: 'border-status-success-border bg-status-success-bg text-status-success',
			warning: 'border-status-warning-border bg-status-warning-bg text-status-warning',
			error: 'border-status-error-secondary-border bg-status-error-bg text-status-error',
		},
		focus: {
			low: 'shadow-sm',
			high: 'border-transparent bg-status-neutral text-primary-bg shadow-base',
		},
		size: {
			sm: { base: 'h-5 gap-1 px-1.5 text-xs', icon: 'h-3 w-3' },
			md: { base: 'h-6 gap-1 px-2 text-sm', icon: 'h-3.5 w-3.5' },
			lg: { base: 'h-7 gap-1.5 text-base', icon: 'h-4 w-4' },
		},
	},
	defaultVariants: {
		status: 'default',
		focus: 'low',
		size: 'md',
	},
	compoundVariants: [
		{
			status: ['info', 'success', 'warning', 'error'],
			focus: 'high',
			class: 'text-white',
		},
		{
			status: 'info',
			focus: 'high',
			class: 'bg-status-info',
		},
		{
			status: 'success',
			focus: 'high',
			class: 'bg-status-success',
		},
		{
			status: 'warning',
			focus: 'high',
			class: 'bg-status-warning',
		},
		{
			status: 'error',
			focus: 'high',
			class: 'bg-status-error',
		},
	],
});

export type BadgeProps = React.HTMLAttributes<HTMLElement> &
	BadgeVariants & {
		asChild?: boolean;
		startIcon?: React.ElementType;
		endIcon?: React.ElementType;
	};

export const Badge = React.forwardRef<HTMLElement, PropsWithChildren<BadgeProps>>(
	(
		{
			startIcon: StartIcon,
			endIcon: EndIcon,
			className,
			children,
			status,
			size,
			focus,
			asChild = false,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'span';
		const styles = badgeVariants({ size, status, focus });

		const startIconEl = StartIcon && <StartIcon className={styles.icon()} />;
		const endIconEl = EndIcon && <EndIcon className={styles.icon()} />;

		return (
			<Comp className={styles.base({ className })} ref={ref} {...props}>
				{startIconEl}
				{children}
				{endIconEl}
			</Comp>
		);
	}
);

Badge.displayName = 'Badge';
