import React from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { scheduleConfigRegistry } from '../registry/schedule-config-registry';
import type { ScheduleType } from '@/types/scheduleConfig';
import { cn } from '@/lib/utils';

interface ScheduleTypeSelectorProps {
	scheduleType: ScheduleType;
	onChange: (type: ScheduleType) => void;
	disabled?: boolean;
	className?: string;
}

export const ScheduleTypeSelector: React.FC<ScheduleTypeSelectorProps> = ({
	scheduleType,
	onChange,
	disabled = false,
	className,
}) => {
	const currentType = scheduleConfigRegistry.getMetadata(scheduleType);
	const allTypes = scheduleConfigRegistry.getAllMetadata();

	if (!currentType) {
		return null;
	}

	return (
		<Select value={scheduleType} onValueChange={onChange} disabled={disabled}>
			<SelectTrigger
				className={cn(
					// Mobile: fill available width
					'h-8 py-1.5 w-full flex-1',
					// Desktop: intrinsic width with bounds
					'sm:h-9 sm:py-2 sm:w-auto sm:flex-none sm:min-w-[9rem] sm:max-w-[16rem]',
					className
				)}
			>
				<SelectValue>
					<div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
						<currentType.icon className="w-4 h-4 shrink-0" />
						{currentType.label}
					</div>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{allTypes.map(type => {
					const TypeIcon = type.icon;
					return (
						<SelectItem key={type.id} value={type.id}>
							<div className="flex items-center gap-3">
								<TypeIcon className="w-4 h-4" />
								{type.label}
							</div>
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
};
