'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewWorkingCapitalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    wc_id: '',
    wc_name: '',
    date: '',
    financial_year: '',
    inventory_value: '',
    trade_receivables: '',
    other_receivables: '',
    trade_payables: '',
    other_payables: '',
    net_working_capital: '',
    debtors_days: '',
    creditors_days: '',
    cash_conversion_cycle: '',
    working_capital_ratio: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/working-capital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/working-capital');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating working capital record:', error);
      alert('Failed to create working capital record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/working-capital">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Working Capital
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Working Capital Record</CardTitle>
          <CardDescription>Fill in the working capital metrics to create a new record</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wc_id">WC ID *</Label>
                <Input id="wc_id" name="wc_id" value={formData.wc_id} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wc_name">WC Name *</Label>
                <Input id="wc_name" name="wc_name" value={formData.wc_name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="financial_year">Financial Year *</Label>
                <Input id="financial_year" name="financial_year" placeholder="2023-2024" value={formData.financial_year} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Assets</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inventory_value">Inventory Value *</Label>
                  <Input id="inventory_value" name="inventory_value" type="number" step="0.01" value={formData.inventory_value} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trade_receivables">Trade Receivables *</Label>
                  <Input id="trade_receivables" name="trade_receivables" type="number" step="0.01" value={formData.trade_receivables} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="other_receivables">Other Receivables *</Label>
                  <Input id="other_receivables" name="other_receivables" type="number" step="0.01" value={formData.other_receivables} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Liabilities</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trade_payables">Trade Payables *</Label>
                  <Input id="trade_payables" name="trade_payables" type="number" step="0.01" value={formData.trade_payables} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="other_payables">Other Payables *</Label>
                  <Input id="other_payables" name="other_payables" type="number" step="0.01" value={formData.other_payables} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Working Capital Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="net_working_capital">Net Working Capital *</Label>
                  <Input id="net_working_capital" name="net_working_capital" type="number" step="0.01" value={formData.net_working_capital} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="working_capital_ratio">Working Capital Ratio *</Label>
                  <Input id="working_capital_ratio" name="working_capital_ratio" type="number" step="0.01" value={formData.working_capital_ratio} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debtors_days">Debtors Days *</Label>
                  <Input id="debtors_days" name="debtors_days" type="number" value={formData.debtors_days} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditors_days">Creditors Days *</Label>
                  <Input id="creditors_days" name="creditors_days" type="number" value={formData.creditors_days} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cash_conversion_cycle">Cash Conversion Cycle *</Label>
                  <Input id="cash_conversion_cycle" name="cash_conversion_cycle" type="number" value={formData.cash_conversion_cycle} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Working Capital Record
              </Button>
              <Link href="/working-capital">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}