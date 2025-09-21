export { scheduleConfigRegistry } from './registry/schedule-config-registry';
export { TeacherScheduleConfig } from './configs/teacher-schedule-config';
export { ClassScheduleConfig } from './configs/class-schedule-config';

import type { FeatureId } from './features/types';

export type ScheduleKind = 'teachers' | 'classes';
export type ViewKind = 'day' | 'week';

type FeatureMatrix = {
  [K in ScheduleKind]: { [V in ViewKind]: FeatureId[] }
};

export const featureMatrix: FeatureMatrix = {
  teachers: {
    day: ['highlight', 'substitution', 'hover-link'],
    week: ['highlight', 'substitution', 'hover-link'],
  },
  classes: {
    day: ['highlight'],
    week: ['highlight'],
  },
};

export const getActiveFeatures = (kind: ScheduleKind, view: ViewKind): ReadonlyArray<FeatureId> => {
  return featureMatrix[kind][view];
};

export const getFeatureFlags = (kind: ScheduleKind, view: ViewKind) => {
  const list = new Set(getActiveFeatures(kind, view));
  return {
    highlight: list.has('highlight'),
    substitution: list.has('substitution'),
    hoverLink: list.has('hover-link'),
  } as const;
};


