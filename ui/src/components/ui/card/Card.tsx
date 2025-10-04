import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { cardStyles } from "./styles";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
	asChild?: boolean;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
	({ className, children, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "div";
		return (
			<Comp ref={ref} className={cardStyles({ className })} {...props}>
				{children}
			</Comp>
		);
	}
);

Card.displayName = "Card";
