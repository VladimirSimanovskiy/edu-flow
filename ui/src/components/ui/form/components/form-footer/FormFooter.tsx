import React from "react";
import { tv } from "tailwind-variants";

const formFooterStyles = tv({
	base: "flex-shrink-0 gap-2 border-t border-secondary-border px-4 pb-4 pt-4 lg:px-6 lg:pb-6 lg:pt-5"
});

/**
 * Футер формы
 */
export const FormFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => {
		return (
			<div ref={ref} className={formFooterStyles({ class: className })} {...props}>
				{children}
			</div>
		);
	}
);

FormFooter.displayName = "FormFooter";