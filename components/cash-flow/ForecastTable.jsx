'use client';

import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/shared/DataTable';
import { formatCurrency } from '@/lib/calculations';

export default function ForecastTable({ forecasts, onEdit, onDelete }) {
  const columns = [
    {
      header: 'Category',
      accessor: 'category'
    },
    {
      header: 'Period Start',
      accessor: 'period_start',
      cell: (row) => new Date(row.period_start).toLocaleDateString()
    },
    {
      header: 'Period End',
      accessor: 'period_end',
      cell: (row) => new Date(row.period_end).toLocaleDateString()
    },
    {
      header: 'Beginning Balance',
      accessor: 'beginning_balance',
      cell: (row) => formatCurrency(row.beginning_balance)
    },
    {
      header: 'Net Change',
      accessor: 'net_cash_change',
      cell: (row) => (
        <span className={parseFloat(row.net_cash_change) >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(row.net_cash_change)}
        </span>
      )
    },
    {
      header: 'Ending Position',
      accessor: 'month_ending_cash_position',
      cell: (row) => (
        <span className="font-bold">
          {formatCurrency(row.month_ending_cash_position)}
        </span>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={forecasts}
      columns={columns}
      searchable={true}
      searchPlaceholder="Search forecasts..."
    />
  );
}