import { Users } from 'lucide-react';
import type { ScheduleConfig } from '../interfaces/schedule-renderer.interface';
import type { ViewType } from '@/types/scheduleConfig';
import { TeacherScheduleRenderer } from '../strategies/teacher-schedule-strategy';

export class TeacherScheduleConfig implements ScheduleConfig {
	readonly type = 'teachers';
	readonly title = 'Расписание учителей';
	readonly description = 'Просмотр расписания преподавателей';
	readonly metadata = {
		id: 'teachers' as const,
		label: 'Учителя',
		icon: Users,
		color: 'blue',
	};

	getRenderer(viewType: ViewType): TeacherScheduleRenderer {
		return new TeacherScheduleRenderer(viewType);
	}
}
