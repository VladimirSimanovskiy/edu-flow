import React from 'react';
import { cn } from '../../utils/cn';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
	error: string;
	className?: string;
	variant?: 'default' | 'inline' | 'banner';
	onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
	error,
	className,
	variant = 'default',
	onRetry,
}) => {
	const getVariantClasses = () => {
		switch (variant) {
			case 'inline':
				return 'p-2 text-sm';
			case 'banner':
				return 'p-4 mb-4';
			default:
				return 'p-3';
		}
	};

	return (
		<Alert status="error" className={cn(getVariantClasses(), className)}>
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Ошибка</AlertTitle>
			<AlertDescription className="mt-1">
				{error}
				{onRetry && (
					<button
						onClick={onRetry}
						className="mt-2 block text-sm font-medium underline hover:no-underline transition-colors"
					>
						Попробовать снова
					</button>
				)}
			</AlertDescription>
		</Alert>
	);
};
