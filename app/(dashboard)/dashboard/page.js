'use client';

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Users, FileText } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import RiskCard from '@/components/dashboard/RiskCard';
import ActionItemList from '@/components/dashboard/ActionItemList';
import ChartWidget from '@/components/dashboard/ChartWidget';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [risks, setRisks] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const [metricsRes, risksRes, insightsRes] = await Promise.all([
        fetch('/api/dashboard/metrics', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/dashboard/risks', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/dashboard/insights', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!metricsRes.ok || !risksRes.ok || !insightsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [metricsData, risksData, insightsData] = await Promise.all([
        metricsRes.json(),
        risksRes.json(),
        insightsRes.json()
      ]);

      setMetrics(metricsData.data);
      setRisks(risksData.data);
      setInsights(insightsData.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your financial health at a glance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Payables"
          value={`$${(metrics?.accounts_payable?.total_balance || 0).toFixed(2)}`}
          subtitle={`${metrics?.accounts_payable?.total_count || 0} invoices`}
          icon={FileText}
          trend={metrics?.accounts_payable?.overdue_count > 0 ? 'down' : 'neutral'}
          color="red"
        />
        <MetricCard
          title="Total Receivables"
          value={`$${(metrics?.accounts_receivable?.total_balance || 0).toFixed(2)}`}
          subtitle={`${metrics?.accounts_receivable?.total_count || 0} invoices`}
          icon={DollarSign}
          trend="up"
          color="green"
        />
        <MetricCard
          title="Cash Position"
          value={`$${(metrics?.cash_flow?.avg_cash_position || 0).toFixed(2)}`}
          subtitle="Average position"
          icon={TrendingUp}
          trend={metrics?.cash_flow?.total_net_change >= 0 ? 'up' : 'down'}
          color="blue"
        />
        <MetricCard
          title="Net Position"
          value={`$${(metrics?.overall_health?.net_position || 0).toFixed(2)}`}
          subtitle="Receivables - Payables"
          icon={metrics?.overall_health?.net_position >= 0 ? TrendingUp : TrendingDown}
          trend={metrics?.overall_health?.net_position >= 0 ? 'up' : 'down'}
          color={metrics?.overall_health?.net_position >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Risk Alerts */}
      {risks && (risks.risks.critical.length > 0 || risks.risks.warning.length > 0) && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Risk Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {risks.risks.critical.slice(0, 4).map((risk, index) => (
              <RiskCard key={index} risk={risk} />
            ))}
            {risks.risks.warning.slice(0, 2).map((risk, index) => (
              <RiskCard key={index} risk={risk} />
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget
          title="Payables Overview"
          type="pie"
          data={[
            { name: 'Overdue', value: metrics?.accounts_payable?.overdue_balance || 0 },
            { name: 'Current', value: (metrics?.accounts_payable?.total_balance || 0) - (metrics?.accounts_payable?.overdue_balance || 0) }
          ]}
        />
        <ChartWidget
          title="Receivables Overview"
          type="pie"
          data={[
            { name: 'Overdue', value: metrics?.accounts_receivable?.overdue_balance || 0 },
            { name: 'Current', value: (metrics?.accounts_receivable?.total_balance || 0) - (metrics?.accounts_receivable?.overdue_balance || 0) }
          ]}
        />
      </div>

      {/* Action Items */}
      {insights && insights.insights.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Action Items</h2>
          <ActionItemList items={insights.insights} />
        </div>
      )}
    </div>
  );
}