import React from 'react';
import { cn } from '../../../../utils/cn';

interface ScheduleContainerProps {
	children: React.ReactNode;
	className?: string;
	title?: string;
	subtitle?: string;
	loading?: boolean;
	loadingText?: string;
}

export const ScheduleContainer: React.FC<ScheduleContainerProps> = ({
	children,
	className,
	title,
	subtitle,
	loading = false,
	loadingText = 'Загрузка...',
}) => {
	if (loading) {
		return (
			<div className={cn('bg-white rounded-lg border shadow-sm p-8', className)}>
				<div className="flex items-center justify-center">
					<div className="text-sm text-gray-500">{loadingText}</div>
				</div>
			</div>
		);
	}

	return (
		<div className={cn('bg-white rounded-lg border shadow-sm overflow-hidden', className)}>
			{(title || subtitle) && (
				<div className="p-3 sm:p-4 border-b border-gray-200">
					{title && (
						<h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 leading-tight break-words">
							{title}
						</h3>
					)}
					{subtitle && (
						<p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed break-words">
							{subtitle}
						</p>
					)}
				</div>
			)}
			{children}
		</div>
	);
};
