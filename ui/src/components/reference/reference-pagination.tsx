import React from 'react';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { ReferencePagination } from '../../types/reference';

interface ReferencePaginationProps {
  pagination: ReferencePagination;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const ReferencePagination: React.FC<ReferencePaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
}) => {
  const { page, limit, total, totalPages, hasNext, hasPrev } = pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    onLimitChange(newLimit);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, page - 2);
      const end = Math.min(totalPages, page + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Показано {total} элементов
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">На странице:</span>
          <Select
            value={limit}
            onChange={handleLimitChange}
            options={[
              { value: 10, label: '10' },
              { value: 25, label: '25' },
              { value: 50, label: '50' },
              { value: 100, label: '100' }
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Показано {((page - 1) * limit) + 1}-{Math.min(page * limit, total)} из {total} элементов
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={!hasPrev}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={!hasPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className="w-8 h-8 p-0"
            >
              {pageNum}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={!hasNext}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-gray-700">На странице:</span>
          <Select
            value={limit}
            onChange={handleLimitChange}
            options={[
              { value: 10, label: '10' },
              { value: 25, label: '25' },
              { value: 50, label: '50' },
              { value: 100, label: '100' }
            ]}
          />
        </div>
      </div>
    </div>
  );
};
