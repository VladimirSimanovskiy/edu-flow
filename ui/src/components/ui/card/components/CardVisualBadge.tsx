import React from "react";
import { tv } from "tailwind-variants";
import { Slot } from "@radix-ui/react-slot";

const cardVisualBadgeStyles = tv({
	base: "absolute -bottom-0.5 -right-0.5 flex h-[62px] w-[62px] items-center justify-center overflow-hidden rounded-tl-lg"
});

export type CardVisualBadgeProps = React.HTMLAttributes<HTMLDivElement> & {
	asChild?: boolean;
};

export const CardVisualBadge = React.forwardRef<HTMLDivElement, CardVisualBadgeProps>(
	({ className, children, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "div";

		return (
			<Comp className={cardVisualBadgeStyles({ className })} ref={ref} {...props}>
				{children}
			</Comp>
		);
	}
);

CardVisualBadge.displayName = "CardVisualBadge";
