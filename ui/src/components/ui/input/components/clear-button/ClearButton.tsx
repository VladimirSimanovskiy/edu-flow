import React from 'react';
import { IconButton } from '../../../button/icon-button/IconButton';
import type { IconButtonProps } from '../../../button/icon-button/IconButton';
import { CircleX } from 'lucide-react';

export interface ClearButtonProps extends Omit<IconButtonProps, 'onClick' | 'icon'> {
	onClear: () => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ onClear, ...props }) => {
	return (
		<IconButton
			type="button"
			icon={CircleX}
			variant="text"
			size="md"
			onClick={onClear}
			{...props}
		/>
	);
};

ClearButton.displayName = 'ClearButton';
