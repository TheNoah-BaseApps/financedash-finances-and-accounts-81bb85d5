'use client';

import { useState, useEffect } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, TrendingUp, DollarSign, PiggyBank, Percent, Edit, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';

export default function BudgetManagementPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    financial_year: '',
    department: '',
  });
  const [formData, setFormData] = useState({
    budget_id: '',
    financial_year: '',
    department: '',
    budget_category: '',
    budget_owner: '',
    original_budget: '',
    revised_budget: '',
    actual_spend_ytd: '',
    balance_available: '',
    utilisation_percent: '',
    budget_status: 'Active',
    start_date: '',
    end_date: '',
    approval_status: 'Pending',
    notes: '',
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  async function fetchBudgets() {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filters.financial_year) params.append('financial_year', filters.financial_year);
      if (filters.department) params.append('department', filters.department);

      const response = await fetch(`/api/budget-management?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setBudgets(result.data);
      } else {
        setError(result.error || 'Failed to fetch budgets');
        toast.error('Failed to fetch budgets');
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError('Error fetching budgets');
      toast.error('Error fetching budgets');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await fetch('/api/budget-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.success) {
        toast.success('Budget created successfully');
        setIsDialogOpen(false);
        setFormData({
          budget_id: '',
          financial_year: '',
          department: '',
          budget_category: '',
          budget_owner: '',
          original_budget: '',
          revised_budget: '',
          actual_spend_ytd: '',
          balance_available: '',
          utilisation_percent: '',
          budget_status: 'Active',
          start_date: '',
          end_date: '',
          approval_status: 'Pending',
          notes: '',
        });
        fetchBudgets();
      } else {
        toast.error(result.error || 'Failed to create budget');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Error creating budget');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      setDeleting(id);
      const response = await fetch(`/api/budget-management/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        toast.success('Budget deleted successfully');
        setBudgets(budgets.filter((b) => b.id !== id));
      } else {
        toast.error(result.error || 'Failed to delete budget');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Error deleting budget');
    } finally {
      setDeleting(null);
    }
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'on hold':
        return 'bg-yellow-500';
      case 'exceeded':
        return 'bg-red-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  }

  const stats = {
    totalBudgets: budgets.length,
    totalUtilised: budgets.reduce((sum, b) => sum + (parseFloat(b.actual_spend_ytd) || 0), 0),
    totalAvailable: budgets.reduce((sum, b) => sum + (parseFloat(b.balance_available) || 0), 0),
    avgUtilisation: budgets.length > 0
      ? budgets.reduce((sum, b) => sum + (parseFloat(b.utilisation_percent) || 0), 0) / budgets.length
      : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-gray-600 mt-1">Track and manage budgets across departments and financial years</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
              <DialogDescription>
                Create a new budget entry for tracking departmental spending
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget_id">Budget ID *</Label>
                    <Input
                      id="budget_id"
                      value={formData.budget_id}
                      onChange={(e) => setFormData({ ...formData, budget_id: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="financial_year">Financial Year *</Label>
                    <Input
                      id="financial_year"
                      value={formData.financial_year}
                      onChange={(e) => setFormData({ ...formData, financial_year: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget_category">Budget Category *</Label>
                    <Input
                      id="budget_category"
                      value={formData.budget_category}
                      onChange={(e) => setFormData({ ...formData, budget_category: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_owner">Budget Owner *</Label>
                  <Input
                    id="budget_owner"
                    value={formData.budget_owner}
                    onChange={(e) => setFormData({ ...formData, budget_owner: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="original_budget">Original Budget *</Label>
                    <Input
                      id="original_budget"
                      type="number"
                      step="0.01"
                      value={formData.original_budget}
                      onChange={(e) => setFormData({ ...formData, original_budget: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revised_budget">Revised Budget</Label>
                    <Input
                      id="revised_budget"
                      type="number"
                      step="0.01"
                      value={formData.revised_budget}
                      onChange={(e) => setFormData({ ...formData, revised_budget: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actual_spend_ytd">Actual Spend YTD</Label>
                    <Input
                      id="actual_spend_ytd"
                      type="number"
                      step="0.01"
                      value={formData.actual_spend_ytd}
                      onChange={(e) => setFormData({ ...formData, actual_spend_ytd: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance_available">Balance Available</Label>
                    <Input
                      id="balance_available"
                      type="number"
                      step="0.01"
                      value={formData.balance_available}
                      onChange={(e) => setFormData({ ...formData, balance_available: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="utilisation_percent">Utilisation %</Label>
                    <Input
                      id="utilisation_percent"
                      type="number"
                      step="0.01"
                      value={formData.utilisation_percent}
                      onChange={(e) => setFormData({ ...formData, utilisation_percent: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget_status">Budget Status *</Label>
                    <Select
                      value={formData.budget_status}
                      onValueChange={(value) => setFormData({ ...formData, budget_status: value })}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approval_status">Approval Status</Label>
                  <Select
                    value={formData.approval_status}
                    onValueChange={(value) => setFormData({ ...formData, approval_status: value })}
                  >
                    <SelectTrigger id="approval_status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Budget'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBudgets}</div>
            <p className="text-xs text-muted-foreground">Active budget entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilised</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalUtilised)}</div>
            <p className="text-xs text-muted-foreground">Actual spend YTD</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Available</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAvailable)}</div>
            <p className="text-xs text-muted-foreground">Remaining balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilisation</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgUtilisation.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average across budgets</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter_financial_year">Financial Year</Label>
              <Input
                id="filter_financial_year"
                placeholder="e.g., 2024"
                value={filters.financial_year}
                onChange={(e) => setFilters({ ...filters, financial_year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter_department">Department</Label>
              <Input
                id="filter_department"
                placeholder="e.g., Marketing"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={fetchBudgets}>Apply Filters</Button>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ financial_year: '', department: '' });
                fetchBudgets();
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Entries ({budgets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <Button className="mt-4" onClick={fetchBudgets}>
                Retry
              </Button>
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No budget entries found</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4">Create First Budget</Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Budget ID</TableHead>
                    <TableHead>Financial Year</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Original Budget</TableHead>
                    <TableHead className="text-right">Revised Budget</TableHead>
                    <TableHead className="text-right">Actual Spend YTD</TableHead>
                    <TableHead className="text-right">Balance Available</TableHead>
                    <TableHead className="text-right">Utilisation %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgets.map((budget) => (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium">{budget.budget_id}</TableCell>
                      <TableCell>{budget.financial_year}</TableCell>
                      <TableCell>{budget.department}</TableCell>
                      <TableCell>{budget.budget_category}</TableCell>
                      <TableCell>{budget.budget_owner}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(budget.original_budget)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(budget.revised_budget)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(budget.actual_spend_ytd)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(budget.balance_available)}
                      </TableCell>
                      <TableCell className="text-right">
                        {budget.utilisation_percent?.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(budget.budget_status)}>
                          {budget.budget_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/budget-management/${budget.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <ConfirmDialog
                            title="Delete Budget Entry"
                            description="Are you sure you want to delete this budget entry? This action cannot be undone."
                            onConfirm={() => handleDelete(budget.id)}
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={deleting === budget.id}
                              >
                                {deleting === budget.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}