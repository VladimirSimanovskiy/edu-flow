import { useEffect } from "react";

/**
 * Хук для установки кастомного сообщения валидации
 */
export function useCustomValidity<T extends HTMLElement>(
	ref: React.RefObject<T>,
	error?: string
) {
	useEffect(() => {
		if (ref.current) {
			ref.current.setCustomValidity(error || "");
		}
	}, [ref, error]);
}
