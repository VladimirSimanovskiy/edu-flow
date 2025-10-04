import type { VariantsConfig } from '@/lib/utils/variants';
import React, { type PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';

export interface MenuItemVariants {
	disabled?: boolean;
}

export const menuItemStyles = tv({
	base: [
		'group/menu-item relative flex cursor-pointer select-none items-center gap-2 rounded-sm bg-secondary-bg p-2 py-1.5 text-sm text-primary-fg',
		// Если есть дочерний элемент с data-menu-item-action, то при наведении на него, пункт меню не нужно подсвечивать
		'[&:has([data-menu-item-action]:hover)]:bg-transparent',
		'transition-colors hover:bg-secondary-bg-hover focus:bg-secondary-bg-hover focus:outline-none',
		'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
	],
	variants: {
		disabled: {
			true: 'pointer-events-none opacity-50',
		},
	} satisfies VariantsConfig<MenuItemVariants>,
});

export type MenuItemProps = React.HTMLAttributes<HTMLDivElement> & MenuItemVariants;

export const MenuItem = React.forwardRef<HTMLDivElement, PropsWithChildren<MenuItemProps>>(
	({ className, children, disabled, ...props }, ref) => (
		<div ref={ref} className={menuItemStyles({ className, disabled })} {...props}>
			{children}
		</div>
	)
);

MenuItem.displayName = 'MenuItem';
