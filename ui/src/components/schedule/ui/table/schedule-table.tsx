import React from 'react';
import { cn } from '../../../../utils/cn';
import { useDragScroll } from '../../../../hooks';

interface ScheduleTableProps {
  children: React.ReactNode;
  className?: string;
  enableDragScroll?: boolean;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  children,
  className,
  enableDragScroll = true,
}) => {
  const dragScroll = useDragScroll({ sensitivity: 1.2 });
  const containerProps = enableDragScroll ? {
    ref: dragScroll.scrollRef,
    className: cn(
      'overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
      enableDragScroll && dragScroll.className,
      'touch-pan-x overscroll-x-contain',
      className
    ),
    ...dragScroll.eventHandlers,
  } : {
    className: cn(
      'overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
      'touch-pan-x overscroll-x-contain',
      className
    ),
  };

  return (
    <div {...containerProps}>
      <table className="w-full">
        {children}
      </table>
    </div>
  );
};

interface ScheduleTableHeaderProps { children: React.ReactNode; className?: string; }
export const ScheduleTableHeader: React.FC<ScheduleTableHeaderProps> = ({ children, className }) => (
  <thead className={cn('border-b border-gray-200', className)}>{children}</thead>
);

interface ScheduleTableBodyProps { children: React.ReactNode; className?: string; }
export const ScheduleTableBody: React.FC<ScheduleTableBodyProps> = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
);

interface ScheduleTableRowProps { children: React.ReactNode; className?: string; hover?: boolean; style?: React.CSSProperties; }
export const ScheduleTableRow: React.FC<ScheduleTableRowProps> = ({ children, className, hover = true, style }) => (
  <tr className={cn('border-b', hover && 'hover:bg-gray-50', className)} style={{ ...style }}>
    {children}
  </tr>
);

interface ScheduleTableCellProps { children: React.ReactNode; className?: string; header?: boolean; width?: string; style?: React.CSSProperties; }
export const ScheduleTableCell: React.FC<ScheduleTableCellProps> = ({ children, className, header = false, width, style }) => {
  const Component = header ? 'th' : 'td';
  return (
    <Component className={cn('p-1 sm:p-2 md:p-3 text-xs sm:text-sm', header && 'text-left font-medium text-gray-600', className)} style={{ width, ...style }}>
      {children}
    </Component>
  );
};


