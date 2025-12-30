'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function JournalTable({ entries, onRefresh }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/accounting-journal/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Entry deleted successfully');
        onRefresh();
      } else {
        toast.error(data.error || 'Failed to delete entry');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete entry');
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

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
        <p className="text-gray-500 mb-4">No journal entries found</p>
        <Button onClick={() => router.push('/accounting-journal/new')}>
          Add First Entry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Code</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead className="text-right">Trial Balance Debit</TableHead>
            <TableHead className="text-right">Trial Balance Credit</TableHead>
            <TableHead className="text-right">Adjusting Debit</TableHead>
            <TableHead className="text-right">Adjusting Credit</TableHead>
            <TableHead className="text-right">Adjusted Debit</TableHead>
            <TableHead className="text-right">Adjusted Credit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.account_code}</TableCell>
              <TableCell>{entry.account_name}</TableCell>
              <TableCell className="text-right">{formatCurrency(entry.trial_balance_debit)}</TableCell>
              <TableCell className="text-right">{formatCurrency(entry.trial_balance_credit)}</TableCell>
              <TableCell className="text-right">{formatCurrency(entry.adjusting_entries_debit)}</TableCell>
              <TableCell className="text-right">{formatCurrency(entry.adjusting_entries_credit)}</TableCell>
              <TableCell className="text-right">{formatCurrency(entry.adjusted_trial_balance_debit)}</TableCell>
              <TableCell className="text-right">{formatCurrency(entry.adjusted_trial_balance_credit)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/accounting-journal/${entry.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleting === entry.id}
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