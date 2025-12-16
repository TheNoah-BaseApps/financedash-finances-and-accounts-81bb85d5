'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ReceivableForm({ receivable, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    invoice_date: '',
    invoice_number: '',
    customer: '',
    terms: '',
    total_amount: '',
    date_due: '',
    payment1: '',
    payment2: '',
    payment3: '',
    payment4: '',
    payment5: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (receivable) {
      setFormData({
        invoice_date: receivable.invoice_date || '',
        invoice_number: receivable.invoice_number || '',
        customer: receivable.customer || '',
        terms: receivable.terms || '',
        total_amount: receivable.total_amount || '',
        date_due: receivable.date_due || '',
        payment1: receivable.payment1 || '',
        payment2: receivable.payment2 || '',
        payment3: receivable.payment3 || '',
        payment4: receivable.payment4 || '',
        payment5: receivable.payment5 || ''
      });
    }
  }, [receivable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const url = receivable 
        ? `/api/accounts-receivable/${receivable.id}`
        : '/api/accounts-receivable';
      
      const response = await fetch(url, {
        method: receivable ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save receivable');
      }

      onSubmit();
    } catch (err) {
      console.error('Error saving receivable:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{receivable ? 'Edit Receivable' : 'Add Receivable'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_date">Invoice Date</Label>
              <Input
                id="invoice_date"
                type="date"
                value={formData.invoice_date}
                onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
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
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="terms">Payment Terms</Label>
              <Input
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
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
              <Label htmlFor="date_due">Due Date</Label>
              <Input
                id="date_due"
                type="date"
                value={formData.date_due}
                onChange={(e) => setFormData({ ...formData, date_due: e.target.value })}
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