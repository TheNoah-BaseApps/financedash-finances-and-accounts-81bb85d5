'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewFinanceReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    report_id: '',
    financial_year: '',
    report_type: '',
    report_date: '',
    revenue: '',
    gross_profit: '',
    ebitda: '',
    net_profit: '',
    cash_balance: '',
    debtors_days: '',
    expenses: '',
    assets: '',
    liabilities: '',
    equity: '',
    report_status: 'Draft',
    approved_by: '',
    approval_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/finance-reporting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/finance-reporting');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating finance report:', error);
      alert('Failed to create finance report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/finance-reporting">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Finance Reporting
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Finance Report</CardTitle>
          <CardDescription>Fill in the financial metrics to create a new report</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report_id">Report ID *</Label>
                <Input id="report_id" name="report_id" value={formData.report_id} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="financial_year">Financial Year *</Label>
                <Input id="financial_year" name="financial_year" placeholder="2023-2024" value={formData.financial_year} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report_type">Report Type *</Label>
                <Select onValueChange={(value) => handleSelectChange('report_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="report_date">Report Date *</Label>
                <Input id="report_date" name="report_date" type="date" value={formData.report_date} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Revenue & Profitability</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="revenue">Revenue *</Label>
                  <Input id="revenue" name="revenue" type="number" step="0.01" value={formData.revenue} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gross_profit">Gross Profit *</Label>
                  <Input id="gross_profit" name="gross_profit" type="number" step="0.01" value={formData.gross_profit} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ebitda">EBITDA *</Label>
                  <Input id="ebitda" name="ebitda" type="number" step="0.01" value={formData.ebitda} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="net_profit">Net Profit *</Label>
                  <Input id="net_profit" name="net_profit" type="number" step="0.01" value={formData.net_profit} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenses">Total Expenses *</Label>
                  <Input id="expenses" name="expenses" type="number" step="0.01" value={formData.expenses} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Balance Sheet Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assets">Total Assets *</Label>
                  <Input id="assets" name="assets" type="number" step="0.01" value={formData.assets} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liabilities">Total Liabilities *</Label>
                  <Input id="liabilities" name="liabilities" type="number" step="0.01" value={formData.liabilities} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equity">Total Equity *</Label>
                  <Input id="equity" name="equity" type="number" step="0.01" value={formData.equity} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cash_balance">Cash Balance *</Label>
                  <Input id="cash_balance" name="cash_balance" type="number" step="0.01" value={formData.cash_balance} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debtors_days">Debtors Days *</Label>
                  <Input id="debtors_days" name="debtors_days" type="number" value={formData.debtors_days} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Finance Report
              </Button>
              <Link href="/finance-reporting">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}