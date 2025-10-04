import { tv } from "tailwind-variants";
import React from "react";
import { useAlert } from "../AlertContext";
import type { VariantsConfig } from "../../../../lib/utils/variants";
import type { AlertVariants } from "../Alert";

const alertDescriptionStyles = tv({
	base: "col-start-2 text-sm text-muted",
	variants: {
		status: {
			success: "text-status-success",
			warning: "text-status-warning",
			error: "text-status-error",
			info: "text-status-info"
		},
		focus: {
			low: "text-muted",
			medium: "",
			high: ""
		}
	} satisfies VariantsConfig<AlertVariants>,
	defaultVariants: {
		focus: "low"
	}
});

export type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & AlertVariants;

/**
 * Компонент AlertDescription для отображения описания алерта
 */
export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
	({ className, focus: focusProp, status: statusProp, ...props }, ref) => {
		const { status, focus } = useAlert({ status: statusProp, focus: focusProp });

		return <div ref={ref} className={alertDescriptionStyles({ className, focus, status })} {...props} />;
	}
);

AlertDescription.displayName = "AlertDescription";
