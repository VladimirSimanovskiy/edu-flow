import type { ScheduleConfig, IScheduleConfigRegistry } from '../interfaces/schedule-renderer.interface';

class ScheduleConfigRegistry implements IScheduleConfigRegistry {
  private configs = new Map<string, ScheduleConfig>();

  register(config: ScheduleConfig): void {
    this.configs.set(config.type, config);
  }

  get(type: string): ScheduleConfig | undefined {
    return this.configs.get(type);
  }

  getAll(): ScheduleConfig[] {
    return Array.from(this.configs.values());
  }
}

export const scheduleConfigRegistry = new ScheduleConfigRegistry();

// Регистрируем стандартные конфигурации
import { TeacherScheduleConfig } from '../configs/teacher-schedule-config';
import { ClassScheduleConfig } from '../configs/class-schedule-config';

scheduleConfigRegistry.register(new TeacherScheduleConfig());
scheduleConfigRegistry.register(new ClassScheduleConfig());
