# Компоненты - Лучшие практики

## Обзор улучшений

Я применил лучшие практики по композиции и стилизации компонентов в вашем проекте. Вот что было сделано:

## 🏗️ Архитектурные улучшения

### 1. Композиция компонентов
- **Разделение ответственности**: Выделил базовые компоненты (`ScheduleContainer`, `ScheduleTable`, `LessonCell`)
- **Переиспользование**: Создал композитные компоненты, которые можно легко комбинировать
- **Извлечение логики**: Вынес бизнес-логику в отдельные хуки (`useScheduleLogic`)

### 2. Дизайн-система
- **Централизованные токены**: Все стили теперь используют дизайн-токены из `tokens.ts`
- **Консистентность**: Единообразные цвета, отступы, типографика во всех компонентах
- **Масштабируемость**: Легко изменять дизайн через токены

## 📁 Структура компонентов

```
components/
├── schedule/
│   ├── base/                    # Базовые композитные компоненты
│   │   ├── schedule-container.tsx
│   │   ├── schedule-table.tsx
│   │   ├── lesson-cell.tsx
│   │   ├── lesson-grid.tsx
│   │   ├── lesson-header.tsx
│   │   └── index.ts
│   ├── class-day-schedule.tsx   # Рефакторенный компонент
│   ├── teacher-day-schedule.tsx # Рефакторенный компонент
│   └── schedule-view.tsx        # Улучшенный главный компонент
├── ui/                          # Улучшенные UI компоненты
│   ├── button.tsx
│   ├── card.tsx
│   ├── table.tsx
│   ├── badge.tsx
│   ├── loading-spinner.tsx
│   ├── error-message.tsx
│   ├── date-picker.tsx
│   ├── view-toggle.tsx
│   └── error-boundary.tsx
└── hooks/
    ├── useScheduleLogic.ts      # Извлеченная бизнес-логика
    └── useDesignTokens.ts       # Хук для работы с токенами
```

## 🎨 Стилизация

### Дизайн-токены
Все компоненты теперь используют централизованные токены:

```typescript
// Цвета
tokens.colors.primary[500]
tokens.colors.success[100]
tokens.colors.error[600]

// Типографика
tokens.typography.fontSize.lg
tokens.typography.fontWeight.semibold

// Отступы
tokens.spacing[4]
tokens.spacing[6]

// Анимации
tokens.animation.duration.fast
tokens.animation.easing.ease
```

### Улучшенные компоненты

#### Button
- Добавлен loading state
- Улучшена доступность
- Использует дизайн-токены

#### Card
- Варианты: `default`, `elevated`, `outlined`
- Настраиваемые отступы
- Композитная структура

#### Table
- Улучшенная стилизация
- Консистентные отступы
- Hover эффекты

#### ErrorMessage
- Варианты: `default`, `inline`, `banner`
- Поддержка retry функциональности
- Иконки и улучшенная типографика

## 🔧 Композиция

### Базовые компоненты расписания

#### ScheduleContainer
```typescript
<ScheduleContainer
  title="Расписание на день"
  loading={isLoading}
  loadingText="Загрузка..."
>
  {/* Контент */}
</ScheduleContainer>
```

#### LessonGrid
```typescript
<LessonGrid
  lessonNumbers={[1, 2, 3, 4, 5, 6, 7]}
  getLesson={(lessonNumber) => getLesson(classId, lessonNumber)}
  variant="class"
/>
```

#### LessonCell
```typescript
<LessonCell
  lesson={lessonData}
  lessonNumber={1}
  variant="class" // или "teacher"
/>
```

## 🚀 Преимущества

### 1. Переиспользование
- Базовые компоненты можно использовать в разных контекстах
- Легко создавать новые варианты расписания

### 2. Поддерживаемость
- Изменения в дизайне делаются в одном месте (токены)
- Четкое разделение ответственности

### 3. Тестируемость
- Бизнес-логика вынесена в хуки
- Компоненты стали более простыми

### 4. Производительность
- Мемоизация в хуках
- Оптимизированные ререндеры

### 5. Доступность
- Улучшенная семантика
- Поддержка клавиатуры
- ARIA атрибуты

## 📝 Использование

### Создание нового компонента расписания
```typescript
import { 
  ScheduleContainer, 
  ScheduleTable, 
  LessonGrid 
} from './base';

export const MySchedule = ({ data, date }) => {
  return (
    <ScheduleContainer title="Мое расписание">
      <ScheduleTable>
        {/* Структура таблицы */}
        <LessonGrid
          lessonNumbers={lessonNumbers}
          getLesson={getLesson}
          variant="class"
        />
      </ScheduleTable>
    </ScheduleContainer>
  );
};
```

### Использование дизайн-токенов
```typescript
import { useDesignTokens } from '../../hooks/useDesignTokens';

const MyComponent = () => {
  const tokens = useDesignTokens();
  
  return (
    <div style={{
      padding: tokens.spacing[4],
      backgroundColor: tokens.colors.primary[100],
      borderRadius: tokens.borderRadius.lg
    }}>
      {/* Контент */}
    </div>
  );
};
```

## 🎯 Следующие шаги

1. **Тестирование**: Добавить unit тесты для новых компонентов
2. **Документация**: Создать Storybook для компонентов
3. **Анимации**: Добавить микроанимации для улучшения UX
4. **Темизация**: Поддержка темной темы через токены
5. **Оптимизация**: Lazy loading для больших компонентов

Эти улучшения делают код более масштабируемым, поддерживаемым и соответствующим современным стандартам React разработки.
