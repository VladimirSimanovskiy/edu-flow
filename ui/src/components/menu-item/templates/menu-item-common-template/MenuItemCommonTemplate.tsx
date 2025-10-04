import { PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';
import { MenuItemText } from '../../components/MenuItemText';
import { Icon } from '@/components/ui';
import { Check, LucideIcon } from 'lucide-react';
import { MenuItemIcon } from '../../components/MenuItemIcon';
import { cn } from '@/lib/utils';
import { VariantsConfig } from '@/lib/utils/variants';

export interface MenuItemCommonTemplateVariants {
	isSelected?: boolean;
}

const menuItemCommonTemplateStyles = tv({
	slots: {
		wrapper: 'flex w-full flex-row items-center gap-3',
		contentWrapper: 'flex flex-row items-center gap-2',
		check: 'invisible',
		rightIcon: 'ml-auto',
	},
	variants: {
		isSelected: {
			true: {
				check: 'visible',
			},
		},
	} satisfies VariantsConfig<MenuItemCommonTemplateVariants>,
});

type MenuItemCommonTemplateProps = MenuItemCommonTemplateVariants & {
	text: string;
	icon: LucideIcon;
	showStartCheck?: boolean;
	showEndCheck?: boolean;
};

export const MenuItemCommonTemplate = ({
	icon,
	text,
	isSelected,
	showStartCheck = false,
	showEndCheck = false,
}: PropsWithChildren<MenuItemCommonTemplateProps>) => {
	const styles = menuItemCommonTemplateStyles();

	return (
		<div className={styles.wrapper()}>
			{showStartCheck && <Icon icon={Check} className={styles.check({ isSelected })} />}
			<div className={styles.contentWrapper()}>
				<MenuItemIcon icon={icon} />
				<MenuItemText>{text}</MenuItemText>
			</div>
			{showEndCheck && (
				<Icon
					icon={Check}
					className={cn(styles.rightIcon(), styles.check({ isSelected }))}
				/>
			)}
		</div>
	);
};

MenuItemCommonTemplate.displayName = 'MenuItemCommonTemplate';
