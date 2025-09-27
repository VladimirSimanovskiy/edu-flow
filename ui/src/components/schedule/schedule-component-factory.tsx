import React from 'react';
import type { ScheduleType, ViewType } from '@/types/scheduleConfig';
import type { Teacher, Class, Lesson } from '@/types/schedule';
import { scheduleConfigRegistry } from './registry/schedule-config-registry';

// Фабрика для получения конфигурации расписания
export const getScheduleConfig = (type: ScheduleType) => {
	const config = scheduleConfigRegistry.get(type);
	if (!config) {
		throw new Error(`Schedule configuration for type "${type}" not found`);
	}
	return config;
};

// Фабрика для рендеринга компонента расписания
export const renderScheduleComponent = (
	type: ScheduleType,
	viewType: ViewType,
	props: {
		teachers?: Teacher[];
		classes?: Class[];
		lessons: Lesson[];
		date: Date;
		weekStart?: Date;
	}
): React.ReactElement => {
	const config = getScheduleConfig(type);
	const renderer = config.getRenderer(viewType);
	return renderer.render(props);
};

// Хук для получения конфигурации расписания
export const useScheduleConfig = (type: ScheduleType) => {
	return getScheduleConfig(type);
};
