import React from 'react';
import { Progress } from '@/components/ui/progress';
import type { LoadingProgressState } from '@/types/loadingProgress';
import { cn } from '@/utils/cn';

export interface ScheduleLoadingProgressProps {
	/** Состояние загрузки */
	state: LoadingProgressState;
	/** Позиция прогресс-бара */
	position?: 'top' | 'overlay';
	/** Дополнительные CSS классы */
	className?: string;
	/** Показывать ли сообщение */
	showMessage?: boolean;
}

export const ScheduleLoadingProgress: React.FC<ScheduleLoadingProgressProps> = ({
	state,
	position = 'top',
	className,
	showMessage = true,
}) => {
	if (!state.isLoading && state.progress === 0) {
		return null;
	}

	const progressBar = (
		<Progress
			value={state.isLoading ? state.progress : 0}
			size="sm"
			indeterminate={state.isLoading && state.progress === 0}
			className={cn(position === 'overlay' && 'shadow-lg', className)}
		/>
	);

	if (position === 'overlay') {
		return (
			<div
				className={cn(
					'absolute top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm',
					'transition-all duration-300 ease-in-out',
					state.isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
				)}
			>
				<div className="p-2">{progressBar}</div>
			</div>
		);
	}

	return <div className="h-1">{progressBar}</div>;
};
