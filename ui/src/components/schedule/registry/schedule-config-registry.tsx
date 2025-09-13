/**
 * Реестр конфигураций расписания
 * Применяет принципы Open/Closed и Dependency Inversion
 * Позволяет регистрировать новые типы расписания без изменения существующего кода
 */

import type { ScheduleConfig, ScheduleConfigRegistry } from '../interfaces/schedule-renderer.interface';

class ScheduleConfigRegistryImpl implements ScheduleConfigRegistry {
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

// Создаем единственный экземпляр реестра
export const scheduleConfigRegistry = new ScheduleConfigRegistryImpl();

// Регистрируем стандартные конфигурации
import { TeacherScheduleConfig } from '../configs/teacher-schedule-config';
import { ClassScheduleConfig } from '../configs/class-schedule-config';

scheduleConfigRegistry.register(new TeacherScheduleConfig());
scheduleConfigRegistry.register(new ClassScheduleConfig());
