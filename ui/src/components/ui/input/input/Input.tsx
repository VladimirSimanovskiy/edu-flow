import React, { useRef } from "react";
import { useMergeRefs } from "../../../../hooks/useMergeRefs";
import { useCustomValidity } from "../../../../hooks/useCustomValidity";
import { inputBaseControlStyles } from "../styles/inputBaseStyles";
import { tv } from "tailwind-variants";

export type InputProps = React.ComponentProps<"input"> & {
	/** Текст сообщения об ошибке. При наличии делает поле невалидным */
	error?: string;
};

const inputStyles = tv({
	extend: inputBaseControlStyles,
	base: "h-10 lg:h-9"
});

/**
 * Стилизованный базовый компонент для создания инпутов.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ type = "text", className, error, ...other }, ref) => {
		const inputRef = useRef<HTMLInputElement>(null);
		const mergedRef = useMergeRefs(inputRef, ref);

		useCustomValidity(inputRef, error);

		return (
			<input
				type={type}
				className={inputStyles({ className })}
				ref={mergedRef}
				aria-invalid={!!error}
				{...other}
			/>
		);
	}
);

Input.displayName = "Input";

export default Input;
