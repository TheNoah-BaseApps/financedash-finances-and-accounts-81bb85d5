'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import RiskCard from '@/components/dashboard/RiskCard';
import MetricCard from '@/components/dashboard/MetricCard';

export default function RiskSummaryPage() {
  const [risks, setRisks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/dashboard/risks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch risks');

      const data = await response.json();
      setRisks(data.data);
    } catch (err) {
      console.error('Error fetching risks:', err);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Summary</h1>
        <p className="text-gray-600">Monitor financial risks and alerts</p>
      </div>

      {/* Risk Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Critical Risks"
          value={risks?.totals?.critical_count || 0}
          subtitle="Requires immediate attention"
          color="red"
          trend={risks?.totals?.critical_count > 0 ? 'down' : 'neutral'}
        />
        <MetricCard
          title="Warning Items"
          value={risks?.totals?.warning_count || 0}
          subtitle="Needs monitoring"
          color="yellow"
        />
        <MetricCard
          title="Total Alerts"
          value={risks?.totals?.total_risks || 0}
          subtitle="All risk indicators"
          color="blue"
        />
      </div>

      {/* Critical Risks */}
      {risks?.risks?.critical && risks.risks.critical.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Critical Risks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {risks.risks.critical.map((risk, index) => (
              <RiskCard key={index} risk={risk} />
            ))}
          </div>
        </div>
      )}

      {/* Warning Risks */}
      {risks?.risks?.warning && risks.risks.warning.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-yellow-600 mb-4">Warning Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {risks.risks.warning.map((risk, index) => (
              <RiskCard key={index} risk={risk} />
            ))}
          </div>
        </div>
      )}

      {/* No Risks Message */}
      {risks?.totals?.total_risks === 0 && (
        <Alert>
          <AlertDescription>
            No risks detected. Your financial health looks good!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}