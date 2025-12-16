'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PayableForm({ payable, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    date: '',
    invoice_number: '',
    supplier_name: '',
    total_amount: '',
    due_date: '',
    payment1: '',
    payment2: '',
    payment3: '',
    payment4: '',
    payment5: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (payable) {
      setFormData({
        date: payable.date || '',
        invoice_number: payable.invoice_number || '',
        supplier_name: payable.supplier_name || '',
        total_amount: payable.total_amount || '',
        due_date: payable.due_date || '',
        payment1: payable.payment1 || '',
        payment2: payable.payment2 || '',
        payment3: payable.payment3 || '',
        payment4: payable.payment4 || '',
        payment5: payable.payment5 || ''
      });
    }
  }, [payable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const url = payable 
        ? `/api/accounts-payable/${payable.id}`
        : '/api/accounts-payable';
      
      const response = await fetch(url, {
        method: payable ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save payable');
      }

      onSubmit();
    } catch (err) {
      console.error('Error saving payable:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{payable ? 'Edit Payable' : 'Add Payable'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="invoice_number">Invoice Number</Label>
              <Input
                id="invoice_number"
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="supplier_name">Supplier Name</Label>
              <Input
                id="supplier_name"
                value={formData.supplier_name}
                onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="total_amount">Total Amount</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Payments</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map(num => (
                <div key={num}>
                  <Label htmlFor={`payment${num}`}>Payment {num}</Label>
                  <Input
                    id={`payment${num}`}
                    type="number"
                    step="0.01"
                    value={formData[`payment${num}`]}
                    onChange={(e) => setFormData({ ...formData, [`payment${num}`]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}