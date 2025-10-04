import React from "react";
import { useMergeRefs } from "../../../../hooks/useMergeRefs";
import { useInputWithActions } from "../../../../hooks/useInputWithActions";
import { InputGroup, InputGroupInput, InputGroupText, InputGroupButton } from "../input-group/InputGroup";
import { CircleX, Copy, Check } from "lucide-react";
import { tv } from "tailwind-variants";

const webInputStyles = tv({
	base: "group",
	slots: {
		action: "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
	}
});

export interface WebInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
	/** Содержимое в начале поля (например, префикс URL) */
	startContent?: React.ReactNode;
	/** Флаг для отображения кнопки очистки значения */
	showClearIcon?: boolean;
	/** Флаг для отображения кнопки копирования значения */
	showCopyIcon?: boolean;
	/** Колбэк на изменение значения */
	onChange?: (value: string | null) => void;
	/** Текст сообщения об ошибке */
	error?: string;
}

export const WebInput = React.forwardRef<HTMLInputElement, WebInputProps>(
	(
		{
			startContent = "https://",
			showClearIcon = true,
			showCopyIcon = true,
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
		const styles = webInputStyles();

		const inputActions = useInputWithActions({
			value,
			defaultValue,
			onChange,
			readOnly,
			disabled,
			showClearIcon,
			showCopyIcon
		});

		const mergedRef = useMergeRefs(ref, inputActions.inputRef);

		return (
			<InputGroup className={styles.base({ className })}>
				{startContent != null && <InputGroupText type="primary">{startContent}</InputGroupText>}

				<InputGroupInput
					ref={mergedRef}
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
			</InputGroup>
		);
	}
);

WebInput.displayName = "WebInput";

export default WebInput;
