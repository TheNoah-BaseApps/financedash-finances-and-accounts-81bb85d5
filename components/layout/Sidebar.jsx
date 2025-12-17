'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Wallet,
  Package,
  FileSpreadsheet,
  Receipt,
  ShoppingCart
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Accounts Payable', href: '/accounts-payable', icon: FileText },
  { name: 'Accounts Receivable', href: '/accounts-receivable', icon: DollarSign },
  { name: 'Bill to Invoice', href: '/bill-to-invoice', icon: FileText },
  { name: 'Bill of Lading', href: '/bill-of-lading', icon: Package },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
  { name: 'Accounting Journal', href: '/accounting-journal', icon: BookOpen },
  { name: 'Balance Sheet', href: '/balance-sheet', icon: FileSpreadsheet },
  { name: 'Income Statement', href: '/income-statement', icon: FileText },
  { name: 'Cash Flow Statement', href: '/cash-flow-statement', icon: TrendingUp },
  { name: 'Expense Report', href: '/expense-report', icon: Receipt },
  { name: 'Budget Management', href: '/budget-management', icon: Wallet },
  { name: 'Cash Flow Forecast', href: '/cash-flow-forecast', icon: TrendingUp },
  { name: 'Finance Reporting', href: '/finance-reporting', icon: TrendingUp },
  { name: 'Working Capital', href: '/working-capital', icon: Wallet },
  { name: 'Risk Summary', href: '/risk-summary', icon: AlertTriangle },
  { name: 'Insights', href: '/insights', icon: Lightbulb }
];

export default function Sidebar({ isOpen }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200
          transition-transform duration-300 z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}