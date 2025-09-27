import React from 'react';
import { TeacherGrid } from '../renderers/teacher';
import type {
	ScheduleRenderer,
	ScheduleRendererProps,
} from '../interfaces/schedule-renderer.interface';
import type { ViewType } from '@/types/scheduleConfig';

export class TeacherScheduleRenderer implements ScheduleRenderer {
	private viewType: ViewType;

	constructor(viewType: ViewType) {
		this.viewType = viewType;
	}

	render(props: ScheduleRendererProps): React.ReactElement {
		const { teachers, lessons, date } = props;
		const teachersList = teachers || [];

		return (
			<TeacherGrid
				viewType={this.viewType}
				date={date}
				lessons={lessons}
				teachers={teachersList}
			/>
		);
	}
}
