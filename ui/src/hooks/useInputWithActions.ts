import { useCallback, useMemo, useRef, useState } from "react";

export interface UseInputWithActionsOptions {
	/** Значение input (для контролируемого режима) */
	value?: string | number | readonly string[];
	/** Значение по умолчанию (для неконтролируемого режима) */
	defaultValue?: string | number | readonly string[];
	/** Колбэк на изменение значения */
	onChange?: (value: string | null) => void;
	/** Флаг только для чтения */
	readOnly?: boolean;
	/** Флаг отключения */
	disabled?: boolean;
	/** Флаг для отображения кнопки очистки */
	showClearIcon?: boolean;
	/** Флаг для отображения кнопки копирования */
	showCopyIcon?: boolean;
}

/**
 * Упрощенный хук для input с функционалом копирования и очистки
 */
export function useInputWithActions({
	value,
	defaultValue,
	onChange,
	readOnly,
	disabled,
	showClearIcon = false,
	showCopyIcon = false
}: UseInputWithActionsOptions) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [hasCopied, setHasCopied] = useState(false);

	const currentValue = value !== undefined ? String(value) : String(defaultValue || "");

	const isEditable = useMemo(() => {
		return !readOnly && !disabled;
	}, [readOnly, disabled]);

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value);
	}, [onChange]);

	const handleClear = useCallback(() => {
		if (value !== undefined) {
			// Controlled mode
			onChange?.("");
		} else {
			// Uncontrolled mode
			if (inputRef.current) {
				inputRef.current.value = "";
				inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
			}
		}
	}, [onChange, value]);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(currentValue);
			setHasCopied(true);
			setTimeout(() => setHasCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	}, [currentValue]);

	const shouldShowClearIcon = showClearIcon && isEditable && currentValue;
	const shouldShowCopyIcon = showCopyIcon && currentValue;

	return {
		// Значения и состояние
		currentValue,
		inputRef,
		isEditable,

		// Обработчики
		handleChange,
		handleClear,
		handleCopy,

		// Состояние копирования
		hasCopied,

		// Флаги видимости кнопок
		shouldShowClearIcon,
		shouldShowCopyIcon
	};
}
