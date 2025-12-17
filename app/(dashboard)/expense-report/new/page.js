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

export default function NewExpenseReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_name: '',
    employee_id: '',
    reimbursement_address: '',
    phone: '',
    department: '',
    manager: '',
    manager_phone: '',
    destination: '',
    purpose: '',
    from_date: '',
    to_date: '',
    expense_date: '',
    description: '',
    air_and_transport: '',
    lodging: '',
    fuel: '',
    phone_expenses: '',
    meals_and_tips: '',
    entertainment: '',
    other_expenses: '',
    total: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/expense-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/expense-report');
      } else {
        alert('Error creating expense report: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating expense report:', error);
      alert('Error creating expense report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/expense-report">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Expense Report</h1>
          <p className="text-muted-foreground">Submit employee expense reimbursement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employee_name">Employee Name *</Label>
              <Input
                id="employee_name"
                name="employee_name"
                value={formData.employee_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="employee_id">Employee ID *</Label>
              <Input
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="reimbursement_address">Reimbursement Address *</Label>
              <Textarea
                id="reimbursement_address"
                name="reimbursement_address"
                value={formData.reimbursement_address}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manager">Manager *</Label>
              <Input
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="manager_phone">Manager Phone *</Label>
              <Input
                id="manager_phone"
                name="manager_phone"
                value={formData.manager_phone}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="from_date">From Date *</Label>
              <Input
                id="from_date"
                name="from_date"
                type="date"
                value={formData.from_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="to_date">To Date *</Label>
              <Input
                id="to_date"
                name="to_date"
                type="date"
                value={formData.to_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="expense_date">Expense Date *</Label>
              <Input
                id="expense_date"
                name="expense_date"
                type="date"
                value={formData.expense_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
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
              <Label htmlFor="air_and_transport">Air and Transport</Label>
              <Input
                id="air_and_transport"
                name="air_and_transport"
                type="number"
                step="0.01"
                value={formData.air_and_transport}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="lodging">Lodging</Label>
              <Input
                id="lodging"
                name="lodging"
                type="number"
                step="0.01"
                value={formData.lodging}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="fuel">Fuel</Label>
              <Input
                id="fuel"
                name="fuel"
                type="number"
                step="0.01"
                value={formData.fuel}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="phone_expenses">Phone Expenses</Label>
              <Input
                id="phone_expenses"
                name="phone_expenses"
                type="number"
                step="0.01"
                value={formData.phone_expenses}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="meals_and_tips">Meals and Tips</Label>
              <Input
                id="meals_and_tips"
                name="meals_and_tips"
                type="number"
                step="0.01"
                value={formData.meals_and_tips}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="entertainment">Entertainment</Label>
              <Input
                id="entertainment"
                name="entertainment"
                type="number"
                step="0.01"
                value={formData.entertainment}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="other_expenses">Other Expenses</Label>
              <Input
                id="other_expenses"
                name="other_expenses"
                type="number"
                step="0.01"
                value={formData.other_expenses}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="total">Total</Label>
              <Input
                id="total"
                name="total"
                type="number"
                step="0.01"
                value={formData.total}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/expense-report">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Expense Report'}
          </Button>
        </div>
      </form>
    </div>
  );
}