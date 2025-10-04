import React, { type PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
import { ButtonBase } from "../button-base/ButtonBase";
import type { ButtonBaseProps } from "../button-base/ButtonBase";
import type { VariantsConfig } from "../../../../lib/utils/variants";

type IconButtonVariants = {
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
};

const iconButtonVariants = tv({
	slots: {
		container: "aspect-square",
		icon: "h-4 w-4"
	},
	variants: {
		size: {
			xs: { container: "p-1.5", icon: "h-3 w-3" },
			sm: { container: "p-2", icon: "h-3.5 w-3.5" },
			md: { container: "p-2.5" },
			lg: { container: "p-3" },
			xl: { container: "p-3", icon: "h-5 w-5" },
			icon: { container: "p-2.5", icon: "h-4 w-4" }
		}
	} satisfies VariantsConfig<IconButtonVariants>,
	defaultVariants: {
		size: "md"
	}
});

export type IconButtonProps = ButtonBaseProps &
	IconButtonVariants & {
		icon: React.ElementType;
		iconClassName?: string;
	};

export const IconButton = React.forwardRef<HTMLButtonElement, PropsWithChildren<IconButtonProps>>(
	({ icon: Icon, size, className, iconClassName, ...props }, ref) => {
		const { container, icon: iconClass } = iconButtonVariants({ size });

		return (
			<ButtonBase className={container({ class: className })} size={size} ref={ref} {...props}>
				<Icon className={iconClass({ size, className: iconClassName })} />
			</ButtonBase>
		);
	}
);

IconButton.displayName = "IconButton";
