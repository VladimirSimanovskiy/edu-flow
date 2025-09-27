import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { ErrorMessage } from '../../ui/error-message';

interface ScheduleLayoutProps {
	title: string;
	description: string;
	children: React.ReactNode;
	error?: Error | null;
}

export const ScheduleLayout: React.FC<ScheduleLayoutProps> = ({
	title,
	description,
	children,
	error = null,
}) => {
	if (error) {
		return (
			<div className="p-6">
				<Card className="border shadow-none">
					<CardHeader>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{description}</CardDescription>
					</CardHeader>
					<CardContent>
						<ErrorMessage
							error={`Ошибка загрузки данных: ${error.message}`}
							variant="banner"
						/>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
			{/* Header */}
			<Card className="shadow-lg border-0">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg sm:text-xl md:text-2xl leading-tight break-words">
						{title}
					</CardTitle>
					<CardDescription className="text-xs sm:text-sm md:text-base leading-relaxed break-words">
						{description}
					</CardDescription>
				</CardHeader>
			</Card>

			{/* Content */}
			{children}
		</div>
	);
};

export default ScheduleLayout;
