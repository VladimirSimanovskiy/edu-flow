import { tv } from "tailwind-variants";

export const cardStyles = tv({
	base: [
		"group/card overflow-hidden rounded-xl border border-secondary-border bg-secondary-bg text-start shadow-sm",
		"relative flex flex-col px-3 pb-3 pt-2.5 lg:px-4"
	]
});
