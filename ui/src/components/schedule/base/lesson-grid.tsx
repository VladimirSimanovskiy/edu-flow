import React from 'react';
import { cn } from '../../../utils/cn';
import { LessonCell, type LessonData } from './lesson-cell';

interface LessonGridProps {
  lessonNumbers: number[];
  getLesson: (lessonNumber: number) => LessonData | undefined;
  variant?: 'class' | 'teacher';
  className?: string;
}

export const LessonGrid: React.FC<LessonGridProps> = ({
  lessonNumbers,
  getLesson,
  variant = 'class',
  className,
}) => {
  return (
    <div 
      className={cn('grid gap-0.5 sm:gap-1 md:gap-1.5', className)}
      style={{ 
        gridTemplateColumns: `repeat(${lessonNumbers.length}, minmax(5rem, 1fr))` 
      }}
    >
      {lessonNumbers.map(lessonNumber => {
        const lesson = getLesson(lessonNumber);
        
        return (
          <LessonCell
            key={lessonNumber}
            lesson={lesson}
            lessonNumber={lessonNumber}
            variant={variant}
          />
        );
      })}
    </div>
  );
};
