import React from "react";
import { tv } from "tailwind-variants";
import { Slot } from "@radix-ui/react-slot";

const cardFeatureStyles = tv({
	base: "absolute bottom-3 right-3"
});

export type CardFeatureProps = React.HTMLAttributes<HTMLDivElement> & {
	asChild?: boolean;
};

export const CardFeature = React.forwardRef<HTMLDivElement, CardFeatureProps>(
	({ className, children, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "div";

		return (
			<Comp className={cardFeatureStyles({ className })} ref={ref} {...props}>
				{children}
			</Comp>
		);
	}
);

CardFeature.displayName = "CardFeature";
