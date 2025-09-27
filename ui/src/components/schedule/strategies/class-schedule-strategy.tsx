import React from 'react';
import { ClassGrid } from '../renderers/class';
import type {
	ScheduleRenderer,
	ScheduleRendererProps,
} from '../interfaces/schedule-renderer.interface';
import type { ViewType } from '@/types/scheduleConfig';

export class ClassScheduleRenderer implements ScheduleRenderer {
	private viewType: ViewType;

	constructor(viewType: ViewType) {
		this.viewType = viewType;
	}

	render(props: ScheduleRendererProps): React.ReactElement {
		const { classes, lessons, date } = props;
		const classesList = classes || [];

		return (
			<ClassGrid
				viewType={this.viewType}
				date={date}
				lessons={lessons}
				classes={classesList}
			/>
		);
	}
}
