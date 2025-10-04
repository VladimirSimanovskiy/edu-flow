import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { tv } from "tailwind-variants";

const cardTitleStyles = tv({
	base: "mb-1 mr-4 text-base font-medium text-secondary-fg"
});

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
	asChild?: boolean;
};

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
	({ className, children, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "h3";
		return (
			<Comp className={cardTitleStyles({ className })} ref={ref} {...props}>
				{children}
			</Comp>
		);
	}
);

CardTitle.displayName = "CardTitle";
