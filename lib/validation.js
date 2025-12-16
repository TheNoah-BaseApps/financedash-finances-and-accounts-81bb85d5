/**
 * Validation utilities for FinanceDash
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  
  return { isValid: true, message: 'Password is valid' };
}

/**
 * Validate monetary amount
 * @param {number} amount - Amount to validate
 * @returns {boolean} Is valid amount
 */
export function isValidAmount(amount) {
  if (typeof amount !== 'number' && typeof amount !== 'string') return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0 && isFinite(num);
}

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} date - Date to validate
 * @returns {boolean} Is valid date
 */
export function isValidDate(date) {
  if (!date || typeof date !== 'string') return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
}

/**
 * Validate invoice number format
 * @param {string} invoiceNumber - Invoice number to validate
 * @returns {boolean} Is valid invoice number
 */
export function isValidInvoiceNumber(invoiceNumber) {
  if (!invoiceNumber || typeof invoiceNumber !== 'string') return false;
  return invoiceNumber.trim().length > 0 && invoiceNumber.length <= 100;
}

/**
 * Validate payment amounts don't exceed total
 * @param {number} totalAmount - Total invoice amount
 * @param {Array<number>} payments - Array of payment amounts
 * @returns {Object} Validation result
 */
export function validatePayments(totalAmount, payments = []) {
  const total = parseFloat(totalAmount);
  if (isNaN(total)) {
    return { isValid: false, message: 'Invalid total amount' };
  }
  
  const paymentSum = payments
    .filter(p => p !== null && p !== undefined && p !== '')
    .reduce((sum, p) => sum + parseFloat(p || 0), 0);
  
  if (paymentSum > total) {
    return { isValid: false, message: 'Payment sum exceeds total amount' };
  }
  
  return { isValid: true, message: 'Payments are valid' };
}

/**
 * Validate due date is after invoice date
 * @param {string} invoiceDate - Invoice date
 * @param {string} dueDate - Due date
 * @returns {Object} Validation result
 */
export function validateDueDateAfterInvoiceDate(invoiceDate, dueDate) {
  if (!isValidDate(invoiceDate) || !isValidDate(dueDate)) {
    return { isValid: false, message: 'Invalid date format' };
  }
  
  const invoice = new Date(invoiceDate);
  const due = new Date(dueDate);
  
  if (due < invoice) {
    return { isValid: false, message: 'Due date must be after invoice date' };
  }
  
  return { isValid: true, message: 'Dates are valid' };
}

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeString(input) {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, 500); // Limit length to prevent abuse
}

/**
 * Validate UUID format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} Is valid UUID
 */
export function isValidUUID(uuid) {
  if (!uuid || typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}