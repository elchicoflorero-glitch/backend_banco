import React from 'react';

interface TableProps {
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
}

export function Table({
  columns,
  data,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
}: TableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td key={`${rowIndex}-${column.key}`} className="px-6 py-4 text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
