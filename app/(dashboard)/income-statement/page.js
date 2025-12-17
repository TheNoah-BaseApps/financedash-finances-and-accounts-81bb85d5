'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, FileText, Trash2, Edit } from 'lucide-react';

export default function IncomeStatementPage() {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    fetchStatements();
  }, [yearFilter]);

  async function fetchStatements() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (yearFilter) params.append('year', yearFilter);
      
      const res = await fetch(`/api/income-statement?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setStatements(data.data);
      } else {
        console.error('Error fetching income statements:', data.error);
      }
    } catch (error) {
      console.error('Error fetching income statements:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this income statement?')) return;
    
    try {
      const res = await fetch(`/api/income-statement/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        fetchStatements();
      } else {
        alert('Error deleting income statement: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting income statement:', error);
      alert('Error deleting income statement');
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading income statements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Income Statement</h1>
          <p className="text-muted-foreground">Track revenue and expense accounts</p>
        </div>
        <Link href="/income-statement/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                placeholder="e.g., 2024"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {statements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No income statements found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first income statement</p>
            <Link href="/income-statement/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Income Statement
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Income Statements ({statements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Year</th>
                    <th className="text-left p-4 font-medium">Account Category</th>
                    <th className="text-right p-4 font-medium">Total Revenues</th>
                    <th className="text-right p-4 font-medium">Total Expenses</th>
                    <th className="text-right p-4 font-medium">Net Income</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statements.map((statement) => (
                    <tr key={statement.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">{statement.year}</td>
                      <td className="p-4">{statement.account_category}</td>
                      <td className="p-4 text-right">
                        ${statement.total_revenues ? Number(statement.total_revenues).toLocaleString() : '0.00'}
                      </td>
                      <td className="p-4 text-right">
                        ${statement.total_expenses ? Number(statement.total_expenses).toLocaleString() : '0.00'}
                      </td>
                      <td className="p-4 text-right font-semibold">
                        ${statement.net_income ? Number(statement.net_income).toLocaleString() : '0.00'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/income-statement/${statement.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(statement.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}