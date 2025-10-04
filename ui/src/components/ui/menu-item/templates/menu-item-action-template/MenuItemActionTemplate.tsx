import { type PropsWithChildren } from 'react';
import { MenuItemIcon } from '../../components/MenuItemIcon';
import { type LucideIcon } from 'lucide-react';
import { MenuItemText } from '../../components/MenuItemText';
import { MenuItemShortcut } from '../../components/MenuItemShortcut';

type MenuItemActionTemplateProps = {
	icon: LucideIcon;
	text: string;
	shortcut?: string;
};

export const MenuItemActionTemplate = ({
	icon,
	text,
	shortcut,
}: PropsWithChildren<MenuItemActionTemplateProps>) => {
	return (
		<>
			<MenuItemIcon icon={icon} />
			<MenuItemText>{text}</MenuItemText>
			{shortcut && <MenuItemShortcut>{shortcut}</MenuItemShortcut>}
		</>
	);
};

MenuItemActionTemplate.displayName = 'MenuItemActionTemplate';
