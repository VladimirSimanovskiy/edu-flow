/**
 * Стратегия рендеринга расписания классов
 * Применяет принципы Open/Closed и Dependency Inversion
 */

import React from 'react';
import { ClassScheduleTable } from '../class-schedule-table';
import { ClassDaySchedule } from '../class-day-schedule';
import type { ScheduleRenderer, ScheduleRendererProps } from '../interfaces/schedule-renderer.interface';
import type { ViewType } from '../../../types/scheduleConfig';

export class ClassScheduleRenderer implements ScheduleRenderer {
  private viewType: ViewType;

  constructor(viewType: ViewType) {
    this.viewType = viewType;
  }

  render(props: ScheduleRendererProps): React.ReactElement {
    const { classes, lessons, date, weekStart } = props;
    const classesList = classes || [];

    if (this.viewType === 'day') {
      return (
        <ClassDaySchedule
          classes={classesList}
          lessons={lessons}
          date={date}
        />
      );
    } else {
      return (
        <ClassScheduleTable
          classes={classesList}
          lessons={lessons}
          weekStart={weekStart!}
        />
      );
    }
  }
}
