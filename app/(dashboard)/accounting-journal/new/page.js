'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function NewAccountingJournalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    account_code: '',
    account_name: '',
    trial_balance_debit: '',
    trial_balance_credit: '',
    adjusting_entries_debit: '',
    adjusting_entries_credit: '',
    adjusted_trial_balance_debit: '',
    adjusted_trial_balance_credit: '',
    income_statement_debit: '',
    income_statement_credit: '',
    balance_sheet_debit: '',
    balance_sheet_credit: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert empty strings to null for numeric fields
      const payload = {
        account_code: formData.account_code,
        account_name: formData.account_name,
        trial_balance_debit: formData.trial_balance_debit ? parseFloat(formData.trial_balance_debit) : 0,
        trial_balance_credit: formData.trial_balance_credit ? parseFloat(formData.trial_balance_credit) : 0,
        adjusting_entries_debit: formData.adjusting_entries_debit ? parseFloat(formData.adjusting_entries_debit) : 0,
        adjusting_entries_credit: formData.adjusting_entries_credit ? parseFloat(formData.adjusting_entries_credit) : 0,
        adjusted_trial_balance_debit: formData.adjusted_trial_balance_debit ? parseFloat(formData.adjusted_trial_balance_debit) : 0,
        adjusted_trial_balance_credit: formData.adjusted_trial_balance_credit ? parseFloat(formData.adjusted_trial_balance_credit) : 0,
        income_statement_debit: formData.income_statement_debit ? parseFloat(formData.income_statement_debit) : 0,
        income_statement_credit: formData.income_statement_credit ? parseFloat(formData.income_statement_credit) : 0,
        balance_sheet_debit: formData.balance_sheet_debit ? parseFloat(formData.balance_sheet_debit) : 0,
        balance_sheet_credit: formData.balance_sheet_credit ? parseFloat(formData.balance_sheet_credit) : 0
      };

      const res = await fetch('/api/accounting-journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/accounting-journal');
      } else {
        alert('Failed to create entry: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating entry:', error);
      alert('Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/accounting-journal">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Accounting Journal Entry</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account_code">Account Code *</Label>
                  <Input
                    id="account_code"
                    name="account_code"
                    value={formData.account_code}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_name">Account Name *</Label>
                  <Input
                    id="account_name"
                    name="account_name"
                    value={formData.account_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Cash"
                  />
                </div>
              </div>
            </div>

            {/* Trial Balance */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Trial Balance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trial_balance_debit">Debit</Label>
                  <Input
                    id="trial_balance_debit"
                    name="trial_balance_debit"
                    type="number"
                    step="0.01"
                    value={formData.trial_balance_debit}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trial_balance_credit">Credit</Label>
                  <Input
                    id="trial_balance_credit"
                    name="trial_balance_credit"
                    type="number"
                    step="0.01"
                    value={formData.trial_balance_credit}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Adjusting Entries */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Adjusting Entries</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adjusting_entries_debit">Debit</Label>
                  <Input
                    id="adjusting_entries_debit"
                    name="adjusting_entries_debit"
                    type="number"
                    step="0.01"
                    value={formData.adjusting_entries_debit}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adjusting_entries_credit">Credit</Label>
                  <Input
                    id="adjusting_entries_credit"
                    name="adjusting_entries_credit"
                    type="number"
                    step="0.01"
                    value={formData.adjusting_entries_credit}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Adjusted Trial Balance */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Adjusted Trial Balance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adjusted_trial_balance_debit">Debit</Label>
                  <Input
                    id="adjusted_trial_balance_debit"
                    name="adjusted_trial_balance_debit"
                    type="number"
                    step="0.01"
                    value={formData.adjusted_trial_balance_debit}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adjusted_trial_balance_credit">Credit</Label>
                  <Input
                    id="adjusted_trial_balance_credit"
                    name="adjusted_trial_balance_credit"
                    type="number"
                    step="0.01"
                    value={formData.adjusted_trial_balance_credit}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Income Statement */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Income Statement</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="income_statement_debit">Debit</Label>
                  <Input
                    id="income_statement_debit"
                    name="income_statement_debit"
                    type="number"
                    step="0.01"
                    value={formData.income_statement_debit}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income_statement_credit">Credit</Label>
                  <Input
                    id="income_statement_credit"
                    name="income_statement_credit"
                    type="number"
                    step="0.01"
                    value={formData.income_statement_credit}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Balance Sheet */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Balance Sheet</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="balance_sheet_debit">Debit</Label>
                  <Input
                    id="balance_sheet_debit"
                    name="balance_sheet_debit"
                    type="number"
                    step="0.01"
                    value={formData.balance_sheet_debit}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance_sheet_credit">Credit</Label>
                  <Input
                    id="balance_sheet_credit"
                    name="balance_sheet_credit"
                    type="number"
                    step="0.01"
                    value={formData.balance_sheet_credit}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Link href="/accounting-journal">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Entry
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}