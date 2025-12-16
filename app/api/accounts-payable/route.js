/**
 * @swagger
 * /api/accounts-payable:
 *   get:
 *     summary: Get all accounts payable
 *     tags: [Accounts Payable]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create new payable
 *     tags: [Accounts Payable]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';
import { requireAuth } from '@/lib/auth';
import { calculateBalanceDue, determineStatus } from '@/lib/calculations';
import { validatePayments, isValidDate, isValidInvoiceNumber, isValidAmount } from '@/lib/validation';
import { logCreate } from '@/lib/audit';

export async function GET(request) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'due_date';

    let queryText = `
      SELECT * FROM accounts_payable
      WHERE user_id = $1
    `;
    const params = [user.userId];
    let paramCount = 2;

    if (status) {
      queryText += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    queryText += ` ORDER BY ${sort === 'amount' ? 'balance_due DESC' : 'due_date ASC'}`;

    const result = await query(queryText, params);

    return NextResponse.json(
      {
        success: true,
        data: result.rows || []
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET /api/accounts-payable:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch payables' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();

    const {
      date,
      invoice_number,
      supplier_name,
      total_amount,
      due_date,
      payment1,
      payment2,
      payment3,
      payment4,
      payment5
    } = body;

    // Validate required fields
    if (!date || !invoice_number || !supplier_name || !total_amount || !due_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate formats
    if (!isValidDate(date) || !isValidDate(due_date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (!isValidInvoiceNumber(invoice_number)) {
      return NextResponse.json(
        { success: false, error: 'Invalid invoice number' },
        { status: 400 }
      );
    }

    if (!isValidAmount(total_amount)) {
      return NextResponse.json(
        { success: false, error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    // Validate payments
    const payments = [payment1, payment2, payment3, payment4, payment5];
    const paymentValidation = validatePayments(total_amount, payments);
    if (!paymentValidation.isValid) {
      return NextResponse.json(
        { success: false, error: paymentValidation.message },
        { status: 400 }
      );
    }

    // Check for duplicate invoice number
    const duplicateCheck = await query(
      'SELECT id FROM accounts_payable WHERE user_id = $1 AND invoice_number = $2',
      [user.userId, invoice_number]
    );

    if (duplicateCheck.rows && duplicateCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Invoice number already exists' },
        { status: 400 }
      );
    }

    // Calculate balance and status
    const balance_due = calculateBalanceDue(total_amount, payments);
    const status = determineStatus(due_date, balance_due);

    // Insert record
    const result = await query(
      `INSERT INTO accounts_payable (
        user_id, date, invoice_number, supplier_name, total_amount, due_date,
        balance_due, payment1, payment2, payment3, payment4, payment5,
        status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *`,
      [
        user.userId, date, invoice_number, supplier_name, total_amount, due_date,
        balance_due, payment1 || 0, payment2 || 0, payment3 || 0, payment4 || 0, payment5 || 0,
        status
      ]
    );

    const newRecord = result.rows[0];

    // Log audit
    await logCreate(user.userId, 'accounts_payable', newRecord.id, newRecord);

    return NextResponse.json(
      {
        success: true,
        data: newRecord,
        message: 'Payable created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/accounts-payable:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create payable' },
      { status: 500 }
    );
  }
}