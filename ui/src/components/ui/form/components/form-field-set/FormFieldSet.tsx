import React from "react";
import { tv } from "tailwind-variants";
import { FormStack } from "../form-stack/FormStack";

const formFieldSetStyles = tv({
	base: "rounded-xl border border-secondary-border p-4 lg:p-6"
});

/** Оболочка для группы полей формы с рамкой и внутренними отступами */
export const FormFieldSet = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => {
		return (
			<FormStack ref={ref} className={formFieldSetStyles({ className })} {...props}>
				{children}
			</FormStack>
		);
	}
);

FormFieldSet.displayName = "FormFieldSet";
