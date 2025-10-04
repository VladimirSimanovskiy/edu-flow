import React from "react";
import { tv } from "tailwind-variants";

const shortcutStyles = tv({
	base: "inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground",
	variants: {
		variant: {
			ghost: "border-transparent bg-transparent",
			default: ""
		}
	},
	defaultVariants: {
		variant: "default"
	}
});

export interface ShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: "ghost" | "default";
}

export const Shortcut = React.forwardRef<HTMLSpanElement, ShortcutProps>(
	({ className, variant, ...props }, ref) => (
		<span ref={ref} className={shortcutStyles({ className, variant })} {...props} />
	)
);

Shortcut.displayName = "Shortcut";
