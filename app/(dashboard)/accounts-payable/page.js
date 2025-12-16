'use client';

import { useState, useEffect } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import PayableTable from '@/components/accounts-payable/PayableTable';
import PayableForm from '@/components/accounts-payable/PayableForm';
import MetricCard from '@/components/dashboard/MetricCard';

export default function AccountsPayablePage() {
  const [payables, setPayables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPayable, setEditingPayable] = useState(null);

  useEffect(() => {
    fetchPayables();
  }, []);

  const fetchPayables = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/accounts-payable', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch payables');

      const data = await response.json();
      setPayables(data.data || []);
    } catch (err) {
      console.error('Error fetching payables:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPayable(null);
    setShowForm(true);
  };

  const handleEdit = (payable) => {
    setEditingPayable(payable);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this payable?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/accounts-payable/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete payable');

      await fetchPayables();
    } catch (err) {
      console.error('Error deleting payable:', err);
      setError(err.message);
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    await fetchPayables();
  };

  const totalBalance = payables.reduce((sum, p) => sum + parseFloat(p.balance_due || 0), 0);
  const overdueCount = payables.filter(p => p.status === 'overdue').length;
  const overdueBalance = payables
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + parseFloat(p.balance_due || 0), 0);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts Payable</h1>
          <p className="text-gray-600">Manage supplier invoices and payments</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payable
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
          subtitle={`${payables.length} invoices`}
          color="blue"
        />
        <MetricCard
          title="Overdue Payables"
          value={`$${overdueBalance.toFixed(2)}`}
          subtitle={`${overdueCount} invoices`}
          color="red"
          trend={overdueCount > 0 ? 'down' : 'neutral'}
        />
        <MetricCard
          title="Current Payables"
          value={`$${(totalBalance - overdueBalance).toFixed(2)}`}
          subtitle={`${payables.length - overdueCount} invoices`}
          color="green"
        />
      </div>

      {/* Payables Table */}
      <PayableTable
        payables={payables}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Payable Form Modal */}
      {showForm && (
        <PayableForm
          payable={editingPayable}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}