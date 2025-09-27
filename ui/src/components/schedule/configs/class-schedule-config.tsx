import { BookOpen } from 'lucide-react';
import type { ScheduleConfig } from '../interfaces/schedule-renderer.interface';
import type { ViewType } from '@/types/scheduleConfig';
import { ClassScheduleRenderer } from '../strategies/class-schedule-strategy';

export class ClassScheduleConfig implements ScheduleConfig {
	readonly type = 'classes';
	readonly title = 'Расписание классов';
	readonly description = 'Просмотр расписания учебных классов';
	readonly metadata = {
		id: 'classes' as const,
		label: 'Классы',
		icon: BookOpen,
		color: 'green',
	};

	getRenderer(viewType: ViewType): ClassScheduleRenderer {
		return new ClassScheduleRenderer(viewType);
	}
}
