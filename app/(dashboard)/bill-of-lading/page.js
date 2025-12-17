'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Edit, Plus } from 'lucide-react';

export default function BillOfLadingPage() {
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    try {
      setLoading(true);
      const response = await fetch('/api/bill-of-lading');
      const data = await response.json();
      
      if (data.success) {
        setRecords(data.data);
      } else {
        setError(data.error || 'Failed to fetch records');
      }
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`/api/bill-of-lading/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        fetchRecords();
      } else {
        alert('Failed to delete record: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Failed to delete record');
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-8">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bill of Lading</h1>
          <p className="text-muted-foreground mt-2">
            Manage shipping and packaging documentation
          </p>
        </div>
        <Link href="/bill-of-lading/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Record
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lading Records</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No records found</p>
              <Link href="/bill-of-lading/new">
                <Button variant="outline">Create your first record</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead className="text-right">Shipping Units</TableHead>
                    <TableHead>Packaging Description</TableHead>
                    <TableHead className="text-right">Weight (correctable)</TableHead>
                    <TableHead className="text-right">Dimensional Weight</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.code}</TableCell>
                      <TableCell className="text-right">
                        {record.number_shipping_units}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {record.packaging_description}
                      </TableCell>
                      <TableCell className="text-right">
                        {parseFloat(record.weight_subject_to_correction).toFixed(2)} kg
                      </TableCell>
                      <TableCell className="text-right">
                        {parseFloat(record.dimensional_weight).toFixed(2)} kg
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${parseFloat(record.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/bill-of-lading/${record.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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