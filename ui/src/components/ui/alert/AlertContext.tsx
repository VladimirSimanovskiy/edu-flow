import React from "react";
import type { AlertVariants } from "./Alert";

export const AlertContext = React.createContext<AlertVariants>({});

/**
 * Хук для получения значений контекста Alert
 * Если переданы props, они имеют приоритет над значениями из контекста
 *
 * @example
 * ```tsx
 * const { status, focus } = useAlert({ status: props.status, focus: props.focus });
 * ```
 */

export const useAlert = (props?: AlertVariants) => {
	const context = React.useContext(AlertContext);

	return {
		status: props?.status ?? context.status,
		focus: props?.focus ?? context.focus
	};
};
