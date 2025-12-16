import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Info, TrendingUp, CheckCircle } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';

export default function ActionItemList({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 text-center">No action items at this time</p>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'opportunity':
        return TrendingUp;
      case 'positive':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const getIconColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {items.map((item, index) => {
            const Icon = getIcon(item.type);
            const iconColor = getIconColor(item.priority);

            return (
              <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                <div className={`p-2 rounded-lg ${iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <StatusBadge status={item.priority} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  {item.action && (
                    <p className="text-sm font-medium text-blue-600">→ {item.action}</p>
                  )}
                  {item.amount && (
                    <p className="text-sm font-bold text-gray-900 mt-2">
                      ${parseFloat(item.amount).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}