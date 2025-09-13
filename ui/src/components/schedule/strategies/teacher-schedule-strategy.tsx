/**
 * Стратегия рендеринга расписания учителей
 * Применяет принципы Open/Closed и Dependency Inversion
 */

import React from 'react';
import { TeacherScheduleTable } from '../teacher-schedule-table';
import { TeacherDaySchedule } from '../teacher-day-schedule';
import type { ScheduleRenderer, ScheduleRendererProps } from '../interfaces/schedule-renderer.interface';
import type { ViewType } from '../../../types/scheduleConfig';

export class TeacherScheduleRenderer implements ScheduleRenderer {
  private viewType: ViewType;

  constructor(viewType: ViewType) {
    this.viewType = viewType;
  }

  render(props: ScheduleRendererProps): React.ReactElement {
    const { teachers, lessons, date, weekStart } = props;
    const teachersList = teachers || [];

    if (this.viewType === 'day') {
      return (
        <TeacherDaySchedule
          teachers={teachersList}
          lessons={lessons}
          date={date}
        />
      );
    } else {
      return (
        <TeacherScheduleTable
          teachers={teachersList}
          lessons={lessons}
          weekStart={weekStart!}
        />
      );
    }
  }
}
