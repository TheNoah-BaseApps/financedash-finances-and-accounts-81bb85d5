'use client';

import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency } from '@/lib/calculations';

export default function PayableTable({ payables, onEdit, onDelete }) {
  const columns = [
    {
      header: 'Invoice #',
      accessor: 'invoice_number'
    },
    {
      header: 'Supplier',
      accessor: 'supplier_name'
    },
    {
      header: 'Date',
      accessor: 'date',
      cell: (row) => new Date(row.date).toLocaleDateString()
    },
    {
      header: 'Due Date',
      accessor: 'due_date',
      cell: (row) => new Date(row.due_date).toLocaleDateString()
    },
    {
      header: 'Total Amount',
      accessor: 'total_amount',
      cell: (row) => formatCurrency(row.total_amount)
    },
    {
      header: 'Balance Due',
      accessor: 'balance_due',
      cell: (row) => formatCurrency(row.balance_due)
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <StatusBadge status={row.status} />
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
      data={payables}
      columns={columns}
      searchable={true}
      searchPlaceholder="Search payables..."
    />
  );
}