import React from "react";
import { cn } from "../../../utils/cn";

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

  const getClasses = () => {
    if (!hasLesson) {
      return 'bg-gray-50 border-gray-200 text-gray-500';
    }

    if (isHighlighted) {
      return 'bg-accent-100 border-accent-400 text-accent-900 shadow-[0_0_0_2px_hsl(280,100%,80%)]';
    }

    return 'bg-primary-50 border-primary-300 text-primary-800';
  };

  const classes = getClasses();

  return (
    <div
      className={cn(
        "h-16 sm:h-18 md:h-20 w-full border rounded text-xs flex flex-col items-center justify-center transition-colors p-1",
        hasLesson && onClick && "cursor-pointer hover:opacity-80",
        classes,
        className
      )}
      onClick={hasLesson ? onClick : undefined}
    >
      {hasLesson ? (
        <>
          <div className="font-medium w-full text-center leading-tight text-xs sm:text-sm truncate mb-0.5">
            {lesson?.primary}
          </div>
          {lesson?.secondary?.map((text, index) => (
            <div
              key={index}
              className="text-xs w-full text-center leading-tight truncate text-primary-500"
            >
              {text}
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};