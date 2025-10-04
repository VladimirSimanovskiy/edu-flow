import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
	Controller,
	FormProvider,
	useFormContext,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form';
import { tv } from 'tailwind-variants';

const formStyle = tv({
	base: 'rounded-md border border-secondary-border bg-secondary-bg',
});

/**
 * Основной контейнер формы
 */
const Form = <T extends FieldValues>({
	className,
	asChild,
	...props
}: React.ComponentProps<typeof FormProvider<T>> & {
	/** Дополнительные классы */
	className?: string;
	/** Использовать ли дочерний элемент как корневой */
	asChild?: boolean;
}) => {
	const Comp = asChild ? Slot : 'div';
	return (
		<Comp className={formStyle({ className })}>
			<FormProvider {...props} />
		</Comp>
	);
};

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

/**
 * Поле формы с валидацией
 */
const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	const { getFieldState, formState } = useFormContext();

	const fieldState = getFieldState(fieldContext.name, formState);

	if (!fieldContext) {
		throw new Error('useFormField should be used within <FormField>');
	}

	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const formItemStyle = tv({
	base: 'space-y-2',
});

/**
 * Контейнер для элементов формы
 */
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => {
		const id = React.useId();

		return (
			<FormItemContext.Provider value={{ id }}>
				<div ref={ref} className={formItemStyle({ className })} {...props} />
			</FormItemContext.Provider>
		);
	}
);
FormItem.displayName = 'FormItem';

interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
	/** Обязательное ли поле */
	required?: boolean;
}

/**
 * Лейбл для поля формы
 */
const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, FormLabelProps>(
	({ className, required, ...props }, ref) => {
		const { formItemId } = useFormField();

		return (
			<LabelPrimitive.Root ref={ref} className={className} htmlFor={formItemId} {...props}>
				{props.children}
				{required && <span className="text-destructive ml-1">*</span>}
			</LabelPrimitive.Root>
		);
	}
);
FormLabel.displayName = 'FormLabel';

/**
 * Контрол для поля формы
 */
const FormControl = React.forwardRef<
	React.ElementRef<typeof Slot>,
	React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

	return (
		<Slot
			ref={ref}
			id={formItemId}
			aria-describedby={
				!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props}
		/>
	);
});
FormControl.displayName = 'FormControl';

const formMessageStyle = tv({
	base: 'text-[0.8rem] font-medium text-destructive',
});

/**
 * Сообщение об ошибке
 */
const FormMessage = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error?.message ?? '') : children;

	if (!body) {
		return null;
	}

	return (
		<p ref={ref} id={formMessageId} className={formMessageStyle({ className })} {...props}>
			{body}
		</p>
	);
});
FormMessage.displayName = 'FormMessage';

export {
	useFormField,
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField as FormFieldControl,
};
