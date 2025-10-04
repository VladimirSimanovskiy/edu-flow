import React from "react";
import type { PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
import { ButtonBase, type ButtonBaseProps, type ButtonBaseVariants } from "../button-base/ButtonBase";
import type { VariantsConfig } from "../../../../lib/utils/variants";

type ButtonVariants = Pick<ButtonBaseVariants, "size">;

const buttonStyles = tv({
	slots: {
		container: "flex items-center justify-center gap-2 overflow-hidden",
		icon: "h-4 w-4"
	},
	variants: {
		size: {
			xs: { icon: "h-3 w-3" },
			sm: { icon: "h-3.5 w-3.5" },
			md: { icon: "h-4 w-4" },
			lg: { icon: "h-4 w-4" },
			xl: { icon: "h-5 w-5", container: "gap-3" },
			icon: { icon: "h-4 w-4" }
		}
	} satisfies VariantsConfig<ButtonVariants>,
	defaultVariants: {
		size: "md"
	}
});

export type ButtonProps = PropsWithChildren<
	ButtonBaseProps &
		ButtonVariants & {
			startIcon?: React.ElementType;
			endIcon?: React.ElementType;
			containerClassName?: string;
			iconClassName?: string;
		}
>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ startIcon: StartIcon, endIcon: EndIcon, size, children, iconClassName, containerClassName, ...props }, ref) => {
		const styles = buttonStyles({ size });

		const startIconEl = StartIcon && <StartIcon className={styles.icon({ className: iconClassName })} />;
		const endIconEl = EndIcon && <EndIcon className={styles.icon({ className: iconClassName })} />;

		return (
			<ButtonBase {...props} size={size} ref={ref}>
				<div className={styles.container({ className: containerClassName })}>
					{startIconEl}
					{children}
					{endIconEl}
				</div>
			</ButtonBase>
		);
	}
);

Button.displayName = "Button";
