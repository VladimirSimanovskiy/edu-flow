type ClassNameValue = string | string[] | Record<string, string> | null | undefined | 0 | 0n | false;

/**
 * Строгая типизация для объекта variants в tailwind-variants tv()
 *
 * Решает проблему рассинхронизации между props компонента и конфигурацией стилей:
 * - Гарантирует, что все варианты из интерфейса props будут настроены в tv()
 * - Предотвращает забывание добавить стили для нового варианта при расширении props
 * - Обеспечивает строгое соответствие между типами props и конфигурацией стилей
 * - Альтернатива VariantProps<typeof styles> которая генерирует нечитаемые длинные типы
 * - Поддерживает boolean типы (разрешает только "true" | "false" ключи, необязательные)
 * - Поддерживает ClassNameValue (строки, массивы, объекты, slots)
 *
 * @example
 * // ✅ Чистые и читаемые типы
 * interface MyVariants {
 *   size?: "sm" | "lg";
 *   disabled?: boolean;
 * }
 * const styles = tv({
 *   variants: {
 *     size: {
 *       sm: "text-sm",
 *       lg: ["text-lg", "font-bold"]
 *     },
 *     disabled: { true: "opacity-50" }
 *   } satisfies VariantsConfig<MyVariants>
 * })
 * type Props = MyVariants & { children: ReactNode }
 *
 * // ❌ Вместо нечитаемых автогенерированных типов из VariantProps
 */
export type VariantsConfig<T> = {
	[K in keyof Required<T>]: Required<T>[K] extends boolean
		? Partial<Record<"true" | "false", ClassNameValue>>
		: Required<T>[K] extends string
			? Record<Required<T>[K], ClassNameValue>
			: never;
};
