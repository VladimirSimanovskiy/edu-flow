import { Button } from '@/components/ui';
import { type ButtonProps } from '@/components/ui/button/button/Button';
import { tv } from 'tailwind-variants';

const menuItemButtonStyles = tv({
	base: 'h-6 rounded-sm py-1',
});

type MenuItemIconProps = ButtonProps;

export const MenuItemButton = ({ className, ...props }: MenuItemIconProps) => (
	<Button
		data-menu-item-action
		size="xs"
		variant={props?.variant ?? 'ghost'}
		className={menuItemButtonStyles({ className })}
		{...props}
	/>
);

MenuItemButton.displayName = 'MenuItemButton';
