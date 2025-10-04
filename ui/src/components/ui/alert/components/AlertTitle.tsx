import React from "react";
import { tv } from "tailwind-variants";
import { Slot } from "@radix-ui/react-slot";
import { useAlert } from "../AlertContext";
import type { VariantsConfig } from "../../../../lib/utils/variants";
import type { AlertVariants } from "../Alert";

const alertTitleStyles = tv({
	base: "col-start-2 line-clamp-1 min-h-4 text-sm font-medium tracking-tight text-primary-fg",
	variants: {
		status: {
			success: "text-status-success",
			warning: "text-status-warning",
			error: "text-status-error",
			info: "text-status-info"
		},
		focus: {
			low: "text-primary-fg",
			medium: "",
			high: ""
		}
	} satisfies VariantsConfig<AlertVariants>,
	defaultVariants: {
		focus: "low"
	}
});

export type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement> &
	AlertVariants & {
		asChild?: boolean;
	};

/**
 * Компонент AlertTitle для отображения заголовка алерта
 */
export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
	({ className, status: statusProp, focus: focusProp, asChild = false, ...props }, ref) => {
		const { status, focus } = useAlert({ status: statusProp, focus: focusProp });

		const Comp = asChild ? Slot : "h5";
		return <Comp ref={ref} className={alertTitleStyles({ status, className, focus })} {...props} />;
	}
);

AlertTitle.displayName = "AlertTitle";
