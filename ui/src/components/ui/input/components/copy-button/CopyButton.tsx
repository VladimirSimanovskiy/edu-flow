import { IconButton } from '../../../button/icon-button/IconButton';
import { Check, Copy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';

interface CopyButtonProps {
	value: string;
	className?: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ value, className }) => {
	const [hasCopied, setHasCopied] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setHasCopied(false);
		}, 2000);
		return () => clearTimeout(timeout);
	}, [hasCopied]);

	const handleCopy = useCallback(() => {
		if (value) navigator.clipboard.writeText(String(value));
		setHasCopied(true);
	}, [value]);
	return (
		<IconButton
			icon={hasCopied ? Check : Copy}
			className={className}
			variant="text"
			size="md"
			onClick={handleCopy}
		/>
	);
};
