import React from "react";
import { tv } from "tailwind-variants";

const formBodyStyles = tv({
	slots: {
		// Грид с 1 ячейкой задается, чтобы корректно отображался скролл
		wrapper: "grid grid-cols-1 grid-rows-1",
		content: "px-4 py-4 lg:px-6 lg:py-5"
	}
});

/**
 * Тело формы
 */
export const FormBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref) => {
		const styles = formBodyStyles();

		return (
			<div
				className={styles.content({ className })}
				{...props}
				ref={ref}
			>
				{children}
			</div>
		);
	}
);

FormBody.displayName = "FormBody";
