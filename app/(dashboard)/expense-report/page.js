'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, FileText, Trash2, Edit } from 'lucide-react';

export default function ExpenseReportPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    fetchReports();
  }, [employeeFilter, departmentFilter]);

  async function fetchReports() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (employeeFilter) params.append('employee_id', employeeFilter);
      if (departmentFilter) params.append('department', departmentFilter);
      
      const res = await fetch(`/api/expense-report?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setReports(data.data);
      } else {
        console.error('Error fetching expense reports:', data.error);
      }
    } catch (error) {
      console.error('Error fetching expense reports:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this expense report?')) return;
    
    try {
      const res = await fetch(`/api/expense-report/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (data.success) {
        fetchReports();
      } else {
        alert('Error deleting expense report: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting expense report:', error);
      alert('Error deleting expense report');
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading expense reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Report</h1>
          <p className="text-muted-foreground">Track employee expense reimbursements</p>
        </div>
        <Link href="/expense-report/new">
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
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                placeholder="Filter by employee ID"
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Filter by department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No expense reports found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first expense report</p>
            <Link href="/expense-report/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Expense Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Expense Reports ({reports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Employee</th>
                    <th className="text-left p-4 font-medium">Employee ID</th>
                    <th className="text-left p-4 font-medium">Department</th>
                    <th className="text-left p-4 font-medium">Destination</th>
                    <th className="text-left p-4 font-medium">Purpose</th>
                    <th className="text-right p-4 font-medium">Total</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">{report.employee_name}</td>
                      <td className="p-4">{report.employee_id}</td>
                      <td className="p-4">{report.department}</td>
                      <td className="p-4">{report.destination}</td>
                      <td className="p-4">{report.purpose}</td>
                      <td className="p-4 text-right font-semibold">
                        ${report.total ? Number(report.total).toLocaleString() : '0.00'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/expense-report/${report.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(report.id)}
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