import React from 'react';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ReferencePaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

/**
 * Компонент пагинации для справочников
 */
export const ReferencePagination: React.FC<ReferencePaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
}) => {
  const { page, limit, total, totalPages } = pagination;

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          Показано {((page - 1) * limit) + 1}-{Math.min(page * limit, total)} из {total}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Предыдущая
        </button>
        
        <span className="px-3 py-1">
          Страница {page} из {totalPages}
        </span>
        
        <button
          onClick={handleNext}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Следующая
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-600">На странице:</label>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};
