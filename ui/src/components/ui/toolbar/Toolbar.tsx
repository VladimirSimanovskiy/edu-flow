import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import React, { type PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';

const toolbarStyles = tv({
	slots: {
		root: 'w-full flex flex-wrap sm:flex-nowrap items-center gap-2 rounded-lg border bg-background p-1.5 shadow-sm',
		group: 'flex items-center gap-1 flex-wrap sm:flex-nowrap min-w-0',
		button: [
			'inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm',
			'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
			'disabled:opacity-50 disabled:pointer-events-none',
		],
		separator: 'hidden sm:block mx-2 h-5 w-px bg-border',
		icon: 'h-4 w-4',
		text: 'hidden sm:inline text-foreground text-sm leading-none',
	},
});

export type ToolbarProps = React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root>;

export const Toolbar = React.forwardRef<
	React.ElementRef<typeof ToolbarPrimitive.Root>,
	ToolbarProps
>(({ className, ...props }, ref) => {
	const styles = toolbarStyles();
	return <ToolbarPrimitive.Root ref={ref} className={styles.root({ className })} {...props} />;
});
Toolbar.displayName = 'Toolbar';

export type ToolbarGroupProps = React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root>;
export const ToolbarGroup: React.FC<PropsWithChildren<{ className?: string }>> = ({
	className,
	children,
}) => {
	const styles = toolbarStyles();
	return <div className={styles.group({ className })}>{children}</div>;
};

export type ToolbarButtonProps = React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button>;
export const ToolbarButton = React.forwardRef<
	React.ElementRef<typeof ToolbarPrimitive.Button>,
	ToolbarButtonProps
>(({ className, ...props }, ref) => {
	const styles = toolbarStyles();
	return (
		<ToolbarPrimitive.Button ref={ref} className={styles.button({ className })} {...props} />
	);
});
ToolbarButton.displayName = 'ToolbarButton';

export type ToolbarSeparatorProps = React.ComponentPropsWithoutRef<
	typeof ToolbarPrimitive.Separator
>;
export const ToolbarSeparator = React.forwardRef<
	React.ElementRef<typeof ToolbarPrimitive.Separator>,
	ToolbarSeparatorProps
>(({ className, ...props }, ref) => {
	const styles = toolbarStyles();
	return (
		<ToolbarPrimitive.Separator
			ref={ref}
			className={styles.separator({ className })}
			{...props}
		/>
	);
});
ToolbarSeparator.displayName = 'ToolbarSeparator';

export const ToolbarText: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
	className,
	...props
}) => {
	const styles = toolbarStyles();
	return <span className={styles.text({ className })} {...props} />;
};
