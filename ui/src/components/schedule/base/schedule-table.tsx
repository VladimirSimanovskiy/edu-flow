import React from 'react';
import { cn } from '../../../utils/cn';
import { tokens } from '../../../design-system/tokens';

interface ScheduleTableProps {
  children: React.ReactNode;
  className?: string;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  children,
  className,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full', className)}>
        {children}
      </table>
    </div>
  );
};

interface ScheduleTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ScheduleTableHeader: React.FC<ScheduleTableHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <thead 
      className={cn('border-b', className)}
      style={{ borderColor: tokens.colors.gray[200] }}
    >
      {children}
    </thead>
  );
};

interface ScheduleTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ScheduleTableBody: React.FC<ScheduleTableBodyProps> = ({
  children,
  className,
}) => {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
};

interface ScheduleTableRowProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const ScheduleTableRow: React.FC<ScheduleTableRowProps> = ({
  children,
  className,
  hover = true,
}) => {
  return (
    <tr 
      className={cn(
        'border-b',
        hover && 'hover:bg-gray-50',
        className
      )}
      style={{ 
        borderColor: tokens.colors.gray[200],
        ...(hover && { 
          transition: `background-color ${tokens.animation.duration.fast} ${tokens.animation.easing.ease}` 
        })
      }}
    >
      {children}
    </tr>
  );
};

interface ScheduleTableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
  width?: string;
}

export const ScheduleTableCell: React.FC<ScheduleTableCellProps> = ({
  children,
  className,
  header = false,
  width,
}) => {
  const Component = header ? 'th' : 'td';
  
  return (
    <Component
      className={cn(
        'p-3 text-sm',
        header && 'text-left font-medium text-gray-600',
        className
      )}
      style={{
        width,
        ...(header && {
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.gray[600]
        })
      }}
    >
      {children}
    </Component>
  );
};
