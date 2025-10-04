import React from 'react';
import { tv } from 'tailwind-variants';
import { Slot } from '@radix-ui/react-slot';

const cardSubTitleStyles = tv({
	base: 'mb-1 text-xs text-muted',
});

export type CardSubTitleProps = React.HTMLAttributes<HTMLParagraphElement> & {
	asChild?: boolean;
};

export const CardSubTitle = React.forwardRef<HTMLParagraphElement, CardSubTitleProps>(
	({ className, children, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'p';

		return (
			<Comp className={cardSubTitleStyles({ className })} ref={ref} {...props}>
				{children}
			</Comp>
		);
	}
);

CardSubTitle.displayName = 'CardSubTitle';
