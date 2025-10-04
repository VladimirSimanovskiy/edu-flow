import React from 'react';
import { tv } from 'tailwind-variants';

const descriptionStyles = tv({
	base: 'text-sm text-muted',
});

type DescriptionProps = React.HTMLAttributes<HTMLDivElement> & React.PropsWithChildren;

export const Description = React.forwardRef<HTMLDivElement, DescriptionProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div ref={ref} className={descriptionStyles({ class: className })} {...props}>
				{children}
			</div>
		);
	}
);

Description.displayName = 'Description';
