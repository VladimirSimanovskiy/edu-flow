import { PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';
import { MenuItemText } from '../../components/MenuItemText';
import { Icon } from '@/components/ui';
import { Check, LucideIcon } from 'lucide-react';
import { MenuItemIcon } from '../../components/MenuItemIcon';
import { MenuItemIconButton } from '../../components/MenuItemIconButton';
import { VariantsConfig } from '@/lib/utils/variants';

export interface MenuItemInteractiveTemplateVariants {
	isSelected?: boolean;
}

const menuItemInteractiveTemplateStyles = tv({
	slots: {
		wrapper: 'flex w-full flex-row items-center gap-3',
		contentWrapper: 'flex flex-row items-center gap-2',
		check: 'invisible',
		button: 'ml-auto',
	},
	variants: {
		isSelected: {
			true: {
				check: 'visible',
			},
		},
	} satisfies VariantsConfig<MenuItemInteractiveTemplateVariants>,
});

type MenuItemInteractiveTemplateProps = MenuItemInteractiveTemplateVariants & {
	text: string;
	icon: LucideIcon;
	buttonIcon: LucideIcon;
	buttonOnClick?: (e: React.MouseEvent) => void;
};

export const MenuItemInteractiveTemplate = ({
	text,
	icon,
	buttonIcon,
	buttonOnClick,
	isSelected,
}: PropsWithChildren<MenuItemInteractiveTemplateProps>) => {
	const styles = menuItemInteractiveTemplateStyles();

	return (
		<div className={styles.wrapper()}>
			<div className={styles.contentWrapper()}>
				<Icon icon={Check} className={styles.check({ isSelected })} />
				<MenuItemIcon icon={icon} />
				<MenuItemText>{text}</MenuItemText>
			</div>
			<MenuItemIconButton
				icon={buttonIcon}
				onClick={buttonOnClick}
				className={styles.button()}
			/>
		</div>
	);
};

MenuItemInteractiveTemplate.displayName = 'MenuItemInteractiveTemplate';
