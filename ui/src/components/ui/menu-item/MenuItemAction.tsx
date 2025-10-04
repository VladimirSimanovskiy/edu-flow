import { tv } from 'tailwind-variants';
import { MenuItem, type MenuItemProps } from './MenuItem';
import { type PropsWithChildren } from 'react';
import React from 'react';

const menuItemActionStyles = tv({
	base: 'hover:cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
});

export type MenuActionItemProps = MenuItemProps;

export const MenuItemAction = React.forwardRef<
	HTMLDivElement,
	PropsWithChildren<MenuActionItemProps>
>(({ className, children, ...props }, ref) => (
	<MenuItem ref={ref} className={menuItemActionStyles({ className })} tabIndex={0} {...props}>
		{children}
	</MenuItem>
));

MenuItemAction.displayName = 'MenuItemAction';
