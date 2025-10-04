import React from "react";
import { tv } from "tailwind-variants";

const formStackStyles = tv({
	base: "space-y-5 lg:space-y-4"
});

/** Оболочка для группы полей формы с внутренними отступами */
export const FormStack = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => {
		return (
			<div ref={ref} className={formStackStyles({ className })} {...props}>
				{children}
			</div>
		);
	}
);

FormStack.displayName = "FormStack";
