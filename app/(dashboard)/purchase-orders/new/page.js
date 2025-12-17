'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    order_id: '',
    order_date: '',
    vendor_name: '',
    vendor_address: '',
    vendor_country: '',
    vendor_tax_id: '',
    vendor_company_reg_number: '',
    product_order_type: '',
    product_sku: '',
    product_description: '',
    ordered_qty: '',
    total_tax: '',
    delivery_location: '',
    promised_delivery_date: '',
    payment_terms: '',
    po_status: 'Pending',
    tds_section: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        router.push('/purchase-orders');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/purchase-orders">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Purchase Orders
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Purchase Order</CardTitle>
          <CardDescription>Fill in the details to create a new purchase order</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order_id">Order ID *</Label>
                <Input id="order_id" name="order_id" value={formData.order_id} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_date">Order Date *</Label>
                <Input id="order_date" name="order_date" type="date" value={formData.order_date} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vendor Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor_name">Vendor Name *</Label>
                  <Input id="vendor_name" name="vendor_name" value={formData.vendor_name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor_country">Vendor Country *</Label>
                  <Input id="vendor_country" name="vendor_country" value={formData.vendor_country} onChange={handleChange} required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="vendor_address">Vendor Address *</Label>
                  <Textarea id="vendor_address" name="vendor_address" value={formData.vendor_address} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor_tax_id">Vendor Tax ID *</Label>
                  <Input id="vendor_tax_id" name="vendor_tax_id" value={formData.vendor_tax_id} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor_company_reg_number">Company Reg Number *</Label>
                  <Input id="vendor_company_reg_number" name="vendor_company_reg_number" value={formData.vendor_company_reg_number} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_order_type">Order Type *</Label>
                  <Input id="product_order_type" name="product_order_type" value={formData.product_order_type} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_sku">Product SKU *</Label>
                  <Input id="product_sku" name="product_sku" value={formData.product_sku} onChange={handleChange} required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="product_description">Product Description *</Label>
                  <Textarea id="product_description" name="product_description" value={formData.product_description} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ordered_qty">Ordered Quantity *</Label>
                  <Input id="ordered_qty" name="ordered_qty" type="number" value={formData.ordered_qty} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_tax">Total Tax *</Label>
                  <Input id="total_tax" name="total_tax" type="number" step="0.01" value={formData.total_tax} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Delivery & Payment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery_location">Delivery Location *</Label>
                  <Input id="delivery_location" name="delivery_location" value={formData.delivery_location} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promised_delivery_date">Promised Delivery Date *</Label>
                  <Input id="promised_delivery_date" name="promised_delivery_date" type="date" value={formData.promised_delivery_date} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_terms">Payment Terms *</Label>
                  <Input id="payment_terms" name="payment_terms" value={formData.payment_terms} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tds_section">TDS Section</Label>
                  <Input id="tds_section" name="tds_section" value={formData.tds_section} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Purchase Order
              </Button>
              <Link href="/purchase-orders">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}