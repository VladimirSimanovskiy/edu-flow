import { Shortcut } from '@/components/ui';
import React from 'react';
import { tv } from 'tailwind-variants';

const menuItemShortcutStyles = tv({
	base: '',
});

type MenuItemTextProps = React.HTMLAttributes<HTMLSpanElement>;

export const MenuItemShortcut = ({ className, children, ...props }: MenuItemTextProps) => (
	<Shortcut variant="ghost" className={menuItemShortcutStyles({ className })} {...props}>
		{children}
	</Shortcut>
);

MenuItemShortcut.displayName = 'MenuItemShortcut';
