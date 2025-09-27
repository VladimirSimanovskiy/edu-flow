import type { Teacher, Class, Lesson } from '@/types/schedule';
import type { ViewType, ScheduleTypeMetadata } from '@/types/scheduleConfig';

export interface ScheduleRendererProps {
	teachers?: Teacher[];
	classes?: Class[];
	lessons: Lesson[];
	date: Date;
	weekStart?: Date;
}

export interface ScheduleRenderer {
	render(props: ScheduleRendererProps): React.ReactElement;
}

export interface ScheduleConfig {
	type: string;
	title: string;
	description: string;
	metadata: ScheduleTypeMetadata;
	getRenderer(viewType: ViewType): ScheduleRenderer;
}

export interface IScheduleConfigRegistry {
	register(config: ScheduleConfig): void;
	get(type: string): ScheduleConfig | undefined;
	getAll(): ScheduleConfig[];
	getMetadata(type: string): ScheduleTypeMetadata | undefined;
	getAllMetadata(): ScheduleTypeMetadata[];
}
