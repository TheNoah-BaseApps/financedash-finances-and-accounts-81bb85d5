'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function EditAccountingJournalPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchEntry();
  }, [params.id]);

  async function fetchEntry() {
    try {
      setLoading(true);
      const res = await fetch(`/api/accounting-journal/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setFormData({
          account_code: data.data.account_code || '',
          account_name: data.data.account_name || '',
          trial_balance_debit: data.data.trial_balance_debit || '',
          trial_balance_credit: data.data.trial_balance_credit || '',
          adjusting_entries_debit: data.data.adjusting_entries_debit || '',
          adjusting_entries_credit: data.data.adjusting_entries_credit || '',
          adjusted_trial_balance_debit: data.data.adjusted_trial_balance_debit || '',
          adjusted_trial_balance_credit: data.data.adjusted_trial_balance_credit || '',
          income_statement_debit: data.data.income_statement_debit || '',
          income_statement_credit: data.data.income_statement_credit || '',
          balance_sheet_debit: data.data.balance_sheet_debit || '',
          balance_sheet_credit: data.data.balance_sheet_credit || ''
        });
      } else {
        alert('Failed to load entry: ' + data.error);
        router.push('/accounting-journal');
      }
    } catch (error) {
      console.error('Error fetching entry:', error);
      alert('Failed to load entry');
      router.push('/accounting-journal');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        account_code: formData.account_code,
        account_name: formData.account_name,
        trial_balance_debit: formData.trial_balance_debit ? parseFloat(formData.trial_balance_debit) : null,
        trial_balance_credit: formData.trial_balance_credit ? parseFloat(formData.trial_balance_credit) : null,
        adjusting_entries_debit: formData.adjusting_entries_debit ? parseFloat(formData.adjusting_entries_debit) : null,
        adjusting_entries_credit: formData.adjusting_entries_credit ? parseFloat(formData.adjusting_entries_credit) : null,
        adjusted_trial_balance_debit: formData.adjusted_trial_balance_debit ? parseFloat(formData.adjusted_trial_balance_debit) : null,
        adjusted_trial_balance_credit: formData.adjusted_trial_balance_credit ? parseFloat(formData.adjusted_trial_balance_credit) : null,
        income_statement_debit: formData.income_statement_debit ? parseFloat(formData.income_statement_debit) : null,
        income_statement_credit: formData.income_statement_credit ? parseFloat(formData.income_statement_credit) : null,
        balance_sheet_debit: formData.balance_sheet_debit ? parseFloat(formData.balance_sheet_debit) : null,
        balance_sheet_credit: formData.balance_sheet_credit ? parseFloat(formData.balance_sheet_credit) : null
      };

      const res = await fetch(`/api/accounting-journal/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/accounting-journal');
      } else {
        alert('Failed to update entry: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating entry:', error);
      alert('Failed to update entry');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <CardTitle>Edit Accounting Journal Entry</CardTitle>
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
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Link href="/accounting-journal">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}