import * as React from 'react';
import { tv } from 'tailwind-variants';
import { cn } from '../../../utils/cn';

export interface TextareaVariants {
	resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const textareaStyles = tv({
	base: [
		'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
		'ring-offset-background placeholder:text-muted-foreground',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		'disabled:cursor-not-allowed disabled:opacity-50',
	],
	variants: {
		resize: {
			none: 'resize-none',
			vertical: 'resize-y',
			horizontal: 'resize-x',
			both: 'resize',
		},
	},
	defaultVariants: {
		resize: 'vertical',
	},
});

export type TextareaProps = React.ComponentProps<'textarea'> &
	TextareaVariants & {
		/** Текст сообщения об ошибке. При наличии делает поле невалидным */
		error?: string;
	};

/**
 * Стилизованный компонент textarea для многострочного ввода текста.
 * Поддерживает все стандартные свойства textarea элемента.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, error, resize, ...other }, ref) => {
		return (
			<textarea
				className={cn(textareaStyles({ resize }), className)}
				ref={ref}
				aria-invalid={!!error}
				{...other}
			/>
		);
	}
);
Textarea.displayName = 'Textarea';
