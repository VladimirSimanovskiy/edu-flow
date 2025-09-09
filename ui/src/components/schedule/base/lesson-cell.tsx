import React from "react";
import { cn } from "../../../utils/cn";
import { tokens } from "../../../design-system/tokens";

export interface LessonData {
  primary?: string;
  secondary?: string[];
}

interface LessonCellProps {
  lesson?: LessonData;
  lessonNumber: number;
  className?: string;
  onClick?: () => void;
  isHighlighted?: boolean;
}

export const LessonCell: React.FC<LessonCellProps> = ({
  lesson,
  className,
  onClick,
  isHighlighted = false,
}) => {
  const hasLesson = Boolean(lesson);

  const getVariantStyles = () => {
    if (!hasLesson) {
      return {
        backgroundColor: tokens.colors.gray[50],
        borderColor: tokens.colors.gray[200],
        color: tokens.colors.gray[500],
      };
    }

    if (isHighlighted) {
      return {
        backgroundColor: tokens.colors.accent[100],
        borderColor: tokens.colors.accent[400],
        color: tokens.colors.accent[900],
        boxShadow: `0 0 0 2px ${tokens.colors.accent[200]}`,
      };
    }

    return {
      backgroundColor: tokens.colors.primary[50],
      borderColor: tokens.colors.primary[300],
      color: tokens.colors.primary[800],
    };
  };

  const styles = getVariantStyles();

  return (
    <div
      className={cn(
        "h-16 sm:h-18 md:h-20 w-full border rounded text-xs flex flex-col items-center justify-center transition-colors p-1",
        hasLesson && onClick && "cursor-pointer hover:opacity-80",
        className
      )}
      style={{
        ...styles,
        transition: `all ${tokens.animation.duration.fast} ${tokens.animation.easing.ease}`,
        fontSize: tokens.typography.fontSize.xs,
        borderRadius: tokens.borderRadius.base,
        minHeight: "4rem",
      }}
      onClick={hasLesson ? onClick : undefined}
    >
      {hasLesson ? (
        <>
          <div
            className="font-medium w-full text-center leading-tight text-xs sm:text-sm truncate mb-0.5"
            style={{ fontWeight: tokens.typography.fontWeight.medium }}
          >
            {lesson?.primary}
          </div>
          {lesson?.secondary?.map((text, index) => (
            <div
              key={index}
              className="text-xs w-full text-center leading-tight truncate"
              style={{
                fontSize: tokens.typography.fontSize.xs,
                color: tokens.colors.primary[500],
              }}
            >
              {text}
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};