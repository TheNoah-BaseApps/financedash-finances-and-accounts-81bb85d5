'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewBudgetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    budget_id: '',
    financial_year: new Date().getFullYear().toString(),
    department: '',
    budget_category: '',
    sub_category: '',
    budget_date: new Date().toISOString().split('T')[0],
    budget_owner: '',
    original_budget: '',
    revised_budget: '',
    actual_spend_ytd: '0',
    committed_spend: '0',
    budget_status: 'Active'
  });

  function handleChange(field, value) {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate derived fields
      const original = parseFloat(updated.original_budget) || 0;
      const revised = parseFloat(updated.revised_budget) || original;
      const actual = parseFloat(updated.actual_spend_ytd) || 0;
      const committed = parseFloat(updated.committed_spend) || 0;

      const totalUtilised = actual + committed;
      const balance = revised - totalUtilised;
      const utilisation = revised > 0 ? (totalUtilised / revised) * 100 : 0;

      return {
        ...updated,
        total_utilised: totalUtilised.toString(),
        balance_available: balance.toString(),
        utilisation_percent: utilisation.toFixed(2)
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/budget-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          original_budget: parseFloat(formData.original_budget),
          revised_budget: formData.revised_budget ? parseFloat(formData.revised_budget) : null,
          actual_spend_ytd: parseFloat(formData.actual_spend_ytd || 0),
          committed_spend: parseFloat(formData.committed_spend || 0)
        })
      });

      const result = await response.json();

      if (result.success) {
        router.push('/budget-management');
      } else {
        alert('Failed to create budget: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Error creating budget entry');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/budget-management">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Budget Management
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Budget Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget_id">Budget ID *</Label>
                <Input
                  id="budget_id"
                  required
                  value={formData.budget_id}
                  onChange={(e) => handleChange('budget_id', e.target.value)}
                  placeholder="e.g., BDG-2024-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="financial_year">Financial Year *</Label>
                <Input
                  id="financial_year"
                  required
                  value={formData.financial_year}
                  onChange={(e) => handleChange('financial_year', e.target.value)}
                  placeholder="e.g., 2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  required
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="e.g., Marketing"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_category">Budget Category *</Label>
                <Select
                  value={formData.budget_category}
                  onValueChange={(value) => handleChange('budget_category', value)}
                  required
                >
                  <SelectTrigger id="budget_category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personnel">Personnel</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Capital Expenditure">Capital Expenditure</SelectItem>
                    <SelectItem value="Research & Development">Research & Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub_category">Sub Category</Label>
                <Input
                  id="sub_category"
                  value={formData.sub_category}
                  onChange={(e) => handleChange('sub_category', e.target.value)}
                  placeholder="e.g., Digital Advertising"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_date">Budget Date *</Label>
                <Input
                  id="budget_date"
                  type="date"
                  required
                  value={formData.budget_date}
                  onChange={(e) => handleChange('budget_date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_owner">Budget Owner *</Label>
                <Input
                  id="budget_owner"
                  required
                  value={formData.budget_owner}
                  onChange={(e) => handleChange('budget_owner', e.target.value)}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="original_budget">Original Budget *</Label>
                <Input
                  id="original_budget"
                  type="number"
                  step="0.01"
                  required
                  value={formData.original_budget}
                  onChange={(e) => handleChange('original_budget', e.target.value)}
                  placeholder="e.g., 100000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revised_budget">Revised Budget</Label>
                <Input
                  id="revised_budget"
                  type="number"
                  step="0.01"
                  value={formData.revised_budget}
                  onChange={(e) => handleChange('revised_budget', e.target.value)}
                  placeholder="Leave empty to use original"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actual_spend_ytd">Actual Spend YTD</Label>
                <Input
                  id="actual_spend_ytd"
                  type="number"
                  step="0.01"
                  value={formData.actual_spend_ytd}
                  onChange={(e) => handleChange('actual_spend_ytd', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="committed_spend">Committed Spend</Label>
                <Input
                  id="committed_spend"
                  type="number"
                  step="0.01"
                  value={formData.committed_spend}
                  onChange={(e) => handleChange('committed_spend', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_status">Budget Status *</Label>
                <Select
                  value={formData.budget_status}
                  onValueChange={(value) => handleChange('budget_status', value)}
                  required
                >
                  <SelectTrigger id="budget_status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Exceeded">Exceeded</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.original_budget && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-sm">Calculated Values</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label>Total Utilised</Label>
                    <p className="font-semibold">${parseFloat(formData.total_utilised || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Balance Available</Label>
                    <p className="font-semibold">${parseFloat(formData.balance_available || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Utilisation %</Label>
                    <p className="font-semibold">{formData.utilisation_percent || 0}%</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4 justify-end">
              <Link href="/budget-management">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Budget'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}