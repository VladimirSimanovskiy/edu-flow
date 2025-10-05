import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { tv } from 'tailwind-variants';

const scrollAreaStyles = tv({
	slots: {
		root: 'relative overflow-hidden',
		viewport: 'h-full w-full rounded-[inherit]',
	},
});

type ScrollAreaProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
	thumbClassName?: string;
	scrollbarClassName?: string;
	orientation?: 'vertical' | 'horizontal' | 'both';
};

export const ScrollArea = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.Root>,
	ScrollAreaProps
>(
	(
		{ className, children, thumbClassName, scrollbarClassName, orientation = 'both', ...props },
		ref
	) => {
		const styles = scrollAreaStyles();

		return (
			<ScrollAreaPrimitive.Root ref={ref} className={styles.root({ className })} {...props}>
				<ScrollAreaPrimitive.Viewport className={styles.viewport()}>
					{children}
				</ScrollAreaPrimitive.Viewport>
				{(orientation === 'vertical' || orientation === 'both') && (
					<ScrollBar
						orientation="vertical"
						thumbClassName={thumbClassName}
						className={scrollbarClassName}
					/>
				)}
				{(orientation === 'horizontal' || orientation === 'both') && (
					<ScrollBar
						orientation="horizontal"
						thumbClassName={thumbClassName}
						className={scrollbarClassName}
					/>
				)}
				<ScrollAreaPrimitive.Corner />
			</ScrollAreaPrimitive.Root>
		);
	}
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const scrollBarStyles = tv({
	slots: {
		wrapper: 'flex touch-none select-none transition-colors',
		thumb: 'relative flex-1 rounded-full bg-secondary-border',
	},
	variants: {
		orientation: {
			vertical: { wrapper: 'h-full w-2.5 border-l border-l-transparent p-0.5' },
			horizontal: { wrapper: 'h-2.5 flex-col border-t border-t-transparent p-0.5' },
		},
	},
});

type ScrollBarProps = React.ComponentPropsWithoutRef<
	typeof ScrollAreaPrimitive.ScrollAreaScrollbar
> & {
	orientation?: 'vertical' | 'horizontal';
	thumbClassName?: string;
};

const ScrollBar = React.forwardRef<
	React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	ScrollBarProps
>(({ className, orientation = 'vertical', thumbClassName, ...props }, ref) => {
	const styles = scrollBarStyles();

	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			ref={ref}
			orientation={orientation}
			className={styles.wrapper({ className, orientation })}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb
				className={styles.thumb({ className: thumbClassName })}
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	);
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollBar };
