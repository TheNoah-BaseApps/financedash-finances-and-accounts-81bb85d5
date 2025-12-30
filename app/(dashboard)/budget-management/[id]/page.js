'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EditBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [revisionHistory, setRevisionHistory] = useState([]);
  const [formData, setFormData] = useState({
    budget_id: '',
    financial_year: '',
    department: '',
    budget_category: '',
    sub_category: '',
    budget_date: '',
    budget_owner: '',
    original_budget: '',
    revised_budget: '',
    actual_spend_ytd: '',
    committed_spend: '',
    budget_status: '',
    total_utilised: '0',
    balance_available: '0',
    utilisation_percent: '0'
  });

  useEffect(() => {
    fetchBudget();
    fetchRevisionHistory();
  }, [id]);

  async function fetchBudget() {
    try {
      const response = await fetch(`/api/budget-management/${id}`);
      const result = await response.json();

      if (result.success) {
        const budget = result.data;
        setFormData({
          budget_id: budget.budget_id || '',
          financial_year: budget.financial_year || '',
          department: budget.department || '',
          budget_category: budget.budget_category || '',
          sub_category: budget.sub_category || '',
          budget_date: budget.budget_date ? budget.budget_date.split('T')[0] : '',
          budget_owner: budget.budget_owner || '',
          original_budget: budget.original_budget?.toString() || '',
          revised_budget: budget.revised_budget?.toString() || '',
          actual_spend_ytd: budget.actual_spend_ytd?.toString() || '0',
          committed_spend: budget.committed_spend?.toString() || '0',
          budget_status: budget.budget_status || 'Active',
          total_utilised: budget.total_utilised?.toString() || '0',
          balance_available: budget.balance_available?.toString() || '0',
          utilisation_percent: budget.utilisation_percent?.toString() || '0'
        });
      } else {
        toast.error('Failed to fetch budget entry');
        router.push('/budget-management');
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
      toast.error('Error fetching budget entry');
      router.push('/budget-management');
    } finally {
      setLoading(false);
    }
  }

  async function fetchRevisionHistory() {
    try {
      const response = await fetch(`/api/budget-management/${id}/revisions`);
      const result = await response.json();

      if (result.success) {
        setRevisionHistory(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching revision history:', error);
    }
  }

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
    setSaving(true);

    try {
      // Recalculate values before submission
      const original = parseFloat(formData.original_budget);
      const revised = formData.revised_budget ? parseFloat(formData.revised_budget) : original;
      const actual = parseFloat(formData.actual_spend_ytd || 0);
      const committed = parseFloat(formData.committed_spend || 0);

      const totalUtilised = actual + committed;
      const balance = revised - totalUtilised;
      const utilisation = revised > 0 ? (totalUtilised / revised) * 100 : 0;

      const response = await fetch(`/api/budget-management/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          original_budget: original,
          revised_budget: formData.revised_budget ? parseFloat(formData.revised_budget) : null,
          actual_spend_ytd: actual,
          committed_spend: committed,
          total_utilised: totalUtilised,
          balance_available: balance,
          utilisation_percent: parseFloat(utilisation.toFixed(2))
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Budget entry updated successfully');
        router.push('/budget-management');
      } else {
        toast.error('Failed to update budget: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('Error updating budget entry');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);

    try {
      const response = await fetch(`/api/budget-management/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Budget entry deleted successfully');
        router.push('/budget-management');
      } else {
        toast.error('Failed to delete budget: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Error deleting budget entry');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/budget-management">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Budget Management
          </Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={deleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Budget
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the budget entry
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Budget Entry</CardTitle>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="financial_year">Financial Year *</Label>
                <Input
                  id="financial_year"
                  required
                  value={formData.financial_year}
                  onChange={(e) => handleChange('financial_year', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  required
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
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
                    <SelectValue />
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
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {revisionHistory.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Revision History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revisionHistory.map((revision, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">
                        {new Date(revision.revision_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        Revised by: {revision.revised_by || 'System'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ${parseFloat(revision.previous_amount || 0).toLocaleString()} → ${parseFloat(revision.new_amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {revision.revision_reason && (
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">Reason:</span> {revision.revision_reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}