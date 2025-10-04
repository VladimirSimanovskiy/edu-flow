import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "../../../utils/cn";
import { tv } from "tailwind-variants";
import type { VariantsConfig } from "../../../lib/utils/variants";

export interface ToggleVariants {
	variant?: "default" | "outline";
	size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const toggleStyles = tv({
	base: "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-primary-fg transition-colors hover:bg-secondary-bg-hover hover:text-muted focus-visible:border-secondary-border focus-visible:shadow-focus focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=on]:bg-primary-bg-hover data-[state=on]:text-primary-fg [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	variants: {
		variant: {
			default: "bg-transparent",
			outline: "border border-secondary-border bg-secondary-bg shadow-sm data-[state=on]:border-primary-border"
		},
		size: {
			xs: "h-7 min-w-7 gap-1.5 p-1.5",
			sm: "h-8 min-w-8 px-2 py-1.5",
			md: "h-9 min-w-9 px-2.5 py-2",
			lg: "h-10 min-w-10 p-3 py-2",
			xl: "h-11 min-w-11 px-4 py-3 text-base"
		}
	} satisfies VariantsConfig<ToggleVariants>,
	defaultVariants: {
		variant: "default",
		size: "md"
	}
});

const Toggle = React.forwardRef<
	React.ElementRef<typeof TogglePrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & ToggleVariants
>(({ className, variant, size, ...props }, ref) => (
	<TogglePrimitive.Root ref={ref} className={cn(toggleStyles({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleStyles as toggleVariants };
