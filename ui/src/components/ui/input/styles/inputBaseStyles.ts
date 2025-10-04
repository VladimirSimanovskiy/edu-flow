import { tv } from "tailwind-variants";

export const inputBaseElementStyles = tv({
	base: [
		"w-full rounded-lg border border-secondary-border bg-secondary-bg px-3 py-2.5 shadow-sm outline-none transition-colors lg:py-2",
		"font-sans text-sm text-primary-fg placeholder:text-muted",
		"hover:border-primary-border hover:shadow-base",
		"focus:rounded-lg focus:border focus:border-secondary-border focus:bg-secondary-bg focus:shadow-focus"
	]
});

export const inputBaseControlStyles = tv({
	extend: inputBaseElementStyles,
	base: [
		"read-only:border-primary-border read-only:bg-primary-bg read-only:shadow-sm",
		"read-only:hover:bg-primary-bg",
		"read-only:focus:bg-primary-bg",
		"disabled:border-primary-border disabled:bg-primary-bg disabled:shadow-sm",
		"invalid:border-status-error-secondary-border invalid:shadow-base invalid:hover:border-status-error-primary-border",
		"invalid:hover:shadow-base invalid:focus:border-status-error-secondary-border invalid:focus:shadow-focus-error",
		"aria-[invalid=true]:border-status-error-secondary-border aria-[invalid=true]:shadow-base aria-[invalid=true]:hover:border-status-error-primary-border",
		"aria-[invalid=true]:hover:shadow-base aria-[invalid=true]:focus:border-status-error-secondary-border aria-[invalid=true]:focus:shadow-focus-error"
	]
});
