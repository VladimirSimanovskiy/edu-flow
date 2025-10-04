import React, { useRef } from 'react';
import { tv } from 'tailwind-variants';
import { inputBaseElementStyles } from '../styles/inputBaseStyles';
import { useMergeRefs } from '../../../../hooks/useMergeRefs';
import { useCustomValidity } from '../../../../hooks/useCustomValidity';
import { IconButton } from '../../button';
import type { LucideIcon } from 'lucide-react';
import type { ButtonBaseProps } from '../../button/button-base/ButtonBase';
import type { VariantsConfig } from '../../../../lib/utils/variants';

const inputGroupStyles = tv({
	extend: inputBaseElementStyles,
	base: [
		'group/input-group flex h-10 px-0 py-0 lg:h-9 lg:py-0',
		'has-[input:focus]:border-secondary-border has-[input:focus]:bg-secondary-bg has-[input:focus]:shadow-focus',
		"has-[div[data-input-group-element='contenteditable']:focus]:border-secondary-border has-[div[data-input-group-element='contenteditable']:focus]:bg-secondary-bg has-[div[data-input-group-element='contenteditable']:focus]:shadow-focus",

		// Стили для обычных read-only input'ов (исключая file)
		"has-[input:read-only:not([type='file'])]:border-primary-border",
		"has-[input:read-only:not([type='file'])]:bg-primary-bg",
		"has-[input:read-only:not([type='file'])]:shadow-sm",
		"has-[input:read-only:not([type='file'])]:hover:bg-primary-bg",
		"has-[input:read-only:not([type='file'])]:has-[input:focus]:!bg-primary-bg",
		"has-[input:read-only:not([type='file'])]:has-[input:focus]:shadow-focus",

		'has-[input:disabled]:border-primary-border',
		'has-[input:disabled]:bg-primary-bg',
		'has-[input:disabled]:shadow-sm',
		'has-[input:invalid]:border-status-error-secondary-border',
		'has-[input:invalid]:shadow-base',
		'has-[input:invalid]:hover:border-status-error-primary-border',
		'has-[input:invalid]:hover:shadow-base',
		'has-[input:invalid]:has-[input:focus]:border-status-error-secondary-border',
		'has-[input:invalid]:has-[input:focus]:shadow-focus-error',
		'has-[input[aria-invalid=true]]:border-status-error-secondary-border',
		'has-[input[aria-invalid=true]]:shadow-base',
		'has-[input[aria-invalid=true]]:hover:border-status-error-primary-border',
		'has-[input[aria-invalid=true]]:hover:shadow-base',
		'has-[input[aria-invalid=true]]:has-[input:focus]:border-status-error-secondary-border',
		'has-[input[aria-invalid=true]]:has-[input:focus]:shadow-focus-error',

		// Стили для автозаполнения - применяем фон ко всей группе
		'has-[input:-webkit-autofill]:bg-[hsl(var(--autofill-bg))]',
		'has-[input:-webkit-autofill]:has-[input:focus]:bg-[hsl(var(--autofill-bg))]',
	],
});

/**
 * Контейнер для группировки инпутов с дополнительными элементами (текст, кнопки).
 * Позволяет создавать композиции из инпутов, текстовых блоков и кнопок.
 */
const InputGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
	({ className, children, ...props }, ref) => {
		const styles = inputGroupStyles({ className });

		return (
			<div ref={ref} className={styles} {...props}>
				{children}
			</div>
		);
	}
);

InputGroup.displayName = 'InputGroup';

const inputGroupInputStyles = tv({
	base: [
		'min-w-5 flex-1 rounded-lg bg-transparent py-2.5 pl-3 lg:py-2',
		'outline-none placeholder:text-muted focus:outline-none',
		// Градиентная маска для плавного обрезания текста слева
		'[mask-image:linear-gradient(to_left,rgba(255,255,255,0),#fff_15%)]',
		// Стили для автозаполнения - убираем фон у самого input'а
		'[-webkit-autofill]:bg-transparent',
		'[-webkit-autofill]:shadow-none',
	],
});

export interface InputGroupInputProps extends React.ComponentProps<'input'> {
	error?: string;
}

/**
 * Инпут для использования в группе.
 */
const InputGroupInput = React.forwardRef<HTMLInputElement, InputGroupInputProps>(
	({ className, error, ...props }, ref) => {
		const styles = inputGroupInputStyles({ className });
		const inputRef = useRef<HTMLInputElement>(null);
		const mergedRef = useMergeRefs(inputRef, ref);

		useCustomValidity(inputRef, error);

		return (
			<input
				ref={mergedRef}
				className={styles}
				aria-invalid={!!error}
				data-input-group-element="input"
				{...props}
			/>
		);
	}
);

InputGroupInput.displayName = 'InputGroup.Input';

type InputGroupTextVariants = {
	type?: 'primary';
};

const inputGroupTextStyles = tv({
	base: [
		'flex h-full items-center border-l border-secondary-border px-3 text-secondary-fg first:border-l-0',
		// Правая граница, если следующий элемент НЕ InputGroupText
		"[&[data-input-group-element='text']:has(+_:not([data-input-group-element='text']))]:border-r",
	],
	variants: {
		type: {
			primary: 'rounded-l-lg bg-primary-bg',
		},
	} satisfies VariantsConfig<InputGroupTextVariants>,
});

type InputGroupTextProps = React.ComponentProps<'div'> & InputGroupTextVariants;

/**
 * Текстовый элемент для отображения префикса или суффикса в группе инпутов.
 */
const InputGroupText = React.forwardRef<HTMLDivElement, InputGroupTextProps>(
	({ className, type, ...props }, ref) => {
		const styles = inputGroupTextStyles({ className, type });
		return <div ref={ref} className={styles} data-input-group-element="text" {...props} />;
	}
);

InputGroupText.displayName = 'InputGroup.Text';

const inputGroupContentEditableStyles = tv({
	base: ['bg-transparent py-2.5 pl-3 lg:py-2', 'outline-none focus:outline-none'],
});

export interface InputGroupContentEditableProps extends React.ComponentProps<'div'> {
	error?: string;
}

/**
 * Contenteditable элемент для использования в группе.
 */
const InputGroupContentEditable = React.forwardRef<HTMLDivElement, InputGroupContentEditableProps>(
	({ className, error, ...props }, ref) => {
		const styles = inputGroupContentEditableStyles({ className });

		return (
			<div
				ref={ref}
				className={styles}
				contentEditable
				role="textbox"
				aria-invalid={!!error}
				data-input-group-element="contenteditable"
				suppressContentEditableWarning={true}
				{...props}
			/>
		);
	}
);

InputGroupContentEditable.displayName = 'InputGroup.ContentEditable';

const inputGroupButtonStyles = tv({
	base: ['aspect-auto h-full px-1.5 py-2.5 first:pl-2.5 last:pr-2.5 lg:py-2'],
});

type InputGroupButtonProps = ButtonBaseProps & {
	icon: LucideIcon;
	iconClassName?: string;
};

const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
	({ icon, className, ...props }, ref) => {
		const styles = inputGroupButtonStyles({ className });
		return (
			<IconButton
				ref={ref}
				icon={icon}
				className={styles}
				variant="text"
				size="md"
				data-input-group-element="button"
				type="button"
				{...props}
			/>
		);
	}
);

InputGroupButton.displayName = 'InputGroup.Button';

export { InputGroupText, InputGroupInput, InputGroup, InputGroupButton, InputGroupContentEditable };
