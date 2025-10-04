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
			<SelectTrigger className={className}>
				<SelectValue>
					<div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
						<currentType.icon className="w-4 h-4 shrink-0" />
						<span className="text-xs sm:text-sm whitespace-nowrap">
							{currentType.label}
						</span>
					</div>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{allTypes.map(type => {
					const TypeIcon = type.icon;
					return (
						<SelectItem key={type.id} value={type.id as string}>
							<div className="flex items-center gap-3">
								<TypeIcon className="w-4 h-4" />
								<span className="font-medium">{type.label}</span>
							</div>
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
};
