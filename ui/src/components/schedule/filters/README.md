# Schedule Filters

Компоненты для фильтрации расписания по учителям и классам.

## Компоненты

### ValuesFilter

Основной компонент фильтрации с поиском и чекбоксами.

```tsx
import { ValuesFilter } from '@/components/ui/values-filter';

const filterOptions = {
  onFilterChanged: (inList, items) => {
    console.log('Filter changed:', { inList, items });
  },
  valueView: (item) => `Item ${item}`,
  fetchData: async (page, searchQuery) => {
    // API call logic
    return { values: [], fullLoaded: true };
  },
  searchPlaceholder: "Поиск...",
  selectAllText: "Выбрать все",
  loadingText: "Загрузка...",
};

<ValuesFilter options={filterOptions} />
```

### ScheduleColumnFilter

Компонент фильтра для интеграции в заголовки таблиц расписания.

```tsx
import { ScheduleColumnFilter } from '@/components/schedule/filters';

<ScheduleColumnFilter
  options={filterOptions}
  isActive={isFilterActive}
  triggerText="Фильтр"
/>
```

## Хуки

### useScheduleFilters

Хук для управления фильтрами расписания.

```tsx
import { useScheduleFilters } from '@/components/schedule/hooks';

const {
  teacherFilterOptions,
  classFilterOptions,
  isTeacherFilterActive,
  isClassFilterActive,
  isTeacherVisible,
  isClassVisible,
  clearFilters,
} = useScheduleFilters({
  teachers,
  classes,
  onFiltersChange: (filters) => {
    console.log('Filters changed:', filters);
  },
});
```

## Интеграция

Фильтры автоматически интегрированы в:

### Недельное расписание:
- `ClassScheduleTable` - фильтрация по классам
- `TeacherScheduleTable` - фильтрация по учителям

### Дневное расписание:
- `ClassDaySchedule` - фильтрация по классам
- `TeacherDaySchedule` - фильтрация по учителям

Фильтры отображаются в заголовке таблицы как кнопка с иконкой фильтра и работают одинаково во всех режимах просмотра расписания.
