import React from 'react';
import type { HTMLAttributes } from 'react';
import { useMergeRefs } from '../../../../hooks/useMergeRefs';
import { useInputWithActions } from '../../../../hooks/useInputWithActions';
import {
	InputGroup,
	InputGroupInput,
	InputGroupButton,
	InputGroupText,
} from '../input-group/InputGroup';
import { CircleX, Copy, Check } from 'lucide-react';
import { tv } from 'tailwind-variants';
import type { InputProps } from '../input/Input';

const textInputStyles = tv({
	base: '',
	slots: {
		action: 'hidden group-focus-within/input-group:block group-hover/input-group:block',
		startIcon: '!border-r-0 pr-0 text-muted',
		endIcon: 'border-l-0 pl-0 text-muted',
		input: '',
	},
	variants: {
		hasStartIcon: { true: { input: 'pl-2' } },
	},
});

export interface TextInputProps
	extends Omit<InputProps, 'onChange'>,
		Omit<HTMLAttributes<HTMLInputElement>, 'onChange'> {
	/** Иконка, отображаемая в начале текстового поля */
	startIcon?: React.ReactNode;
	/** Иконка, отображаемая в конце текстового поля */
	endIcon?: React.ReactNode;
	/** Флаг для отображения кнопки очистки значения */
	showClearIcon?: boolean;
	/** Флаг для отображения кнопки копирования значения */
	showCopyIcon?: boolean;
	/** Колбэк на изменение значения */
	onChange?: (value: string | null) => void;
}

/**
 * Компонент текстового поля ввода с поддержкой иконок и дополнительных действий.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
	(
		{
			startIcon,
			endIcon,
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
		const styles = textInputStyles();

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
			<InputGroup className={styles.base({ className })}>
				{startIcon && (
					<InputGroupText className={styles.startIcon()}>{startIcon}</InputGroupText>
				)}

				<InputGroupInput
					ref={mergedRef}
					value={value}
					defaultValue={defaultValue}
					onChange={inputActions.handleChange}
					readOnly={readOnly}
					disabled={disabled}
					error={error}
					className={styles.input({ hasStartIcon: !!startIcon })}
					{...props}
				/>

				{inputActions.shouldShowClearIcon && (
					<InputGroupButton
						icon={CircleX}
						onClick={inputActions.handleClear}
						type="button"
						className={styles.action()}
					/>
				)}

				{inputActions.shouldShowCopyIcon && (
					<InputGroupButton
						icon={inputActions.hasCopied ? Check : Copy}
						onClick={inputActions.handleCopy}
						type="button"
						className={styles.action()}
					/>
				)}

				{endIcon && <InputGroupText className={styles.endIcon()}>{endIcon}</InputGroupText>}
			</InputGroup>
		);
	}
);

TextInput.displayName = 'TextInput';

export default TextInput;
