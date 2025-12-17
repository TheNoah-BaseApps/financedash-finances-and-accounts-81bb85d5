'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileText, Loader2 } from 'lucide-react';

export default function WorkingCapitalPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      setLoading(true);
      const res = await fetch('/api/working-capital');
      const data = await res.json();
      
      if (data.success) {
        setRecords(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching working capital records:', err);
      setError('Failed to load working capital records');
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
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
          <h1 className="text-3xl font-bold tracking-tight">Working Capital</h1>
          <p className="text-muted-foreground mt-2">
            Monitor cash conversion cycle and working capital metrics
          </p>
        </div>
        <Link href="/working-capital/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Working Capital Record
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
          <CardTitle>Working Capital Records</CardTitle>
          <CardDescription>
            View and manage all working capital tracking records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">No working capital records found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first working capital record.
              </p>
              <Link href="/working-capital/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Working Capital Record
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>WC ID</TableHead>
                  <TableHead>WC Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Financial Year</TableHead>
                  <TableHead>Net WC</TableHead>
                  <TableHead>Debtors Days</TableHead>
                  <TableHead>Creditors Days</TableHead>
                  <TableHead>CCC</TableHead>
                  <TableHead>WC Ratio</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.wc_id}</TableCell>
                    <TableCell>{record.wc_name}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.financial_year}</TableCell>
                    <TableCell>{formatCurrency(record.net_working_capital)}</TableCell>
                    <TableCell>{record.debtors_days} days</TableCell>
                    <TableCell>{record.creditors_days} days</TableCell>
                    <TableCell>{record.cash_conversion_cycle} days</TableCell>
                    <TableCell>{record.working_capital_ratio?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Link href={`/working-capital/${record.id}`}>
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