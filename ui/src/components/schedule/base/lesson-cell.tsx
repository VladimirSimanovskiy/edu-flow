import React from 'react';
import { cn } from '../../../utils/cn';
import { tokens } from '../../../design-system/tokens';

export interface LessonData {
  teacherName?: string;
  classroomNumber?: string;
  className?: string;
  subjectName?: string;
}

interface LessonCellProps {
  lesson?: LessonData;
  lessonNumber: number;
  variant?: 'class' | 'teacher';
  className?: string;
}

export const LessonCell: React.FC<LessonCellProps> = ({
  lesson,
  lessonNumber,
  variant = 'class',
  className,
}) => {
  const hasLesson = Boolean(lesson);
  
  const getVariantStyles = () => {
    if (!hasLesson) {
      return {
        backgroundColor: tokens.colors.gray[50],
        borderColor: tokens.colors.gray[200],
        color: tokens.colors.gray[500]
      };
    }

    if (variant === 'class') {
      return {
        backgroundColor: tokens.colors.primary[100],
        borderColor: tokens.colors.primary[300],
        color: tokens.colors.primary[800]
      };
    }

    return {
      backgroundColor: tokens.colors.success[100],
      borderColor: tokens.colors.success[300],
      color: tokens.colors.success[800]
    };
  };

  const styles = getVariantStyles();

  return (
    <div
      className={cn(
        'h-8 border rounded text-xs flex flex-col items-center justify-center transition-colors',
        className
      )}
      style={{
        ...styles,
        transition: `all ${tokens.animation.duration.fast} ${tokens.animation.easing.ease}`,
        fontSize: tokens.typography.fontSize.xs,
        borderRadius: tokens.borderRadius.base
      }}
    >
      {hasLesson ? (
        <>
          {variant === 'class' ? (
            <>
              <div 
                className="font-medium truncate w-full text-center"
                style={{ fontWeight: tokens.typography.fontWeight.medium }}
              >
                {lesson?.teacherName}
              </div>
              <div 
                className="text-xs truncate w-full text-center"
                style={{ 
                  fontSize: tokens.typography.fontSize.xs,
                  color: variant === 'class' ? tokens.colors.primary[600] : tokens.colors.success[600]
                }}
              >
                {lesson?.classroomNumber}
              </div>
            </>
          ) : (
            <div 
              className="font-medium truncate w-full text-center"
              style={{ fontWeight: tokens.typography.fontWeight.medium }}
            >
              {lesson?.className}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};
