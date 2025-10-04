import React from "react";
import { tv } from "tailwind-variants";
import { Slot } from "@radix-ui/react-slot";

const cardFooterStyles = tv({
	base: "mt-auto pt-2.5"
});

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement> & {
	asChild?: boolean;
};

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
	({ className, children, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "div";

		return (
			<Comp className={cardFooterStyles({ className })} ref={ref} {...props}>
				{children}
			</Comp>
		);
	}
);

CardFooter.displayName = "CardFooter";
