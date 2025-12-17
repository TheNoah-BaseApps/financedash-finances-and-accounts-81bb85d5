'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, Receipt, Calculator, DollarSign, Users, Building, Package, ShoppingCart } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  const workflows = [
    {
      icon: Calculator,
      title: 'General Ledger',
      description: 'Manage chart of accounts, journal entries, and financial transactions',
      link: '/general-ledger'
    },
    {
      icon: DollarSign,
      title: 'Accounts Payable',
      description: 'Track vendor invoices, payments, and outstanding liabilities',
      link: '/accounts-payable'
    },
    {
      icon: Users,
      title: 'Accounts Receivable',
      description: 'Monitor customer invoices, payments, and aging reports',
      link: '/accounts-receivable'
    },
    {
      icon: Building,
      title: 'Fixed Assets',
      description: 'Manage asset acquisition, depreciation, and disposal tracking',
      link: '/fixed-assets'
    },
    {
      icon: Package,
      title: 'Inventory',
      description: 'Control stock levels, valuation, and cost tracking',
      link: '/inventory'
    },
    {
      icon: ShoppingCart,
      title: 'Purchasing',
      description: 'Handle purchase orders, requisitions, and vendor management',
      link: '/purchasing'
    },
    {
      icon: FileText,
      title: 'Income Statement',
      description: 'Track revenue and expense accounts with comprehensive financial reporting',
      link: '/income-statement'
    },
    {
      icon: TrendingUp,
      title: 'Cash Flow Statement',
      description: 'Monitor operating, investing, and financing cash activities',
      link: '/cash-flow-statement'
    },
    {
      icon: Receipt,
      title: 'Expense Report',
      description: 'Manage employee expense reimbursements and travel costs',
      link: '/expense-report'
    }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}