import { useCallback } from "react";

/**
 * Хук для объединения нескольких ref'ов в один
 */
export function useMergeRefs<T = any>(...refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>): React.RefCallback<T> {
	return useCallback(
		(value: T) => {
			refs.forEach((ref) => {
				if (typeof ref === "function") {
					ref(value);
				} else if (ref != null) {
					(ref as React.MutableRefObject<T | null>).current = value;
				}
			});
		},
		refs
	);
}
