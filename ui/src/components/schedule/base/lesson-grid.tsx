import React from 'react';
import { cn } from '../../../utils/cn';
import { LessonCell, type LessonData } from './lesson-cell';

interface LessonGridProps {
  lessonNumbers: number[];
  getLesson: (lessonNumber: number) => LessonData | undefined;
  className?: string;
  onLessonClick?: (lessonNumber: number, lesson: LessonData) => void;
  isLessonHighlighted?: (lessonNumber: number, lesson: LessonData) => boolean;
}

export const LessonGrid: React.FC<LessonGridProps> = ({
  lessonNumbers,
  getLesson,
  className,
  onLessonClick,
  isLessonHighlighted,
}) => {
  return (
    <div 
      className={cn('grid gap-0.5 sm:gap-1 md:gap-1.5', className)}
      style={{ 
        gridTemplateColumns: `repeat(${lessonNumbers?.length ?? 0}, minmax(5rem, 1fr))` 
      }}
    >
      {lessonNumbers?.map(lessonNumber => {
        const lesson = getLesson(lessonNumber);
        const isHighlighted = lesson && isLessonHighlighted ? isLessonHighlighted(lessonNumber, lesson) : false;
        
        return (
          <LessonCell
            key={lessonNumber}
            lesson={lesson}
            lessonNumber={lessonNumber}
            onClick={lesson && onLessonClick ? () => onLessonClick(lessonNumber, lesson) : undefined}
            isHighlighted={isHighlighted}
          />
        );
      })}
    </div>
  );
};
