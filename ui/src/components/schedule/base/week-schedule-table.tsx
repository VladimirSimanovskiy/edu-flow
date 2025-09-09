import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { tokens } from '../../../design-system/tokens';
import { useLessonNumbers } from '../../../hooks/useLessonNumbers';
import { ScheduleContainer } from './schedule-container';
import { 
  ScheduleTable,
  ScheduleTableHeader,
  ScheduleTableBody,
  ScheduleTableRow,
  ScheduleTableCell
} from './schedule-table';
import { LessonHeader } from './lesson-header';
import { LessonGrid } from './lesson-grid';
import type { Lesson } from '../../../types/schedule';

export interface ScheduleEntity {
  id: number;
  name: string;
  subtitle?: string;
}

export interface WeekScheduleTableProps<T extends ScheduleEntity> {
  entities: T[];
  lessons: Lesson[];
  weekStart: Date;
  className?: string;
  variant: 'class' | 'teacher';
  getLessonForEntity: (entityId: number, day: Date, lessonNumber: number) => Lesson | undefined;
  entityLabel: string;
  entitySubLabel: string;
}

export const WeekScheduleTable = <T extends ScheduleEntity>({
  entities,
  weekStart,
  className,
  variant,
  getLessonForEntity,
  entityLabel,
  entitySubLabel,
}: WeekScheduleTableProps<T>) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const { lessonNumbers, isLoading: lessonNumbersLoading } = useLessonNumbers();

  const weekTitle = `Неделя ${format(weekStart, 'd MMM', { locale: ru })} - ${format(addDays(weekStart, 6), 'd MMM yyyy', { locale: ru })}`;

  return (
    <ScheduleContainer
      className={className}
      title={weekTitle}
      loading={lessonNumbersLoading}
      loadingText="Загрузка расписания уроков..."
    >
      <ScheduleTable>
        <ScheduleTableHeader>
          {/* Основной заголовок */}
          <ScheduleTableRow className="bg-gray-50">
            <ScheduleTableCell header width="w-48" className="border-r">
              {entityLabel}
            </ScheduleTableCell>
            {days.map((day) => (
              <ScheduleTableCell 
                key={day.toISOString()} 
                header 
                className="text-center p-2 border-r last:border-r-0"
              >
                <div>
                  <div 
                    className="font-semibold"
                    style={{ fontWeight: tokens.typography.fontWeight.semibold }}
                  >
                    {format(day, 'EEE', { locale: ru })}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ 
                      fontSize: tokens.typography.fontSize.xs,
                      color: tokens.colors.gray[500]
                    }}
                  >
                    {format(day, 'd MMM', { locale: ru })}
                  </div>
                </div>
              </ScheduleTableCell>
            ))}
          </ScheduleTableRow>
          
          {/* Подзаголовок с номерами уроков */}
          <ScheduleTableRow className="bg-gray-50">
            <ScheduleTableCell header width="w-48" className="border-r">
              {entitySubLabel}
            </ScheduleTableCell>
            {days.map((day) => (
              <ScheduleTableCell 
                key={`sub-${day.toISOString()}`} 
                header 
                className="text-center p-1 border-r last:border-r-0"
              >
                <LessonHeader lessonNumbers={lessonNumbers} />
              </ScheduleTableCell>
            ))}
          </ScheduleTableRow>
        </ScheduleTableHeader>
        
        <ScheduleTableBody>
          {entities.map((entity) => (
            <ScheduleTableRow key={entity.id}>
              <ScheduleTableCell className="border-r">
                <div 
                  className="font-medium"
                  style={{ 
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.gray[900]
                  }}
                >
                  {entity.name}
                </div>
                {entity.subtitle && (
                  <div 
                    className="text-xs"
                    style={{ 
                      fontSize: tokens.typography.fontSize.xs,
                      color: tokens.colors.gray[500]
                    }}
                  >
                    {entity.subtitle}
                  </div>
                )}
              </ScheduleTableCell>
              {days.map((day) => (
                <ScheduleTableCell 
                  key={`${entity.id}-${day.toISOString()}`} 
                  className="p-1 border-r last:border-r-0"
                >
                  <LessonGrid
                    lessonNumbers={lessonNumbers}
                    getLesson={(lessonNumber) => getLessonForEntity(entity.id, day, lessonNumber)}
                    variant={variant}
                  />
                </ScheduleTableCell>
              ))}
            </ScheduleTableRow>
          ))}
        </ScheduleTableBody>
      </ScheduleTable>
    </ScheduleContainer>
  );
};
