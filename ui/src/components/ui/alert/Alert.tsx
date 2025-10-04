import * as React from "react";
import { tv } from "tailwind-variants";
import { AlertContext } from "./AlertContext";
import type { VariantsConfig } from "../../../lib/utils/variants";

export interface AlertVariants {
	/** Статус алерта */
	status?: "success" | "warning" | "error" | "info";
	/** Состояние фокуса */
	focus?: "low" | "medium" | "high";
}

const alertStyles = tv({
	base: [
		"group relative w-full items-start rounded-lg border border-secondary-border bg-secondary-bg px-4 py-3 text-sm",
		"grid grid-cols-[auto_1fr_auto] gap-y-1.5"
	],
	variants: {
		status: {
			success: "border-status-success-border bg-status-success-bg",
			warning: "border-status-warning-border bg-status-warning-bg",
			error: "border-status-error-border bg-status-error-bg",
			info: "border-status-info-border bg-status-info-bg"
		},
		focus: {
			low: "border-secondary-border bg-secondary-bg",
			medium: "border-secondary-border bg-secondary-bg",
			// Не задаем bg, чтобы не переопределять status. Определяем в compoundVariants.
			high: ""
		}
	} satisfies VariantsConfig<AlertVariants>,
	compoundVariants: [
		{
			status: undefined,
			focus: "high",
			class: "bg-status-neutral-fg"
		}
	],
	defaultVariants: {
		focus: "low"
	}
});

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & AlertVariants;

/**
 * Компонент Alert для отображения уведомлений и сообщений
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
	({ className, status, focus = "low", children, ...props }, ref) => {
		const contextValue = React.useMemo(
			() => ({
				status,
				focus
			}),
			[status, focus]
		);

		return (
			<AlertContext.Provider value={contextValue}>
				<div ref={ref} role="alert" className={alertStyles({ status, focus, className })} {...props}>
					{children}
				</div>
			</AlertContext.Provider>
		);
	}
);

Alert.displayName = "Alert";
