'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Loader2 } from 'lucide-react';

export default function FinanceReportingPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      setLoading(true);
      const res = await fetch('/api/finance-reporting');
      const data = await res.json();
      
      if (data.success) {
        setReports(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching finance reports:', err);
      setError('Failed to load finance reports');
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Reporting</h1>
          <p className="text-muted-foreground mt-2">
            Track financial performance metrics and reports
          </p>
        </div>
        <Link href="/finance-reporting/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Finance Report
          </Button>
        </Link>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Finance Report List</CardTitle>
          <CardDescription>
            View and manage all financial reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">No finance reports found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first finance report.
              </p>
              <Link href="/finance-reporting/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Finance Report
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Financial Year</TableHead>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Report Date</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Net Profit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.report_id}</TableCell>
                    <TableCell>{report.financial_year}</TableCell>
                    <TableCell>{report.report_type}</TableCell>
                    <TableCell>{new Date(report.report_date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(report.revenue)}</TableCell>
                    <TableCell>{formatCurrency(report.net_profit)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.report_status)}>
                        {report.report_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/finance-reporting/${report.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}