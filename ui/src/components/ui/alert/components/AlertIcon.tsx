import React from "react";
import { tv } from "tailwind-variants";
import { useAlert } from "../AlertContext";
import type { AlertVariants } from "../Alert";
import type { VariantsConfig } from "../../../../lib/utils/variants";

type AlertIconVariants = Omit<AlertVariants, "focus">;

const alertIconStyles = tv({
	base: "text-status-default mr-3 translate-y-0.5",
	variants: {
		status: {
			success: "text-status-success-hover",
			warning: "text-status-warning-hover",
			error: "text-status-error-hover",
			info: "text-status-info-hover"
		}
	} satisfies VariantsConfig<AlertIconVariants>
});

export type AlertIconProps = React.SVGProps<SVGSVGElement> & AlertIconVariants & {
	children?: React.ReactNode;
};

/**
 * Компонент AlertIcon для отображения иконки алерта
 */
export const AlertIcon = React.forwardRef<SVGSVGElement, AlertIconProps>(
	({ className, status: statusProp, children, ...props }, ref) => {
		const { status } = useAlert({ status: statusProp });

		return (
			<svg
				ref={ref}
				className={alertIconStyles({ status, className })}
				{...props}
			>
				{children}
			</svg>
		);
	}
);

AlertIcon.displayName = "AlertIcon";
