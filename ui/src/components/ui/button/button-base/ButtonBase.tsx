import type { VariantsConfig } from "../../../../lib/utils/variants";
import { Slot } from "@radix-ui/react-slot";
import React, { type PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

export interface ButtonBaseVariants {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "text";
	status?: "default" | "info" | "success" | "warning" | "error";
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
}

const buttonBaseStyles = tv({
	base: "inline-flex cursor-pointer select-none items-center justify-center overflow-hidden rounded-lg font-medium text-primary-fg transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			primary: "bg-primary-accent text-primary-bg shadow-base hover:bg-primary-accent-hover",
			secondary: "bg-secondary-bg-hover hover:bg-primary-bg-hover",
			outline:
				"border border-solid border-secondary-border bg-secondary-bg shadow-sm hover:border-primary-border hover:bg-secondary-bg-hover",
			ghost: "bg-transparent hover:bg-secondary-bg-hover",
			link: "bg-transparent text-muted underline hover:text-primary-fg",
			text: "bg-transparent text-muted hover:text-primary-fg"
		},
		status: {
			default: "",
			info: "text-status-info",
			success: "text-status-success",
			warning: "text-status-warning",
			error: "text-status-error"
		},
		size: {
			xs: "h-7 gap-2 px-2.5 py-1.5 text-xs",
			sm: "h-8 gap-2 px-3 py-2 text-xs",
			md: "h-9 gap-2 px-4 py-2 text-sm",
			lg: "h-10 gap-2 px-5 py-2 text-sm",
			xl: "h-11 gap-3 px-6 py-3 text-base",
			icon: "h-10 w-10"
		}
	} satisfies VariantsConfig<ButtonBaseVariants>,
	defaultVariants: {
		variant: "primary",
		size: "md",
		status: "default"
	},
	compoundVariants: [
		/*
		 * Statuses
		 */
		// Primary
		{
			variant: "primary",
			status: ["info", "success", "warning", "error"],
			class: "text-white hover:text-white"
		},
		{
			variant: "primary",
			status: "info",
			class: "bg-status-info hover:bg-status-info-hover"
		},
		{
			variant: "primary",
			status: "success",
			class: "bg-status-success hover:bg-status-success-hover"
		},
		{
			variant: "primary",
			status: "warning",
			class: "bg-status-warning hover:bg-status-warning-hover"
		},
		{
			variant: "primary",
			status: "error",
			class: "bg-status-error hover:bg-status-error-hover"
		},
		// Secondary
		{
			variant: "secondary",
			status: "info",
			class: "bg-status-info-bg hover:bg-status-info-bg-hover"
		},
		{
			variant: "secondary",
			status: "success",
			class: "bg-status-success-bg hover:bg-status-success-bg-hover"
		},
		{
			variant: "secondary",
			status: "warning",
			class: "bg-status-warning-bg hover:bg-status-warning-bg-hover"
		},
		{
			variant: "secondary",
			status: "error",
			class: "bg-status-error-bg hover:bg-status-error-bg-hover"
		},
		// Outline
		{
			variant: "outline",
			status: "info",
			class: "border-status-info-border hover:border-status-info-border hover:bg-status-info-bg"
		},
		{
			variant: "outline",
			status: "success",
			class: "border-status-success-border hover:border-status-success-border hover:bg-status-success-bg"
		},
		{
			variant: "outline",
			status: "warning",
			class: "border-status-warning-border hover:border-status-warning-border hover:bg-status-warning-bg"
		},
		{
			variant: "outline",
			status: "error",
			class: "border-status-error-border hover:border-status-error-border hover:bg-status-error-bg"
		},
		// Ghost
		{
			variant: "ghost",
			status: "info",
			class: "text-status-info hover:bg-status-info-bg"
		},
		{
			variant: "ghost",
			status: "success",
			class: "text-status-success hover:bg-status-success-bg"
		},
		{
			variant: "ghost",
			status: "warning",
			class: "text-status-warning hover:bg-status-warning-bg"
		},
		{
			variant: "ghost",
			status: "error",
			class: "text-status-error hover:bg-status-error-bg"
		},
		// Text & Link
		{
			variant: ["text", "link"],
			status: "info",
			class: "text-status-info/70 hover:text-status-info"
		},
		{
			variant: ["text", "link"],
			status: "success",
			class: "text-status-success/70 hover:text-status-success"
		},
		{
			variant: ["text", "link"],
			status: "warning",
			class: "text-status-warning/70 hover:text-status-warning"
		},
		{
			variant: ["text", "link"],
			status: "error",
			class: "text-status-error/70 hover:text-status-error"
		}
	]
});

export type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	ButtonBaseVariants & {
		asChild?: boolean;
	};

export const ButtonBase = React.forwardRef<HTMLButtonElement, PropsWithChildren<ButtonBaseProps>>(
	({ variant, size, children, status, className, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp className={buttonBaseStyles({ variant, size, status, className })} ref={ref} {...props}>
				{children}
			</Comp>
		);
	}
);

ButtonBase.displayName = "ButtonBase";

// Export buttonVariants for compatibility
export { buttonBaseStyles as buttonVariants };
