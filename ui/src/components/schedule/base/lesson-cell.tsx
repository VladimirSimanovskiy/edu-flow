import React from 'react';
import { cn } from '../../../utils/cn';
import { tokens } from '../../../design-system/tokens';

export interface LessonData {
  teacherName?: string;
  classroomNumber?: string | number;
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
        'h-16 sm:h-18 md:h-20 w-full border rounded text-xs flex flex-col items-center justify-center transition-colors p-1',
        className
      )}
      style={{
        ...styles,
        transition: `all ${tokens.animation.duration.fast} ${tokens.animation.easing.ease}`,
        fontSize: tokens.typography.fontSize.xs,
        borderRadius: tokens.borderRadius.base,
        minHeight: '4rem' // Минимальная высота для мобильных
      }}
    >
      {hasLesson ? (
        <>
          {variant === 'class' ? (
            <>
              <div 
                className="font-medium w-full text-center leading-tight text-xs sm:text-sm truncate mb-0.5"
                style={{ fontWeight: tokens.typography.fontWeight.medium }}
              >
                {lesson?.subjectName}
              </div>
              <div 
                className="text-xs w-full text-center leading-tight truncate mb-0.5"
                style={{ 
                  fontSize: tokens.typography.fontSize.xs,
                  color: tokens.colors.primary[600]
                }}
              >
                {lesson?.teacherName}
              </div>
              <div 
                className="text-xs w-full text-center leading-tight truncate"
                style={{ 
                  fontSize: tokens.typography.fontSize.xs,
                  color: tokens.colors.primary[500]
                }}
              >
                {lesson?.classroomNumber ? `каб. ${lesson.classroomNumber}` : ''}
              </div>
            </>
          ) : (
            <>
              <div 
                className="font-medium w-full text-center leading-tight text-xs sm:text-sm truncate mb-0.5"
                style={{ fontWeight: tokens.typography.fontWeight.medium }}
              >
                {lesson?.subjectName}
              </div>
              <div 
                className="text-xs w-full text-center leading-tight truncate mb-0.5"
                style={{ 
                  fontSize: tokens.typography.fontSize.xs,
                  color: tokens.colors.success[600]
                }}
              >
                {lesson?.className}
              </div>
              <div 
                className="text-xs w-full text-center leading-tight truncate"
                style={{ 
                  fontSize: tokens.typography.fontSize.xs,
                  color: tokens.colors.success[500]
                }}
              >
                {lesson?.classroomNumber ? `каб. ${lesson.classroomNumber}` : ''}
              </div>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};
