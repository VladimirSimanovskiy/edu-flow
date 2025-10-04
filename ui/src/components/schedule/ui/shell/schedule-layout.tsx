import React from 'react';
import { Card, CardFooter, CardTitle, CardSubTitle } from '@/components/ui/card';
import { ErrorMessage } from '@/components/ui/error-message';

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
					<CardTitle>{title}</CardTitle>
					<CardSubTitle>{description}</CardSubTitle>
					<CardFooter>
						<ErrorMessage
							error={`Ошибка загрузки данных: ${error.message}`}
							variant="banner"
						/>
					</CardFooter>
				</Card>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
			{/* Header */}
			<Card className="shadow-lg border-0">
				<CardTitle className="pb-4 text-lg sm:text-xl md:text-2xl leading-tight break-words">
					{title}
				</CardTitle>
				<CardSubTitle className="text-xs sm:text-sm md:text-base leading-relaxed break-words">
					{description}
				</CardSubTitle>
			</Card>

			{/* Content */}
			{children}
		</div>
	);
};

export default ScheduleLayout;
