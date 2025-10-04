import { useEffect } from "react";

/**
 * Хук для установки кастомного сообщения валидации
 */
export function useCustomValidity<T extends HTMLElement>(
	ref: React.RefObject<T>,
	error?: string
) {
	useEffect(() => {
		if (ref.current && 'setCustomValidity' in ref.current) {
			(ref.current as any).setCustomValidity(error || "");
		}
	}, [ref, error]);
}
