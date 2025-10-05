import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { tv } from 'tailwind-variants';
import type { VariantsConfig } from '../../../lib/utils/variants';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Value>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => {
	return (
		<SelectPrimitive.Value
			ref={ref}
			className={cn('flex items-center gap-1', className)}
			{...props}
		/>
	);
});
SelectValue.displayName = SelectPrimitive.Value.displayName;

export interface SelectTriggerVariants {
	invalid?: boolean;
	disabled?: boolean;
}

export const selectTriggerStyles = tv({
	base: [
		'group flex h-10 w-full items-center whitespace-nowrap rounded-lg border border-secondary-border bg-secondary-bg px-3 py-2.5 shadow-sm outline-none lg:h-9 lg:py-2',
		'text-sm text-primary-fg',
		'hover:border-primary-border hover:shadow-base',
		'focus:rounded-lg focus:border focus:border-secondary-border focus:bg-secondary-bg focus:shadow-focus',
		'disabled:border-primary-border disabled:bg-primary-bg disabled:shadow-sm',
		'data-[placeholder]:text-muted [&>span]:line-clamp-1',
		'invalid:border-status-error-secondary-border invalid:shadow-base',
		'invalid:hover:border-status-error-primary-border invalid:hover:shadow-base invalid:focus:border-status-error-secondary-border invalid:focus:shadow-focus-error',
	],
	slots: {
		iconWrapper: 'ml-auto flex items-center',
		icon: 'pointer-events-none h-4 w-4 text-muted group-disabled:hidden',
	},
	variants: {
		invalid: {
			true: {
				base: 'border-status-error-secondary-border shadow-base hover:border-status-error-primary-border hover:shadow-base focus:border-status-error-secondary-border focus:shadow-focus-error',
			},
		},
		disabled: {
			true: {
				base: 'border-primary-border bg-secondary-bg-hover shadow-sm',
				icon: 'hidden',
			},
		},
	} satisfies VariantsConfig<SelectTriggerVariants>,
});

type SelectTriggerProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
	SelectTriggerVariants & {
		onClear?: () => void;
	};

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	SelectTriggerProps
>(({ className, children, onClear, invalid, ...props }, ref) => {
	const styles = selectTriggerStyles({ invalid });

	return (
		<SelectPrimitive.Trigger ref={ref} className={styles.base({ className })} {...props}>
			{children}
			<div className={styles.iconWrapper()}>
				{onClear && (
					<button
						type="button"
						onClick={() => {
							onClear();
						}}
						onPointerDown={e => {
							e.stopPropagation();
							e.preventDefault();
						}}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								onClear();
								e.stopPropagation();
								e.preventDefault();
							}
						}}
						className="h-4 w-4 text-muted hover:text-primary-fg"
					>
						×
					</button>
				)}
				<SelectPrimitive.Icon asChild>
					<ChevronDown className={styles.icon()} />
				</SelectPrimitive.Icon>
			</div>
		</SelectPrimitive.Trigger>
	);
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const selectScrollUpButtonStyles = tv({
	base: ['flex cursor-default items-center justify-center py-1'],
	slots: {
		icon: 'h-4 w-4',
	},
});

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => {
	const styles = selectScrollUpButtonStyles();
	return (
		<SelectPrimitive.ScrollUpButton ref={ref} className={styles.base({ className })} {...props}>
			<ChevronUp className={styles.icon()} />
		</SelectPrimitive.ScrollUpButton>
	);
});
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const selectScrollDownButtonStyles = tv({
	base: ['flex cursor-default items-center justify-center py-1'],
	slots: {
		icon: 'h-4 w-4',
	},
});
const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => {
	const styles = selectScrollDownButtonStyles();
	return (
		<SelectPrimitive.ScrollDownButton
			ref={ref}
			className={styles.base({ className })}
			{...props}
		>
			<ChevronDown className={styles.icon()} />
		</SelectPrimitive.ScrollDownButton>
	);
});
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const selectContentStyles = tv({
	base: [
		'relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-lg',
		'border border-secondary-border bg-secondary-bg text-primary-fg shadow-sm',
		'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
		'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
	],
	slots: {
		viewport: 'p-1',
	},
	variants: {
		position: {
			popper: {
				base: 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
				viewport:
					'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
			},
			'item-aligned': '',
		},
	},
});
const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
		/**
		 * Контейнер для портала. Если не указан, используется хук usePortalContainer
		 * для поиска PortalContainer
		 */
		portalContainer?: HTMLElement;
	}
>(({ className, children, position = 'popper', portalContainer, ...props }, ref) => {
	const styles = selectContentStyles({ position });
	return (
		<SelectPrimitive.Portal container={portalContainer}>
			<SelectPrimitive.Content
				ref={ref}
				className={styles.base({ className })}
				position={position}
				{...props}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport className={styles.viewport()}>
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const selectLabelStyles = tv({
	base: ['overflow-hidden overflow-ellipsis px-2 py-1.5 text-xs font-normal text-muted'],
});

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => {
	return (
		<SelectPrimitive.Label ref={ref} className={selectLabelStyles({ className })} {...props} />
	);
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const selectItemStyles = tv({
	base: [
		'relative flex w-full cursor-default select-none items-center gap-1 rounded-sm py-1.5 px-2 text-sm outline-none',
		'bg-secondary-bg text-primary-fg',
		'hover:bg-secondary-bg-hover focus:bg-secondary-bg-hover focus:outline-none',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
	],
	slots: {
		indicator: 'absolute right-2 flex h-3.5 w-3.5 items-center justify-center',
		indicatorIcon: 'h-4 w-4',
	},
});

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, disabled, ...props }, ref) => {
	const styles = selectItemStyles();
	return (
		<SelectPrimitive.Item
			ref={ref}
			disabled={disabled}
			className={styles.base({ className })}
			{...props}
		>
			<span className={styles.indicator()}>
				<SelectPrimitive.ItemIndicator>
					<Check className={styles.indicatorIcon()} />
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
});
SelectItem.displayName = SelectPrimitive.Item.displayName;

const selectSeparatorStyles = tv({
	base: ['-mx-1 my-1 h-px bg-secondary-border'],
});

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => {
	return (
		<SelectPrimitive.Separator
			ref={ref}
			className={selectSeparatorStyles({ className })}
			{...props}
		/>
	);
});
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const SelectOption = SelectPrimitive.Item;
SelectOption.displayName = 'SelectOption';

const SelectItemText = SelectPrimitive.ItemText;
SelectItemText.displayName = SelectPrimitive.ItemText.displayName;

const SelectItemIndicator = SelectPrimitive.ItemIndicator;
SelectItemIndicator.displayName = SelectPrimitive.ItemIndicator.displayName;

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
	SelectOption,
	SelectItemText,
	SelectItemIndicator,
};
