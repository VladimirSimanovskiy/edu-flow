import React from 'react';
import { tv } from 'tailwind-variants';
import { useAlert } from '../AlertContext';
import { Button } from '../../button';
import type { ButtonProps } from '../../button';
import type { AlertVariants } from '../Alert';

const alertButtonStyles = tv({
	base: 'col-start-3 ml-3 h-3 self-end px-0 py-0.5 text-xs',
});

export type AlertButtonProps = Omit<ButtonProps, 'status'> & Pick<AlertVariants, 'status'>;

/**
 * Компонент AlertButton для отображения кнопки алерта
 */
export const AlertButton = React.forwardRef<HTMLButtonElement, AlertButtonProps>(
	({ className, status: statusProp, ...props }, ref) => {
		const { status } = useAlert({ status: statusProp });

		return (
			<Button
				ref={ref}
				status={status}
				variant="link"
				className={alertButtonStyles({ className })}
				{...props}
			/>
		);
	}
);

AlertButton.displayName = 'AlertButton';
