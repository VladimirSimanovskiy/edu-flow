import React from 'react';
import { cn } from '../../../utils/cn';
import { tokens } from '../../../design-system/tokens';

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
      className={cn('grid gap-1', className)}
      style={{ 
        gridTemplateColumns: `repeat(${lessonNumbers?.length ?? 0}, 1fr)` 
      }}
    >
      {lessonNumbers?.map(num => (
        <div 
          key={num} 
          className="text-center font-semibold"
          style={{
            fontSize: tokens.typography.fontSize.sm,
            fontWeight: tokens.typography.fontWeight.semibold,
            color: tokens.colors.gray[600]
          }}
        >
          {num}
        </div>
      ))}
    </div>
  );
};
