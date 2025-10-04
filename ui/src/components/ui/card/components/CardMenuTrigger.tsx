import { IconButton } from '../../button/icon-button/IconButton';
import type { IconButtonProps } from '../../button/icon-button/IconButton';
import { useIsMobile } from '../../../../hooks/useBreakpoints';
import { MoreVertical } from 'lucide-react';
import React from 'react';
import { tv } from 'tailwind-variants';

const cardMenuTriggerStyles = tv({
	base: [
		'absolute right-px top-1.5 h-8 w-8',
		'invisible group-focus-within/card:visible group-hover/card:visible data-[state=open]:visible touch:visible',
	],
	variants: {
		isMobile: {
			true: 'right-0 top-1',
		},
	},
});

export type CardMenuTriggerProps = Omit<IconButtonProps, 'icon'> & {
	iconProps?: Partial<IconButtonProps>;
};

export const CardMenuTrigger = React.forwardRef<HTMLButtonElement, CardMenuTriggerProps>(
	({ className, ...props }, ref) => {
		const isMobile = useIsMobile();

		return (
			<IconButton
				size="sm"
				variant="text"
				icon={MoreVertical}
				className={cardMenuTriggerStyles({ className, isMobile })}
				ref={ref}
				{...props}
			/>
		);
	}
);

CardMenuTrigger.displayName = 'CardMenuTrigger';
