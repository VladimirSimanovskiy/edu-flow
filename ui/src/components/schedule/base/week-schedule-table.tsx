import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useLessonNumbers } from '../hooks';
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
import { ScheduleColumnFilter } from '../filters';
import type { Lesson } from '../../../types/schedule';
import type { LessonData } from './lesson-cell';
import type { ValuesFilterOptions } from '../../../types/valuesFilter';

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
  getLessonForEntity: (entityId: number, day: Date, lessonNumber: number) => LessonData | undefined;
  entityLabel: string;
  onLessonClick?: (entityId: number, day: Date, lessonNumber: number, lesson: LessonData) => void;
  isLessonHighlighted?: (entityId: number, day: Date, lessonNumber: number, lesson: LessonData) => boolean;
  enableDragScroll?: boolean;
  filterOptions?: ValuesFilterOptions<number>;
  isFilterActive?: boolean;
  filteredEntities?: T[];
}

export const WeekScheduleTable = <T extends ScheduleEntity>({
  entities,
  weekStart,
  className,
  getLessonForEntity,
  entityLabel,
  onLessonClick,
  isLessonHighlighted,
  enableDragScroll = true,
  filterOptions,
  isFilterActive = false,
  filteredEntities,
}: WeekScheduleTableProps<T>) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const { lessonNumbers, isLoading: lessonNumbersLoading } = useLessonNumbers();

  const weekTitle = `Неделя ${format(weekStart, 'd MMM', { locale: ru })} - ${format(addDays(weekStart, 6), 'd MMM yyyy', { locale: ru })}`;

  // Use filtered entities if provided, otherwise use all entities
  const displayEntities = filteredEntities || entities;

  return (
    <ScheduleContainer
      className={className}
      title={weekTitle}
      loading={lessonNumbersLoading}
      loadingText="Загрузка расписания уроков..."
    >
      <ScheduleTable enableDragScroll={enableDragScroll}>
        <ScheduleTableHeader>
          {/* Основной заголовок с днями недели и номерами уроков */}
          <ScheduleTableRow className="bg-gray-50">
            <ScheduleTableCell 
              header 
              width="w-20 sm:w-32 md:w-48" 
              className="border-r sticky left-0 bg-gray-50 z-20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="hidden sm:inline">{entityLabel}</span>
                  <span className="sm:hidden text-xs">
                    {entityLabel === 'Классы' ? 'Кл.' : 'Уч.'}
                  </span>
                </div>
                {filterOptions && (
                  <ScheduleColumnFilter
                    options={filterOptions}
                    isActive={isFilterActive}
                    triggerText=""
                    className="ml-2"
                  />
                )}
              </div>
            </ScheduleTableCell>
            {days.map((day) => (
              <ScheduleTableCell 
                key={day.toISOString()} 
                header 
                className="text-center p-0.5 sm:p-1 border-r last:border-r-0"
              >
                <div className="mb-1">
                  <div className="font-semibold text-xs sm:text-sm">
                    {format(day, 'EEE', { locale: ru })}
                  </div>
                  <div className="text-xs hidden sm:block text-gray-500">
                    {format(day, 'd MMM', { locale: ru })}
                  </div>
                </div>
                <LessonHeader lessonNumbers={lessonNumbers} />
              </ScheduleTableCell>
            ))}
          </ScheduleTableRow>
        </ScheduleTableHeader>
        
        <ScheduleTableBody>
          {displayEntities.map((entity) => (
            <ScheduleTableRow key={entity.id}>
              <ScheduleTableCell className="border-r sticky left-0 bg-white z-10">
                <div className="font-medium text-xs sm:text-sm text-gray-900">
                  {entity.name}
                </div>
                {entity.subtitle && (
                  <div className="text-xs hidden sm:block text-gray-500">
                    {entity.subtitle}
                  </div>
                )}
              </ScheduleTableCell>
              {days.map((day) => (
                <ScheduleTableCell 
                  key={`${entity.id}-${day.toISOString()}`} 
                  className="p-0.5 sm:p-1 border-r last:border-r-0"
                >
                  <LessonGrid
                    lessonNumbers={lessonNumbers}
                    getLesson={(lessonNumber) => getLessonForEntity(entity.id, day, lessonNumber)}
                    onLessonClick={onLessonClick ? (lessonNumber, lesson) => onLessonClick(entity.id, day, lessonNumber, lesson) : undefined}
                    isLessonHighlighted={isLessonHighlighted ? (lessonNumber, lesson) => isLessonHighlighted(entity.id, day, lessonNumber, lesson) : undefined}
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
