import { useInputWithActions } from '../../../../hooks/useInputWithActions';
import { useMergeRefs } from '../../../../hooks/useMergeRefs';
import { Check, CircleX, Copy, Eye, EyeOff } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { InputGroup, InputGroupButton, InputGroupInput } from '../input-group/InputGroup';
import type { InputProps } from '../input/Input';

export interface SecretInputProps
	extends Omit<InputProps, 'onChange' | 'type'>,
		Omit<HTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
	/** Флаг для отображения кнопки очистки значения */
	showClearIcon?: boolean;
	/** Флаг для отображения кнопки копирования значения */
	showCopyIcon?: boolean;
	/** Колбэк на изменение значения */
	onChange?: (value: string | null) => void;
}

/**
 * Компонент для ввода секретных данных с возможностью переключения видимости текста.
 */
export const SecretInput = React.forwardRef<HTMLInputElement, SecretInputProps>(
	(
		{
			showClearIcon,
			showCopyIcon,
			value,
			defaultValue,
			onChange,
			readOnly,
			disabled,
			error,
			className,
			...props
		},
		ref
	) => {
		const [type, setType] = useState<'password' | 'text'>('password');

		const handleShowValueToggle = useCallback(() => {
			setType(prev => (prev === 'password' ? 'text' : 'password'));
		}, []);

		const inputActions = useInputWithActions({
			value,
			defaultValue,
			onChange,
			readOnly,
			disabled,
			showClearIcon,
			showCopyIcon,
		});

		const mergedRef = useMergeRefs(ref, inputActions.inputRef);

		return (
			<InputGroup className={className}>
				<InputGroupInput
					ref={mergedRef}
					type={type}
					value={value}
					defaultValue={defaultValue}
					onChange={inputActions.handleChange}
					readOnly={readOnly}
					disabled={disabled}
					error={error}
					{...props}
				/>

				{inputActions.shouldShowClearIcon && (
					<InputGroupButton
						icon={CircleX}
						onClick={inputActions.handleClear}
						type="button"
					/>
				)}

				{inputActions.shouldShowCopyIcon && (
					<InputGroupButton
						icon={inputActions.hasCopied ? Check : Copy}
						onClick={inputActions.handleCopy}
						type="button"
					/>
				)}

				<InputGroupButton
					icon={type === 'password' ? Eye : EyeOff}
					onClick={handleShowValueToggle}
				/>
			</InputGroup>
		);
	}
);

SecretInput.displayName = 'SecretInput';
