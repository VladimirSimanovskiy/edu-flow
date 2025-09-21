import type { TimeColumn, TimeViewStrategy } from '../../core/types';
import type { Lesson } from '../../../../types/schedule';

export class DayViewStrategy implements TimeViewStrategy {
  private lessonNumbers: number[];

  constructor(lessonNumbers: number[] = [1,2,3,4,5,6]) {
    this.lessonNumbers = lessonNumbers;
  }

  getColumns(_input: { date: Date }): TimeColumn[] {
    return this.lessonNumbers.map(n => ({ key: String(n), label: String(n) }));
  }

  getCellKey(lesson: Lesson): string {
    return String(lesson.lessonNumber);
  }

  getPrefetchRanges(date: Date): Array<{ start: Date; end: Date }> {
    const oneDay = 24 * 60 * 60 * 1000;
    return [
      { start: new Date(date.getTime() - oneDay), end: new Date(date.getTime() - oneDay) },
      { start: date, end: date },
      { start: new Date(date.getTime() + oneDay), end: new Date(date.getTime() + oneDay) },
    ];
  }
}


