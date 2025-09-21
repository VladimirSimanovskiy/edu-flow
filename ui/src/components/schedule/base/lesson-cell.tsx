import React from "react";
import { cn } from "../../../utils/cn";

export interface LessonData {
  primary?: string;
  secondary?: string[];
  // Метки для рендера состояний
  isSubstitution?: boolean; // это запись замещения
  isReplacedOriginal?: boolean; // основной урок, который был заменен
  replaced?: {
    primary?: string;
    secondary?: string[];
  };
}

interface LessonCellProps {
  lesson?: LessonData;
  lessonNumber: number;
  className?: string;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isHighlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isHoverLinked?: boolean;
  enableEmptyClick?: boolean;
  onEmptyClick?: () => void;
}

export const LessonCell: React.FC<LessonCellProps> = ({
  lesson,
  className,
  onClick,
  onContextMenu,
  isHighlighted = false,
  onMouseEnter,
  onMouseLeave,
  isHoverLinked = false,
  enableEmptyClick = false,
  onEmptyClick,
}) => {
  const hasLesson = Boolean(lesson);

  const getClasses = () => {
    // Определяем базовый вид по типу урока или пустой ячейки
    const baseType = !hasLesson
      ? 'bg-gray-50 border-gray-200 text-gray-500'
      : lesson?.isSubstitution
        ? 'bg-warning-50 border-warning-300 text-warning-700'
        : lesson?.isReplacedOriginal
          ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-70'
          : 'bg-primary-50 border-primary-300 text-primary-800';

    // При hover связке показываем только рамку, игнорируя кликовую заливку
    if (isHoverLinked) {
      return baseType + ' border-2 border-accent-400';
    }

    // Кликавая подсветка — для пустых и непустых ячеек
    if (isHighlighted) {
      return 'bg-accent-100 border-accent-400 text-accent-900 shadow-[0_0_0_2px_hsl(280,100%,80%)]';
    }

    return baseType;
  };

  const classes = getClasses();

  return (
    <div
      className={cn(
        "h-16 sm:h-18 md:h-20 w-full border rounded text-xs flex flex-col items-center justify-center transition-colors p-1",
        (hasLesson && onClick) || (!hasLesson && enableEmptyClick && onEmptyClick) ? "cursor-pointer hover:opacity-80" : undefined,
        classes,
        className
      )}
      onClick={hasLesson ? onClick : enableEmptyClick ? onEmptyClick : undefined}
      onContextMenu={hasLesson && onContextMenu ? (e) => { e.preventDefault(); onContextMenu(e); } : undefined}
      onMouseEnter={hasLesson ? onMouseEnter : undefined}
      onMouseLeave={hasLesson ? onMouseLeave : undefined}
    >
      {hasLesson ? (
        <>
          {lesson?.isSubstitution && lesson?.replaced ? (
            <div className="w-full mb-0.5">
              {lesson.replaced.primary ? (
                <div className="w-full text-center leading-tight truncate text-gray-400">
                  {lesson.replaced.primary}
                </div>
              ) : null}
              {lesson.replaced.secondary?.map((text, index) => (
                <div key={`r-${index}`} className="text-xxs w-full text-center leading-tight truncate text-gray-400">
                  {text}
                </div>
              ))}
            </div>
          ) : null}

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