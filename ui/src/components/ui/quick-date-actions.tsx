/**
 * Компонент быстрых действий для выбора даты
 * Следует принципу Single Responsibility - только быстрые действия
 */

import React from 'react';
import { cn } from '../../utils/cn';
import { Button } from './button';
import { getQuickActions } from '../../utils/dateControlUtils';
import type { QuickAction } from '../../types/dateControl';

interface QuickDateActionsProps {
  /** Тип представления */
  viewType: 'day' | 'week';
  /** Обработчик выбора действия */
  onActionSelect: (action: QuickAction) => void;
  /** Дополнительные CSS классы */
  className?: string;
  /** Состояние отключения */
  disabled?: boolean;
}

export const QuickDateActions: React.FC<QuickDateActionsProps> = ({
  viewType,
  onActionSelect,
  className,
  disabled = false
}) => {
  const actions = getQuickActions(viewType);
  
  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          size="sm"
          onClick={() => !disabled && action.enabled && onActionSelect(action)}
          disabled={disabled || !action.enabled}
          className="text-xs px-2 py-1 h-auto"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};
