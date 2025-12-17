'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Trash2, Edit } from 'lucide-react';

export default function CashFlowStatementPage() {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatements();
  }, []);

  async function fetchStatements() {
    try {
      setLoading(true);
      const res = await fetch('/api/cash-flow-statement');
      const data = await res.json();
      
      if (data.success) {
        setStatements(data.data);
      } else {
        console.error('Error fetching cash flow statements:', data.error);
      }
    } catch (error) {
      console.error('Error fetching cash flow statements:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this cash flow statement?')) return;
    
    try {
      const res = await fetch(`/api/cash-flow-statement/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        fetchStatements();
      } else {
        alert('Error deleting cash flow statement: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting cash flow statement:', error);
      alert('Error deleting cash flow statement');
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading cash flow statements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cash Flow Statement</h1>
          <p className="text-muted-foreground">Track operating, investing, and financing activities</p>
        </div>
        <Link href="/cash-flow-statement/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {statements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cash flow statements found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first cash flow statement</p>
            <Link href="/cash-flow-statement/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Cash Flow Statement
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Statements ({statements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-right p-4 font-medium">Net Income</th>
                    <th className="text-right p-4 font-medium">Cash at Beginning</th>
                    <th className="text-right p-4 font-medium">Cash at End</th>
                    <th className="text-right p-4 font-medium">Net Change</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statements.map((statement) => (
                    <tr key={statement.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">{statement.category}</td>
                      <td className="p-4 text-right">
                        ${statement.net_income ? Number(statement.net_income).toLocaleString() : '0.00'}
                      </td>
                      <td className="p-4 text-right">
                        ${statement.cash_at_beginning_of_period ? Number(statement.cash_at_beginning_of_period).toLocaleString() : '0.00'}
                      </td>
                      <td className="p-4 text-right">
                        ${statement.cash_at_end_of_period ? Number(statement.cash_at_end_of_period).toLocaleString() : '0.00'}
                      </td>
                      <td className="p-4 text-right font-semibold">
                        ${statement.net_change_in_cash_and_cash_equivalents ? Number(statement.net_change_in_cash_and_cash_equivalents).toLocaleString() : '0.00'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/cash-flow-statement/${statement.id}`}>
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