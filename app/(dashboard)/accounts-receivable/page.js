'use client';

import { useState, useEffect } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import ReceivableTable from '@/components/accounts-receivable/ReceivableTable';
import ReceivableForm from '@/components/accounts-receivable/ReceivableForm';
import MetricCard from '@/components/dashboard/MetricCard';

export default function AccountsReceivablePage() {
  const [receivables, setReceivables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReceivable, setEditingReceivable] = useState(null);

  useEffect(() => {
    fetchReceivables();
  }, []);

  const fetchReceivables = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/accounts-receivable', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch receivables');

      const data = await response.json();
      setReceivables(data.data || []);
    } catch (err) {
      console.error('Error fetching receivables:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingReceivable(null);
    setShowForm(true);
  };

  const handleEdit = (receivable) => {
    setEditingReceivable(receivable);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this receivable?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/accounts-receivable/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete receivable');

      await fetchReceivables();
    } catch (err) {
      console.error('Error deleting receivable:', err);
      setError(err.message);
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    await fetchReceivables();
  };

  const totalBalance = receivables.reduce((sum, r) => sum + parseFloat(r.balance_due || 0), 0);
  const overdueCount = receivables.filter(r => r.status === 'overdue').length;
  const overdueBalance = receivables
    .filter(r => r.status === 'overdue')
    .reduce((sum, r) => sum + parseFloat(r.balance_due || 0), 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts Receivable</h1>
          <p className="text-gray-600">Manage customer invoices and collections</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Receivable
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Outstanding"
          value={`$${totalBalance.toFixed(2)}`}
          subtitle={`${receivables.length} invoices`}
          color="green"
        />
        <MetricCard
          title="Overdue Receivables"
          value={`$${overdueBalance.toFixed(2)}`}
          subtitle={`${overdueCount} invoices`}
          color="red"
          trend={overdueCount > 0 ? 'down' : 'neutral'}
        />
        <MetricCard
          title="Current Receivables"
          value={`$${(totalBalance - overdueBalance).toFixed(2)}`}
          subtitle={`${receivables.length - overdueCount} invoices`}
          color="blue"
        />
      </div>

      {/* Receivables Table */}
      <ReceivableTable
        receivables={receivables}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Receivable Form Modal */}
      {showForm && (
        <ReceivableForm
          receivable={editingReceivable}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}