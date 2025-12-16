import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/calculations';

export default function PaymentHistoryDisplay({ payments, totalAmount }) {
  const paymentArray = [
    payments.payment1,
    payments.payment2,
    payments.payment3,
    payments.payment4,
    payments.payment5
  ].filter(p => p && parseFloat(p) > 0);

  const totalPaid = paymentArray.reduce((sum, p) => sum + parseFloat(p), 0);
  const balanceDue = parseFloat(totalAmount) - totalPaid;

  if (paymentArray.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No payments recorded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {paymentArray.map((payment, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-sm text-gray-600">Payment {index + 1}</span>
              <span className="font-medium">{formatCurrency(payment)}</span>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Paid</span>
            <span className="font-bold text-green-600">{formatCurrency(totalPaid)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Balance Due</span>
            <span className={`font-bold ${balanceDue > 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {formatCurrency(balanceDue)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}