import React from 'react';
import { tv } from 'tailwind-variants';

const formDividerStyles = tv({
	base: 'mb-4 mt-4 lg:mb-3.5 lg:mt-5',
});

/**
 * Девайдер формы
 */
export const FormDivider = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
	({ className, ...props }, ref) => {
		return <hr ref={ref} className={formDividerStyles({ className })} {...props} />;
	}
);

FormDivider.displayName = 'FormDivider';
