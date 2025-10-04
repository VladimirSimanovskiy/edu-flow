import React from 'react';
import { tv } from 'tailwind-variants';
import { Slot } from '@radix-ui/react-slot';

const cardContentStyles = tv({
	base: 'p-6 pt-0',
});

export type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
	asChild?: boolean;
};

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
	({ className, children, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'div';

		return (
			<Comp className={cardContentStyles({ className })} ref={ref} {...props}>
				{children}
			</Comp>
		);
	}
);

CardContent.displayName = 'CardContent';
