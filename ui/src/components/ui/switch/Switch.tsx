import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { tv } from "tailwind-variants";
import type { VariantsConfig } from "../../../lib/utils/variants";

export interface SwitchVariants {
	size?: "sm" | "md";
}

/**
 * Варианты стилей для компонента Switch
 */
const switchStyles = tv({
	slots: {
		root: [
			"peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full",
			"transition-colors",
			"focus-visible:border-tertiary-accent focus-visible:shadow-focus focus-visible:outline-none",
			"disabled:cursor-not-allowed disabled:opacity-50",
			"data-[state=checked]:bg-primary-accent data-[state=unchecked]:bg-secondary-border",
			"data-[state=checked]:hover:enabled:bg-primary-accent-hover",
			"data-[state=unchecked]:hover:enabled:bg-primary-border"
		],
		thumb: "rounded-full bg-secondary-bg shadow-base transition-transform"
	},
	variants: {
		size: {
			sm: {
				root: "h-5 w-9",
				thumb: "h-4 w-4 data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-0.5"
			},
			md: {
				root: "h-6 w-11",
				thumb: "h-5 w-5 data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5"
			}
		}
	} satisfies VariantsConfig<SwitchVariants>,
	defaultVariants: {
		size: "md"
	}
});

export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & SwitchVariants;

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
	({ className, size, ...props }, ref) => {
		const { root, thumb } = switchStyles({ size });

		return (
			<SwitchPrimitives.Root className={root({ className })} {...props} ref={ref}>
				<SwitchPrimitives.Thumb className={thumb()} />
			</SwitchPrimitives.Root>
		);
	}
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
