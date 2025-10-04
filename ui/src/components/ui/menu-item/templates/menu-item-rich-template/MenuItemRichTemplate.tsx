import { type LucideIcon } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import { FeatureIcon } from '@/components/ui/icon/FeatureIcon';
import { Description } from '@/components/ui';
import { richButtonStyles } from '@/components/ui/button/rich-button/RichButton';

export type MenuItemRichTemplateProps = {
	title: string;
	description: string;
	icon: LucideIcon;
};

export const MenuItemRichTemplate = ({
	icon,
	description,
	title,
}: PropsWithChildren<MenuItemRichTemplateProps>) => {
	const buttonStyles = richButtonStyles();
	return (
		<>
			<FeatureIcon type="primary" icon={icon}></FeatureIcon>

			<div className={buttonStyles.wrapper()}>
				<span className={buttonStyles.text()}>{title}</span>
				<Description className={buttonStyles.description()}>{description}</Description>
			</div>
		</>
	);
};

MenuItemRichTemplate.displayName = 'MenuItemRichTemplate';
