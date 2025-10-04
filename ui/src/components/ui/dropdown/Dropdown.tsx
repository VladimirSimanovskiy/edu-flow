import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import * as React from 'react';
import { tv } from 'tailwind-variants';
import { cn } from '../../../utils/cn';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const dropdownMenuSubTriggerStyles = tv({
	base: [
		'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
		'focus:bg-accent data-[state=open]:bg-accent',
		'hover:bg-secondary-bg-hover',
	],
	slots: {
		chevron: 'ml-auto h-4 w-4',
	},
	variants: {
		inset: {
			true: 'pl-8',
		},
	},
	defaultVariants: {
		inset: false,
	},
});

const DropdownMenuSubTrigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
		inset?: boolean;
	}
>(({ className, inset, children, ...props }, ref) => {
	const styles = dropdownMenuSubTriggerStyles({ inset });
	return (
		<DropdownMenuPrimitive.SubTrigger
			ref={ref}
			className={cn(styles.base, className)}
			{...props}
		>
			{children}
			<ChevronRight className={styles.chevron()} />
		</DropdownMenuPrimitive.SubTrigger>
	);
});
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const dropdownMenuSubContentStyles = tv({
	base: [
		'z-50 min-w-[8rem] overflow-hidden rounded-lg border border-secondary-border bg-secondary-bg p-1 shadow-md',
		'origin-[--radix-dropdown-menu-content-transform-origin]',
		'data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
		'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
		'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
		'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
	],
});

const DropdownMenuSubContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
	const styles = dropdownMenuSubContentStyles();
	return (
		<DropdownMenuPrimitive.SubContent ref={ref} className={cn(styles, className)} {...props} />
	);
});
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const dropdownMenuContentStyles = tv({
	base: [
		'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
		'data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
		'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
		'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
		'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
	],
});

const DropdownMenuContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(dropdownMenuContentStyles.base, className)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const dropdownMenuItemStyles = tv({
	base: [
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
		'transition-colors focus:bg-accent focus:text-accent-foreground',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		'hover:bg-secondary-bg-hover',
	],
	variants: {
		inset: {
			true: 'pl-8',
		},
	},
});

const DropdownMenuItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => {
	const styles = dropdownMenuItemStyles({ inset });
	return <DropdownMenuPrimitive.Item ref={ref} className={cn(styles, className)} {...props} />;
});
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const dropdownMenuCheckboxItemStyles = tv({
	base: [
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
		'transition-colors focus:bg-accent focus:text-accent-foreground',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		'hover:bg-secondary-bg-hover',
	],
	slots: {
		indicator: 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center',
		icon: 'h-4 w-4',
	},
});

const DropdownMenuCheckboxItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
	const styles = dropdownMenuCheckboxItemStyles();
	return (
		<DropdownMenuPrimitive.CheckboxItem
			ref={ref}
			className={cn(styles.base, className)}
			checked={checked}
			{...props}
		>
			<span className={styles.indicator()}>
				<DropdownMenuPrimitive.ItemIndicator>
					<Check className={styles.icon()} />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.CheckboxItem>
	);
});
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const dropdownMenuRadioItemStyles = tv({
	base: [
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
		'transition-colors focus:bg-accent focus:text-accent-foreground',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		'hover:bg-secondary-bg-hover',
	],
	slots: {
		indicator: 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center',
		icon: 'h-2 w-2 fill-current',
	},
});

const DropdownMenuRadioItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
	const styles = dropdownMenuRadioItemStyles();
	return (
		<DropdownMenuPrimitive.RadioItem
			ref={ref}
			className={cn(styles.base, className)}
			{...props}
		>
			<span className={styles.indicator()}>
				<DropdownMenuPrimitive.ItemIndicator>
					<Circle className={styles.icon()} />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.RadioItem>
	);
});
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const dropdownMenuLabelStyles = tv({
	base: 'px-2 py-1.5 text-sm font-semibold',
	variants: {
		inset: {
			true: 'pl-8',
		},
	},
});

const DropdownMenuLabel = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => {
	const styles = dropdownMenuLabelStyles({ inset });
	return <DropdownMenuPrimitive.Label ref={ref} className={cn(styles, className)} {...props} />;
});
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const dropdownMenuSeparatorStyles = tv({
	base: '-mx-1 my-1 h-px bg-muted',
});

const DropdownMenuSeparator = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => {
	const styles = dropdownMenuSeparatorStyles();
	return (
		<DropdownMenuPrimitive.Separator ref={ref} className={cn(styles, className)} {...props} />
	);
});
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const dropdownMenuShortcutStyles = tv({
	base: 'ml-auto text-xs tracking-widest opacity-60',
});

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	const styles = dropdownMenuShortcutStyles();
	return <span className={cn(styles, className)} {...props} />;
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
};
