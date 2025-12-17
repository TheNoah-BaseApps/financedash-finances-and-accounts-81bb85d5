'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, FileSpreadsheet } from 'lucide-react';

export default function BalanceSheetPage() {
  const [balanceSheets, setBalanceSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchBalanceSheets();
  }, [yearFilter, categoryFilter]);

  async function fetchBalanceSheets() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (yearFilter) params.append('year', yearFilter);
      if (categoryFilter) params.append('category', categoryFilter);

      const response = await fetch(`/api/balance-sheet?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setBalanceSheets(result.data);
      } else {
        console.error('Error fetching balance sheets:', result.error);
      }
    } catch (error) {
      console.error('Error fetching balance sheets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this balance sheet entry?')) {
      return;
    }

    try {
      const response = await fetch(`/api/balance-sheet/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        fetchBalanceSheets();
      } else {
        console.error('Error deleting balance sheet:', result.error);
        alert('Failed to delete balance sheet entry');
      }
    } catch (error) {
      console.error('Error deleting balance sheet:', error);
      alert('Failed to delete balance sheet entry');
    }
  }

  function formatCurrency(value) {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading balance sheets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Balance Sheet</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your balance sheet entries
          </p>
        </div>
        <Link href="/balance-sheet/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Balance Sheet
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                placeholder="Filter by year"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Filter by category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {balanceSheets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No balance sheets found</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first balance sheet entry
            </p>
            <Link href="/balance-sheet/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Balance Sheet
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Total Assets</TableHead>
                    <TableHead className="text-right">Total Liabilities</TableHead>
                    <TableHead className="text-right">Total Equity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheets.map((sheet) => (
                    <TableRow key={sheet.id}>
                      <TableCell className="font-medium">{sheet.year}</TableCell>
                      <TableCell>{sheet.category}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(sheet.total_assets)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          (sheet.total_current_liabilities || 0) +
                            (sheet.total_long_term_liabilities || 0)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(sheet.total_owners_equity)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/balance-sheet/${sheet.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(sheet.id)}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}