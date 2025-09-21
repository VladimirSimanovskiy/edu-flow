import React from 'react';
import { cn } from '../../../../utils/cn';

interface LessonHeaderProps {
  lessonNumbers: number[];
  className?: string;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lessonNumbers,
  className,
}) => {
  return (
    <div 
      className={cn('grid gap-0.5', className)}
      style={{ 
        gridTemplateColumns: `repeat(${lessonNumbers?.length ?? 0}, 1fr)` 
      }}
    >
      {lessonNumbers?.map(num => (
        <div 
          key={num} 
          className="text-center font-semibold text-xs text-gray-600 py-0.5"
        >
          {num}
        </div>
      ))}
    </div>
  );
};


