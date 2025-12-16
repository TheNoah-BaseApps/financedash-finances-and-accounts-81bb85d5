'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForecastForm({ forecast, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    category: '',
    period_start: '',
    period_end: '',
    beginning_balance: '',
    cash_sales: '',
    customer_account_collections: '',
    loan_cash_injection: '',
    interest_income: '',
    tax_refund: '',
    other_cash_receipts: '',
    direct_product_svc_costs: '',
    payroll_taxes: '',
    vendor_payments: '',
    supplies: '',
    rent: '',
    loan_payments: '',
    purchase_of_fixed_assets: '',
    additional_operating_expenses: '',
    additional_overhead_expenses: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (forecast) {
      setFormData({
        category: forecast.category || '',
        period_start: forecast.period_start || '',
        period_end: forecast.period_end || '',
        beginning_balance: forecast.beginning_balance || '',
        cash_sales: forecast.cash_sales || '',
        customer_account_collections: forecast.customer_account_collections || '',
        loan_cash_injection: forecast.loan_cash_injection || '',
        interest_income: forecast.interest_income || '',
        tax_refund: forecast.tax_refund || '',
        other_cash_receipts: forecast.other_cash_receipts || '',
        direct_product_svc_costs: forecast.direct_product_svc_costs || '',
        payroll_taxes: forecast.payroll_taxes || '',
        vendor_payments: forecast.vendor_payments || '',
        supplies: forecast.supplies || '',
        rent: forecast.rent || '',
        loan_payments: forecast.loan_payments || '',
        purchase_of_fixed_assets: forecast.purchase_of_fixed_assets || '',
        additional_operating_expenses: forecast.additional_operating_expenses || '',
        additional_overhead_expenses: forecast.additional_overhead_expenses || ''
      });
    }
  }, [forecast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const url = forecast 
        ? `/api/cash-flow-forecast/${forecast.id}`
        : '/api/cash-flow-forecast';
      
      const response = await fetch(url, {
        method: forecast ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save forecast');
      }

      onSubmit();
    } catch (err) {
      console.error('Error saving forecast:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{forecast ? 'Edit Forecast' : 'Add Forecast'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="beginning_balance">Beginning Balance</Label>
              <Input
                id="beginning_balance"
                type="number"
                step="0.01"
                value={formData.beginning_balance}
                onChange={(e) => setFormData({ ...formData, beginning_balance: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="period_start">Period Start</Label>
              <Input
                id="period_start"
                type="date"
                value={formData.period_start}
                onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="period_end">Period End</Label>
              <Input
                id="period_end"
                type="date"
                value={formData.period_end}
                onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Cash Receipts</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cash_sales">Cash Sales</Label>
                <Input
                  id="cash_sales"
                  type="number"
                  step="0.01"
                  value={formData.cash_sales}
                  onChange={(e) => setFormData({ ...formData, cash_sales: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="customer_account_collections">Customer Collections</Label>
                <Input
                  id="customer_account_collections"
                  type="number"
                  step="0.01"
                  value={formData.customer_account_collections}
                  onChange={(e) => setFormData({ ...formData, customer_account_collections: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="loan_cash_injection">Loan Cash Injection</Label>
                <Input
                  id="loan_cash_injection"
                  type="number"
                  step="0.01"
                  value={formData.loan_cash_injection}
                  onChange={(e) => setFormData({ ...formData, loan_cash_injection: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="interest_income">Interest Income</Label>
                <Input
                  id="interest_income"
                  type="number"
                  step="0.01"
                  value={formData.interest_income}
                  onChange={(e) => setFormData({ ...formData, interest_income: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tax_refund">Tax Refund</Label>
                <Input
                  id="tax_refund"
                  type="number"
                  step="0.01"
                  value={formData.tax_refund}
                  onChange={(e) => setFormData({ ...formData, tax_refund: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="other_cash_receipts">Other Cash Receipts</Label>
                <Input
                  id="other_cash_receipts"
                  type="number"
                  step="0.01"
                  value={formData.other_cash_receipts}
                  onChange={(e) => setFormData({ ...formData, other_cash_receipts: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Cash Payments</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="direct_product_svc_costs">Direct Product/Service Costs</Label>
                <Input
                  id="direct_product_svc_costs"
                  type="number"
                  step="0.01"
                  value={formData.direct_product_svc_costs}
                  onChange={(e) => setFormData({ ...formData, direct_product_svc_costs: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="payroll_taxes">Payroll Taxes</Label>
                <Input
                  id="payroll_taxes"
                  type="number"
                  step="0.01"
                  value={formData.payroll_taxes}
                  onChange={(e) => setFormData({ ...formData, payroll_taxes: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="vendor_payments">Vendor Payments</Label>
                <Input
                  id="vendor_payments"
                  type="number"
                  step="0.01"
                  value={formData.vendor_payments}
                  onChange={(e) => setFormData({ ...formData, vendor_payments: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="supplies">Supplies</Label>
                <Input
                  id="supplies"
                  type="number"
                  step="0.01"
                  value={formData.supplies}
                  onChange={(e) => setFormData({ ...formData, supplies: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="rent">Rent</Label>
                <Input
                  id="rent"
                  type="number"
                  step="0.01"
                  value={formData.rent}
                  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="loan_payments">Loan Payments</Label>
                <Input
                  id="loan_payments"
                  type="number"
                  step="0.01"
                  value={formData.loan_payments}
                  onChange={(e) => setFormData({ ...formData, loan_payments: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="purchase_of_fixed_assets">Purchase of Fixed Assets</Label>
                <Input
                  id="purchase_of_fixed_assets"
                  type="number"
                  step="0.01"
                  value={formData.purchase_of_fixed_assets}
                  onChange={(e) => setFormData({ ...formData, purchase_of_fixed_assets: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="additional_operating_expenses">Additional Operating Expenses</Label>
                <Input
                  id="additional_operating_expenses"
                  type="number"
                  step="0.01"
                  value={formData.additional_operating_expenses}
                  onChange={(e) => setFormData({ ...formData, additional_operating_expenses: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="additional_overhead_expenses">Additional Overhead Expenses</Label>
                <Input
                  id="additional_overhead_expenses"
                  type="number"
                  step="0.01"
                  value={formData.additional_overhead_expenses}
                  onChange={(e) => setFormData({ ...formData, additional_overhead_expenses: e.target.value })}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}