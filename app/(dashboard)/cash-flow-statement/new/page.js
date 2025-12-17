'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCashFlowStatementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    net_income: '',
    changes_in_working_capital: '',
    depreciation_and_amortization: '',
    accounts_receivable: '',
    accounts_payable: '',
    deferred_taxes: '',
    other: '',
    cash_from_sale_of_capital_assets: '',
    cash_paid_for_purchase_of_capital_assets: '',
    increases_in_long_term_assets: '',
    proceeds_from_common_stock_issuance: '',
    proceeds_from_long_term_debt_issuance: '',
    dividends_paid_out: '',
    proceeds_from_preferred_stock_issuance: '',
    net_change_in_cash_and_cash_equivalents: '',
    cash_at_beginning_of_period: '',
    cash_at_end_of_period: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/cash-flow-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/cash-flow-statement');
      } else {
        alert('Error creating cash flow statement: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating cash flow statement:', error);
      alert('Error creating cash flow statement');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/cash-flow-statement">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Cash Flow Statement</h1>
          <p className="text-muted-foreground">Enter cash flow activity details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Operating Activities"
              />
            </div>
            <div>
              <Label htmlFor="net_income">Net Income</Label>
              <Input
                id="net_income"
                name="net_income"
                type="number"
                step="0.01"
                value={formData.net_income}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operating Activities</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="changes_in_working_capital">Changes in Working Capital</Label>
              <Input
                id="changes_in_working_capital"
                name="changes_in_working_capital"
                type="number"
                step="0.01"
                value={formData.changes_in_working_capital}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="depreciation_and_amortization">Depreciation and Amortization</Label>
              <Input
                id="depreciation_and_amortization"
                name="depreciation_and_amortization"
                type="number"
                step="0.01"
                value={formData.depreciation_and_amortization}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="accounts_receivable">Accounts Receivable</Label>
              <Input
                id="accounts_receivable"
                name="accounts_receivable"
                type="number"
                step="0.01"
                value={formData.accounts_receivable}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="accounts_payable">Accounts Payable</Label>
              <Input
                id="accounts_payable"
                name="accounts_payable"
                type="number"
                step="0.01"
                value={formData.accounts_payable}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investing Activities</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cash_from_sale_of_capital_assets">Cash from Sale of Capital Assets</Label>
              <Input
                id="cash_from_sale_of_capital_assets"
                name="cash_from_sale_of_capital_assets"
                type="number"
                step="0.01"
                value={formData.cash_from_sale_of_capital_assets}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="cash_paid_for_purchase_of_capital_assets">Cash Paid for Purchase of Capital Assets</Label>
              <Input
                id="cash_paid_for_purchase_of_capital_assets"
                name="cash_paid_for_purchase_of_capital_assets"
                type="number"
                step="0.01"
                value={formData.cash_paid_for_purchase_of_capital_assets}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financing Activities</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="proceeds_from_common_stock_issuance">Proceeds from Common Stock Issuance</Label>
              <Input
                id="proceeds_from_common_stock_issuance"
                name="proceeds_from_common_stock_issuance"
                type="number"
                step="0.01"
                value={formData.proceeds_from_common_stock_issuance}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="dividends_paid_out">Dividends Paid Out</Label>
              <Input
                id="dividends_paid_out"
                name="dividends_paid_out"
                type="number"
                step="0.01"
                value={formData.dividends_paid_out}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Position</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="net_change_in_cash_and_cash_equivalents">Net Change in Cash</Label>
              <Input
                id="net_change_in_cash_and_cash_equivalents"
                name="net_change_in_cash_and_cash_equivalents"
                type="number"
                step="0.01"
                value={formData.net_change_in_cash_and_cash_equivalents}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="cash_at_beginning_of_period">Cash at Beginning of Period</Label>
              <Input
                id="cash_at_beginning_of_period"
                name="cash_at_beginning_of_period"
                type="number"
                step="0.01"
                value={formData.cash_at_beginning_of_period}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="cash_at_end_of_period">Cash at End of Period</Label>
              <Input
                id="cash_at_end_of_period"
                name="cash_at_end_of_period"
                type="number"
                step="0.01"
                value={formData.cash_at_end_of_period}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/cash-flow-statement">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Cash Flow Statement'}
          </Button>
        </div>
      </form>
    </div>
  );
}