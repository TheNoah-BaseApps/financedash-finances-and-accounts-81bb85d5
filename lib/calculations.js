/**
 * Financial calculation utilities for FinanceDash
 */

/**
 * Calculate balance due from total and payments
 * @param {number} totalAmount - Total invoice amount
 * @param {Array<number>} payments - Array of payment amounts
 * @returns {number} Balance due
 */
export function calculateBalanceDue(totalAmount, payments = []) {
  const total = parseFloat(totalAmount) || 0;
  const paymentSum = payments
    .filter(p => p !== null && p !== undefined && p !== '')
    .reduce((sum, p) => sum + (parseFloat(p) || 0), 0);
  
  const balance = total - paymentSum;
  return Math.max(0, Math.round(balance * 100) / 100); // Round to 2 decimals
}

/**
 * Calculate total cash receipts
 * @param {Object} forecast - Cash flow forecast object
 * @returns {number} Total receipts
 */
export function calculateTotalReceipts(forecast) {
  const fields = [
    'cash_sales',
    'customer_account_collections',
    'loan_cash_injection',
    'interest_income',
    'tax_refund',
    'other_cash_receipts'
  ];
  
  return fields.reduce((sum, field) => {
    return sum + (parseFloat(forecast[field]) || 0);
  }, 0);
}

/**
 * Calculate total cash payments
 * @param {Object} forecast - Cash flow forecast object
 * @returns {number} Total payments
 */
export function calculateTotalCashPayments(forecast) {
  const fields = [
    'direct_product_svc_costs',
    'payroll_taxes',
    'vendor_payments',
    'supplies',
    'rent',
    'loan_payments',
    'purchase_of_fixed_assets',
    'additional_operating_expenses',
    'additional_overhead_expenses'
  ];
  
  return fields.reduce((sum, field) => {
    return sum + (parseFloat(forecast[field]) || 0);
  }, 0);
}

/**
 * Calculate net cash change
 * @param {number} totalReceipts - Total cash receipts
 * @param {number} totalPayments - Total cash payments
 * @returns {number} Net cash change
 */
export function calculateNetCashChange(totalReceipts, totalPayments) {
  return Math.round((totalReceipts - totalPayments) * 100) / 100;
}

/**
 * Calculate month ending cash position
 * @param {number} beginningBalance - Beginning balance
 * @param {number} netCashChange - Net cash change
 * @returns {number} Ending cash position
 */
export function calculateMonthEndingCashPosition(beginningBalance, netCashChange) {
  return Math.round((beginningBalance + netCashChange) * 100) / 100;
}

/**
 * Calculate days overdue
 * @param {string} dueDate - Due date (YYYY-MM-DD)
 * @returns {number} Days overdue (0 if not overdue)
 */
export function calculateDaysOverdue(dueDate) {
  if (!dueDate) return 0;
  
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = today - due;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Determine status based on due date and balance
 * @param {string} dueDate - Due date
 * @param {number} balanceDue - Balance due
 * @returns {string} Status (paid, overdue, pending)
 */
export function determineStatus(dueDate, balanceDue) {
  const balance = parseFloat(balanceDue) || 0;
  
  if (balance === 0) {
    return 'paid';
  }
  
  const daysOverdue = calculateDaysOverdue(dueDate);
  
  if (daysOverdue > 0) {
    return 'overdue';
  }
  
  return 'pending';
}

/**
 * Check if cash position indicates shortfall
 * @param {number} cashPosition - Month ending cash position
 * @param {number} threshold - Minimum threshold (default: 10000)
 * @returns {boolean} Has cash shortfall
 */
export function hasCashShortfall(cashPosition, threshold = 10000) {
  return parseFloat(cashPosition) < threshold;
}

/**
 * Calculate aging bucket for receivable/payable
 * @param {number} daysOverdue - Days overdue
 * @returns {string} Aging bucket
 */
export function getAgingBucket(daysOverdue) {
  if (daysOverdue === 0) return 'Current';
  if (daysOverdue <= 30) return '1-30 days';
  if (daysOverdue <= 60) return '31-60 days';
  if (daysOverdue <= 90) return '61-90 days';
  return '90+ days';
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
export function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, decimals = 1) {
  const num = parseFloat(value) || 0;
  return `${num.toFixed(decimals)}%`;
}