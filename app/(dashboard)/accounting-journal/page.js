'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
import { Loader2, Plus, Search, Pencil, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountingJournalPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    account_code: '',
    account_name: '',
    trial_balance_debit: '',
    trial_balance_credit: '',
    adjusting_entries_debit: '',
    adjusting_entries_credit: '',
    adjusted_trial_balance_debit: '',
    adjusted_trial_balance_credit: ''
  });

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
        toast.error('Failed to load entries', {
          description: data.error
        });
      }
    } catch (err) {
      console.error('Error fetching entries:', err);
      setError('Failed to load accounting journal entries');
      toast.error('Failed to load entries', {
        description: 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/accounting-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Entry created successfully');
        setIsDialogOpen(false);
        setFormData({
          account_code: '',
          account_name: '',
          trial_balance_debit: '',
          trial_balance_credit: '',
          adjusting_entries_debit: '',
          adjusting_entries_credit: '',
          adjusted_trial_balance_debit: '',
          adjusted_trial_balance_credit: ''
        });
        await fetchEntries();
      } else {
        toast.error('Failed to create entry', {
          description: data.error
        });
      }
    } catch (err) {
      console.error('Error creating entry:', err);
      toast.error('Failed to create entry', {
        description: 'An unexpected error occurred'
      });
    } finally {
      setSubmitting(false);
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
        toast.success('Entry deleted successfully');
        await fetchEntries();
      } else {
        toast.error('Failed to delete entry', {
          description: data.error
        });
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
      toast.error('Failed to delete entry', {
        description: 'An unexpected error occurred'
      });
    }
  }

  const filteredEntries = entries.filter(entry => 
    entry.account_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.account_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return value ? `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-';
  };

  const calculateTotals = () => {
    return filteredEntries.reduce((acc, entry) => {
      acc.tbDebit += parseFloat(entry.trial_balance_debit || 0);
      acc.tbCredit += parseFloat(entry.trial_balance_credit || 0);
      acc.adjDebit += parseFloat(entry.adjusting_entries_debit || 0);
      acc.adjCredit += parseFloat(entry.adjusting_entries_credit || 0);
      acc.atbDebit += parseFloat(entry.adjusted_trial_balance_debit || 0);
      acc.atbCredit += parseFloat(entry.adjusted_trial_balance_credit || 0);
      return acc;
    }, {
      tbDebit: 0,
      tbCredit: 0,
      adjDebit: 0,
      adjCredit: 0,
      atbDebit: 0,
      atbCredit: 0
    });
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounting Journal</h1>
          <p className="text-muted-foreground mt-2">
            Manage trial balances, adjusting entries, and financial statements
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Journal Entry</DialogTitle>
              <DialogDescription>
                Create a new accounting journal entry with trial balance and adjusting entries
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account_code">Account Code *</Label>
                    <Input
                      id="account_code"
                      value={formData.account_code}
                      onChange={(e) => setFormData({ ...formData, account_code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account_name">Account Name *</Label>
                    <Input
                      id="account_name"
                      value={formData.account_name}
                      onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Trial Balance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trial_balance_debit">Debit</Label>
                      <Input
                        id="trial_balance_debit"
                        type="number"
                        step="0.01"
                        value={formData.trial_balance_debit}
                        onChange={(e) => setFormData({ ...formData, trial_balance_debit: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trial_balance_credit">Credit</Label>
                      <Input
                        id="trial_balance_credit"
                        type="number"
                        step="0.01"
                        value={formData.trial_balance_credit}
                        onChange={(e) => setFormData({ ...formData, trial_balance_credit: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Adjusting Entries</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adjusting_entries_debit">Debit</Label>
                      <Input
                        id="adjusting_entries_debit"
                        type="number"
                        step="0.01"
                        value={formData.adjusting_entries_debit}
                        onChange={(e) => setFormData({ ...formData, adjusting_entries_debit: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adjusting_entries_credit">Credit</Label>
                      <Input
                        id="adjusting_entries_credit"
                        type="number"
                        step="0.01"
                        value={formData.adjusting_entries_credit}
                        onChange={(e) => setFormData({ ...formData, adjusting_entries_credit: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Adjusted Trial Balance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adjusted_trial_balance_debit">Debit</Label>
                      <Input
                        id="adjusted_trial_balance_debit"
                        type="number"
                        step="0.01"
                        value={formData.adjusted_trial_balance_debit}
                        onChange={(e) => setFormData({ ...formData, adjusted_trial_balance_debit: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adjusted_trial_balance_credit">Credit</Label>
                      <Input
                        id="adjusted_trial_balance_credit"
                        type="number"
                        step="0.01"
                        value={formData.adjusted_trial_balance_credit}
                        onChange={(e) => setFormData({ ...formData, adjusted_trial_balance_credit: e.target.value })}
                      />
                    </div>
                  </div>
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
                    'Create Entry'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-muted-foreground">
              Accounting journal entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debits (ATB)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.atbDebit)}</div>
            <p className="text-xs text-muted-foreground">
              Adjusted trial balance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits (ATB)</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totals.atbCredit)}</div>
            <p className="text-xs text-muted-foreground">
              Adjusted trial balance
            </p>
          </CardContent>
        </Card>
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
              <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Entry
              </Button>
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