'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import ActionItemList from '@/components/dashboard/ActionItemList';
import MetricCard from '@/components/dashboard/MetricCard';

export default function InsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/insights', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch insights');

      const data = await response.json();
      setInsights(data.data);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Insights</h1>
        <p className="text-gray-600">Actionable recommendations based on your data</p>
      </div>

      {/* Insight Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Insights"
          value={insights?.total_insights || 0}
          subtitle="Actionable items"
          icon={Lightbulb}
          color="blue"
        />
        <MetricCard
          title="Critical Actions"
          value={insights?.critical_count || 0}
          subtitle="Urgent attention needed"
          color="red"
        />
        <MetricCard
          title="High Priority"
          value={insights?.high_count || 0}
          subtitle="Important actions"
          color="yellow"
        />
      </div>

      {/* Action Items */}
      {insights?.insights && insights.insights.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recommended Actions</h2>
          <ActionItemList items={insights.insights} />
        </div>
      ) : (
        <Alert>
          <AlertDescription>
            No insights available at this time. Continue monitoring your financial data.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}