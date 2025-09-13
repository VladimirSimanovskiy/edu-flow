import type { ScheduleConfig } from '../interfaces/schedule-renderer.interface';
import type { ViewType } from '../../../types/scheduleConfig';
import { TeacherScheduleRenderer } from '../strategies/teacher-schedule-strategy';

export class TeacherScheduleConfig implements ScheduleConfig {
  readonly type = 'teachers';
  readonly title = 'Расписание учителей';
  readonly description = 'Просмотр расписания преподавателей';

  getRenderer(viewType: ViewType): TeacherScheduleRenderer {
    return new TeacherScheduleRenderer(viewType);
  }
}
