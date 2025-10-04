import { type PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';
import { MenuItemText } from '../../components/MenuItemText';
import { MenuItemSecondaryText } from '../../components/MenuItemSecondaryText';
import { Icon } from '@/components/ui';
import { Check } from 'lucide-react';
import type { VariantsConfig } from '@/lib/utils/variants';

export interface MenuItemInfoTemplateVariants {
	isSelected?: boolean;
}

const menuItemInfoTemplateStyles = tv({
	slots: {
		check: 'invisible',
	},
	variants: {
		isSelected: {
			true: {
				check: 'visible',
			},
		},
	} satisfies VariantsConfig<MenuItemInfoTemplateVariants>,
});

type MenuItemInfoTemplateProps = MenuItemInfoTemplateVariants & {
	text: string;
	description?: string;
};

export const MenuItemInfoTemplate = ({
	description,
	text,
	isSelected,
}: PropsWithChildren<MenuItemInfoTemplateProps>) => {
	const styles = menuItemInfoTemplateStyles();

	return (
		<>
			<Icon icon={Check} className={styles.check({ isSelected })} />
			<MenuItemText>{text}</MenuItemText>
			{description && <MenuItemSecondaryText>{description}</MenuItemSecondaryText>}
		</>
	);
};

MenuItemInfoTemplate.displayName = 'MenuItemInfoTemplate';
