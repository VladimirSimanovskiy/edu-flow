import React from "react";
import { tv } from "tailwind-variants";
import { Slot } from "@radix-ui/react-slot";

const cardHeaderStyles = tv({
	base: "flex flex-col space-y-1.5 p-6"
});

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
	asChild?: boolean;
};

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
	({ className, children, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "div";

		return (
			<Comp className={cardHeaderStyles({ className })} ref={ref} {...props}>
				{children}
			</Comp>
		);
	}
);

CardHeader.displayName = "CardHeader";
