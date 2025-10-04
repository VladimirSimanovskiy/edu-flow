import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import * as React from 'react';
import { tv } from 'tailwind-variants';
import { cn } from '../../../utils/cn';

const checkboxStyles = tv({
	slots: {
		root: [
			'peer h-4 w-4 shrink-0 rounded-sm border border-primary-border shadow-sm',
			'flex items-center justify-center',
			'hover:border-muted hover:shadow-base',
			'focus-visible:border-secondary-border focus-visible:shadow-focus focus-visible:outline-none',
			'disabled:cursor-not-allowed disabled:border-secondary-border disabled:bg-primary-bg disabled:shadow-sm',
			'data-[state=checked]:border-primary-accent data-[state=checked]:bg-primary-accent data-[state=checked]:text-primary-bg',
			'data-[state=checked]:hover:border-primary-accent-hover data-[state=checked]:hover:bg-primary-accent-hover data-[state=checked]:hover:shadow-base',
			'data-[state=checked]:focus-visible:shadow-focus',
			'data-[state=checked]:disabled:border-primary-accent data-[state=checked]:disabled:bg-primary-accent data-[state=checked]:disabled:opacity-50 data-[state=checked]:disabled:shadow-sm',
			'data-[state=indeterminate]:border-primary-accent data-[state=indeterminate]:bg-primary-accent data-[state=indeterminate]:text-primary-bg',
			'data-[state=indeterminate]:hover:border-primary-accent-hover data-[state=indeterminate]:hover:bg-primary-accent-hover data-[state=indeterminate]:hover:shadow-base',
			'data-[state=indeterminate]:focus-visible:shadow-focus',
			'data-[state=indeterminate]:disabled:border-primary-accent data-[state=indeterminate]:disabled:bg-primary-accent data-[state=indeterminate]:disabled:opacity-50 data-[state=indeterminate]:disabled:shadow-sm',
		],
		icon: 'h-4 w-4',
	},
});

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
	({ className, ...props }, ref) => {
		const styles = checkboxStyles();
		return (
			<CheckboxPrimitive.Root ref={ref} className={cn(styles.root(), className)} {...props}>
				<CheckboxPrimitive.Indicator>
					{props.checked === 'indeterminate' ? (
						<Minus className={styles.icon()} />
					) : (
						<Check className={styles.icon()} />
					)}
				</CheckboxPrimitive.Indicator>
			</CheckboxPrimitive.Root>
		);
	}
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
