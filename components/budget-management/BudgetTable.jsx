'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function BudgetTable({ budgets, onRefresh }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/budget-management/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Budget deleted successfully');
        onRefresh();
      } else {
        toast.error(data.error || 'Failed to delete budget');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete budget');
    } finally {
      setDeleting(null);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Draft': 'secondary',
      'Approved': 'default',
      'Active': 'default',
      'Closed': 'secondary',
      'Overrun': 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getUtilizationBadge = (percent) => {
    if (!percent) return null;
    const value = parseFloat(percent);
    if (value > 100) {
      return <Badge variant="destructive" className="gap-1"><TrendingUp className="h-3 w-3" />{value.toFixed(1)}%</Badge>;
    } else if (value > 80) {
      return <Badge variant="outline" className="gap-1"><TrendingUp className="h-3 w-3" />{value.toFixed(1)}%</Badge>;
    } else {
      return <Badge variant="secondary" className="gap-1"><TrendingDown className="h-3 w-3" />{value.toFixed(1)}%</Badge>;
    }
  };

  if (budgets.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
        <p className="text-gray-500 mb-4">No budgets found</p>
        <Button onClick={() => router.push('/budget-management/new')}>
          Add First Budget
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Budget ID</TableHead>
            <TableHead>Financial Year</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead className="text-right">Original Budget</TableHead>
            <TableHead className="text-right">Revised Budget</TableHead>
            <TableHead className="text-right">Actual Spend YTD</TableHead>
            <TableHead className="text-right">Balance Available</TableHead>
            <TableHead className="text-right">Utilization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.map((budget) => (
            <TableRow key={budget.id}>
              <TableCell className="font-medium">{budget.budget_id}</TableCell>
              <TableCell>{budget.financial_year}</TableCell>
              <TableCell>{budget.department}</TableCell>
              <TableCell>{budget.budget_category}</TableCell>
              <TableCell>{budget.budget_owner}</TableCell>
              <TableCell className="text-right">{formatCurrency(budget.original_budget)}</TableCell>
              <TableCell className="text-right">{formatCurrency(budget.revised_budget)}</TableCell>
              <TableCell className="text-right">{formatCurrency(budget.actual_spend_ytd)}</TableCell>
              <TableCell className="text-right">{formatCurrency(budget.balance_available)}</TableCell>
              <TableCell className="text-right">{getUtilizationBadge(budget.utilisation_percent)}</TableCell>
              <TableCell>{getStatusBadge(budget.budget_status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/budget-management/${budget.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(budget.id)}
                    disabled={deleting === budget.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}