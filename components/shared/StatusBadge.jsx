export default function StatusBadge({ status }) {
  const styles = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800',
    critical: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const labels = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    critical: 'Critical',
    warning: 'Warning',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    info: 'Info'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.info}`}>
      {labels[status] || status}
    </span>
  );
}