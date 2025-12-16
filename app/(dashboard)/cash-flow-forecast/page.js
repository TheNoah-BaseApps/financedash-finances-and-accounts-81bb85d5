'use client';

import { useState, useEffect } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import ForecastTable from '@/components/cash-flow/ForecastTable';
import ForecastForm from '@/components/cash-flow/ForecastForm';
import MetricCard from '@/components/dashboard/MetricCard';
import ChartWidget from '@/components/dashboard/ChartWidget';

export default function CashFlowForecastPage() {
  const [forecasts, setForecasts] = useState([]);
  const [projections, setProjections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingForecast, setEditingForecast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const [forecastsRes, projectionsRes] = await Promise.all([
        fetch('/api/cash-flow-forecast', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/cash-flow-forecast/projections', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!forecastsRes.ok || !projectionsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [forecastsData, projectionsData] = await Promise.all([
        forecastsRes.json(),
        projectionsRes.json()
      ]);

      setForecasts(forecastsData.data || []);
      setProjections(projectionsData.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingForecast(null);
    setShowForm(true);
  };

  const handleEdit = (forecast) => {
    setEditingForecast(forecast);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this forecast?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cash-flow-forecast/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete forecast');

      await fetchData();
    } catch (err) {
      console.error('Error deleting forecast:', err);
      setError(err.message);
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    await fetchData();
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

  const chartData = (projections?.projections || []).map(p => ({
    name: p.period_label,
    value: parseFloat(p.month_ending_cash_position)
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cash Flow Forecast</h1>
          <p className="text-gray-600">Project and monitor your cash positions</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Forecast
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Metrics */}
      {projections?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Average Balance"
            value={`$${(projections.summary.average_ending_balance || 0).toFixed(2)}`}
            subtitle="Across all periods"
            color="blue"
          />
          <MetricCard
            title="Lowest Projected"
            value={`$${(projections.summary.lowest_balance || 0).toFixed(2)}`}
            subtitle="Minimum position"
            color="red"
            trend={projections.summary.lowest_balance < 10000 ? 'down' : 'neutral'}
          />
          <MetricCard
            title="Highest Projected"
            value={`$${(projections.summary.highest_balance || 0).toFixed(2)}`}
            subtitle="Maximum position"
            color="green"
            trend="up"
          />
        </div>
      )}

      {/* Cash Position Chart */}
      {chartData.length > 0 && (
        <ChartWidget
          title="Cash Position Trend"
          type="line"
          data={chartData}
        />
      )}

      {/* Forecast Table */}
      <ForecastTable
        forecasts={forecasts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Forecast Form Modal */}
      {showForm && (
        <ForecastForm
          forecast={editingForecast}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}