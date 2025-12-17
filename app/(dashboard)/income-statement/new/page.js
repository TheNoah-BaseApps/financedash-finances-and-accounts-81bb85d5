'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewIncomeStatementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: '',
    account_category: '',
    sales_revenue: '',
    service_revenue: '',
    interest_revenue: '',
    other_revenue: '',
    total_revenues: '',
    advertising: '',
    bad_debt: '',
    commissions: '',
    cost_of_goods_sold: '',
    depreciation: '',
    employee_benefits: '',
    furniture_and_equipment: '',
    insurance: '',
    interest_expense: '',
    maintenance_and_repairs: '',
    office_supplies: '',
    payroll_taxes: '',
    rent: '',
    research_and_development: '',
    salaries_and_wages: '',
    software: '',
    travel: '',
    utilities: '',
    web_hosting_and_domains: '',
    other_expenses: '',
    total_expenses: '',
    net_income_before_taxes: '',
    income_tax_expense: '',
    income_from_continuing_operations: '',
    net_income: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/income-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/income-statement');
      } else {
        alert('Error creating income statement: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating income statement:', error);
      alert('Error creating income statement');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/income-statement">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Income Statement</h1>
          <p className="text-muted-foreground">Enter revenue and expense details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                placeholder="e.g., 2024"
              />
            </div>
            <div>
              <Label htmlFor="account_category">Account Category *</Label>
              <Input
                id="account_category"
                name="account_category"
                value={formData.account_category}
                onChange={handleChange}
                required
                placeholder="e.g., Operating"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sales_revenue">Sales Revenue</Label>
              <Input
                id="sales_revenue"
                name="sales_revenue"
                type="number"
                step="0.01"
                value={formData.sales_revenue}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="service_revenue">Service Revenue</Label>
              <Input
                id="service_revenue"
                name="service_revenue"
                type="number"
                step="0.01"
                value={formData.service_revenue}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="interest_revenue">Interest Revenue</Label>
              <Input
                id="interest_revenue"
                name="interest_revenue"
                type="number"
                step="0.01"
                value={formData.interest_revenue}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="other_revenue">Other Revenue</Label>
              <Input
                id="other_revenue"
                name="other_revenue"
                type="number"
                step="0.01"
                value={formData.other_revenue}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="total_revenues">Total Revenues</Label>
              <Input
                id="total_revenues"
                name="total_revenues"
                type="number"
                step="0.01"
                value={formData.total_revenues}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="advertising">Advertising</Label>
              <Input
                id="advertising"
                name="advertising"
                type="number"
                step="0.01"
                value={formData.advertising}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="bad_debt">Bad Debt</Label>
              <Input
                id="bad_debt"
                name="bad_debt"
                type="number"
                step="0.01"
                value={formData.bad_debt}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="commissions">Commissions</Label>
              <Input
                id="commissions"
                name="commissions"
                type="number"
                step="0.01"
                value={formData.commissions}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="cost_of_goods_sold">Cost of Goods Sold</Label>
              <Input
                id="cost_of_goods_sold"
                name="cost_of_goods_sold"
                type="number"
                step="0.01"
                value={formData.cost_of_goods_sold}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="depreciation">Depreciation</Label>
              <Input
                id="depreciation"
                name="depreciation"
                type="number"
                step="0.01"
                value={formData.depreciation}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="salaries_and_wages">Salaries and Wages</Label>
              <Input
                id="salaries_and_wages"
                name="salaries_and_wages"
                type="number"
                step="0.01"
                value={formData.salaries_and_wages}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="rent">Rent</Label>
              <Input
                id="rent"
                name="rent"
                type="number"
                step="0.01"
                value={formData.rent}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="utilities">Utilities</Label>
              <Input
                id="utilities"
                name="utilities"
                type="number"
                step="0.01"
                value={formData.utilities}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="total_expenses">Total Expenses</Label>
              <Input
                id="total_expenses"
                name="total_expenses"
                type="number"
                step="0.01"
                value={formData.total_expenses}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Income</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="net_income_before_taxes">Net Income Before Taxes</Label>
              <Input
                id="net_income_before_taxes"
                name="net_income_before_taxes"
                type="number"
                step="0.01"
                value={formData.net_income_before_taxes}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="income_tax_expense">Income Tax Expense</Label>
              <Input
                id="income_tax_expense"
                name="income_tax_expense"
                type="number"
                step="0.01"
                value={formData.income_tax_expense}
                onChange={handleChange}
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

        <div className="flex justify-end gap-4">
          <Link href="/income-statement">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Income Statement'}
          </Button>
        </div>
      </form>
    </div>
  );
}