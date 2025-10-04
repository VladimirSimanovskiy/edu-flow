import { IconButton } from '@/components/ui';
import { type IconButtonProps } from '@/components/ui/button/icon-button/IconButton';
import { tv } from 'tailwind-variants';
import React from 'react';

const menuItemIconButtonStyles = tv({
	base: 'h-6 w-6 rounded-sm',
});

type MenuItemIconProps = IconButtonProps;

export const MenuItemIconButton = React.forwardRef<HTMLButtonElement, MenuItemIconProps>(
	({ className, icon, ...props }, ref) => (
		<IconButton
			ref={ref}
			icon={icon}
			data-menu-item-action
			size="xs"
			variant={props?.variant ?? 'ghost'}
			className={menuItemIconButtonStyles({ className })}
			{...props}
		/>
	)
);

MenuItemIconButton.displayName = 'MenuItemIconButton';
