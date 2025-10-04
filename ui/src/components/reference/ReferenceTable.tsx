import React from 'react';
import type { ReferenceTableProps } from '@/types/reference-system';

/**
 * Универсальная таблица для справочников
 */
export const ReferenceTable = <T extends any>({
  data,
  columns,
  isLoading,
  onEdit,
  onDelete,
}: ReferenceTableProps<T>) => {
  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!data || data.length === 0) {
    return <div>Нет данных для отображения</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="border p-2 text-left">
                {column.title}
              </th>
            ))}
            <th className="border p-2 text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="border p-2">
                  {column.render 
                    ? column.render(item[column.key], item)
                    : String(item[column.key] || '')
                  }
                </td>
              ))}
              <td className="border p-2">
                <button 
                  onClick={() => onEdit(item)}
                  className="mr-2 text-blue-600 hover:text-blue-800"
                >
                  Редактировать
                </button>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
