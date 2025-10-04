import { IconButton } from '../../../button/icon-button/IconButton';
import type { IconButtonProps } from '../../../button/icon-button/IconButton';
import type { FC, PropsWithChildren } from 'react';
import { tv } from 'tailwind-variants';

const inputIconButtonVariants = tv({
	base: 'aspect-auto px-1.5',
});

type InputIconButtonProps = PropsWithChildren<
	IconButtonProps & {
		onClick?: () => void;
		className?: string;
	}
>;

export const InputIconButton: FC<InputIconButtonProps> = ({ icon, className, ...props }) => {
	const styles = inputIconButtonVariants({ className });
	return <IconButton icon={icon} className={styles} variant="text" size="md" {...props} />;
};
