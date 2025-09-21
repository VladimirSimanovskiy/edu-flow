import { startOfWeek, addDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { TimeColumn, TimeViewStrategy } from '../../core/types';
import type { Lesson } from '../../../../types/schedule';

export class WeekViewStrategy implements TimeViewStrategy {
  private lessonNumbers: number[];

  constructor(lessonNumbers: number[] = [1,2,3,4,5,6]) {
    this.lessonNumbers = lessonNumbers;
  }

  getColumns(input: { date: Date }): TimeColumn[] {
    const weekStart = startOfWeek(input.date, { weekStartsOn: 1 });
    const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
    const columns: TimeColumn[] = [];
    for (let i = 0; i < days.length; i++) {
      const dayLabel = format(days[i], 'EEE', { locale: ru });
      for (const n of this.lessonNumbers) {
        columns.push({
          key: `${i + 1}-${n}`,
          label: String(n),
          groupKey: String(i + 1),
          groupLabel: dayLabel,
        });
      }
    }
    return columns;
  }

  getCellKey(lesson: Lesson): string {
    const dow = (lesson as any).dayOfWeek as number; // 1..7
    const lessonNumber = (lesson as any).lessonNumber as number;
    return `${dow}-${lessonNumber}`;
  }

  getPrefetchRanges(date: Date): Array<{ start: Date; end: Date }> {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const prev = new Date(start);
    prev.setDate(start.getDate() - 7);
    const next = new Date(start);
    next.setDate(start.getDate() + 7);
    const end = addDays(start, 4);
    const prevEnd = addDays(prev, 4);
    const nextEnd = addDays(next, 4);
    return [
      { start: prev, end: prevEnd },
      { start, end },
      { start: next, end: nextEnd },
    ];
  }
}


