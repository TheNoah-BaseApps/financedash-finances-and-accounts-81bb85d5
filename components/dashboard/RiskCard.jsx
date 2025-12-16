import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';

export default function RiskCard({ risk }) {
  const icons = {
    critical: AlertTriangle,
    warning: AlertCircle,
    info: Info
  };

  const Icon = icons[risk.severity] || Info;

  const colorClasses = {
    critical: 'border-red-200 bg-red-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-blue-200 bg-blue-50'
  };

  return (
    <Card className={`${colorClasses[risk.severity]} border-2`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${
            risk.severity === 'critical' ? 'bg-red-100' :
            risk.severity === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            <Icon className={`h-5 w-5 ${
              risk.severity === 'critical' ? 'text-red-600' :
              risk.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
            }`} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{risk.title}</h3>
              <StatusBadge status={risk.severity} />
            </div>
            <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
            {risk.amount && (
              <p className="text-lg font-bold text-gray-900">
                ${parseFloat(risk.amount).toFixed(2)}
              </p>
            )}
            {risk.daysOverdue && (
              <p className="text-xs text-gray-500 mt-1">
                {risk.daysOverdue} days overdue
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}