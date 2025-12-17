'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewBillToInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoice_id: '',
    date: new Date().toISOString().split('T')[0],
    customer_id: '',
    terms: '',
    bill_to: '',
    ship_to: '',
    description: '',
    quantity: '',
    unit_price: '',
    amount: '',
    tax_percentage: '',
    total: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate amount if quantity and unit_price are set
      if (name === 'quantity' || name === 'unit_price') {
        const qty = parseFloat(name === 'quantity' ? value : updated.quantity) || 0;
        const price = parseFloat(name === 'unit_price' ? value : updated.unit_price) || 0;
        updated.amount = (qty * price).toFixed(2);
      }
      
      // Auto-calculate total if amount and tax_percentage are set
      if (name === 'amount' || name === 'tax_percentage') {
        const amt = parseFloat(name === 'amount' ? value : updated.amount) || 0;
        const tax = parseFloat(name === 'tax_percentage' ? value : updated.tax_percentage) || 0;
        updated.total = (amt + (amt * tax / 100)).toFixed(2);
      }
      
      return updated;
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bill-to-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          unit_price: parseFloat(formData.unit_price),
          amount: parseFloat(formData.amount),
          tax_percentage: parseFloat(formData.tax_percentage),
          total: parseFloat(formData.total)
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/bill-to-invoice');
      } else {
        alert('Failed to create invoice: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
      alert('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/bill-to-invoice">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice_id">Invoice ID *</Label>
                <Input
                  id="invoice_id"
                  name="invoice_id"
                  value={formData.invoice_id}
                  onChange={handleChange}
                  required
                  placeholder="INV-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_id">Customer ID *</Label>
                <Input
                  id="customer_id"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  required
                  placeholder="CUST-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Payment Terms *</Label>
                <Input
                  id="terms"
                  name="terms"
                  value={formData.terms}
                  onChange={handleChange}
                  required
                  placeholder="Net 30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bill_to">Bill To *</Label>
                <Textarea
                  id="bill_to"
                  name="bill_to"
                  value={formData.bill_to}
                  onChange={handleChange}
                  required
                  placeholder="Billing address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ship_to">Ship To *</Label>
                <Textarea
                  id="ship_to"
                  name="ship_to"
                  value={formData.ship_to}
                  onChange={handleChange}
                  required
                  placeholder="Shipping address"
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Item description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  placeholder="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_price">Unit Price *</Label>
                <Input
                  id="unit_price"
                  name="unit_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unit_price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_percentage">Tax Percentage *</Label>
                <Input
                  id="tax_percentage"
                  name="tax_percentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.tax_percentage}
                  onChange={handleChange}
                  required
                  placeholder="0.0"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="total">Total *</Label>
                <Input
                  id="total"
                  name="total"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total}
                  onChange={handleChange}
                  required
                  readOnly
                  className="bg-muted text-lg font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Invoice'}
              </Button>
              <Link href="/bill-to-invoice">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}