import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';
import React from 'react';
import { tv } from 'tailwind-variants';

const formSectionHeaderButtonStyles = tv({
	slots: {
		button: 'h-full p-0',
		container: 'leading-none',
	},
});

type FormSectionHeaderButtonProps = ButtonProps;

/**
 * Кнопка для отдельной секции
 */
export const FormSectionHeaderButton = React.forwardRef<
	HTMLButtonElement,
	FormSectionHeaderButtonProps
>(({ className, children, ...props }, ref) => {
	const styles = formSectionHeaderButtonStyles();

	return (
		<Button ref={ref} className={styles.button({ class: className })} {...props}>
			{children}
		</Button>
	);
});

FormSectionHeaderButton.displayName = 'FormSectionHeaderButton';
