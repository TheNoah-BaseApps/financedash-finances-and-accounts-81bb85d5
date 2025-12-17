'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditBalanceSheetPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    year: '',
    category: '',
    cash: '',
    accounts_receivable: '',
    inventory: '',
    prepaid_expenses: '',
    short_term_investments: '',
    total_current_assets: '',
    long_term_investments: '',
    property_equipment: '',
    less_accumulated_depreciation: '',
    intangible_assets: '',
    total_fixed_assets: '',
    deferred_income_tax: '',
    other_assets: '',
    total_assets: '',
    accounts_payable: '',
    short_term_loans: '',
    income_taxes_payable: '',
    accrued_salaries_and_wages: '',
    unearned_revenue: '',
    current_portion_of_long_term_debt: '',
    total_current_liabilities: '',
    long_term_debt: '',
    deferred_income_tax_liabilities: '',
    total_long_term_liabilities: '',
    owners_investment: '',
    retained_earnings: '',
    total_owners_equity: '',
    total_liabilities_and_owners_equity: '',
  });

  useEffect(() => {
    fetchBalanceSheet();
  }, [params.id]);

  async function fetchBalanceSheet() {
    try {
      const response = await fetch(`/api/balance-sheet/${params.id}`);
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        setFormData({
          year: data.year || '',
          category: data.category || '',
          cash: data.cash || '',
          accounts_receivable: data.accounts_receivable || '',
          inventory: data.inventory || '',
          prepaid_expenses: data.prepaid_expenses || '',
          short_term_investments: data.short_term_investments || '',
          total_current_assets: data.total_current_assets || '',
          long_term_investments: data.long_term_investments || '',
          property_equipment: data.property_equipment || '',
          less_accumulated_depreciation: data.less_accumulated_depreciation || '',
          intangible_assets: data.intangible_assets || '',
          total_fixed_assets: data.total_fixed_assets || '',
          deferred_income_tax: data.deferred_income_tax || '',
          other_assets: data.other_assets || '',
          total_assets: data.total_assets || '',
          accounts_payable: data.accounts_payable || '',
          short_term_loans: data.short_term_loans || '',
          income_taxes_payable: data.income_taxes_payable || '',
          accrued_salaries_and_wages: data.accrued_salaries_and_wages || '',
          unearned_revenue: data.unearned_revenue || '',
          current_portion_of_long_term_debt: data.current_portion_of_long_term_debt || '',
          total_current_liabilities: data.total_current_liabilities || '',
          long_term_debt: data.long_term_debt || '',
          deferred_income_tax_liabilities: data.deferred_income_tax_liabilities || '',
          total_long_term_liabilities: data.total_long_term_liabilities || '',
          owners_investment: data.owners_investment || '',
          retained_earnings: data.retained_earnings || '',
          total_owners_equity: data.total_owners_equity || '',
          total_liabilities_and_owners_equity: data.total_liabilities_and_owners_equity || '',
        });
      }
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = { ...formData };
      
      Object.keys(payload).forEach((key) => {
        if (key !== 'year' && key !== 'category' && payload[key] !== '') {
          payload[key] = parseFloat(payload[key]);
        }
      });

      const response = await fetch(`/api/balance-sheet/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/balance-sheet');
      } else {
        console.error('Error updating balance sheet:', result.error);
        alert('Failed to update balance sheet entry');
      }
    } catch (error) {
      console.error('Error updating balance sheet:', error);
      alert('Failed to update balance sheet entry');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading balance sheet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/balance-sheet">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Balance Sheet</h1>
          <p className="text-muted-foreground mt-1">
            Update balance sheet data for assets, liabilities, and equity
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cash">Cash</Label>
                <Input id="cash" name="cash" type="number" step="0.01" value={formData.cash} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accounts_receivable">Accounts Receivable</Label>
                <Input id="accounts_receivable" name="accounts_receivable" type="number" step="0.01" value={formData.accounts_receivable} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inventory">Inventory</Label>
                <Input id="inventory" name="inventory" type="number" step="0.01" value={formData.inventory} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prepaid_expenses">Prepaid Expenses</Label>
                <Input id="prepaid_expenses" name="prepaid_expenses" type="number" step="0.01" value={formData.prepaid_expenses} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_term_investments">Short Term Investments</Label>
                <Input id="short_term_investments" name="short_term_investments" type="number" step="0.01" value={formData.short_term_investments} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_current_assets">Total Current Assets</Label>
                <Input id="total_current_assets" name="total_current_assets" type="number" step="0.01" value={formData.total_current_assets} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fixed Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="long_term_investments">Long Term Investments</Label>
                <Input id="long_term_investments" name="long_term_investments" type="number" step="0.01" value={formData.long_term_investments} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property_equipment">Property Equipment</Label>
                <Input id="property_equipment" name="property_equipment" type="number" step="0.01" value={formData.property_equipment} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="less_accumulated_depreciation">Less Accumulated Depreciation</Label>
                <Input id="less_accumulated_depreciation" name="less_accumulated_depreciation" type="number" step="0.01" value={formData.less_accumulated_depreciation} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intangible_assets">Intangible Assets</Label>
                <Input id="intangible_assets" name="intangible_assets" type="number" step="0.01" value={formData.intangible_assets} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_fixed_assets">Total Fixed Assets</Label>
                <Input id="total_fixed_assets" name="total_fixed_assets" type="number" step="0.01" value={formData.total_fixed_assets} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deferred_income_tax">Deferred Income Tax</Label>
                <Input id="deferred_income_tax" name="deferred_income_tax" type="number" step="0.01" value={formData.deferred_income_tax} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_assets">Other Assets</Label>
                <Input id="other_assets" name="other_assets" type="number" step="0.01" value={formData.other_assets} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_assets">Total Assets</Label>
                <Input id="total_assets" name="total_assets" type="number" step="0.01" value={formData.total_assets} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Liabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accounts_payable">Accounts Payable</Label>
                <Input id="accounts_payable" name="accounts_payable" type="number" step="0.01" value={formData.accounts_payable} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_term_loans">Short Term Loans</Label>
                <Input id="short_term_loans" name="short_term_loans" type="number" step="0.01" value={formData.short_term_loans} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income_taxes_payable">Income Taxes Payable</Label>
                <Input id="income_taxes_payable" name="income_taxes_payable" type="number" step="0.01" value={formData.income_taxes_payable} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accrued_salaries_and_wages">Accrued Salaries And Wages</Label>
                <Input id="accrued_salaries_and_wages" name="accrued_salaries_and_wages" type="number" step="0.01" value={formData.accrued_salaries_and_wages} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unearned_revenue">Unearned Revenue</Label>
                <Input id="unearned_revenue" name="unearned_revenue" type="number" step="0.01" value={formData.unearned_revenue} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_portion_of_long_term_debt">Current Portion Of Long Term Debt</Label>
                <Input id="current_portion_of_long_term_debt" name="current_portion_of_long_term_debt" type="number" step="0.01" value={formData.current_portion_of_long_term_debt} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_current_liabilities">Total Current Liabilities</Label>
                <Input id="total_current_liabilities" name="total_current_liabilities" type="number" step="0.01" value={formData.total_current_liabilities} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Long Term Liabilities & Equity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="long_term_debt">Long Term Debt</Label>
                <Input id="long_term_debt" name="long_term_debt" type="number" step="0.01" value={formData.long_term_debt} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deferred_income_tax_liabilities">Deferred Income Tax Liabilities</Label>
                <Input id="deferred_income_tax_liabilities" name="deferred_income_tax_liabilities" type="number" step="0.01" value={formData.deferred_income_tax_liabilities} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_long_term_liabilities">Total Long Term Liabilities</Label>
                <Input id="total_long_term_liabilities" name="total_long_term_liabilities" type="number" step="0.01" value={formData.total_long_term_liabilities} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owners_investment">Owners Investment</Label>
                <Input id="owners_investment" name="owners_investment" type="number" step="0.01" value={formData.owners_investment} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retained_earnings">Retained Earnings</Label>
                <Input id="retained_earnings" name="retained_earnings" type="number" step="0.01" value={formData.retained_earnings} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_owners_equity">Total Owners Equity</Label>
                <Input id="total_owners_equity" name="total_owners_equity" type="number" step="0.01" value={formData.total_owners_equity} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_liabilities_and_owners_equity">Total Liabilities And Owners Equity</Label>
                <Input id="total_liabilities_and_owners_equity" name="total_liabilities_and_owners_equity" type="number" step="0.01" value={formData.total_liabilities_and_owners_equity} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/balance-sheet">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}