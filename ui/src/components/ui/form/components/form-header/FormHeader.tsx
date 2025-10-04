import React from "react";
import { tv } from "tailwind-variants";

const formHeaderStyles = tv({
	base: "relative flex-shrink-0 border-b border-secondary-border px-4 pb-4 pt-4 lg:px-6 lg:pb-5 lg:pt-6"
});

/**
 * Заголовок формы
 */
export const FormHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => {
		return (
			<>
				<div ref={ref} className={formHeaderStyles({ class: className })} {...props}>
					{children}
				</div>
			</>
		);
	}
);

FormHeader.displayName = "FormHeader";

export const formTitleStyles = tv({
	base: "font-sans text-xl font-semibold tracking-tight text-primary-fg"
});

/**
 * Заголовок поля
 */
export const FormTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
	({ className, ...props }, ref) => {
		return <h2 ref={ref} className={formTitleStyles({ class: className })} {...props} />;
	}
);

FormTitle.displayName = "FormTitle";

export const formDescriptionStyles = tv({
	base: "font-sans text-sm font-normal tracking-tight text-muted"
});

/**
 * Описание поля
 */
export const FormDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		return <div ref={ref} className={formDescriptionStyles({ class: className })} {...props} />;
	}
);

FormDescription.displayName = "FormDescription";