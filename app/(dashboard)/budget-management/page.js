'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export default function BudgetManagementPage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [filters, setFilters] = useState({
    financial_year: '',
    department: '',
    budget_status: ''
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  async function fetchBudgets() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.financial_year) params.append('financial_year', filters.financial_year);
      if (filters.department) params.append('department', filters.department);
      if (filters.budget_status) params.append('budget_status', filters.budget_status);

      const response = await fetch(`/api/budget-management?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setBudgets(result.data);
      } else {
        console.error('Failed to fetch budgets:', result.error);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      setDeleting(id);
      const response = await fetch(`/api/budget-management/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.success) {
        setBudgets(budgets.filter(b => b.id !== id));
      } else {
        console.error('Failed to delete budget:', result.error);
        alert('Failed to delete budget entry');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert('Error deleting budget entry');
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
      currency: 'USD'
    }).format(amount || 0);
  }

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
          <p className="text-gray-600 mt-1">Track and manage organizational budgets</p>
        </div>
        <Link href="/budget-management/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="financial_year">Financial Year</Label>
              <Input
                id="financial_year"
                placeholder="e.g., 2024"
                value={filters.financial_year}
                onChange={(e) => setFilters({ ...filters, financial_year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Marketing"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget_status">Status</Label>
              <Select
                value={filters.budget_status}
                onValueChange={(value) => setFilters({ ...filters, budget_status: value })}
              >
                <SelectTrigger id="budget_status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Exceeded">Exceeded</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={fetchBudgets}>
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Entries ({budgets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No budget entries found</p>
              <Link href="/budget-management/new">
                <Button className="mt-4">Create First Budget</Button>
              </Link>
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
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-right">Utilization</TableHead>
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