'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewBillOfLadingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    number_shipping_units: '',
    packaging_description: '',
    code: '',
    weight_subject_to_correction: '',
    dimensional_weight: '',
    amount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bill-of-lading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          number_shipping_units: parseInt(formData.number_shipping_units),
          weight_subject_to_correction: parseFloat(formData.weight_subject_to_correction),
          dimensional_weight: parseFloat(formData.dimensional_weight),
          amount: parseFloat(formData.amount)
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/bill-of-lading');
      } else {
        alert('Failed to create record: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating record:', err);
      alert('Failed to create record');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/bill-of-lading">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Records
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Bill of Lading</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="BOL-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number_shipping_units">Number of Shipping Units *</Label>
                <Input
                  id="number_shipping_units"
                  name="number_shipping_units"
                  type="number"
                  min="1"
                  value={formData.number_shipping_units}
                  onChange={handleChange}
                  required
                  placeholder="1"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="packaging_description">Packaging Description *</Label>
                <Textarea
                  id="packaging_description"
                  name="packaging_description"
                  value={formData.packaging_description}
                  onChange={handleChange}
                  required
                  placeholder="Describe packaging details"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight_subject_to_correction">Weight Subject to Correction (kg) *</Label>
                <Input
                  id="weight_subject_to_correction"
                  name="weight_subject_to_correction"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.weight_subject_to_correction}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensional_weight">Dimensional Weight (kg) *</Label>
                <Input
                  id="dimensional_weight"
                  name="dimensional_weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.dimensional_weight}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Record'}
              </Button>
              <Link href="/bill-of-lading">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}