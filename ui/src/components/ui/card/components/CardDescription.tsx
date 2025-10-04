import React from "react";
import { tv } from "tailwind-variants";
import { Slot } from "@radix-ui/react-slot";

const cardDescriptionStyles = tv({
	base: "text-sm text-muted-foreground"
});

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
	asChild?: boolean;
};

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
	({ className, children, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "p";

		return (
			<Comp className={cardDescriptionStyles({ className })} ref={ref} {...props}>
				{children}
			</Comp>
		);
	}
);

CardDescription.displayName = "CardDescription";
