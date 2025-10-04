import * as React from 'react';
import {
	useFormContext,
	type FieldPath,
	type FieldValues,
	type ControllerRenderProps,
	type UseFormStateReturn,
	type ControllerFieldState,
} from 'react-hook-form';
import { FormFieldControl, FormItem, FormControl } from '../../Form';

export type FormFieldControlRenderer<TFieldValues extends FieldValues = FieldValues> = (props: {
	field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
	fieldState: ControllerFieldState;
	formState: UseFormStateReturn<TFieldValues>;
	readonly?: boolean;
}) => React.ReactNode;

export interface FormFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	/** Имя поля формы */
	name: TName;
	/** Заголовок поля (лейбл) */
	title: string;
	/** Описание поля */
	description?: string;
	/** Функция рендеринга контрола */
	control: FormFieldControlRenderer<TFieldValues>;
	/** Является ли поле обязательным */
	required?: boolean;
	/** Дополнительные классы */
	className?: string;
	/** Классы для лейбла */
	labelClassName?: string;
	/** Поле только для чтения */
	readonly?: boolean;
	/** Вариант расположения элементов поля */
	layout?: 'horizontal' | 'vertical' | 'responsive';
}

/**
 * Компонент FormField объединяет несколько компонентов формы в один блок
 * для упрощения создания консистентных форм.
 *
 * ### Варианты раскладки (layout):
 *
 * - **responsive** (по умолчанию): адаптивная раскладка с mobile-first подходом.
 *   На мобильных устройствах - вертикальный лейаут, на десктопе (от lg breakpoint) - горизонтальный.
 *
 * - **horizontal**: принудительно горизонтальная раскладка на всех экранах.
 *   Лейбл располагается слева от поля ввода.
 *
 * - **vertical**: принудительно вертикальная раскладка на всех экранах.
 *   Лейбл располагается над полем ввода.
 *
 * Компонент обеспечивает согласованное расположение элементов формы,
 * включая лейбл, поле ввода, подсказку и сообщение об ошибке.
 *
 * @example
 * <FormField
 *   name="username"
 *   title="Имя пользователя"
 *   description="Ваше публичное имя пользователя"
 *   required
 *   control={({ field }) => (
 *     <TextInput
 *       placeholder="Введите имя пользователя"
 *       startIcon={<Icon icon={User} />}
 *       {...field}
 *     />
 *   )}
 * />
 */

export function FormField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, title, description, control, required }: FormFieldProps<TFieldValues, TName>) {
	const form = useFormContext<TFieldValues>();

	return (
		<FormFieldControl
			control={form.control}
			name={name}
			render={({ field, fieldState, formState }) => {
				return (
					<FormItem>
						<div className="space-y-2">
							<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								{title}
								{required && <span className="text-destructive ml-1">*</span>}
							</label>
							{description && (
								<p className="text-sm text-muted-foreground">{description}</p>
							)}
							<FormControl id={`${name}-form-item`}>
								{control({ field, fieldState, formState })}
							</FormControl>
							{fieldState.error?.message && (
								<p className="text-[0.8rem] font-medium text-destructive">
									{fieldState.error.message}
								</p>
							)}
						</div>
					</FormItem>
				);
			}}
		/>
	);
}
