'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search, Pencil, Trash2 } from 'lucide-react';

export default function AccountingJournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/accounting-journal');
      const data = await res.json();
      
      if (data.success) {
        setEntries(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Failed to load accounting journal entries');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const res = await fetch(`/api/accounting-journal/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        await fetchEntries();
      } else {
        alert('Failed to delete entry: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Failed to delete entry');
    }
  }

  const filteredEntries = entries.filter(entry => 
    entry.account_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.account_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return value ? `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounting Journal</h1>
          <p className="text-muted-foreground mt-2">
            Manage trial balances, adjusting entries, and financial statements
          </p>
        </div>
        <Link href="/accounting-journal/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by account code or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Badge variant="outline">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-destructive">
              {error}
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No journal entries found</p>
              <Link href="/accounting-journal/new">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Entry
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead className="text-right">TB Debit</TableHead>
                    <TableHead className="text-right">TB Credit</TableHead>
                    <TableHead className="text-right">Adj Debit</TableHead>
                    <TableHead className="text-right">Adj Credit</TableHead>
                    <TableHead className="text-right">ATB Debit</TableHead>
                    <TableHead className="text-right">ATB Credit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.account_code}</TableCell>
                      <TableCell>{entry.account_name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.trial_balance_debit)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.trial_balance_credit)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.adjusting_entries_debit)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.adjusting_entries_credit)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.adjusted_trial_balance_debit)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(entry.adjusted_trial_balance_credit)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/accounting-journal/${entry.id}`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
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