import { Icon } from '@/components/ui';
import { type IconProps } from '@/components/ui/icon/Icon';
import { tv } from 'tailwind-variants';

const menuItemIconStyles = tv({
	base: 'truncate text-sm text-primary-fg',
});

type MenuItemIconProps = IconProps;

export const MenuItemIcon = ({ className, icon, ...props }: MenuItemIconProps) => (
	<Icon icon={icon} className={menuItemIconStyles({ className })} {...props} />
);

MenuItemIcon.displayName = 'MenuItemIcon';
