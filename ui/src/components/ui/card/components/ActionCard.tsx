import { Slot } from "@radix-ui/react-slot";
import React, { useCallback } from "react";
import { tv } from "tailwind-variants";
import { cardStyles } from "../styles";

const actionCardStyles = tv({
	extend: cardStyles,
	base: [
		"cursor-pointer hover:border-primary-border hover:bg-secondary-bg-hover hover:shadow-base",
		"focus-visible:border-secondary-border focus-visible:bg-secondary-bg focus-visible:shadow-focus"
	]
});

export type ActionCardProps = React.HTMLAttributes<HTMLDivElement> & {
	asChild?: boolean;
};

export const ActionCard = React.forwardRef<HTMLDivElement, ActionCardProps>(
	({ className, children, asChild = false, onClick, ...props }, ref) => {
		const Comp = asChild ? Slot : "div";

		const handleKeyDown = useCallback(
			(event: React.KeyboardEvent<HTMLDivElement>) => {
				if (onClick && (event.key === "Enter" || event.key === " ") && event.target === event.currentTarget) {
					event.preventDefault();
					onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
				}
			},
			[onClick]
		);

		return (
			<Comp
				ref={ref}
				className={actionCardStyles({ className })}
				onClick={onClick}
				onKeyDown={handleKeyDown}
				tabIndex={0}
				role="button"
				{...props}
			>
				{children}
			</Comp>
		);
	}
);

ActionCard.displayName = "ActionCard";
